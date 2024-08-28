import Breadcrumb from "@/components/Common/Breadcrumb";
import { Profile } from "@/components/Profile/index";

import React from "react";

const ProfilePage = () => {
  return (
    <>
      <Breadcrumb pageName="Profile" description="" />
      <Profile />
    </>
  );
};

export default ProfilePage;
