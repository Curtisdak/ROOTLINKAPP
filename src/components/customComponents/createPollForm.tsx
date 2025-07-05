"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const pollSchema = z.object({
  question: z.string().min(1, "La question est obligatoire"),
  options: z.array(z.string().min(1, "Option vide")).min(2, "Ajoutez au moins 2 options"),
  published: z.boolean(),
});

type PollFormData = z.infer<typeof pollSchema>;

export default function CreatePollForm() {
  const [open, setOpen] = useState(false);

  const form = useForm<PollFormData>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      question: "",
      options: ["", ""],
      published: false,
    },
  });

  const { fields, append, remove } = useFieldArray<PollFormData>({
    name: "options",
    control: form.control,
  });

  const onSubmit = async (data: PollFormData) => {
    try {
      const res = await fetch("/api/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error("Erreur : " + error.error);
        return;
      }

      toast.success("Sondage créé avec succès !");
      form.reset(); // clear form
      setOpen(false); // close modal
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la création du sondage.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Créez un sondage</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Créer un nouveau sondage</DialogTitle>
          <DialogDescription>Entrez la question et les options du sondage.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez la question du sondage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Options</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`options.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder={`Option ${index + 1}`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 2 && (
                    <Trash2
                     
                     className=" text-primary  hover:text-red-500 hover:scale-150 cursor-pointer ease-in-out duration-300"
                      onClick={() => remove(index)}
                    />
                    
                    
                  )}
                </div>
              ))}
              <Button type="button" variant={"secondary"} onClick={() => append("")}>
                Ajouter <Plus/> 
              </Button>
            </div>

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                  </FormControl>
                  <FormLabel className="mb-0">Publier immédiatement</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit"className="w-full " >Créer le sondage</Button>
          </form>
          <div> <p className="text-muted-foreground text-center text-sm">Powered by <a className="font-bold" href="https//www.serik.io">Serik</a>  </p></div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
