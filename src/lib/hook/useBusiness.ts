import { Business } from "@/lib/types/Business";
import { useCallback, useState } from "react";
export const useBusiness = () => {
  const [business, setBusiness] = useState<Business>({
    clerkUserId: "",
    name: "",
    email: "",
    logo: "",
    loyaltyProgram: 5,
    rewardsRedeemed: 0,
    credit: 0,
  });

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedName = e.target.value;
      setBusiness((prevBusiness) => ({
        ...prevBusiness,
        name: updatedName,
      }));
    },
    [],
  );

  const handleLoyaltyProgramChange = useCallback((newValue) => {
    setBusiness((prevBusiness) => ({
      ...prevBusiness,
      loyaltyProgram: (prevBusiness.loyaltyProgram = newValue),
    }));
  }, []);

  const handleLogoChange = useCallback((url: string) => {
    const updatedLogo = url;
    setBusiness((prevBusiness) => ({
      ...prevBusiness,
      logo: updatedLogo,
    }));
  }, []);

  return {
    business,
    setBusiness,
    handleNameChange,
    handleLoyaltyProgramChange,
    handleLogoChange,
  };
};
