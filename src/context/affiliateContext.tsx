"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  amazonUrl: string;
  price?: number;
  category?: string;
}

interface AffiliateContextType {
  products: Product[];
  loading: boolean;
  error: boolean;
  deleteProduct: (id: string) => Promise<void>;
  updateProduct: (updated: Product) => Promise<void>;
}

const AffiliateContext = createContext<AffiliateContextType | undefined>(
  undefined
);

export const useAffiliate = () => {
  const context = useContext(AffiliateContext);
  if (!context)
    throw new Error("useAffiliate must be used within AffiliateProvider");
  return context;
};

export const AffiliateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const refreshAffiliate = () => {
    fetch("/api/admin/affiliate-product")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshAffiliate();
  }, []);

  const deleteProduct = async (id: string) => {
    const res = await fetch(`/api/admin/affiliate-product`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Supprimé");
      refreshAffiliate()
    } else {
      toast.success("desolé, veuillez réessayer");
    }
  };

  const updateProduct = async (updated: Product) => {
    const res = await fetch(`/api/admin/affiliate-product`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      const result = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? result : p))
      );
      toast.success("A été bien modifié");
      refreshAffiliate()
    } else {
      toast.success("n&pos;à pas été modifié");
    }
  };

  const value = useMemo(
    () => ({ products, loading, error, deleteProduct, updateProduct, refreshAffiliate }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, loading, error]
  );

  return (
    <AffiliateContext.Provider value={value}>
      {children}
    </AffiliateContext.Provider>
  );
};
