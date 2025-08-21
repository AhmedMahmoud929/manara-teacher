import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICartSlice {
  products: {
    id: number;
    quantity: number;
  }[];
}

const initialState: ICartSlice = {
  products: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<number>) => {
      if (state.products.find((p) => p.id === action.payload)) return;
      state.products.push({ id: action.payload, quantity: 1 });
    },
    setCartItems: (
      state,
      action: PayloadAction<{ id: number; quantity: number }[]>
    ) => {
      state.products = action.payload;
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    incrementQuantity: (state, action: PayloadAction<number>) => {
      state.products = state.products.map((p) => ({
        ...p,
        quantity: p.id === action.payload ? p.quantity + 1 : p.quantity,
      }));
    },
    decrementQuantity: (state, action: PayloadAction<number>) => {
      state.products = state.products.map((p) => ({
        ...p,
        quantity: p.id === action.payload ? p.quantity - 1 : p.quantity,
      }));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  setCartItems,
  incrementQuantity,
  decrementQuantity,
} = cartSlice.actions;
