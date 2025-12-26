import toast from "react-hot-toast";

type MessageType = "success" | "error";

export const toastMessage = (type: MessageType, message: string) => {
  if (type === "success") {
    toast.success(message);
  } else if (type === "error") {
    toast.error(message);
  }
};
