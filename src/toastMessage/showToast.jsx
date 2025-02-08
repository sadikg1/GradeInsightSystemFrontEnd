import { toast } from "react-toastify";

const showToast = (type, message, duration = 3000) => {
  // Default duration is 3000ms (3 seconds)
  if (type === "success") {
    toast.success(message, { autoClose: duration });
  } else if (type === "error") {
    toast.error(message, { autoClose: duration });
  }
};

export default showToast;
