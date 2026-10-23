// ============================================================
// MOCK DATA — Users
// Stage 2: Replace with API.getUsers()
// ============================================================

export const CURRENT_USER = {
  id: 'u_001',
  name: 'Manthan Patel',
  email: 'manthan@example.com',
  avatar: null,
  role: 'user',
  totalChecks: 128,
  savedNews: 14,
  joinedAt: '2025-01-15T10:00:00Z',
  preferences: {
    emailNotifications: true,
    theme: 'dark',
  },
};

export const ADMIN_USER = {
  id: 'u_admin_001',
  name: 'Admin',
  email: 'admin@verifai.com',
  role: 'admin',
};

export const mockUsers = [
  { id: 'u_001', name: 'Manthan Patel', email: 'manthan@example.com', checks: 128, status: 'active', joinedAt: '2025-01-15' },
  { id: 'u_002', name: 'Priya Shah', email: 'priya@example.com', checks: 45, status: 'active', joinedAt: '2025-02-20' },
  { id: 'u_003', name: 'Raj Kumar', email: 'raj@example.com', checks: 91, status: 'active', joinedAt: '2025-03-08' },
  { id: 'u_004', name: 'Ananya Mehta', email: 'ananya@example.com', checks: 17, status: 'inactive', joinedAt: '2025-04-11' },
  { id: 'u_005', name: 'Vikram Desai', email: 'vikram@example.com', checks: 204, status: 'active', joinedAt: '2025-01-28' },
  { id: 'u_006', name: 'Shreya Joshi', email: 'shreya@example.com', checks: 63, status: 'active', joinedAt: '2025-05-03' },
  { id: 'u_007', name: 'Arjun Nair', email: 'arjun@example.com', checks: 8, status: 'suspended', joinedAt: '2025-06-19' },
  { id: 'u_008', name: 'Kavya Reddy', email: 'kavya@example.com', checks: 152, status: 'active', joinedAt: '2025-02-07' },
];

// Hardcoded mock credentials for Stage 1 auth
export const MOCK_CREDENTIALS = {
  user: { email: 'manthan@example.com', password: 'password123' },
  admin: { email: 'admin@verifai.com', password: 'admin123' },
};
