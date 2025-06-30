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
  products_count?: number;
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
const safeApiCall = async <T>(apiCall: Promise<{ data: PaginatedResponse<T> }>): Promise<PaginatedResponse<T>> => {
  try {
    const response = await apiCall;
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError('Erreur lors de l\'appel API', error.response?.data);
  }
    throw new ApiError('Une erreur inconnue est survenue');
  }
};

// API FUNCTIONS
export const getProducts = async (): Promise<PaginatedResponse<Product>> => {
  try {
    return await safeApiCall<Product>(api.get('/products/'));
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return { count: 0, next: null, previous: null, results: [] };
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const response = await api.get<Product>(`/products/${slug}/`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${slug}:`, error);
    throw error;
  }
};

export const getFeaturedProducts = async (): Promise<PaginatedResponse<Product>> => {
  try {
    return await safeApiCall<Product>(api.get('/products/featured/'));
  } catch (error) {
    console.error('Erreur lors de la récupération des produits mis en avant:', error);
    return { count: 0, next: null, previous: null, results: [] };
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await safeApiCall<Category>(api.get('/categories/'));
    return response.results;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return [];
  }
};

export const getProductsByCategory = async (categorySlug: string): Promise<PaginatedResponse<Product>> => {
  try {
    return await safeApiCall<Product>(api.get(`/categories/${categorySlug}/products/`));
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits de la catégorie ${categorySlug}:`, error);
    return { count: 0, next: null, previous: null, results: [] };
  }
};

export const getSubCategories = async (): Promise<SubCategory[]> => {
  try {
    const response = await safeApiCall<SubCategory>(api.get('/subcategories/'));
    return response.results;
  } catch (error) {
    console.error('Erreur lors de la récupération des sous-catégories:', error);
    return [];
  }
};

export const getSubCategoriesByCategory = async (categorySlug: string): Promise<SubCategory[]> => {
  try {
    const response = await safeApiCall<SubCategory>(api.get(`/subcategories/by_category/?category=${categorySlug}`));
    return response.results;
  } catch (error) {
    console.error(`Erreur lors de la récupération des sous-catégories de ${categorySlug}:`, error);
    return [];
  }
};

export const getProductsBySubCategory = async (subcategorySlug: string): Promise<PaginatedResponse<Product>> => {
  try {
    return await safeApiCall<Product>(api.get(`/subcategories/${subcategorySlug}/products/`));
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits de la sous-catégorie ${subcategorySlug}:`, error);
    return { count: 0, next: null, previous: null, results: [] };
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await safeApiCall<Product>(api.get(`/products/search/?q=${query}`));
    return response.results;
  } catch (error) {
    console.error(`Erreur lors de la recherche de produits avec la requête "${query}":`, error);
    return [];
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