export interface Activity {
  id: number;
  // Các field khác của Activity sẽ được bổ sung sau khi có response cụ thể
  [key: string]: unknown;
}

// Tạm thời để dạng rộng để dễ map từ swagger về sau
export type CreateActivityRequest = Record<string, unknown>;
export type UpdateActivityRequest = Record<string, unknown>;


