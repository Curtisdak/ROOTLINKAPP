"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FullLoading } from "@/components/customComponents/FullLoading";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

//in this the user is going to enter is email so we can send him the link to reset his password

const formSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});
const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  // this is the user email from login page
  const userEmail = searchParams.get("userEmail");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: `${userEmail ? userEmail : ""}`,
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        return () => {
          toast.error(data.error);
        };
      } else {
        toast.success(data.message);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.info(error);
      // return router.push(`/error?message=Nous+vous+conseillons+de+re-éssayer`)
    }
  };
  const handleBack = () => {
    router.back(); // Revenir à la page précédente
  };

  if (loading) {
    return <FullLoading />;
  }

  return (

    
    <div className="flex">
      <div className="hidden lg:flex w-screen  h-screen  bg-primary justify-center items-center flex-col text-black">
        <h1 className="text-4xl font-bold mb-12">Serik Immo</h1>
        <h2 className="text-2xl font-bold ">
          Vous avez oublié votre mot de passe ?
        </h2>
        <p>
          Ne vous inquitez pas, Nous sommes là pour vous aider à le renitialiser
        </p>
      </div>

      <div className="flex flex-col gap-4 justify-center items-center p-6 w-screen h-screen ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full lg:max-w-lg  "
          >
            <h1 className="text-2xl text-center font-bold lg:hidden">
              Mot de passe oublié ?
            </h1>
            <p className="text-center mb-10">
              Envoie nous ton adresse email pour recevoir le lien de
              renitialisation de ton mot de passe.
            </p>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse Email</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-input"
                      type="email"
                      placeholder="...........@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              Envoyé
            </Button>
            <Button
              type="button"
              variant={"ghost"}
              className="animate-bounce hover:text-primary"
              onClick={handleBack}
            >
              <ArrowLeft />
            </Button>
          </form>
        </Form>
      </div>
    </div>
    
  );
};

export default ForgotPasswordForm;