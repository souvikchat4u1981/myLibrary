import { toast } from "react-toastify";
export const SuccessMessage = (message, autoClose = 5000) => {
  toast.success(message, { autoClose: autoClose });
};

export const ErrorMessage = (message) => {
  toast.error(message);
};

export const WarningMessage = (message) => {
  toast.warning(message, { autoClose: 0 });
};
