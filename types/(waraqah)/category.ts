export interface ICategory {
  id: number;
  name: string;
  updated_at: Date;
  created_at: Date;
  products_count: number;
  is_active: boolean;
}

export interface CreateCategoryDto {
  name: string;
  // description: string;
  // parent?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  id: number;
}
