export interface Module {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleFormData {
  name: string;
  description?: string;
}
