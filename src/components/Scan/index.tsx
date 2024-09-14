/* eslint-disable @next/next/no-img-element */
"use client";
import {
  fetchBusinessAPI,
  giveRewardAPI,
  giveStampAPI,
  handlePaymentAPI,
} from "@/lib/api";
import Modal from "../Modal";
import React, { useEffect, useState } from "react";

import { Scanner } from "@yudiel/react-qr-scanner";
import useHandleApiErrors from "@/lib/hook/useHandlerApiErrors";
import Image from "next/image";
import { CreditIndicator } from "../Profile/CreditIndicator";
import { useUtility } from "@/lib/hook/useUtility";
import { useScanner } from "@/lib/hook/useScanner";
export const Scan = () => {
  const { handleApiErrors } = useHandleApiErrors();
  const [credit, setCredit] = useState<number>(0);

  const {
    showCamera,
    setShowCamera,
    isScanAllowed,
    setIsScanAllowed,
    customerId,
    setCustomerId,
    handleDecode,
    handleError,
  } = useScanner();

  const {
    isLoading,
    setIsLoading,
    warningMessage,
    setWarningMessage,
    showWarning,
    setShowWarning,
  } = useUtility();

  useEffect(() => {
    isSetupFinished();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onConfirm = async () => {
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
  };

  const onRewardConfirm = async () => {
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
  };

  const handlePayment = async () => {
    const response = await handlePaymentAPI();
    const isSuccess = await handleApiErrors(response);
    if (!isSuccess) return;
    const data = await response.json();
    window.location.href = data.data;
  };

  const isSetupFinished = async (): Promise<boolean> => {
    const response = await fetchBusinessAPI();
    const isSuccess = await handleApiErrors(response);
    if (!isSuccess) return;
    const data = await response.json();
    let res: boolean;
    if (data.data.name === "") {
      console.log(data.data.name, "data.data.name");
      res = false;
    } else {
      res = true;
    }
    setIsScanAllowed(res);

    setCredit(data.data.credit);
  };
  return (
    <div className="flex items-center justify-center border-red-100 ">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <div className="flex flex-col justify-between">
              <div className="card card-compact mb-10 ml-4 mr-4 mt-10 w-96 bg-base-100 shadow-xl lg:w-full xl:w-2/3">
                <div className="card-body items-center">
                  <h2 className="card-title items-center justify-center">
                    Scanner
                  </h2>
                  {credit < 10 ? "You are running out of credit." : undefined}
                  <div>
                    <CreditIndicator
                      credit={credit}
                      handlePayment={handlePayment}
                    />
                  </div>
                  <h2>
                    {customerId ? "Customer ID " + customerId : undefined}
                  </h2>
                  {showCamera ? (
                    <div className="max-h-96 max-w-96 border-2 border-gray-500">
                      <Scanner
                        constraints={{ facingMode: "environment" }}
                        onScan={(result) => handleDecode(result)}
                        onError={handleError}
                      />
                    </div>
                  ) : (
                    <div className="h-96 max-h-96 w-96 max-w-96 rounded-box border-2 border-gray-500"></div>
                  )}
                  {isScanAllowed && (
                    <button
                      className="btn btn-primary m-1 rounded-full"
                      onClick={() => {
                        showCamera ? setShowCamera(false) : setShowCamera(true);
                      }}
                    >
                      {showCamera ? (
                        <Image
                          src="/images/scanner/camera-off.svg"
                          alt="logo"
                          className="hidden w-full dark:block"
                          width={140}
                          height={30}
                        />
                      ) : (
                        <Image
                          src="/images/scanner/camera-01.svg"
                          alt="logo"
                          className="hidden w-full dark:block"
                          width={140}
                          height={30}
                        />
                      )}
                    </button>
                  )}
                  {customerId !== "" && isScanAllowed && !isLoading ? (
                    <div>
                      <button
                        className="btn btn-primary m-1"
                        onClick={onConfirm}
                      >
                        Give Stamp
                      </button>
                      <button
                        className="btn btn-primary m-1"
                        onClick={onRewardConfirm}
                      >
                        Give Reward
                      </button>
                    </div>
                  ) : undefined}
                  <div>
                    {!isScanAllowed && (
                      <div>
                        <div>
                          Please add business name before giving away the
                          reward.
                        </div>
                      </div>
                    )}
                  </div>
                  <Modal
                    message={warningMessage}
                    visible={showWarning}
                    onConfirm={() => {
                      setShowWarning(false);
                      setWarningMessage("");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
