"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-model-store";

import { Button } from "@/components/ui/button";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
function DeleteServerModal() {
  const { isOpen, onClose, onOpen, type, data } = useModal();

  const { server } = data;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isModelOpen = isOpen && type === "deleteServer";

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/servers/${server?.id}`);
      onClose();
      router.refresh();
      router.push("/");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">
            Delete server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this ?<br />
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>{" "}
            will be permanent deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={onClick} variant="primary">
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteServerModal;
