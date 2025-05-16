import axios from 'axios';

// URL de base de l'API - utiliser l'URL complète pour le développement local
const API_URL = 'http://localhost:8000/api';

// Types pour les produits
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  available: boolean;
  featured: boolean;
  category: number;
  category_name: string;
  images: ProductImage[];
  created_at: string;
  // Propriétés additionnelles
  discount_percentage?: number;
  is_new?: boolean;
  rating?: number;
  review_count?: number;
}

export interface ProductImage {
  id: number;
  image: string;
  image_url: string;
  is_main: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  image_url: string;
  products_count?: number;
}

// Images de secours par catégorie
const FALLBACK_IMAGES = {
  'hommes': 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4',
  'femmes': 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03',
  'chaussures': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  'montres': 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49',
  'casquettes': 'https://images.unsplash.com/photo-1521369909029-2afed882baee',
  'baskets': 'https://images.unsplash.com/photo-1552346154-21d32810aba3',
  'default': 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03'
};

// Helper pour obtenir une URL d'image valide pour une catégorie
export const getCategoryImageUrl = (category: Category): string => {
  // Utiliser l'image_url si elle existe
  if (category.image_url && !category.image_url.includes('null')) {
    return category.image_url;
  }
  
  // Sinon, utiliser l'image si elle existe
  if (category.image && !category.image.includes('null')) {
    return category.image;
  }
  
  // Sinon, utiliser une image de secours en fonction du slug
  const slug = category.slug.toLowerCase();
  return FALLBACK_IMAGES[slug as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.default;
};

// Fonction utilitaire pour vérifier et traiter les réponses API
const safeApiCall = async <T>(apiCall: Promise<{ data: unknown }>): Promise<T[]> => {
  try {
    const response = await apiCall;
    // Vérifier si la réponse est un tableau
    if (Array.isArray(response.data)) {
      return response.data as T[];
    }
    // Si la réponse est un objet JSON valide mais pas un tableau
    if (response.data && typeof response.data === 'object') {
      console.warn('API a renvoyé un objet au lieu d\'un tableau:', response.data);
      return [];
    }
    // Si la réponse n'est pas JSON (ex: HTML)
    console.error('Réponse API invalide (non JSON):', typeof response.data);
    return [];
  } catch (error) {
    console.error('Erreur lors de l\'appel API:', error);
    return [];
  }
};

// Fonctions pour récupérer les données des produits
export const getProducts = async () => {
  try {
    return await safeApiCall<Product>(axios.get(`${API_URL}/products/`));
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return [];
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const response = await axios.get<Product>(`${API_URL}/products/${slug}/`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${slug}:`, error);
    throw error;
  }
};

export const getFeaturedProducts = async () => {
  try {
    return await safeApiCall<Product>(axios.get(`${API_URL}/products/featured/`));
  } catch (error) {
    console.error('Erreur lors de la récupération des produits mis en avant:', error);
    return [];
  }
};

export const getCategories = async () => {
  try {
    return await safeApiCall<Category>(axios.get(`${API_URL}/categories/`));
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return [];
  }
};

export const getProductsByCategory = async (categorySlug: string) => {
  try {
    return await safeApiCall<Product>(axios.get(`${API_URL}/categories/${categorySlug}/products/`));
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits de la catégorie ${categorySlug}:`, error);
    return [];
  }
};

export const searchProducts = async (query: string) => {
  try {
    return await safeApiCall<Product>(axios.get(`${API_URL}/products/search/?q=${query}`));
  } catch (error) {
    console.error(`Erreur lors de la recherche de produits avec la requête "${query}":`, error);
    return [];
  }
};