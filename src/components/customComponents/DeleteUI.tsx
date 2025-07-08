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


interface DeleteUIProps {
  productId: string;
  alertTitle: string;
  alertDesc: string;
  deleteAction: (id:string) => void;
}

const DeleteUI: React.FC<DeleteUIProps> = ({alertTitle, alertDesc,productId,deleteAction, }) => {

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        
          <Trash2 className="text-red-500/40 hover:scale-110 hover:text-red-500/100 ease-in-out duration-500 w-6 h-6 cursor-pointer " />
        
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertTitle || "Supprimer"}</AlertDialogTitle>
          <AlertDialogDescription>{alertDesc || "êtes vous sûr de le supprimer"}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button className="font-bold"  onClick={() => deleteAction(productId)   }>
              Supprimer
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUI;