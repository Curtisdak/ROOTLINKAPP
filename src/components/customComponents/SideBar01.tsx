import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  // SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { AlignJustify } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { signOut, useSession } from "next-auth/react";

export default function SideBar() {
    const { data: session } = useSession();
  const currentUser = session?.user;

  const avatarFallback = currentUser?.name
    ? currentUser.name.substring(0, 2).toUpperCase()
    : "??";
  return (
     <div className="flex lg:hidden"> 
    <Sheet >
      <SheetTrigger asChild>
        <AlignJustify/>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here..
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>

          <div className="flex items-center gap-2">
              <Avatar className="cursor-pointer ">
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
           <Link href="/" className="text-sm text-muted-foreground italiccd  ">
              Developed by Serik
            </Link>
        </SheetFooter>
      </SheetContent>
    </Sheet>
    </div>   
   
  )
}