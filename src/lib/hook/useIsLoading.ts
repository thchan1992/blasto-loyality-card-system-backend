import { useState } from "react";

export const useIsLoading = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return { isLoading, setIsLoading };
};
