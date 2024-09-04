/* eslint-disable @next/next/no-img-element */
"use client";
import { giveRewardAPI, giveStampAPI, handlePaymentAPI } from "@/lib/api";

import React, { useState } from "react";

import { Scanner } from "@yudiel/react-qr-scanner";
import useHandleApiErrors from "@/lib/hook/useHandlerApiErrors";
export const Scan = () => {
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<string>("");
  const { handleApiErrors } = useHandleApiErrors();

  const handleDecode = (result) => {
    if (result && result.length > 0) {
      const rawValue = result[0].rawValue;
      setShowCamera(false);
      setCustomerId(rawValue);
    }
  };

  const handleError = (error) => {
    console.error("QR Scanner Error:", error);
  };

  const onConfirm = async () => {
    const response = await giveStampAPI(customerId, 1);
    const isSuccess = await handleApiErrors(response);
    if (!isSuccess) return;
  };

  const onRewardConfirm = async () => {
    const response = await giveRewardAPI(customerId);
    const isSuccess = await handleApiErrors(response);
    if (!isSuccess) return;
  };

  const handlePayment = async () => {
    const response = await handlePaymentAPI();
    const isSuccess = await handleApiErrors(response);
    if (!isSuccess) return;
    const data = await response.json();
    window.location.href = data.data;
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex h-1/2 w-full flex-col pl-2 pr-2">
        <button className="btn btn-primary" onClick={handlePayment}>
          Pay More
        </button>
        customer id: {customerId}
        {showCamera && (
          <Scanner
            constraints={{ facingMode: "environment" }}
            onScan={(result) => handleDecode(result)}
            onError={handleError}
          />
        )}
        <button
          className="btn btn-primary m-1"
          onClick={() => {
            showCamera ? setShowCamera(false) : setShowCamera(true);
          }}
        >
          {showCamera ? "Close Camera" : "Open Camera"}
        </button>
        {customerId !== "" && (
          <>
            <button className="btn btn-primary m-1" onClick={onConfirm}>
              Give Stamp
            </button>
            <button className="btn btn-primary m-1" onClick={onRewardConfirm}>
              Give Reward
            </button>
          </>
        )}
      </div>
    </div>
  );
};
