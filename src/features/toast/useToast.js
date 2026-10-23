import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { dismissToast, toast } from "./toastSlice";

// const notify = useToast(); notify.success("Saved");
export function useToast() {
  const dispatch = useDispatch();
  return useMemo(
    () => ({
      success: (message, opts) => dispatch(toast.success(message, opts)),
      error: (message, opts) => dispatch(toast.error(message, opts)),
      info: (message, opts) => dispatch(toast.info(message, opts)),
      warning: (message, opts) => dispatch(toast.warning(message, opts)),
      dismiss: (id) => dispatch(dismissToast(id)),
    }),
    [dispatch],
  );
}
