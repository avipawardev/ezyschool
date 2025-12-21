import axiosInstance from "@/api/axiosInstance";

export const createTicketService = async (formData) => {
  const { data } = await axiosInstance.post("/support/create", formData);
  return data;
};

export const getTicketsService = async (userId, role) => {
  const { data } = await axiosInstance.get(`/support/get?userId=${userId}&role=${role}`);
  return data;
};

export const updateTicketStatusService = async (id, status) => {
    const { data } = await axiosInstance.put(`/support/update/${id}`, { status });
    return data;
};

export const addReplyService = async (ticketId, replyData) => {
    const { data } = await axiosInstance.put(`/support/reply/${ticketId}`, replyData);
    return data;
};
