/* eslint-disable @next/next/no-img-element */
"use client";
import { changeBusinessAPI, fetchBusinessAPI } from "@/lib/api";
import useHandleApiErrors from "@/lib/hook/useHandlerApiErrors";
import { IBusiness } from "@/lib/models/Business";
import { Business } from "@/lib/types/Business";
import { Bubblegum_Sans } from "next/font/google";
import React, { useEffect, useState } from "react";
import { UploadForm } from "./S3UploadForm";
import Modal from "../Modal";
export const Profile = () => {
  const { handleApiErrors } = useHandleApiErrors();

  const [isLoading, setIsLoading] = useState(true);

  const [warningMessage, setWarningMessage] = useState<string>("");
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [totalStamps, setTotalStamps] = useState<number>(0);

  const [business, setBusiness] = useState<Business>({
    clerkUserId: "",
    name: "",
    email: "",
    logo: "",
    loyaltyProgram: 5,
    rewardsRedeemed: 0,
    credit: 0,
  });
  useEffect(() => {
    fetchBusiness();
    setIsLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeBusiness = async () => {
    // try {
    if (business.name.length < 5) {
      setWarningMessage("The business name must be longer than 5 characters.");
      setShowWarning(true);
      return;
    }
    const response = await changeBusinessAPI(business);
    const isSuccess = await handleApiErrors(response);
    if (!isSuccess) return;
    const data = await response.json();
    const { __v, ...filteredBusiness } = data.data;
    setBusiness(filteredBusiness);
    setShowWarning(true);
    setWarningMessage("Change completed.");
    // } catch (e) {
    //   console.log(e.message);
    // }
  };

  const fetchBusiness = async () => {
    try {
      const response = await fetchBusinessAPI();
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
        credit: data.data.credit,
      };
      setBusiness(businessFetched);
      setTotalStamps(data.totalStamps);
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
    const updatedLogo = url;
    setBusiness((prevBusiness) => ({
      ...prevBusiness,
      logo: updatedLogo,
    }));
  };

  return (
    <div className="flex items-center justify-center">
      {!isLoading && (
        <div>
          <div className="card card-compact m-4 w-96 bg-base-100 shadow-xl">
            <figure>
              <img src={business.logo} alt="Logo" />
            </figure>
            <div className="card-body">
              {business.email}
              <h2 className="card-title">Profile</h2>
              Total Stamps: {totalStamps}
              <p className="flex flex-col items-center justify-center border-2 p-1">
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
                <label className="swap swap-flip pt-2 text-9xl">
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
                Rewards Redeemed: {business.rewardsRedeemed}
              </p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  onClick={handleChangeBusiness}
                >
                  Change Profile
                </button>
              </div>
            </div>
          </div>
          <Modal
            message={warningMessage}
            visible={showWarning}
            onConfirm={() => {
              setShowWarning(false);
            }}
          />
        </div>
      )}
    </div>
  );
};
