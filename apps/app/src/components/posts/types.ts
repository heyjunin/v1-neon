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

export type NotificationType = 'success' | 'error';

export interface NotificationState {
  type: NotificationType;
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

// Form types
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isDirty: boolean;
}

export interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validation?: (values: T) => Partial<Record<keyof T, string>>;
  onSuccess?: () => void;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isDirty: boolean;
  isLoading: boolean;
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  reset: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  validate: () => boolean;
}
