export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalDocuments: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
