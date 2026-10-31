import { toast } from "@/components/ui/toast";

export function showSuccess(message: string) {
  toast.add({
    title: "Success !!!",
    type: "success",
    description: message,
  });
}

export function showError(message: string) {
  toast.add({
    title: "Error !!!",
    type: "error",
    description: message,
    priority: "high",
  });
}
