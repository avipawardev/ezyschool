import axiosInstance from "@/api/axiosInstance";

export const getReferralPercentageService = async () => {
  const { data } = await axiosInstance.get("/referral/percentage");
  return data;
};

export const updateReferralPercentageService = async (percentage) => {
  const { data } = await axiosInstance.put("/referral/percentage", { percentage });
  return data;
};

export const validateReferralCodeService = async (code) => {
  const { data } = await axiosInstance.get(`/referral/validate/${code}`);
  return data;
};

export const getReferralStatsService = async (userId) => {
    const { data } = await axiosInstance.get(`/referral/stats/${userId}`);
    return data;
};

export const getAllReferralsService = async () => {
    const { data } = await axiosInstance.get("/referral/all");
    return data;
};

export const updateReferralStatusService = async (id, status) => {
    const { data } = await axiosInstance.put(`/referral/status/${id}`, { status });
    return data;
};
