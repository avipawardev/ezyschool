import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });

  return data;
}

export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);

  return data;
}

export async function checkAuthService() {
  const { data } = await axiosInstance.get("/auth/check-auth");

  return data;
}



// Service to delete user account
export async function deleteAccountService() {
  const { data } = await axiosInstance.delete("/auth/delete");
  return data;
}

export async function mediaUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function mediaDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);

  return data;
}

export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(`/instructor/course/get`);

  return data;
}

export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(`/instructor/course/add`, formData);

  return data;
}

export async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/details/${id}`
  );

  return data;
}

export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );

  return data;
}

export async function mediaBulkUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function fetchStudentViewCourseListService(query) {
  const CACHE_KEY = `courseListCache_${query}`;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const cachedData = sessionStorage.getItem(CACHE_KEY);
  if (cachedData) {
    const { timestamp, data } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_DURATION) {
      // console.log("Returning cached courses"); // Optional: Keep clean
      return data;
    }
  }

  const { data } = await axiosInstance.get(`/student/course/get?${query}`);
  
  if (data?.success) {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          data: data
      }));
  }

  return data;
}

export async function fetchStudentViewCourseDetailsService(courseId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}`
  );

  return data;
}

export async function checkCoursePurchaseInfoService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/purchase-info/${courseId}/${studentId}`
  );

  return data;
}

// export async function createPaymentService(formData) {
//   const { data } = await axiosInstance.post(`/student/order/create`, formData);

//   return data;
// }

// export async function captureAndFinalizePaymentService(
//   paymentId,
//   payerId,
//   orderId
// ) {
//   const { data } = await axiosInstance.post(`/student/order/capture`, {
//     paymentId,
//     payerId,
//     orderId,
//   });

//   return data;
// }

export async function fetchStudentBoughtCoursesService(studentId) {
  const { data } = await axiosInstance.get(
    `/student/courses-bought/get/${studentId}`
  );

  return data;
}

export async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  );

  return data;
}

export async function markLectureAsViewedService(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  );

  return data;
}

export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    {
      userId,
      courseId,
    }
  );

  return data;
}

export async function getUserProfileService(id) {
  const { data } = await axiosInstance.get(`/student/profile/get/${id}`);
  return data;
}

export async function updateUserProfileService(id, formData) {
  const { data } = await axiosInstance.put(`/student/profile/update/${id}`, formData);
  return data;
}

export async function getCourseSuggestionsService(id) {
  const { data } = await axiosInstance.get(`/student/profile/suggestions/${id}`);
  return data;
}

export async function createRazorpayOrderService(coursePricing) {
  const { data } = await axiosInstance.post("/student/razorpay/create-order", {
    coursePricing,
  });
  return data;
}

export async function verifyRazorpayPaymentService(paymentData) {
  const { data } = await axiosInstance.post(
    "/student/razorpay/verify-payment",
    paymentData
  );
  return data;
}

export async function submitAssignmentService(
  userId,
  courseId,
  lectureId,
  assignmentId,
  assignmentUrl,
  public_id
) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/submit-assignment`,
    {
      userId,
      courseId,
      lectureId,
      assignmentId,
      assignmentUrl,
      public_id,
    }
  );
  return data;
}

export async function submitMCQService(userId, courseId, lectureId, score) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/submit-mcq`,
    {
      userId,
      courseId,
      lectureId,
      score,
    }
  );
  return data;
}

export async function fetchAIResponseService(question, context, language = "english") {
  const { data } = await axiosInstance.post("/student/ai/chat", {
    question,
    context,
    language,
  });
  return data;
}
