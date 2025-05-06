import axios from 'axios';

// URL de base de l'API
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
}

// Fonctions pour récupérer les données des produits
export const getProducts = async () => {
  try {
    const response = await axios.get<Product[]>(`${API_URL}/products/`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
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
    const response = await axios.get<Product[]>(`${API_URL}/products/featured/`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits mis en avant:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get<Category[]>(`${API_URL}/categories/`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    throw error;
  }
};

export const getProductsByCategory = async (categorySlug: string) => {
  try {
    const response = await axios.get<Product[]>(`${API_URL}/categories/${categorySlug}/products/`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits de la catégorie ${categorySlug}:`, error);
    throw error;
  }
};

export const searchProducts = async (query: string) => {
  try {
    const response = await axios.get<Product[]>(`${API_URL}/products/search/?q=${query}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la recherche de produits avec la requête "${query}":`, error);
    throw error;
  }
}; 