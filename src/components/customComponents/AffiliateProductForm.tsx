"use client";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10).optional(),
  imageUrl: z.string().url(),
  amazonUrl: z.string().url(),
  price: z.coerce.number().positive(),
  category: z.string().min(2),
});

export default function ProductFormDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      amazonUrl: "",
      price: 0,
      category: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await fetch("/api/admin/affiliate-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      toast.success("Produit ajouté !");
      form.reset();
      setOpen(false);
    } else {
      toast.error("Erreur lors de l'ajout");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter un produit</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter un produit affilié</DialogTitle>
          <DialogDescription>
            Remplissez les informations du produit à afficher sur votre site.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          {(["title", "description", "imageUrl", "amazonUrl", "category", "price"] as const).map((field) => (
            <div key={field}>
              <Label htmlFor={field} className="capitalize">{field}</Label>
              {field === "description" ? (
                <Textarea {...form.register(field)} />
              ) : (
                <Input type={field === "price" ? "number" : "text"} {...form.register(field)} />
              )}
            </div>
          ))}
          <Button type="submit" className="mt-2 w-full">Ajouter</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
