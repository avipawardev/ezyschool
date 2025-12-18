// Helper function to generate device ID
export const generateDeviceId = () => {
  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    deviceId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
};

// Format currency
export const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN");
};
