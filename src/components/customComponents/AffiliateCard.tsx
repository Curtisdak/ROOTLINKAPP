"use client";
;
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Product } from "@/context/affiliateContext";

import { ExternalLink,  } from "lucide-react";

import DeleteUI from "./DeleteUI";
import EditProductDialog from "./EditProductDialog";
import ShowDescriptionUi from "./showDescriptionUi";

interface Props {
  product: Product;
}

export default function AffiliateCard({ product }: Props) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role && session.user.role !== "USER";

  return (
    <div className="rounded-2xl border w-auto  lg:w-[350px] bg-white dark:bg-background shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col">
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
          <h2 className="text-lg font-semibold leading-snug line-clamp-1">
            {product.title}
          </h2>
        </div>

        {/* Description */}
        <p className="line-clamp-2">{product.description}</p>


        <div className="flex justify-between items-center"> 
             
        <div className="text-sm text-muted-foreground">
          <ShowDescriptionUi product={product} />
        </div>

        {/* Infos */}
        <div className="flex flex-col gap-1 text-sm">
          {product.price && (
            <span className="text-primary font-bold text-lg">
              {product.price} €
            </span>
          )}
        </div>

        </div>

        {/* Amazon link */}
        <a
          href={product.amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1 text-md hover:underline mt-2 font-medium border-2 border-primary/20  hover:bg-primary/10 ease-in-out duration-500 p-2 rounded-lg "
        >
          <ExternalLink size={14} /> Acheter sur Amazon
        </a>

        {isAdmin && (
          <div className="flex items-center gap-10">
            <DeleteUI productId={product.id} alertTitle={""} alertDesc={""} />
            <EditProductDialog product={product} />
          </div>
        )}
      </div>
    </div>
  );
}
