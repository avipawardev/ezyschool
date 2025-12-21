import axiosInstance from "@/api/axiosInstance";

export const createNotificationService = async (formData, role = "admin") => {
  const url = role === "instructor" 
    ? "/instructor/notifications/create" 
    : "/admin/notifications/create";
    
  const { data } = await axiosInstance.post(url, formData);
  return data;
};

export const fetchNotificationsService = async (userId) => {
    const { data } = await axiosInstance.get(
      `/common/notifications/${userId}`
    );
    return data;
};

export const markNotificationAsReadService = async (id) => {
  const { data } = await axiosInstance.put(
    `/common/notifications/mark-as-read/${id}`
  );
  return data;
};
