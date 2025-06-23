"use client"

import React from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { Product, } from '@/context/affiliateContext'
import { useRouter } from 'next/navigation'

interface Props{
    product: Product ;
}

const ShowDescriptionUi = ({product}:Props) => {
    
    const router = useRouter()
  return (

    <Dialog>
      <form>
        <DialogTrigger asChild>
          <p className='animate-pulse cursor-pointer mt-2 '>  voir plus </p>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{product?.title}</DialogTitle>
            <DialogDescription>
                {product?.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">fermez</Button>
            </DialogClose>
            <Button type="submit" onClick={()=> router.push(`${product.amazonUrl}`)} >Acheter sur Amazon</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default ShowDescriptionUi
