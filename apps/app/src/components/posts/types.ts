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
