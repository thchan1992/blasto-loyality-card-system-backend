/* eslint-disable @next/next/no-img-element */
"use client";
import { changeBusinessAPI, fetchBusinessAPI, giveStampAPI } from "@/lib/api";
import useHandleApiErrors from "@/lib/hook/useHandlerApiErrors";
import { IBusiness } from "@/lib/models/Business";
import { Business } from "@/lib/types/Business";
import { Bubblegum_Sans } from "next/font/google";
import React, { useEffect, useState } from "react";

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
    const res = await giveStampAPI("user_2lEyIkcUadDD4WSMZPrsBQ7D5YH", 1);
    console.log(res);
  };
  return (
    <div className="flex items-center justify-center">
      <div className="flex h-1/2 w-full flex-col pl-2 pr-2">
        customer id: {customerId}
        {showCamera && (
          <Scanner
            constraints={{ facingMode: "environment" }}
            onScan={(result) => handleDecode(result)}
            onError={handleError}
          />
        )}
        <button
          className="btn btn-primary"
          onClick={() => {
            showCamera ? setShowCamera(false) : setShowCamera(true);
          }}
        >
          {showCamera ? "Close Camera" : "Open Camera"}
        </button>
        {customerId !== "" && <button onClick={onConfirm}>Confirm</button>}
      </div>
    </div>
  );
};
