"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FileUpload from "@/components/ui/file-upload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-model-store";
import qs from "query-string";

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required",
  }),
});

function MessageFileModel() {
  const [isMounted, setMounted] = useState(false);

  const router = useRouter();
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const { query, apiUrl } = data;
  const isModalOpen = isOpen && type === "messageFile";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!isMounted) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">
            Add an attachment
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-zinc-500">
          send as a file as a message
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint="messageFile"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant="primary">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default MessageFileModel;
