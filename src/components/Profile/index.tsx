"use client";
import { fetchBusinessAPI } from "@/lib/api";
import useHandleApiErrors from "@/lib/hook/useHandlerApiErrors";
import { IBusiness } from "@/lib/models/Business";
import { Business } from "@/lib/types/Business";
import { Bubblegum_Sans } from "next/font/google";
import React, { useEffect, useState } from "react";
import { UploadForm } from "./S3UploadForm";

export const Profile = () => {
  const { handleApiErrors } = useHandleApiErrors();

  const [isLoading, setIsLoading] = useState(true);

  const [business, setBusiness] = useState<Business>({
    clerkUserId: "",
    name: "",
    email: "",
    logo: "",
    loyaltyProgram: 5,
    rewardsRedeemed: 0,
  });
  useEffect(() => {
    fetchBusiness();
    setIsLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBusiness = async () => {
    try {
      const response = await fetchBusinessAPI(
        "user_2lEyLuLIEBbwEClWhluLCG2JAcH",
      );
      const isSuccess = await handleApiErrors(response);
      if (!isSuccess) return;
      const data = await response.json();
      const businessFetched = {
        clerkUserId: data.data.clerkUserId,
        email: data.data.email,
        logo: data.data.logo,
        loyaltyProgram: data.data.loyaltyProgram,
        name: data.data.name,
        rewardsRedeemed: data.data.rewardsRedeemed,
      };
      setBusiness(businessFetched);
      console.log(businessFetched, "business Fetched");
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedName = e.target.value;
    setBusiness((prevBusiness) => ({
      ...prevBusiness,
      name: updatedName,
    }));
  };

  const handleLoyaltyProgramChange = () => {
    setBusiness((prevBusiness) => ({
      ...prevBusiness,
      loyaltyProgram: prevBusiness.loyaltyProgram === 5 ? 10 : 5,
    }));
  };

  const handleLogoChange = (url: string) => {
    console.log(url, " URL LOGO");
    const updatedLogo = url;
    setBusiness((prevBusiness) => ({
      ...prevBusiness,
      logo: updatedLogo,
    }));
  };

  return (
    <div className="flex items-center justify-center">
      profile
      {!isLoading && (
        <div>
          <UploadForm
            onFileUrlChange={handleLogoChange}
            oldFileUrl={business.logo}
          />
          <input
            value={business.name}
            type="text"
            placeholder="Business name"
            className="input input-bordered w-full max-w-xs"
            onChange={handleNameChange}
          />
          {business.loyaltyProgram}
          <label className="swap swap-flip text-9xl">
            {/* Bind checkbox checked state to the loyalty program value */}
            <input
              type="checkbox"
              checked={business.loyaltyProgram !== 5}
              // onChange={handleLoyaltyProgramChange}
              onChange={handleLoyaltyProgramChange}
            />
            {/* Display "10" when checkbox is checked, "5" when unchecked */}
            <div className="swap-on">🔟</div>
            <div className="swap-off">5️⃣</div>
          </label>
        </div>
      )}
    </div>
  );
};
