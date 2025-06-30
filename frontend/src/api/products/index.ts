import axios from 'axios';

const API_URL = '/api';

// Fonction pour récupérer un cookie par son nom
function getCookie(name: string): string | null {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Est-ce que ce cookie commence par le nom que nous voulons ?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const api = axios.create({
  baseURL: API_URL,
});

// Ajouter un intercepteur pour inclure le token CSRF
api.interceptors.request.use(config => {
  const csrfToken = getCookie('csrftoken');
  if (csrfToken) {
    // Django s'attend à ce que le token soit dans cet en-tête
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// TYPES
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  is_published: boolean;
  created_at: string;
  images: ProductImage[];
  category: Category;
  subcategory: SubCategory | null;
  is_featured: boolean;
  average_rating: number;
  review_count: number;
}

export interface ProductImage {
  id: number;
  image: string;
  thumbnail: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string;
  products_count?: number;
}

export interface SubCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: number;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export class ApiError extends Error {
  details?: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.details = details;
  }
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// API UTILS
const safeApiCall = async <T>(apiCall: Promise<{ data: T[] | PaginatedResponse<T> }>): Promise<T[]> => {
  try {
    const response = await apiCall;
    const data = response.data;
    if ('results' in data) {
      // C'est une réponse paginée
      return data.results;
    }
    // C'est une réponse non paginée (tableau direct)
    return data as T[];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError('Erreur lors de l\'appel API', error.response?.data);
    }
    throw new ApiError('Une erreur inconnue est survenue');
  }
};

// API FUNCTIONS
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<PaginatedResponse<Product>>('/products/');
    return response.data.results;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
  }
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/${slug}/`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${slug}:`, error);
    throw error;
  }
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<PaginatedResponse<Product>>('/products/featured/');
    return response.data.results;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits mis en avant:', error);
    throw error;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<PaginatedResponse<Category>>('/categories/');
    console.log("Données brutes des catégories:", response.data); // Pour le débogage
    
    if (response.data && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    
    // Si la réponse n'a pas le format attendu, essayez de gérer le cas où ce n'est pas paginé
    if (Array.isArray(response.data)) {
      console.warn("Réponse non paginée pour les catégories");
      return response.data as unknown as Category[];
    }

    console.error("Les données reçues pour les catégories ne sont pas dans le format attendu:", response.data);
    return []; // Retourne un tableau vide pour éviter de casser l'UI

  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    throw error;
  }
};

export const getProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
  try {
    const response = await api.get<PaginatedResponse<Product>>(`/categories/${categorySlug}/products/`);
    return response.data.results;
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits de la catégorie ${categorySlug}:`, error);
    throw error;
  }
};

export const getSubCategories = async (): Promise<SubCategory[]> => {
  try {
    const response = await api.get<PaginatedResponse<SubCategory>>('/subcategories/');
    return response.data.results;
  } catch (error) {
    console.error('Erreur lors de la récupération des sous-catégories:', error);
    throw error;
  }
};

export const getSubCategoriesByCategory = async (categorySlug: string): Promise<SubCategory[]> => {
  try {
    const response = await api.get<PaginatedResponse<SubCategory>>(`/subcategories/by_category/?category=${categorySlug}`);
    return response.data.results;
  } catch (error) {
    console.error(`Erreur lors de la récupération des sous-catégories de ${categorySlug}:`, error);
    throw error;
  }
};

export const getProductsBySubCategory = async (subcategorySlug: string): Promise<Product[]> => {
  try {
    const response = await api.get<PaginatedResponse<Product>>(`/subcategories/${subcategorySlug}/products/`);
    return response.data.results;
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits de la sous-catégorie ${subcategorySlug}:`, error);
    throw error;
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await api.get<PaginatedResponse<Product>>(`/products/search/?q=${query}`);
    return response.data.results;
  } catch (error) {
    console.error(`Erreur lors de la recherche de produits avec la requête "${query}":`, error);
    throw error;
  }
};

export const registerUser = async (userData: any) => {
  try {
    const response = await api.post<User>('/users/register/', userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError('Erreur lors de l\'inscription', error.response?.data);
    }
    throw new ApiError('Une erreur inconnue est survenue');
  }
};

export const loginUser = async (credentials: any) => {
  try {
    const response = await api.post('/token/', credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError('Erreur lors de la connexion', error.response?.data);
    }
    throw new ApiError('Une erreur inconnue est survenue');
  }
};