import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  editCategoryId: number | null;
  isEditCategorySheetOpen: boolean;
}

const initialState: CategoryState = {
  editCategoryId: null,
  isEditCategorySheetOpen: false,
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setEditCategoryId: (state, action: PayloadAction<number | null>) => {
      state.editCategoryId = action.payload;
    },
    setIsEditCategorySheetOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditCategorySheetOpen = action.payload;
    },
  },
});

export const { setEditCategoryId, setIsEditCategorySheetOpen } =
  categorySlice.actions;
export default categorySlice;
