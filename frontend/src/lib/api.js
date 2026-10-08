const rawBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
const API_BASE = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE;
  }

  getToken() {
    return localStorage.getItem('cognify_token');
  }

  async request(endpoint, options = {}) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${cleanEndpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  }

  // Auth
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  async getProduct(idOrSlug) {
    return this.request(`/products/${idOrSlug}`);
  }

  async getProductsByCategory(category, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products/category/${category}${query ? `?${query}` : ''}`);
  }

  // Categories
  async getCategories() {
    return this.request('/categories');
  }

  // Cart
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(itemData) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async updateCartItem(itemId, data) {
    return this.request(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async removeFromCart(itemId) {
    return this.request(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  }

  // Wishlist
  async getWishlist() {
    return this.request('/wishlist');
  }

  async toggleWishlist(productId) {
    return this.request('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId) {
    return this.request(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  // Admin Methods
  async addProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async getAllOrders() {
    return this.request('/orders/all');
  }

  async updateOrder(id, data) {
    return this.request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

const api = new ApiClient();
export default api;