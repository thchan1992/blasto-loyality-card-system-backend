/* eslint-disable @next/next/no-img-element */
"use client";
import {
  changeBusinessAPI,
  fetchBusinessAPI,
  handlePaymentAPI,
} from "@/lib/api";
import useHandleApiErrors from "@/lib/hook/useHandlerApiErrors";
import { Business } from "@/lib/types/Business";
import React, { useEffect, useState } from "react";
import { UploadForm } from "./S3UploadForm";
import Modal from "../Modal";
import { Stats } from "./Stats";
import StampSelector from "./StampSelector";
import { CreditIndicator } from "./CreditIndicator";
import { useUtility } from "@/lib/hook/useUtility";

export const Profile = () => {
  const { handleApiErrors } = useHandleApiErrors();
  const [totalStamps, setTotalStamps] = useState<number>(0);
  const {
    isLoading,
    setIsLoading,
    warningMessage,
    setWarningMessage,
    showWarning,
    setShowWarning,
  } = useUtility();

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

  const handleLoyaltyProgramChange = (newValue) => {
    setBusiness((prevBusiness) => ({
      ...prevBusiness,
      loyaltyProgram: (prevBusiness.loyaltyProgram = newValue),
    }));
  };

  const handleLogoChange = (url: string) => {
    const updatedLogo = url;
    setBusiness((prevBusiness) => ({
      ...prevBusiness,
      logo: updatedLogo,
    }));
  };

  const handlePayment = async () => {
    const response = await handlePaymentAPI();
    const isSuccess = await handleApiErrors(response);
    if (!isSuccess) return;
    const data = await response.json();
    window.location.href = data.data;
  };

  return (
    <div className="flex items-center justify-center border-red-100 ">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12 ">
            <div className="flex flex-row justify-between ">
              {!isLoading && (
                <div className="card card-compact m-4 mb-10 mt-20 w-96 bg-base-100 shadow-xl lg:w-full xl:w-2/3">
                  <figure>
                    <img
                      src={business.logo}
                      alt="Logo"
                      className="h-88 w-88 bg-white object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title"> {business.email}</h2>
                    {/* Total Stamps: {totalStamps}
                    Rewards Redeemed: {business.rewardsRedeemed} */}
                    <Stats
                      data={[
                        { title: "Total Stamps", value: totalStamps, desc: "" },
                        {
                          title: "Rewards Redeemed",
                          value: business.rewardsRedeemed,
                          desc: "",
                        },
                      ]}
                    />
                    {/* <div className="stats bg-primary text-primary-content">
                      <div className="stat">
                        <div className="stat-title">Account balance</div>
                        <div className="stat-value">
                          {business.credit} Stamp(s)
                        </div>
                        <div className="stat-actions">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={handlePayment}
                          >
                            Add credits
                          </button>
                        </div>
                      </div>
                    </div> */}

                    <CreditIndicator
                      credit={business.credit}
                      handlePayment={handlePayment}
                    />

                    <div className="glass rounded-box ">
                      <p className="flex flex-col justify-center p-1 ">
                        <UploadForm
                          onFileUrlChange={handleLogoChange}
                          oldFileUrl={business.logo}
                        />
                        <div className="p-3">
                          <h2 className="mb-4 items-center text-2xl font-bold">
                            Change Your Business Name
                          </h2>
                          <input
                            value={business.name}
                            type="text"
                            placeholder="Business name"
                            className="input input-bordered  w-full"
                            onChange={handleNameChange}
                          />
                        </div>
                        {/* <label className="swap swap-flip pt-2 text-9xl">
                          <input
                            type="checkbox"
                            checked={business.loyaltyProgram !== 5}
                            onChange={handleLoyaltyProgramChange}
                          />
                          <div className="swap-on">🔟</div>
                          <div className="swap-off">5️⃣</div>
                        </label> */}
                        <StampSelector
                          initialValue={business.loyaltyProgram}
                          onChange={handleLoyaltyProgramChange}
                        />
                      </p>
                    </div>
                    <div className="card-actions justify-end">
                      <button
                        className="btn btn-primary"
                        onClick={handleChangeBusiness}
                      >
                        Change Profile
                      </button>
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
          </div>
        </div>
      </div>
    </div>
  );
};
