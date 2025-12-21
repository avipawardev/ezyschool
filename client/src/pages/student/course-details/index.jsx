import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
//   createPaymentService,
  createRazorpayOrderService,
  fetchStudentViewCourseDetailsService,
  verifyRazorpayPaymentService,
} from "@/services";
import { validateReferralCodeService } from "@/services/referral-service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  async function fetchStudentViewCourseDetails() {
    // const checkCoursePurchaseInfoResponse =
    //   await checkCoursePurchaseInfoService(
    //     currentCourseDetailsId,
    //     auth?.user._id
    //   );

    // if (
    //   checkCoursePurchaseInfoResponse?.success &&
    //   checkCoursePurchaseInfoResponse?.data
    // ) {
    //   navigate(`/course-progress/${currentCourseDetailsId}`);
    //   return;
    // }

    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId
    );

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo);
  }

//   async function handleCreatePayment() {
//     const paymentPayload = {
//       userId: auth?.user?._id,
//       userName: auth?.user?.userName,
//       userEmail: auth?.user?.userEmail,
//       orderStatus: "pending",
//       paymentMethod: "paypal",
//       paymentStatus: "initiated",
//       orderDate: new Date(),
//       paymentId: "",
//       payerId: "",
//       instructorId: studentViewCourseDetails?.instructorId,
//       instructorName: studentViewCourseDetails?.instructorName,
//       courseImage: studentViewCourseDetails?.image,
//       courseTitle: studentViewCourseDetails?.title,
//       courseId: studentViewCourseDetails?._id,
//       coursePricing: studentViewCourseDetails?.pricing,
//     };

//     console.log(paymentPayload, "paymentPayload");
//     const response = await createPaymentService(paymentPayload);

//     if (response.success) {
//       sessionStorage.setItem(
//         "currentOrderId",
//         JSON.stringify(response?.data?.orderId)
//       );
//       setApprovalUrl(response?.data?.approveUrl);
//     }
//   }

  async function handleRazorpayPayment() {
    const paymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName || "Unknown",
      userEmail: auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "razorpay",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    if (!auth?.user?._id || !studentViewCourseDetails?._id) {
      alert("User details or Course details are missing. Please reload the page.");
      return;
    }

    const orderResponse = await createRazorpayOrderService(
      studentViewCourseDetails?.pricing
    );

    if (orderResponse.success) {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        name: "EzySchool LMS",
        description: studentViewCourseDetails?.title,
        image: studentViewCourseDetails?.image,
        order_id: orderResponse.order.id,
        handler: async function (response) {
          console.log(response);

          const verifyResponse = await verifyRazorpayPaymentService({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            payload: { ...paymentPayload, referralCode: appliedReferral ? referralCode : "" },
          });

          if (verifyResponse.success) {
            sessionStorage.setItem(
              "currentOrderId",
              JSON.stringify(verifyResponse?.data?._id)
            );
            navigate("/payment-return");
          }
        },
        prefill: {
          name: auth?.user?.userName,
          email: auth?.user?.userEmail,
          contact: "9999999999",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    }
  }

  const [referralCode, setReferralCode] = useState("");
  const [appliedReferral, setAppliedReferral] = useState(null); // { referrerName: string }
  const [referralError, setReferralError] = useState("");

  const handleApplyReferral = async () => {
      if(!referralCode.trim()) return;
      setReferralError("");
      const response = await validateReferralCodeService(referralCode);
      if(response.success) {
          if(response.referrerId === auth?.user?._id) {
             setReferralError("You cannot use your own code.");
             setAppliedReferral(null);
             return;
          }
          setAppliedReferral({ referrerName: response.referrerName });
      } else {
          setAppliedReferral(null);
          setReferralError("Invalid Referral Code");
      }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("course/details"))
      setStudentViewCourseDetails(null),
        setCurrentCourseDetailsId(null),
        setCoursePurchaseId(null);
  }, [location.pathname]);

  if (loadingState) return <Skeleton />;

  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
  }

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (item) => item.freePreview
        )
      : -1;

  return (
    <div className=" mx-auto p-4">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">
          {studentViewCourseDetails?.title}
        </h1>
        <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <span>Created By {studentViewCourseDetails?.instructorName}</span>
          <span>Created On {studentViewCourseDetails?.date.split("T")[0]}</span>
          <span className="flex items-center">
            <Globe className="mr-1 h-4 w-4" />
            {studentViewCourseDetails?.primaryLanguage}
          </span>
          <span>
            {studentViewCourseDetails?.students.length}{" "}
            {studentViewCourseDetails?.students.length <= 1
              ? "Student"
              : "Students"}
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-grow">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What you'll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {studentViewCourseDetails?.objectives
                  .split(",")
                  .map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>{studentViewCourseDetails?.description}</CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              {studentViewCourseDetails?.curriculum?.map(
                (curriculumItem, index) => (
                  <li
                    className={`${
                      curriculumItem?.freePreview
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    } flex items-center mb-4`}
                    key={index}
                    onClick={
                      curriculumItem?.freePreview
                        ? () => handleSetFreePreview(curriculumItem)
                        : null
                    }
                  >
                    {curriculumItem?.freePreview ? (
                      <PlayCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    <span>{curriculumItem?.title}</span>
                  </li>
                )
              )}
            </CardContent>
          </Card>
        </main>
        <aside className="w-full md:w-[500px]">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1
                      ? studentViewCourseDetails?.curriculum[
                          getIndexOfFreePreviewUrl
                        ].videoUrl
                      : ""
                  }
                  width="100%"
                  height="100%"
                />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  ₹{studentViewCourseDetails?.pricing}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                  {/* <Button onClick={handleCreatePayment} className="w-full">
                    Buy with Paypal
                  </Button> */}
                  <div className="mb-4">
                       <Label className="mb-2 block">Referral Code</Label>
                       <div className="flex gap-2">
                           <Input 
                                placeholder="Enter Code" 
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                                disabled={!!appliedReferral}
                           />
                           {appliedReferral ? (
                               <Button variant="outline" onClick={() => { setAppliedReferral(null); setReferralCode(""); }}>Remove</Button>
                           ) : (
                               <Button onClick={handleApplyReferral}>Apply</Button>
                           )}
                       </div>
                       {appliedReferral && <p className="text-green-600 text-xs mt-1 font-bold">Applied: referred by {appliedReferral.referrerName}</p>}
                       {referralError && <p className="text-red-500 text-xs mt-1">{referralError}</p>}
                  </div>

                  <Button onClick={handleRazorpayPayment} className="w-full">
                    Buy with Razorpay
                  </Button>
                  {getIndexOfFreePreviewUrl !== -1 && (studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl]?.notes || studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl]?.pdfUrl) ? (
                     <Button 
                        onClick={() => handleSetFreePreview(studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl])} 
                        variant="outline" 
                        className="w-full"
                    >
                        View Notes & Resources
                     </Button>
                  ) : null}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="w-[90vw] sm:w-[800px] max-w-5xl">
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
            <DialogDescription className="sr-only">
                Anyone can view this preview.
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video rounded-lg flex items-center justify-center">
            <VideoPlayer
              url={displayCurrentVideoFreePreview?.videoUrl}
              width="100%"
              height="100%"
            />
          </div>

          <div className="flex flex-col gap-2">
            {studentViewCourseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((filteredItem, index) => (
                <p
                  key={index}
                  onClick={() => handleSetFreePreview(filteredItem)}
                  className="cursor-pointer text-[16px] font-medium"
                >
                  {filteredItem?.title}
                </p>
              ))}
          </div>
          <div className="mt-4 space-y-4">
              {displayCurrentVideoFreePreview?.notes ? (
                  <div className="p-4 bg-gray-100 rounded-md dark:bg-gray-800">
                      <h3 className="font-bold mb-2">Lecture Notes</h3>
                      <p className="text-gray-700 whitespace-pre-wrap dark:text-gray-300">{displayCurrentVideoFreePreview.notes}</p>
                  </div>
              ) : null}
              {displayCurrentVideoFreePreview?.pdfUrl ? (
                  <div className="p-4 bg-gray-100 rounded-md dark:bg-gray-800">
                      <h3 className="font-bold mb-2">Course Material</h3>
                       <a 
                          href={displayCurrentVideoFreePreview.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline font-medium"
                      >
                          Download / View PDF
                      </a>
                  </div>
              ) : null}
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPage;
