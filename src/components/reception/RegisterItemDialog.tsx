
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Package } from "lucide-react";
import RegisterItemForm from "./RegisterItemForm";

const RegisterItemDialog = () => {
  const [open, setOpen] = React.useState(false);

  const handleFormSuccess = () => {
    // Close the dialog after successful submission
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Package className="mr-2 h-4 w-4" />
          Register Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Register New Test Item</DialogTitle>
          <DialogDescription>
            Enter the details of the test item to register it in the system.
          </DialogDescription>
        </DialogHeader>
        <RegisterItemForm onSuccess={handleFormSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default RegisterItemDialog;
