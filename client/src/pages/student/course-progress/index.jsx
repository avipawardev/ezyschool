import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
  submitAssignmentService,
  submitMCQService,
  mediaUploadService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import AIChat from "@/components/student-view/ai-chat";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showRewatchConfirmDialog, setShowRewatchConfirmDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [assignmentParams, setAssignmentParams] = useState({
    uploadProgress: 0,
    isUploading: false,
    assignmentUrl: "",
    previewUrl: "",
    assignmentUrl: "",
    previewUrl: "",
    currentAssignmentId: null,
    public_id: "", // Add public_id state
  });
  const [mcqState, setMcqState] = useState({
    selectedOptions: {}, // { questionIndex: optionIndex }
    isSubmitted: false,
  });
  const { id } = useParams();

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);

          return;
        }

        if (response?.data?.progress?.length === 0) {
          if (!currentLecture) {
            setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          }
        } else {
          console.log("logging here");
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          if (!currentLecture) {
            setCurrentLecture(
              response?.data?.courseDetails?.curriculum[
                lastIndexOfViewedAsTrue + 1
              ]
            );
          }
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  function handleRewatchCourse() {
    setShowCourseCompleteDialog(false);
    setShowRewatchConfirmDialog(true);
  }

  async function handleConfirmRewatch() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowRewatchConfirmDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  function handleNextLecture() {
      const currentLectureIndex = studentCurrentCourseProgress?.courseDetails?.curriculum?.findIndex(
          item => item._id === currentLecture?._id
      );
      
      if (currentLectureIndex !== -1 && currentLectureIndex < studentCurrentCourseProgress?.courseDetails?.curriculum?.length - 1) {
          const nextLecture = studentCurrentCourseProgress?.courseDetails?.curriculum[currentLectureIndex + 1];
          setCurrentLecture(nextLecture);
      }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
    
    if (currentLecture) {
        const lectureProgress = studentCurrentCourseProgress?.progress?.find(
            item => item.lectureId === currentLecture._id
        );
        
        // Deprecated assignmentParams syncing for multiple assignments logic
        // We now handle checking submission status directly in the render loop or via a separate effect if needed
        // For now, reset upload state when lecture changes
        setAssignmentParams({
            uploadProgress: 0,
            isUploading: false,
            assignmentUrl: "",
            previewUrl: "",
            currentAssignmentId: null,
        });

        if (lectureProgress?.mcqCompleted) {
             setMcqState({
                 selectedOptions: {}, 
                 isSubmitted: true 
             });
        } else {
             setMcqState({
                 selectedOptions: {},
                 isSubmitted: false
             });
        }
    }
  }, [currentLecture]);

  async function handleAssignmentUpload(event, assignmentId) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        setAssignmentParams({ ...assignmentParams, isUploading: true, currentAssignmentId: assignmentId });
        const response = await mediaUploadService(formData, (percent) => {
            setAssignmentParams(prev => ({ ...prev, uploadProgress: percent }));
        });
        if (response.success) {
            setAssignmentParams({
                ...assignmentParams,
                isUploading: false,
                isUploading: false,
                assignmentUrl: response.data.url,
                previewUrl: response.data.url,
                public_id: response.data.public_id, // Capture public_id from response
                currentAssignmentId: assignmentId 
            });
        }
    }
  }

  async function handleSubmitAssignment(assignmentId) {
     const response = await submitAssignmentService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture?._id,
        assignmentId,
        currentLecture?._id,
        assignmentId,
        assignmentParams.assignmentUrl,
        assignmentParams.public_id // Send public_id to backend
     );
     if (response.success) {
         fetchCurrentCourseProgress();
         setAssignmentParams({
            uploadProgress: 0,
            isUploading: false,
            assignmentUrl: "",
            previewUrl: "",
            currentAssignmentId: null,
         });
     }
  }

  async function handleSubmitMCQ() {
      let score = 0;
      currentLecture?.mcqs?.forEach((mcq, index) => {
          if (mcqState.selectedOptions[index] + 1 === mcq.correctOption) {
              score++;
          }
      });
      
      const response = await submitMCQService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture?._id,
        score
      );

      if (response.success) {
          setMcqState(prev => ({ ...prev, isSubmitted: true }));
          fetchCurrentCourseProgress();
      }
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#1c1d1f] text-black dark:text-white font-inter">
      {showConfetti && <Confetti />}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1c1d1f] border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student-courses")}
            className="text-black dark:text-white"
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses Page
          </Button>
          <h1 className="text-lg font-bold hidden md:block">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
            <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
            {isSideBarOpen ? (
                <ChevronRight className="h-5 w-5" />
            ) : (
                <ChevronLeft className="h-5 w-5" />
            )}
            </Button>
            <ModeToggle />
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`flex-1 flex flex-col h-full overflow-y-auto ${
            isSideBarOpen ? "mr-[400px]" : ""
          } transition-all duration-300`}
        >
          <div>
            <VideoPlayer
              width="100%"
              height="500px"
              url={currentLecture?.videoUrl}
              onProgressUpdate={setCurrentLecture}
              progressData={currentLecture}
            />
            <div className="p-6 bg-white dark:bg-[#1c1d1f] flex items-center justify-between">
              <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
              {
                   studentCurrentCourseProgress?.courseDetails?.curriculum?.findIndex(
                      item => item._id === currentLecture?._id
                   ) < studentCurrentCourseProgress?.courseDetails?.curriculum?.length - 1 && (
                      <Button onClick={handleNextLecture} className="max-w-40">Next Session</Button>
                   )
              }
            </div>
            
            <div className="p-4 bg-white dark:bg-[#1c1d1f]">
               <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-[#1c1d1f] p-0 h-14 border-b border-gray-200 dark:border-gray-700 mb-4">
                      <TabsTrigger value="overview" className="text-black dark:text-white rounded-none h-full bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white hover:bg-gray-200 dark:hover:bg-gray-800">Overview</TabsTrigger>
                      <TabsTrigger value="notes" className="text-black dark:text-white rounded-none h-full bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white hover:bg-gray-200 dark:hover:bg-gray-800">Notes</TabsTrigger>
                      <TabsTrigger value="assignment" className="text-black dark:text-white rounded-none h-full bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white hover:bg-gray-200 dark:hover:bg-gray-800">Assignment</TabsTrigger>
                      <TabsTrigger value="quiz" className="text-black dark:text-white rounded-none h-full bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white hover:bg-gray-200 dark:hover:bg-gray-800">Quiz</TabsTrigger>
                      <TabsTrigger value="ai" className="text-black dark:text-white rounded-none h-full bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white hover:bg-gray-200 dark:hover:bg-gray-800">AI Help</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                       <div className="p-2 space-y-4">
                          <h2 className="text-xl font-bold mb-4">About this course</h2>
                          <p className="text-gray-800 dark:text-gray-400">
                             {studentCurrentCourseProgress?.courseDetails?.description}
                          </p>
                       </div>
                  </TabsContent>
                   <TabsContent value="notes">
                      <div className="p-2 space-y-6">
                            {currentLecture?.notes ? (
                                <div>
                                    <h2 className="text-xl font-bold mb-2">Lecture Notes</h2>
                                    <p className="text-gray-800 dark:text-gray-400 whitespace-pre-wrap">{currentLecture?.notes}</p>
                                </div>
                            ) : null}
                            {currentLecture?.pdfUrl ? (
                                 <div>
                                    <h2 className="text-xl font-bold mb-2">Course Material</h2>
                                    <a 
                                        href={currentLecture?.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline font-medium"
                                    >
                                        Download / View PDF
                                    </a>
                                </div>
                            ) : null}
                             {!currentLecture?.notes && !currentLecture?.pdfUrl && (
                                <p className="text-gray-500">No notes or resources available for this lecture.</p>
                             )}
                        </div>
                   </TabsContent>
                   <TabsContent value="assignment">
                        <div className="p-2 space-y-6">
                            <h2 className="text-xl font-bold mb-4">Assignments</h2>
                             {currentLecture?.assignment && currentLecture?.assignment.length > 0 ? (
                                <div className="space-y-4">
                                {currentLecture.assignment.map((assignItem, index) => {
                                    const progressItem = studentCurrentCourseProgress?.progress?.find(p => p.lectureId === currentLecture._id);
                                    const assignmentProgress = progressItem?.assignmentsProgress?.find(ap => ap.assignmentId === assignItem._id);
                                    
                                    const isSubmitted = assignmentProgress?.submitted;
                                    const submittedUrl = assignmentProgress?.assignmentUrl;

                                    return (
                                        <div key={index} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md mb-4">
                                            <h3 className="font-semibold mb-2">Assignment {index + 1}</h3>
                                            <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">{assignItem.title}</p>
                                            
                                            {isSubmitted ? (
                                                <div className="space-y-4">
                                                    <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-md">
                                                        <p className="text-green-500 font-semibold mb-2">Assignment Submitted!</p>
                                                        <a href={submittedUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline">View Submission</a>
                                                    </div>
                                                     <Button onClick={() => setAssignmentParams({
                                                         ...assignmentParams, 
                                                         currentAssignmentId: assignItem._id, 
                                                         assignmentUrl: "" 
                                                     })} variant="outline">Re-upload</Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <Label>Upload your assignment (Notebook Photo)</Label>
                                                    <Input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        onChange={(e) => handleAssignmentUpload(e, assignItem._id)} 
                                                    />
                                                    {assignmentParams.currentAssignmentId === assignItem._id && assignmentParams.isUploading ? <p>Uploading...</p> : null}
                                                    <Button 
                                                        disabled={
                                                            assignmentParams.currentAssignmentId !== assignItem._id || 
                                                            !assignmentParams.assignmentUrl || 
                                                            assignmentParams.isUploading
                                                        } 
                                                        onClick={() => handleSubmitAssignment(assignItem._id)}
                                                    >
                                                        Submit Assignment
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                </div>
                            ) : (
                                <p className="text-gray-500">No assignments for this lecture.</p>
                            )}
                        </div>
                   </TabsContent>
                   <TabsContent value="quiz">
                        <div className="p-2 space-y-6">
                             <h2 className="text-xl font-bold mb-4">Quiz</h2>
                             {currentLecture?.mcqs?.length > 0 ? (
                                <div className="space-y-6">
                                    {mcqState.isSubmitted ? (
                                        <div className="p-4 bg-blue-900/20 border border-blue-500/50 rounded-md">
                                            <h3 className="text-xl font-bold text-blue-500">
                                                Your Score: {studentCurrentCourseProgress?.progress?.find(p => p.lectureId === currentLecture._id)?.mcqScore} / {currentLecture.mcqs.length}
                                            </h3>
                                        </div>
                                    ) : null}
                                    
                                    {currentLecture.mcqs.filter(mcq => mcq.question && mcq.question.trim() !== "").map((mcq, index) => (
                                        <div key={index} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                                            <p className="font-semibold mb-4">Q{index + 1}: {mcq.question}</p>
                                            <div className="space-y-2">
                                                {mcq.options.map((option, optionIndex) => (
                                                    <div key={optionIndex} className="flex items-center space-x-2">
                                                        <input 
                                                            type="radio" 
                                                            name={`mcq-${index}`} 
                                                            disabled={mcqState.isSubmitted}
                                                            checked={mcqState.selectedOptions[index] === optionIndex}
                                                            onChange={() => setMcqState(prev => ({
                                                                ...prev,
                                                                selectedOptions: {
                                                                    ...prev.selectedOptions,
                                                                    [index]: optionIndex
                                                                }
                                                            }))}
                                                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                                                        />
                                                        <label className="text-gray-800 dark:text-gray-300">{option}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {!mcqState.isSubmitted && (
                                         <Button onClick={handleSubmitMCQ} className="w-full">Submit Quiz</Button>
                                    )}
                                </div>
                             ) : (
                                 <p className="text-gray-500">No quiz available for this lecture.</p>
                             )}
                        </div>
                   </TabsContent>
                   <TabsContent value="ai">
                        <AIChat 
                            context={`Lecture Title: ${currentLecture?.title}\nNotes: ${currentLecture?.notes || "No notes available"}`}
                            studentName={auth?.user?.userName}
                        />
                   </TabsContent>
               </Tabs>
            </div>
            
        </div>
       </div>
        <div
          className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-white dark:bg-[#1c1d1f] border-l border-gray-200 dark:border-gray-700 transition-all duration-300 ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full"> 
             <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1c1d1f]">
               <h3 className="text-lg font-bold">Course Content</h3>
             </div>
             <ScrollArea className="flex-1">

                <div className="p-4 space-y-4">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                    (item) => (
                      <div
                        className={`flex items-center space-x-2 text-sm font-bold cursor-pointer p-2 rounded-md ${
                            currentLecture?._id === item._id ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white" : "text-black dark:text-white"
                        }`}
                        key={item._id}
                        onClick={() => setCurrentLecture(item)}
                      >
                        {studentCurrentCourseProgress?.progress?.find(
                          (progressItem) => progressItem.lectureId === item._id
                        )?.viewed ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Play className="h-4 w-4 " />
                        )}
                        <span>{item?.title}</span>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
           </div>
        </div>
      </div>
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>You can't view this page</DialogTitle>
            <DialogDescription>
              Please purchase this course to get access
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={showCourseCompleteDialog} onOpenChange={(is) => {
        setShowCourseCompleteDialog(is);
        setShowConfetti(is);
      }}>
        <DialogContent showOverlay={false} className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <Label>You have completed the course</Label>
              <div className="flex flex-row gap-3">
                <Button onClick={() => navigate("/student-courses")}>
                  My Courses Page
                </Button>
                <Button onClick={handleRewatchCourse}>Rewatch Course</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={showRewatchConfirmDialog} onOpenChange={setShowRewatchConfirmDialog}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>Rewatch Course?</DialogTitle>
            <DialogDescription>
              If you rewatch the course, all your previous assignment submissions will be explicitly deleted from the database.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
             <Button onClick={handleConfirmRewatch} className="w-full bg-red-600 hover:bg-red-700 text-white">
                Understand, Rewatch Course
             </Button>
             <Button onClick={() => setShowRewatchConfirmDialog(false)} variant="outline" className="w-full">
                Cancel
             </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default StudentViewCourseProgressPage;
