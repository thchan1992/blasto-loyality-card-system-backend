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
export const Scan = () => {
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<string>("");
  const { handleApiErrors } = useHandleApiErrors();
  const [isScanAllowed, setIsScanAllowed] = useState<boolean>(false);
  const [credit, setCredit] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [needMoreCredit, setNeedMoreCredit] = useState<boolean>(false);
  useEffect(() => {
    isSetupFinished();
    setIsLoading(false);
  }, []);

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
    if (response.status === 404) {
      setShowWarning(true);
      setCustomerId("");
      return;
    }
    const isSuccess = await handleApiErrors(response);
    if (!isSuccess) return;
    const data = await response.json();
    setCredit(data.newCredit);
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

  const isSetupFinished = async (): Promise<boolean> => {
    const response = await fetchBusinessAPI();
    const isSuccess = await handleApiErrors(response);
    if (!isSuccess) return;
    const data = await response.json();
    let res: boolean;
    if (data.data.name === "") {
      res = false;
    } else {
      res = true;
    }
    setIsScanAllowed(res);
    if (data.data.credit <= 0) {
      res = true;
    } else {
      res = false;
    }
    setNeedMoreCredit(res);
    setCredit(data.data.credit);
  };
  return (
    <div className="flex items-center justify-center">
      <div className="flex h-1/2 w-full flex-col pl-2 pr-2">
        credit: {credit < 10 ? "You are running out of credit" : credit}
        <button className="btn btn-primary" onClick={handlePayment}>
          Pay More {needMoreCredit && <div>(You Need more credit)</div>}
        </button>
        customer id: {customerId}
        {showCamera && (
          <Scanner
            constraints={{ facingMode: "environment" }}
            onScan={(result) => handleDecode(result)}
            onError={handleError}
          />
        )}
        {isScanAllowed && (
          <button
            className="btn btn-primary m-1"
            onClick={() => {
              showCamera ? setShowCamera(false) : setShowCamera(true);
            }}
          >
            {showCamera ? "Close Camera" : "Open Camera"}
          </button>
        )}
        {customerId !== "" && isScanAllowed ? (
          <>
            <button className="btn btn-primary m-1" onClick={onConfirm}>
              Give Stamp
            </button>
            <button className="btn btn-primary m-1" onClick={onRewardConfirm}>
              Give Reward
            </button>
          </>
        ) : undefined}
        <div>
          {isScanAllowed && (
            <div>
              <div>Please add business name before giving away the reward.</div>
            </div>
          )}
        </div>
        <Modal
          message={
            "Customer ID not found. If the issue persists, please contact us for support."
          }
          visible={showWarning}
          onConfirm={() => {
            setShowWarning(false);
          }}
        />
      </div>
    </div>
  );
};
