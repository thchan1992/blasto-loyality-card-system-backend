import { useState } from "react";
import { useUtility } from "./useUtility";

export const useScanner = () => {
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [isScanAllowed, setIsScanAllowed] = useState<boolean>(true);
  const [customerId, setCustomerId] = useState<string>("");
  const { setShowWarning, setWarningMessage } = useUtility();

  const handleDecode = (result) => {
    if (result && result.length > 0) {
      const rawValue = result[0].rawValue;
      setShowCamera(false);
      setCustomerId(rawValue);
    }
  };

  const handleError = (error) => {
    console.error("QR Scanner Error:", error);
    setWarningMessage(
      "Scanner error, please try again later. If the issue persists, please contact us for support.",
    );
    setShowWarning(true);
  };

  return {
    showCamera,
    setShowCamera,
    isScanAllowed,
    setIsScanAllowed,
    customerId,
    setCustomerId,

    handleDecode,
    handleError,
  };
};
