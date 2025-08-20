export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: {
    id: string;
    email: string;
    fullName: string | null;
  };
}

export interface PostFormData {
  title: string;
  content: string;
}

export interface NotificationState {
  type: 'success' | 'error';
  message: string;
  isVisible: boolean;
}

export interface ConfirmationState {
  isOpen: boolean;
  itemId: string | null;
  itemTitle: string;
  actionType?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SearchState {
  term: string;
  filters?: Record<string, string | number | boolean>;
}
