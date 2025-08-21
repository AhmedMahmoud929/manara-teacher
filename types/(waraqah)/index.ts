export type CSSPosition = {
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
};

export type QueryParams = void | Record<string, string>;

// Define error response type
export interface ErrorResponse {
  message: string;
  http_code: number;
  data: null | string | Record<string, string[]>;
}

// Define success response type with a dynamic DT
export interface SuccessResponse<DataType = any> {
  data: DataType;
  message: string;
  code: number;
  http_code: number;
}

export interface PaginatedData<DataType = any> {
  current_page: number;
  data: DataType;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string;
    label: string;
    active: boolean;
  }[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
}

export interface PaginationOptions {
  page?: number;
  per_page?: number;
  search?: string;
}

