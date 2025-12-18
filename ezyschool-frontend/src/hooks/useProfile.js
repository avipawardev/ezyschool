import React from "react";
import { useQuery } from "react-query";
import { authAPI } from "../api/endpoints.js";
import useAuthStore from "../contexts/authStore.js";

const useProfile = () => {
  const { user, setUser } = useAuthStore();

  const { data, isLoading, error } = useQuery("profile", authAPI.getProfile, {
    enabled: !!useAuthStore.getState().token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user: data?.data?.data || user,
    isLoading,
    error,
  };
};

export default useProfile;
