// WealthPulse Unified API Client
const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Dashboard
  getSummary: () => request('/api/dashboard/summary'),
  updateProfile: (profileData) => request('/api/dashboard/profile', {
    method: 'PATCH',
    body: JSON.stringify(profileData)
  }),

  // Transactions
  getTransactions: (isWaste = null, category = '') => {
    const params = new URLSearchParams();
    if (isWaste !== null) params.append('is_waste', isWaste);
    if (category) params.append('category', category);
    const q = params.toString() ? `?${params.toString()}` : '';
    return request(`/api/transactions${q}`);
  },
  addTransaction: (tx) => request('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(tx)
  }),
  deleteTransaction: (id) => request(`/api/transactions/${id}`, {
    method: 'DELETE'
  }),
  resetDemoData: () => request('/api/transactions/reset-demo', {
    method: 'POST'
  }),

  // Recurring Bills
  getRecurring: () => request('/api/recurring'),
  addRecurring: (bill) => request('/api/recurring', {
    method: 'POST',
    body: JSON.stringify(bill)
  }),
  toggleRecurring: (id, isActive) => request(`/api/recurring/${id}/toggle`, {
    method: 'PATCH',
    body: JSON.stringify({ is_active: isActive })
  }),
  deleteRecurring: (id) => request(`/api/recurring/${id}`, {
    method: 'DELETE'
  }),

  // AI Reality Check & Coach
  getRealityCheck: (tone = 'savage') => request('/api/ai/reality-check', {
    method: 'POST',
    body: JSON.stringify({ tone })
  }),
  askCoach: (question) => request('/api/ai/coach', {
    method: 'POST',
    body: JSON.stringify({ question })
  }),
  checkHealth: () => request('/api/health'),

  // Personal Profile (Strictly Personal Details)
  getUserProfile: () => request('/api/user/profile'),
  updateUserProfile: (profileData) => request('/api/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  }),
  updateUserAvatar: (avatarUrl) => request('/api/user/avatar', {
    method: 'POST',
    body: JSON.stringify({ avatar_url: avatarUrl })
  })
};
