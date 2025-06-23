"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Product, useAffiliate } from "@/context/affiliateContext";
import { FilePenLine } from "lucide-react";

export default function EditProductDialog({ product }: { product: Product }) {
  const { updateProduct } = useAffiliate();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...product });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "price" ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProduct(form);
    toast.success("Produit modifié !");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <FilePenLine className="hover:text-primary ease-in-out duration-500 cursor-pointer"/>
          
       
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Modifier le produit</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(["title", "description", "imageUrl", "amazonUrl", "category", "price"] as const).map((field) => (
            <div key={field}>
              <Label htmlFor={field}>{field}</Label>
              {field === "description" ? (
                <Textarea
                  name={field}
                  value={form[field as keyof typeof form] as string}
                  onChange={handleChange}
                />
              ) : (
                <Input
                  name={field}
                  value={
                    field === "price"
                      ? form[field as keyof typeof form]?.toString() ?? ""
                      : (form[field as keyof typeof form] as string)
                  }
                  onChange={handleChange}
                  type={field === "price" ? "number" : "text"}
                />
              )}
            </div>
          ))}
          <Button type="submit" className="w-full">Mettre à jour</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
