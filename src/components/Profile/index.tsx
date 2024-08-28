"use client";
import { fetchBusiness } from "@/lib/api";
import useHandleApiErrors from "@/lib/hook/useHandlerApiErrors";
import React, { useEffect, useState } from "react";

export const Profile = () => {
  const { handleApiErrors } = useHandleApiErrors();

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchTroubleShoots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTroubleShoots = async () => {
    try {
      const response = await fetchBusiness("user_2lEyLuLIEBbwEClWhluLCG2JAcH");
      // console.log(response);
      // const isSuccess = await handleApiErrors(response);
      // if (!isSuccess) return;
      const data = await response.json();
      console.log(data, "data from the server");
    } catch (e) {
      console.log(e.message);
    }
  };
  return <div className="flex items-center justify-center">profile</div>;
};
