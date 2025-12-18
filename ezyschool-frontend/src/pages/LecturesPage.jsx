import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlay, FiCheckCircle, FiBookOpen, FiClock, FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";
import { courseAPI, lectureAPI } from "../api/endpoints.js";

// Mock Data for fallback
const MOCK_MY_COURSES = [
  { _id: "m1", title: "Class 10 Mathematics", progress: 65 },
  { _id: "m2", title: "Physics Class 12", progress: 30 },
  { _id: "m3", title: "English Grammar", progress: 10 }
];

const MOCK_LECTURES = [
    { _id: "l1", title: "Introduction to Calculus", duration: "10:05", completed: true },
    { _id: "l2", title: "Limits and Continuity", duration: "15:30", completed: true },
    { _id: "l3", title: "Derivatives Basics", duration: "12:15", completed: false },
    { _id: "l4", title: "Applications of Derivatives", duration: "20:00", completed: false },
];

export default function LecturesPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getMyCourses();
      const data = response.data.data || [];
      setCourses(data.length ? data : MOCK_MY_COURSES);
      
      // Auto select first course for better UX
      if (data.length || MOCK_MY_COURSES.length) {
          handleSelectCourse(data[0] || MOCK_MY_COURSES[0]);
      }
    } catch (error) {
      console.error(error);
      setCourses(MOCK_MY_COURSES);
      handleSelectCourse(MOCK_MY_COURSES[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCourse = async (course) => {
    setSelectedCourse(course);
    setCurrentLecture(null); // Reset player
    try {
      const response = await lectureAPI.getByCoursseId(course._id);
      const data = response.data.data && response.data.data.length ? response.data.data : MOCK_LECTURES;
      setLectures(data);
      if(data.length > 0) setCurrentLecture(data[0]);
    } catch (error) {
       setLectures(MOCK_LECTURES);
       setCurrentLecture(MOCK_LECTURES[0]);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col md:flex-row">
      {/* Left Sidebar - Course List (My Subjects) */}
      <div className="w-full md:w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0 flex flex-col">
         <div className="p-4 border-b border-gray-700">
             <h2 className="font-bold text-lg text-gray-100 flex items-center gap-2">
                 <FiBookOpen /> My Subjects
             </h2>
         </div>
         <div className="flex-1 overflow-y-auto">
             {courses.map((course) => (
                 <button
                    key={course._id}
                    onClick={() => handleSelectCourse(course)}
                    className={`w-full text-left p-4 hover:bg-gray-700 transition border-l-4 ${
                        selectedCourse?._id === course._id 
                        ? "bg-gray-700 border-purple-500" 
                        : "border-transparent"
                    }`}
                 >
                     <p className="font-semibold text-sm line-clamp-2">{course.title}</p>
                     <div className="mt-2 w-full bg-gray-600 rounded-full h-1.5">
                         <div 
                            className="bg-purple-500 h-1.5 rounded-full" 
                            style={{ width: `${course.progress || 0}%` }}
                         ></div>
                     </div>
                     <p className="text-xs text-gray-400 mt-1">{course.progress || 0}% Complete</p>
                 </button>
             ))}
         </div>
         <Link to="/metrics" className="p-4 border-t border-gray-700 text-sm text-gray-400 hover:text-white text-center block">
             View All Progress
         </Link>
      </div>
      
      {/* Main Content - Player */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top Bar for Selected Course */}
          <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center px-6 justify-between flex-shrink-0">
             <h1 className="text-xl font-bold truncate">
                 {selectedCourse ? selectedCourse.title : "Select a Course"}
             </h1>
             <button className="text-sm border border-white px-3 py-1 hover:bg-white hover:text-black transition">
                 Share
             </button>
          </div>

          {/* Player Area */}
          <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
              {/* Video Player Section */}
              <div className="flex-1 bg-black p-4 lg:p-8 flex flex-col items-center justify-center min-h-[400px]">
                  {currentLecture ? (
                      <div className="w-full max-w-4xl aspect-video bg-gray-900 rounded-lg shadow-2xl relative group cursor-pointer border border-gray-800">
                          {/* Fake Video Player UI */}
                          <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition">
                                  <FiPlay className="text-white text-3xl" />
                              </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                              <p className="text-white font-bold">{currentLecture.title}</p>
                              <div className="h-1 bg-gray-600 w-full mt-2 rounded-full overflow-hidden">
                                  <div className="w-1/3 h-full bg-purple-500"></div>
                              </div>
                          </div>
                      </div>
                  ) : (
                      <p className="text-gray-500">Select a lecture to start watching</p>
                  )}
                  
                  {currentLecture && (
                      <div className="w-full max-w-4xl mt-6 text-left">
                          <h2 className="text-2xl font-bold mb-2">{currentLecture.title}</h2>
                          <p className="text-gray-400 leading-relaxed">
                              {currentLecture.description || "In this lecture, we will cover the fundamental concepts of this topic. Make sure to take notes and complete the quiz at the end."}
                          </p>
                      </div>
                  )}
              </div>
              
              {/* Course Content List (Right Side) */}
              <div className="w-full lg:w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto">
                  <div className="p-4 border-b border-gray-700 font-bold">
                      Course Content
                  </div>
                  <div>
                      {lectures.map((lecture, idx) => (
                          <button 
                            key={lecture._id} 
                            onClick={() => setCurrentLecture(lecture)}
                            className={`w-full text-left p-4 border-b border-gray-700 flex gap-3 hover:bg-gray-750 transition ${
                                currentLecture?._id === lecture._id ? "bg-gray-700" : ""
                            }`}
                          >
                              <div className="mt-1">
                                  {lecture.completed ? (
                                      <FiCheckCircle className="text-purple-500" />
                                  ) : (
                                       <div className="w-4 h-4 rounded-full border-2 border-gray-500"></div>
                                  )}
                              </div>
                              <div>
                                  <p className="text-sm font-semibold text-gray-200">
                                      {idx + 1}. {lecture.title}
                                  </p>
                                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                     <FiPlay className="text-[10px]" />
                                     <span>{lecture.duration || "10:00"}</span>
                                  </div>
                              </div>
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
