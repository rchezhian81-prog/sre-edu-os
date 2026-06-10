export interface User {
  id: string; email: string; fullName: string; role: Role; branchId?: string; avatar?: string;
}
export type Role = 'owner'|'admin'|'principal'|'teacher'|'parent'|'student'|'accountant'|'librarian'|'transport_officer';
export interface AuthState {
  user: User | null; accessToken: string | null; refreshToken: string | null;
  isAuthenticated: boolean; isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}
