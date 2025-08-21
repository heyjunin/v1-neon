import type { BaseEntity } from "../hooks/use-crud-manager";
import type { ViewMode } from "../hooks/use-view-mode";

export interface CrudState<T> {
  isFormOpen: boolean;
  editingItem: T | null;
  viewingItem: T | null;
}

export interface CrudActions<T> {
  onEdit: (item: T) => void;
  onCreate: () => void;
  onView?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export interface ListViewProps<T> {
  items: T[];
  loading: boolean;
  error?: Error;
  searchTerm: string;
  viewMode: ViewMode;
  onSearchChange: (term: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
  actions: CrudActions<T>;
}

export interface CrudFormProps<T> {
  item: T | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface CrudViewProps<T> {
  item: T;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (item: T) => void;
}

export interface CrudManagerProps<T extends BaseEntity> {
  entity: string;
  listComponent: React.ComponentType<ListViewProps<T>>;
  formComponent: React.ComponentType<CrudFormProps<T>>;
  viewComponent?: React.ComponentType<CrudViewProps<T>>;
  onFormSuccess?: (entity: string) => string;
}

export interface NotificationType {
  type: "success" | "error" | "info" | "warning";
  message: string;
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
