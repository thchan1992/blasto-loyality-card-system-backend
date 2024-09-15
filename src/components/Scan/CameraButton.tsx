import { Scanner } from "@yudiel/react-qr-scanner";
import Image from "next/image";
import React from "react";

export const CameraButton = ({
  showCamera,
  setShowCamera,
  isScanAllowed,
  customerId,
  isLoading,
  onGiveStampConfirm,
  onGiveRewardConfirm,
}: {
  showCamera: boolean;
  setShowCamera: React.Dispatch<React.SetStateAction<boolean>>;
  isScanAllowed: boolean;
  customerId: string;
  isLoading: boolean;
  onGiveStampConfirm: () => Promise<void>;
  onGiveRewardConfirm: () => Promise<void>;
}) => {
  return (
    <>
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
          <button className="btn btn-primary m-1" onClick={onGiveStampConfirm}>
            Give Stamp
          </button>
          <button className="btn btn-primary m-1" onClick={onGiveRewardConfirm}>
            Give Reward
          </button>
        </div>
      ) : undefined}
    </>
  );
};
