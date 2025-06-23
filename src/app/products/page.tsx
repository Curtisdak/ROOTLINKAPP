"use client";

import { useAffiliate } from "@/context/affiliateContext";
import AffiliateCard from "@/components/customComponents/AffiliateCard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function ProductsPage() {
  const { products, loading, error } = useAffiliate();

  if (loading) return <p className="p-6 text-muted-foreground">Chargement...</p>;

  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>Impossible de charger les produits affiliés.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {products.map((product) => (
        <AffiliateCard key={product.id} product={product} />
      ))}
    </div>
  );
}
