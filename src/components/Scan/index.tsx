/* eslint-disable @next/next/no-img-element */
"use client";
import { giveRewardAPI, giveStampAPI } from "@/lib/api";

import React, { useState } from "react";

import { Scanner } from "@yudiel/react-qr-scanner";
export const Scan = () => {
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<string>("");
  const handleDecode = (result) => {
    if (result && result.length > 0) {
      const rawValue = result[0].rawValue;
      console.log("QR Code Raw Value:", rawValue);
      setShowCamera(false);
      setCustomerId(rawValue);
    }
  };

  const handleError = (error) => {
    console.error("QR Scanner Error:1", error);
  };

  const onConfirm = async () => {
    const res = await giveStampAPI(customerId, 1);
    console.log(res);
  };

  const onRewardConfirm = async () => {
    const res = await giveRewardAPI(customerId);
    console.log(res);
  };

  const handlePayment = async () => {
    try {
      const response = await fetch("/api/payment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
        // console.log(data, "payment successed");
      } else {
        console.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
