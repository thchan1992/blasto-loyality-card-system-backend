import { useState } from "react";

export const useUtility = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [warningMessage, setWarningMessage] = useState<string>("");
  const [showWarning, setShowWarning] = useState<boolean>(false);

  return {
    isLoading,
    setIsLoading,
    warningMessage,
    setWarningMessage,
    showWarning,
    setShowWarning,
  };
};
