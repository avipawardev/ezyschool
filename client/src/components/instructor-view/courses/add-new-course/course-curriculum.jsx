import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Upload } from "lucide-react";
import { useContext, useRef } from "react";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  }

  function handleCourseTitleChange(event, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      title: event.target.value,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleFreePreviewChange(currentValue, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
          cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleReplaceVideo(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const deleteCurrentMediaResponse = await mediaDeleteService(
      getCurrentVideoPublicId
    );

    if (deleteCurrentMediaResponse?.success) {
      cpyCourseCurriculumFormData[currentIndex] = {
        ...cpyCourseCurriculumFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }

  function handleOpenBulkUploadDialog() {
    bulkUploadInputRef.current?.click();
  }

  function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }

  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();

    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );

      console.log(response, "bulk");
      if (response?.success) {
        let cpyCourseCurriculumFormdata =
          areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)
            ? []
            : [...courseCurriculumFormData];

        cpyCourseCurriculumFormdata = [
          ...cpyCourseCurriculumFormdata,
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${
              cpyCourseCurriculumFormdata.length + (index + 1)
            }`,
            freePreview: false,
          })),
        ];
        setCourseCurriculumFormData(cpyCourseCurriculumFormdata);
        setMediaUploadProgress(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleDeleteLecture(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentSelectedVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);

    if (response?.success) {
      cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
        (_, index) => index !== currentIndex
      );

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Create Course Curriculum</CardTitle>
        <div>
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUploadDialog}
          >
            <Upload className="w-4 h-5 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
          onClick={handleNewLecture}
        >
          Add Lecture
        </Button>
        {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((curriculumItem, index) => (
            <div className="border p-5 rounded-md dark:border-gray-700" key={index}>
              <div className="flex gap-5 items-center">
                <h3 className="font-semibold">Lecture {index + 1}</h3>
                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter lecture title"
                  className="max-w-96"
                  onChange={(event) => handleCourseTitleChange(event, index)}
                  value={courseCurriculumFormData[index]?.title}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                    checked={courseCurriculumFormData[index]?.freePreview}
                    id={`freePreview-${index + 1}`}
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>
                    Free Preview
                  </Label>
                </div>
              </div>
              <div className="mt-6">
                {courseCurriculumFormData[index]?.videoUrl ? (
                  <div className="flex gap-3">
                    <VideoPlayer
                      url={courseCurriculumFormData[index]?.videoUrl}
                      width="450px"
                      height="200px"
                    />
                    <Button onClick={() => handleReplaceVideo(index)}>
                      Replace Video
                    </Button>
                    <Button
                      onClick={() => handleDeleteLecture(index)}
                      className="bg-red-900"
                    >
                      Delete Lecture
                    </Button>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(event) =>
                      handleSingleLectureUpload(event, index)
                    }
                    className="mb-4"
                  />
                )}
              </div>
              <div className="mt-6 space-y-4">
                  <div>
                      <Label>Lecture Notes</Label>
                      <textarea
                          className="w-full p-2 border rounded-md min-h-[100px] dark:bg-gray-800 dark:text-white dark:border-gray-700"
                          placeholder="Add lecture notes here..."
                          value={courseCurriculumFormData[index]?.notes || ""}
                          onChange={(e) => {
                              let cpy = [...courseCurriculumFormData];
                              cpy[index] = { ...cpy[index], notes: e.target.value };
                              setCourseCurriculumFormData(cpy);
                          }}
                      />
                  </div>
                  <div>
                      <Label>Lecture PDF Material</Label>
                      {courseCurriculumFormData[index]?.pdfUrl ? (
                          <div className="flex gap-3 items-center mt-2">
                              <a 
                                  href={courseCurriculumFormData[index]?.pdfUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline"
                              >
                                  View PDF
                              </a>
                              <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                      let cpy = [...courseCurriculumFormData];
                                      cpy[index].pdfUrl = "";
                                      setCourseCurriculumFormData(cpy);
                                  }}
                              >
                                  Remove PDF
                              </Button>
                          </div>
                      ) : (
                          <div className="mt-2">
                              <Input
                                  type="file"
                                  accept="application/pdf"
                                  onChange={async (event) => {
                                      const selectedFile = event.target.files[0];
                                      if (selectedFile) {
                                          const formData = new FormData();
                                          formData.append("file", selectedFile);
                                          try {
                                              setMediaUploadProgress(true);
                                              const response = await mediaUploadService(formData, setMediaUploadProgressPercentage);
                                              if (response.success) {
                                                  let cpy = [...courseCurriculumFormData];
                                                  cpy[index].pdfUrl = response.data.url;
                                                  setCourseCurriculumFormData(cpy);
                                              }
                                          } catch (e) {
                                              console.log(e);
                                          } finally {
                                              setMediaUploadProgress(false);
                                          }
                                      }
                                  }}
                              />
                          </div>
                      )}
                  </div>
                  <div className="mt-4">
                    <Label className="flex justify-between items-center">
                        <span>Assignment Description</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                let cpy = [...courseCurriculumFormData];
                                const currentAssignment = cpy[index]?.assignment || [];
                                if (currentAssignment.length >= 5) {
                                    alert("You can add maximum 5 assignments");
                                    return;
                                }
                                cpy[index] = {
                                    ...cpy[index],
                                    assignment: [
                                        ...currentAssignment,
                                        { title: "" }
                                    ]
                                };
                                setCourseCurriculumFormData(cpy);
                            }}
                        >
                            Add Assignment
                        </Button>
                    </Label>
                    <div className="space-y-4 mt-2">
                        {courseCurriculumFormData[index]?.assignment?.map((assignItem, assignIndex) => (
                             <div key={assignIndex} className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                <Label>Assignment {assignIndex + 1}</Label>
                                <textarea
                                  className="w-full p-2 border rounded-md min-h-[100px] mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                  placeholder="Describe the assignment for this lecture..."
                                  value={assignItem.title || ""}
                                  onChange={(e) => {
                                    let cpy = [...courseCurriculumFormData];
                                    cpy[index].assignment[assignIndex].title = e.target.value;
                                    setCourseCurriculumFormData(cpy);
                                  }}
                                />
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => {
                                         let cpy = [...courseCurriculumFormData];
                                         cpy[index].assignment = cpy[index].assignment.filter((_, i) => i !== assignIndex);
                                         setCourseCurriculumFormData(cpy);
                                    }}
                                >
                                    Remove Assignment
                                </Button>
                             </div>
                        ))}
                    </div>
                  </div>
                   <div className="mt-4">
                    <Label className="flex justify-between items-center">
                        <span>MCQs</span>
                         <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                let cpy = [...courseCurriculumFormData];
                                const currentLecture = cpy[index] || {};
                                const currentMcqs = currentLecture.mcqs || [];
                                if (currentMcqs.length >= 5) {
                                    alert("You can add maximum 5 MCQs");
                                    return;
                                }
                                cpy[index] = {
                                    ...currentLecture,
                                    mcqs: [
                                        ...currentMcqs,
                                        { question: "", options: ["", "", "", ""], correctOption: 1 },
                                    ]
                                };
                                setCourseCurriculumFormData(cpy);
                            }}
                         >
                            Add MCQ
                         </Button>
                    </Label>
                    <div className="space-y-4 mt-2">
                        {courseCurriculumFormData[index]?.mcqs?.map((mcq, mcqIndex) => (
                             <div key={mcqIndex} className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                <Label>Question {mcqIndex + 1}</Label>
                                <Input
                                    className="mt-1 mb-2"
                                    placeholder="Enter question"
                                    value={mcq.question}
                                    onChange={(e) => {
                                        let cpy = [...courseCurriculumFormData];
                                        cpy[index].mcqs[mcqIndex].question = e.target.value;
                                        setCourseCurriculumFormData(cpy);
                                    }}
                                />
                                <Label>Options</Label>
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                    {mcq.options.map((option, optionIndex) => (
                                        <Input
                                            key={optionIndex}
                                            placeholder={`Option ${optionIndex + 1}`}
                                            value={option}
                                            onChange={(e) => {
                                                let cpy = [...courseCurriculumFormData];
                                                cpy[index].mcqs[mcqIndex].options[optionIndex] = e.target.value;
                                                setCourseCurriculumFormData(cpy);
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="mt-2">
                                    <Label>Correct Option (1-4)</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="4"
                                        className="mt-1"
                                        value={mcq.correctOption}
                                        onChange={(e) => {
                                            let cpy = [...courseCurriculumFormData];
                                            cpy[index].mcqs[mcqIndex].correctOption = parseInt(e.target.value);
                                            setCourseCurriculumFormData(cpy);
                                        }}
                                    />
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => {
                                         let cpy = [...courseCurriculumFormData];
                                         cpy[index].mcqs = cpy[index].mcqs.filter((_, i) => i !== mcqIndex);
                                         setCourseCurriculumFormData(cpy);
                                    }}
                                >
                                    Remove MCQ
                                </Button>
                             </div>
                        ))}
                    </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
