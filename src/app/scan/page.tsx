import Breadcrumb from "@/components/Common/Breadcrumb";
import { Profile } from "@/components/Profile/index";
import { Scan } from "@/components/Scan";

import React from "react";

const ScanPage = () => {
  return (
    <>
      <Breadcrumb pageName="Scan" description="" />
      <Scan />
    </>
  );
};

export default ScanPage;
