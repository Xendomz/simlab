export interface ApiResponse<T = any> {
  code: number,
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  current_page?: number;
  data: T[];
  first_page_url?: string;
  from?: number | null;
  last_page?: number;
  last_page_url?: string;
  next_page_url?: string | null;
  path?: string;
  per_page?: number;
  prev_page_url?: string | null;
  to?: number | null;
  total?: number;
}

export type SortDirection = 'asc' | 'desc'
export type ModalType = 'Add' | 'Edit'
export type Role = 'Admin' | 'Kepala Lab Terpadu' | 'Dosen' | 'Koorprodi' | 'Kepala Lab Unit' | 'Laboran' | 'Mahasiswa' | 'Pihak Luar';