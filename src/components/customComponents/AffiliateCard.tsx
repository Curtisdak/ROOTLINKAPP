"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Product,  } from "@/context/affiliateContext";

import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import DeleteUI from "./DeleteUI";
import EditProductDialog from "./EditProductDialog";

interface Props {
  product: Product;
}

export default function AffiliateCard({ product }: Props) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role && session.user.role !== "USER";
  

  const [showFullDesc, setShowFullDesc] = useState(false);

  return (
    <div className="rounded-2xl border w-auto  lg:w-[300px] bg-white dark:bg-background shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative w-full  lg:w-[300px] h-64  flex items-center justify-center">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-contain p-6"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold leading-snug">
            {product.title}
          </h2>
        </div>

        {/* Description */}
        <div className="text-sm text-muted-foreground">
          {showFullDesc ? (
            product.description
          ) : (
            <p className="line-clamp-2">{product.description}</p>
          )}
          <button
            onClick={() => setShowFullDesc(!showFullDesc)}
            className="mt-1 text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            {showFullDesc ? (
              <>
                Réduire <ChevronUp size={14} />
              </>
            ) : (
              <>
                Voir plus <ChevronDown size={14} />
              </>
            )}
          </button>
        </div>

        {/* Infos */}
        <div className="flex flex-col gap-1 text-sm">
          {product.category && (
            <span className="text-muted-foreground">
              Catégorie :{" "}
              <span className="font-medium">{product.category}</span>
            </span>
          )}
          {product.price && (
            <span className="text-primary font-bold text-lg">
              {product.price} €
            </span>
          )}
        </div>

        {/* Amazon link */}
        <a
          href={product.amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2 font-medium"
        >
          <ExternalLink size={14} /> Acheter sur Amazon
        </a>

        {isAdmin && (
          <div className="flex items-center gap-10">
            <DeleteUI productId={product.id} alertTitle={""} alertDesc={""}  />
            <EditProductDialog product={product}/>
          </div>
        )}
      </div>
    </div>
  );
}
