import React from "react";
// Adjust the import according to how deleteProduct is exported.
// If deleteProduct is a default export:
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useAffiliate } from "@/context/affiliateContext";

interface DeleteUIProps {
  productId: string;
  alertTitle: string;
  alertDesc: string;
}

const DeleteUI: React.FC<DeleteUIProps> = ({alertTitle, alertDesc,productId }) => {

  const {deleteProduct} = useAffiliate()
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        
          <Trash2 className="text-red-500/40 hover:scale-110 hover:text-red-500/100 ease-in-out duration-500 w-8 h-8 cursor-pointer " />
        
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertTitle || "Supprimer"}</AlertDialogTitle>
          <AlertDialogDescription>{alertDesc || "êtes vous sûr de le supprimer"}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button className="font-bold"  onClick={() => deleteProduct(productId)}>
              Supprimer
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUI;