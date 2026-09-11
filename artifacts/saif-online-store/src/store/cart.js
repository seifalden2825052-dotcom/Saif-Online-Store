import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const TAX_RATE = 0.0825;
export const FREE_SHIPPING_THRESHOLD = 500;
export const SHIPPING_FLAT = 19;
export const MAX_ITEM_QUANTITY = 10;

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      isCheckoutOpen: false,
      activeProduct: null,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      openCheckout: () => set({ isCheckoutOpen: true, isCartOpen: false }),
      closeCheckout: () => set({ isCheckoutOpen: false }),
      openProduct: (product) => set({ activeProduct: product }),
      closeProduct: () => set({ activeProduct: null }),

      addItem: (product, quantity = 1) =>
        set((state) => {
          const requestedQuantity = Math.min(
            Math.max(Math.floor(Number(quantity) || 1), 1),
            MAX_ITEM_QUANTITY,
          );
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              isCartOpen: true,
              items: state.items.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      image: item.image ?? product.image,
                      tagline: item.tagline ?? product.tagline,
                      variant: item.variant ?? product.variant,
                      quantity: Math.min(
                        item.quantity + requestedQuantity,
                        MAX_ITEM_QUANTITY,
                      ),
                    }
                  : item,
              ),
            };
          }
          return {
            isCartOpen: true,
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                tagline: product.tagline,
                image: product.image,
                variant: product.variant,
                quantity: requestedQuantity,
              },
            ],
          };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

      setQuantity: (id, quantity) =>
        set((state) => {
          const nextQuantity = Number(quantity);
          return {
            items:
              nextQuantity <= 0
                ? state.items.filter((item) => item.id !== id)
                : state.items.map((item) =>
                    item.id === id
                      ? {
                          ...item,
                          quantity: Math.min(
                            Math.max(Math.floor(nextQuantity) || 1, 1),
                            MAX_ITEM_QUANTITY,
                          ),
                        }
                      : item,
                  ),
          };
        }),

      clearCart: () => set({ items: [] }),

      totalQuantity: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      totals: () => {
        const subtotal = get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping =
          subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
        const tax = subtotal * TAX_RATE;
        return { subtotal, shipping, tax, total: subtotal + shipping + tax };
      },
    }),
    {
      name: "auren-cart",
      version: 1,
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        items: Array.isArray(persistedState?.items)
          ? persistedState.items.map((item) => ({
              ...item,
              quantity: Math.min(
                Math.max(Math.floor(Number(item.quantity) || 1), 1),
                MAX_ITEM_QUANTITY,
              ),
            }))
          : currentState.items,
      }),
    },
  ),
);

export const formatPrice = (value) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });
