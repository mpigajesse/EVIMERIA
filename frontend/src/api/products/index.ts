import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
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
export const getProducts = async () => {
  try {
    return await safeApiCall<Product>(api.get('/products/'));
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
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

export const getFeaturedProducts = async () => {
  try {
    return await safeApiCall<Product>(api.get('/products/featured/'));
  } catch (error) {
    console.error('Erreur lors de la récupération des produits mis en avant:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    return await safeApiCall<Category>(api.get('/categories/'));
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    throw error;
  }
};

export const getProductsByCategory = async (categorySlug: string) => {
  try {
    return await safeApiCall<Product>(api.get(`/categories/${categorySlug}/products/`));
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits de la catégorie ${categorySlug}:`, error);
    throw error;
  }
};

export const getSubCategories = async () => {
  try {
    return await safeApiCall<SubCategory>(api.get('/subcategories/'));
  } catch (error) {
    console.error('Erreur lors de la récupération des sous-catégories:', error);
    throw error;
  }
};

export const getSubCategoriesByCategory = async (categorySlug: string) => {
  try {
    return await safeApiCall<SubCategory>(api.get(`/subcategories/by_category/?category=${categorySlug}`));
  } catch (error) {
    console.error(`Erreur lors de la récupération des sous-catégories de ${categorySlug}:`, error);
    throw error;
  }
};

export const getProductsBySubCategory = async (subcategorySlug: string) => {
  try {
    return await safeApiCall<Product>(api.get(`/subcategories/${subcategorySlug}/products/`));
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits de la sous-catégorie ${subcategorySlug}:`, error);
    throw error;
  }
};

export const searchProducts = async (query: string) => {
  try {
    return await safeApiCall<Product>(api.get(`/products/search/?q=${query}`));
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