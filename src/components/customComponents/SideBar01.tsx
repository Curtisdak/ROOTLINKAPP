import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlignJustify } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signOut, useSession } from "next-auth/react";

export default function SideBar() {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const show = false;

  const avatarFallback = currentUser?.name
    ? currentUser.name.substring(0, 2).toUpperCase()
    : "??";
  return (
    <div className="flex ">
      <Sheet>
        <SheetTrigger asChild>
          <AlignJustify className="cursor-pointer text-muted-foreground" />
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>RootLink</SheetTitle>
            <SheetDescription>{currentUser?.email}</SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[700px] w-full rounded-md p-6">
            <div className="flex flex-col items-baseline-last gap-6 w-full ">
              <Link
                href={"./"}
                className="flex text-muted-foreground items-baseline gap-2 w-full hover:text-primary  "
              >
                {" "}
                <p>Accueil </p>{" "}
              </Link>
              <Link
                href={"./"}
                className="flex text-muted-foreground items-baseline gap-2 w-full hover:text-primary  "
              >
                {" "}
                <p>Profile </p>{" "}
              </Link>
              <a
                href={"https://www.instagram.com/rootlink.officiel/"  } target="_blank" 
                className="flex text-muted-foreground items-baseline gap-2 w-full hover:text-primary  "
              >
                {" "}
                <p>Lives </p>{" "}
              </a>
              <Separator />
              {}{" "}
             {show && <Link
                href={"/Accueil"}
                className="flex text-muted-foreground items-baseline gap-2 w-full hover:text-primary  "
              >
                {" "}
                <p>Conversation </p>{" "}
              </Link>} 
              <Link
                href={"/products"}
                className="flex text-muted-foreground items-baseline gap-2 w-full hover:text-primary  "
              >
                {" "}
                <p>Boutique </p>{" "}
              </Link>
             {show && <Link
                href={"./marketplace"}
                className="flex text-muted-foreground items-baseline gap-2 w-full hover:text-primary  "
              >
                {" "}
                <p>Theme et Sondage</p>{" "}
              </Link> }
             
             
                {currentUser?.role==="ADMIN" &&   <div className="-6  w-full">
                    <Separator className="my-2" />
                    <Link href="/admin" className="">
                      <p className="font-medium text-primary hover:underline">
                        Admin{" "}
                      </p>
                    </Link>
                  </div>}
                
            </div>
          </ScrollArea>

          <SheetFooter>
            {session && (
              <div className="flex  items-center gap-2">
                <Avatar className="cter ">
                  <AvatarImage
                    src={currentUser?.image || ""}
                    alt={currentUser?.name || "user"}
                    className="scale-150"
                  />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <Button
                  variant={"link"}
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  {" "}
                  Se déconnecter{" "}
                </Button>
              </div>
            )}
            <Link href="/" className="text-sm text-muted-foreground italiccd  ">
              Developed by Serik
            </Link>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
