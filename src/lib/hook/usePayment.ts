import { useCallback } from "react";
import { handlePaymentAPI } from "../api";
import useHandleApiErrors from "./useHandlerApiErrors";

export const usePayment = () => {
  const { handleApiErrors } = useHandleApiErrors();

  const handlePayment = useCallback(async () => {
    const response = await handlePaymentAPI();
    const isSuccess = await handleApiErrors(response);
    if (!isSuccess) return;
    const data = await response.json();
    window.location.href = data.data;
  }, [handleApiErrors]);

  return { handlePayment };
};
