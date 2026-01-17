import { Product, Category } from '@/types';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

/**
 * Generic function to fetch data from the backend API
 */
async function fetchBackend<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BACKEND_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const result: ApiResponse<T> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
}

/**
 * Product API functions
 */
export const productApi = {
  /**
   * Get all products
   */
  getAllProducts: (): Promise<Product[]> => {
    return fetchBackend<Product[]>('/products');
  },

  /**
   * Get product by ID
   */
  getProductById: (id: string): Promise<Product> => {
    return fetchBackend<Product>(`/products/${id}`);
  },

  /**
   * Get product by slug
   */
  getProductBySlug: (slug: string): Promise<Product> => {
    return fetchBackend<Product>(`/products/slug/${slug}`);
  },

  /**
   * Get products by category ID
   */
  getProductsByCategory: (categoryId: string): Promise<Product[]> => {
    return fetchBackend<Product[]>(`/products/category/${categoryId}`);
  },
};

/**
 * Category API functions
 */
export const categoryApi = {
  /**
   * Get all categories
   */
  getAllCategories: (): Promise<Category[]> => {
    return fetchBackend<Category[]>('/categories');
  },

  /**
   * Get category by ID
   */
  getCategoryById: (id: string): Promise<Category> => {
    return fetchBackend<Category>(`/categories/${id}`);
  },
};

/**
 * Initialize the backend client with common configurations
 */
export const backendClient = {
  product: productApi,
  category: categoryApi,
};