/* eslint-disable @next/next/no-img-element */
"use client";
import { changeBusinessAPI, fetchBusinessAPI } from "@/lib/api";
import useHandleApiErrors from "@/lib/hook/useHandlerApiErrors";
import { IBusiness } from "@/lib/models/Business";
import { Business } from "@/lib/types/Business";
import { Bubblegum_Sans } from "next/font/google";
import React, { useEffect, useState } from "react";

import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
export const Scan = () => {
  const handleDecode = (result) => {
    console.log("QR Code Result:", result.rawValue);
  };

  const handleError = (error) => {
    console.error("QR Scanner Error:", error);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="h-1/2 w-full pl-2 pr-2">
        <Scanner
          constraints={{ facingMode: "environment" }}
          onScan={handleDecode}
          onError={handleError}
        />
      </div>
    </div>
  );
};
