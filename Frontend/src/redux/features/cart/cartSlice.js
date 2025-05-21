import { createSlice } from "@reduxjs/toolkit";

// 🔁 Load saved cart from localStorage if it exists
const savedCart = JSON.parse(localStorage.getItem("cartState"));

const initialState = savedCart || {
  products: [],
  selectedItems: 0,
  totalPrice: 0,
  tax: 0,
  taxRate: 0.05,
  grandTotal: 0,
};

// 🔧 Save current cart to localStorage
const saveToLocalStorage = (state) => {
  localStorage.setItem("cartState", JSON.stringify(state));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { _id, variant } = action.payload;

      const existingItem = state.products.find(item =>
        item._id === _id &&
        (
          (!item.variant && !variant) ||
          (item.variant && variant && item.variant._id === variant._id)
        )
      );

      if (existingItem) {
        if (existingItem.quantity < existingItem.variant.stock) {
          existingItem.quantity += 1;
        }
      } else {
        state.products.push({ ...action.payload, quantity: 1 });
      }

      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      state.tax = setTax(state);
      state.grandTotal = setGrandTotal(state);

      saveToLocalStorage(state);
    },

    updateQuantity: (state, action) => {
      const { type, id, variantId } = action.payload;

      const existingItem = state.products.find(product =>
        product._id === id && product.variant?._id === variantId
      );

      if (existingItem) {
        if (type === 'increment' && existingItem.quantity < existingItem.variant.stock) {
          existingItem.quantity += 1;
        } else if (type === 'decrement' && existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        }
      }

      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      state.tax = setTax(state);
      state.grandTotal = setGrandTotal(state);

      saveToLocalStorage(state);
    },

    removeFromCart: (state, action) => {
      const { id, variantId } = action.payload;

      state.products = state.products.filter(product =>
        !(product._id === id && product.variant?._id === variantId)
      );

      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      state.tax = setTax(state);
      state.grandTotal = setGrandTotal(state);

      saveToLocalStorage(state);
    },

    clearCart: (state) => {
      state.products = [];
      state.selectedItems = 0;
      state.totalPrice = 0;
      state.tax = 0;
      state.grandTotal = 0;

      localStorage.removeItem("cartState");
    },
  },
});

// Utility functions
export const setSelectedItems = (state) =>
  state.products.reduce((total, product) => total + product.quantity, 0);

export const setTotalPrice = (state) =>
  state.products.reduce(
    (total, product) =>
      total + product.quantity * (product.variant?.price || product.price),
    0
  );

export const setTax = (state) => setTotalPrice(state) * state.taxRate;

export const setGrandTotal = (state) => setTotalPrice(state) + setTax(state);

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;




// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   products: [],
//   selectedItems: 0,
//   totalPrice: 0,
//   tax: 0,
//   taxRate: 0.05,
//   grandTotal: 0,
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart: (state, action) => {
//       const { _id, variant } = action.payload;

//       const existingItem = state.products.find(item => 
//         item._id === _id && 
//         (
//           (!item.variant && !variant) || 
//           (item.variant && variant && item.variant._id === variant._id)
//         )
//       );

//       if (existingItem) {
//         if (existingItem.quantity < existingItem.variant.stock) {
//           existingItem.quantity += 1;
//         }
//       } else {
//         state.products.push({ ...action.payload, quantity: 1 });
//       }

//       state.selectedItems = setSelectedItems(state);
//       state.totalPrice = setTotalPrice(state);
//       state.tax = setTax(state);
//       state.grandTotal = setGrandTotal(state);
//     },

//     updateQuantity: (state, action) => {
//       const { type, id, variantId } = action.payload;

//       const existingItem = state.products.find(product => 
//         product._id === id && product.variant?._id === variantId
//       );

//       if (existingItem) {
//         if (type === 'increment' && existingItem.quantity < existingItem.variant.stock) {
//           existingItem.quantity += 1;
//         } else if (type === 'decrement' && existingItem.quantity > 1) {
//           existingItem.quantity -= 1;
//         }
//       }

//       state.selectedItems = setSelectedItems(state);
//       state.totalPrice = setTotalPrice(state);
//       state.tax = setTax(state);
//       state.grandTotal = setGrandTotal(state);
//     },

//     removeFromCart: (state, action) => {
//       const { id, variantId } = action.payload;

//       state.products = state.products.filter(product =>
//         !(product._id === id && product.variant?._id === variantId)
//       );

//       state.selectedItems = setSelectedItems(state);
//       state.totalPrice = setTotalPrice(state);
//       state.tax = setTax(state);
//       state.grandTotal = setGrandTotal(state);
//     },

//     clearCart: (state) => {
//       state.products = [];
//       state.selectedItems = 0;
//       state.totalPrice = 0;
//       state.tax = 0;
//       state.grandTotal = 0;
//     },
//   },
// });

// // Utility functions
// export const setSelectedItems = (state) =>
//   state.products.reduce((total, product) => total + product.quantity, 0);

// export const setTotalPrice = (state) =>
//   state.products.reduce((total, product) => total + product.quantity * (product.variant?.price || product.price), 0);

// export const setTax = (state) => setTotalPrice(state) * state.taxRate;

// export const setGrandTotal = (state) => setTotalPrice(state) + setTax(state);

// export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
// export default cartSlice.reducer;
