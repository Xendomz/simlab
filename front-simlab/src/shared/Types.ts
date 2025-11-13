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
  last_page?: number;
  per_page?: number;
  total?: number;
}

export type SortDirection = 'asc' | 'desc'
export type ModalType = 'Add' | 'Edit'
export type Role = 'Admin' | 'Kepala Lab Terpadu' | 'Dosen' | 'Koorprodi' | 'Kepala Lab Unit' | 'Laboran' | 'Mahasiswa' | 'Pihak Luar';