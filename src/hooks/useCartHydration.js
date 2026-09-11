import { useEffect, useState } from "react";
import { useCartStore } from "../store/cart";

/**
 * Rehydrates the persisted cart from localStorage after mount so server
 * rendered markup and the first client render always match.
 */
export function useCartHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void useCartStore.persist.rehydrate()?.then?.(() => {
      if (!cancelled) setHydrated(true);
    });
    setHydrated(true);
    return () => {
      cancelled = true;
    };
  }, []);

  return hydrated;
}
