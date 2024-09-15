import { useScanner } from "@/lib/hook/useScanner";
import { Scanner } from "@yudiel/react-qr-scanner";
import Image from "next/image";
import React from "react";

export const CameraButton = (
  {
    // showCamera,
    // setShowCamera,
    // isScanAllowed,
  }: {
    // showCamera:boolean;
    // setShowCamera: React.Dispatch<React.SetStateAction<boolean>>;
    // isScanAllowed:boolean;
  },
) => {
  const {
    showCamera,
    setShowCamera,
    isScanAllowed,
    handleDecode,
    handleError,
  } = useScanner();

  return (
    <>
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
    </>
  );
};
