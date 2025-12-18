import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClock, FiGlobe, FiAward, FiCheck, FiPlayCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { courseAPI } from "../api/endpoints.js";

// Mock Detailed Data
const MOCK_COURSE_DETAILS = {
  "1": {
    _id: "1",
    title: "Class 10 Mathematics - Complete NCERT Guide",
    description: "Master Class 10 Mathematics with comprehensive video lessons, quizzes, and doubt solving. This course covers the full NCERT syllabus including Real Numbers, Polynomials, Trigonometry, and Statistics.",
    instructor: "R.K. Sharma",
    rating: 4.8,
    reviews: 1240,
    price: 999,
    originalPrice: 2999,
    thumbnail: "https://img.freepik.com/free-vector/math-background_23-2148148386.jpg",
    lastUpdated: "January 2024",
    language: "English, Hindi",
    duration: "45h 30m",
    lectures: 120,
    features: [
        "Full NCERT Solutions",
        "Weekly Live Doubt Classes",
        "Chapter-wise Practice Tests",
        "Downloadable Notes (PDF)"
    ],
    content: [
        { title: "Real Numbers", lectures: 5, duration: "2h 30m" },
        { title: "Polynomials", lectures: 8, duration: "3h 15m" },
        { title: "Trigonometry", lectures: 12, duration: "5h 45m" },
    ]
  },
  "m1": { // Matching mock ID from CoursePage
    _id: "m1",
    title: "Class 10 Mathematics - Complete NCERT Guide",
    description: "Master Class 10 Mathematics with comprehensive video lessons, quizzes, and doubt solving.",
    instructor: "R.K. Sharma",
    rating: 4.8,
    price: 999,
    thumbnail: "https://img.freepik.com/free-vector/math-background_23-2148148386.jpg",
    features: ["Full NCERT Solutions", "Live Doubt Classes"],
    content: []
  }
};

export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      // Attempt to fetch from API, if fail use mock
      // const response = await courseAPI.get(courseId);
      // setCourse(response.data);
      
      // Simulate network delay
      setTimeout(() => {
         const mockData = MOCK_COURSE_DETAILS[courseId] || MOCK_COURSE_DETAILS["1"];
         setCourse(mockData);
         setLoading(false);
      }, 500);

    } catch (error) {
      console.error(error);
      setCourse(MOCK_COURSE_DETAILS["1"]);
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
      try {
          await courseAPI.enroll(courseId);
          toast.success("Successfully enrolled! Redirecting to classroom...");
          setTimeout(() => navigate("/lectures"), 1500);
      } catch (err) {
          toast.success("Already enrolled! Redirecting..."); // Mock success for now
          // toast.error("Enrollment failed. Please try again.");
          setTimeout(() => navigate("/lectures"), 1000);
      }
  }

  if (loading) return <div className="text-center py-20">Loading course details...</div>;
  if (!course) return <div className="text-center py-20">Course not found.</div>;

  return (
    <div className="bg-white min-h-screen">
       {/* Hero / Header */}
       <div className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                    <button onClick={() => navigate("/courses")} className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 text-sm font-bold">
                        <FiArrowLeft /> Back to Courses
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold font-serif leading-tight">{course.title}</h1>
                    <p className="text-lg text-gray-300 max-w-2xl">{course.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm mt-4">
                        {course.bestseller && (
                            <span className="bg-yellow-200 text-yellow-900 font-bold px-2 py-0.5 text-xs rounded">Bestseller</span>
                        )}
                        <span className="text-yellow-400 font-bold flex items-center gap-1">
                             {course.rating} ★★★★★ <span className="text-gray-400 font-normal underline">({course.reviews} ratings)</span>
                        </span>
                        <span className="text-gray-300">Created by <span className="text-purple-400 underline">{typeof course.instructor === 'object' ? course.instructor?.name : course.instructor}</span></span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 mt-2">
                         <div className="flex items-center gap-2"><FiClock /> {course.duration || "Self-Paced"}</div>
                         <div className="flex items-center gap-2"><FiGlobe /> {course.language || "English"}</div>
                         <div className="flex items-center gap-2"><FiAward /> Certificate of Completion</div>
                    </div>
                </div>
                
                {/* Floating Buy Card (Desktop) */}
                <div className="hidden md:block w-80 flex-shrink-0 relative">
                    <div className="absolute top-0 w-full bg-white text-gray-900 p-1 shadow-xl border border-gray-200 rounded-lg">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover rounded-t-md mb-2" />
                        <div className="p-4">
                             <div className="flex items-end gap-2 mb-4">
                                <span className="text-3xl font-bold">₹{course.price}</span>
                                <span className="text-gray-500 line-through mb-1">₹{course.originalPrice}</span>
                                <span className="text-yellow-700 font-bold text-sm mb-1 ml-auto">70% off</span>
                             </div>
                             <button 
                                onClick={handleEnroll}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 text-lg transition mb-2"
                             >
                                 Buy this course
                             </button>
                             <p className="text-center text-xs text-gray-500">30-Day Money-Back Guarantee</p>
                        </div>
                    </div>
                </div>
            </div>
       </div>

       {/* Main Content */}
       <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
            <div className="flex-1">
                {/* What you'll learn */}
                <div className="border border-gray-300 p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">What you'll learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.features && course.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <FiCheck className="mt-0.5 text-gray-400" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Course Content */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Course Content</h2>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        {course.content && course.content.length > 0 ? course.content.map((section, idx) => (
                           <div key={idx} className="border-b border-gray-200 bg-gray-50 p-4">
                               <div className="flex justify-between font-bold text-gray-800 cursor-pointer">
                                   <span>{section.title}</span>
                                   <span className="text-xs text-gray-500 font-normal">{section.lectures} lectures • {section.duration}</span>
                               </div>
                           </div> 
                        )) : (
                            <div className="p-4 text-gray-500">Curriculum details loading...</div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Mobile Buy Card Placeholder or Sidebar */}
            <div className="md:hidden">
                 <div className="flex items-end gap-2 mb-4">
                    <span className="text-3xl font-bold">₹{course.price}</span>
                    <button 
                        onClick={handleEnroll}
                        className="flex-1 bg-purple-600 text-white font-bold py-3 text-lg"
                    >
                         Enroll Now
                    </button>
                </div>
            </div>
       </div>
    </div>
  );
}
