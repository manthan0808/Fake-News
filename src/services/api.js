// ============================================================
// API Service Layer — Stage 1: Uses Mock Data
// Stage 2: Replace mock imports with real fetch/axios calls
// ============================================================
import {
  mockNewsHistory,
  getMockResultById,
  MOCK_RESULT_1,
} from '../data/mockData/news';
import {
  mockDashboardStats,
  mockAdminStats,
  mockNotifications,
  mockReports,
} from '../data/mockData/dashboardStats';
import { mockClaims, mockEvidence, mockSources, mockMLPerformance } from '../data/mockData/claims';
import { mockUsers } from '../data/mockData/users';

// Simulate network delay
const delay = (ms = 600) => new Promise(res => setTimeout(res, ms));

// ── News API ─────────────────────────────────────────────

export const newsService = {
  // POST /api/news/analyze
  analyze: async (input) => {
    await delay(3000); // simulate analysis time
    return { ...MOCK_RESULT_1, id: `nr_${Date.now()}` };
  },

  // GET /api/news/history
  getHistory: async () => {
    await delay();
    return mockNewsHistory;
  },

  // GET /api/news/:id
  getById: async (id) => {
    await delay(400);
    return getMockResultById(id);
  },

  // GET /api/news/:id/claims
  getClaims: async (newsId) => {
    await delay(300);
    return mockClaims[newsId] || mockClaims['nr_001'];
  },

  // GET /api/news/:id/evidence
  getEvidence: async (newsId) => {
    await delay(300);
    return mockEvidence[newsId] || mockEvidence['nr_001'];
  },
};

// ── Dashboard API ─────────────────────────────────────────

export const dashboardService = {
  getUserStats: async () => {
    await delay(400);
    return mockDashboardStats;
  },

  getAdminStats: async () => {
    await delay(400);
    return mockAdminStats;
  },
};

// ── Notification API ──────────────────────────────────────

export const notificationService = {
  getAll: async () => {
    await delay(300);
    return mockNotifications;
  },

  markRead: async (id) => {
    await delay(200);
    return { success: true };
  },
};

// ── Bookmark API ──────────────────────────────────────────

export const bookmarkService = {
  getAll: async () => {
    await delay(300);
    return mockNewsHistory.filter(n => n.isSaved);
  },

  toggle: async (newsId) => {
    await delay(200);
    return { success: true };
  },
};

// ── Source API ────────────────────────────────────────────

export const sourceService = {
  getAll: async () => {
    await delay(400);
    return mockSources;
  },

  update: async (id, data) => {
    await delay(300);
    return { success: true };
  },
};

// ── Admin API ─────────────────────────────────────────────

export const adminService = {
  getUsers: async () => {
    await delay(400);
    return mockUsers;
  },

  getReports: async () => {
    await delay(400);
    return mockReports;
  },

  getMLPerformance: async () => {
    await delay(300);
    return mockMLPerformance;
  },
};
