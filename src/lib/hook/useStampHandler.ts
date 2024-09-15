import { useCallback } from "react";
import { giveRewardAPI, giveStampAPI } from "../api";
import useHandleApiErrors from "./useHandlerApiErrors";

export const useStampHandler = ({
  setIsLoading,
  customerId,
  setWarningMessage,
  setShowWarning,
  setCustomerId,
  setCredit,
  setIsScanAllowed,
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  customerId: string;
  setWarningMessage: (value: React.SetStateAction<string>) => void;
  setShowWarning: (value: React.SetStateAction<boolean>) => void;
  setCustomerId: (value: React.SetStateAction<string>) => void;
  setCredit: (value: React.SetStateAction<number>) => void;
  setIsScanAllowed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { handleApiErrors } = useHandleApiErrors();

  const onGiveStampConfirm = useCallback(async () => {
    setIsLoading(true);
    const response = await giveStampAPI(customerId, 1);
    if (response.status === 404) {
      setWarningMessage(
        "Customer ID not found. If the issue persists, please contact us for support.",
      );
      setShowWarning(true);
      setCustomerId("");
      setIsLoading(false);
      return;
    }
    const isSuccess = await handleApiErrors(response);
    if (!isSuccess) return;
    const data = await response.json();
    setCredit(data.newCredit);
    setWarningMessage("Stamp given.");
    setShowWarning(true);
    setIsLoading(false);
  }, [
    customerId,
    handleApiErrors,
    setCredit,
    setCustomerId,
    setIsLoading,
    setShowWarning,
    setWarningMessage,
  ]);

  const onGiveRewardConfirm = useCallback(async () => {
    setIsLoading(true);
    const response = await giveRewardAPI(customerId);
    if (response.status === 404) {
      setWarningMessage(
        "Customer ID not found or Customer do not have any reward. If the issue persists, please contact us for support.",
      );
      setShowWarning(true);
      setCustomerId("");
      setIsLoading(false);
      return;
    }
    const isSuccess = await handleApiErrors(response);
    if (!isSuccess) return;
    setWarningMessage("Reward redeemed.");
    setShowWarning(true);
    setIsLoading(false);
  }, [
    customerId,
    handleApiErrors,
    setCustomerId,
    setIsLoading,
    setShowWarning,
    setWarningMessage,
  ]);

  return { onGiveStampConfirm, onGiveRewardConfirm };
};
