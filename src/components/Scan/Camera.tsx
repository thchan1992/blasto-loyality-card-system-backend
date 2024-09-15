import { Scanner } from "@yudiel/react-qr-scanner";
import React from "react";

export const Camera = ({
  showCamera,
  handleDecode,
  handleError,
}: {
  showCamera: boolean;
  handleDecode: (result: any) => void;
  handleError: (error: any) => void;
}) => {
  return (
    <div>
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
    </div>
  );
};
