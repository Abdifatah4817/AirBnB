import { useState, useEffect } from "react";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("nairobistay_wishlist") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("nairobistay_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggle = (id: string) =>
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const isWishlisted = (id: string) => wishlist.includes(id);

  return { wishlist, toggle, isWishlisted };
}
