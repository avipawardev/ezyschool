import React from "react";
import { Link } from "react-router-dom";
import useProfile from "../hooks/useProfile.js";
import useAuthStore from "../contexts/authStore.js";
import { FiClock, FiStar, FiUser } from "react-icons/fi";

const HeroSection = ({ user }) => (
  <div className="relative bg-white shadow-sm mb-8">
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center gap-8">
      {/* Hero Content */}
      <div className="flex-1 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 leading-tight">
          Welcome back, {user?.name}
        </h1>
        <p className="text-lg text-gray-600 max-w-lg">
          Prepare for your exams with our expert-designed courses for Class 5 to 12.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/courses" className="bg-gray-900 text-white font-bold py-3 px-6 hover:bg-gray-800 transition">
                Explore Subjects
            </Link>
            <Link to="/profile" className="bg-white border border-gray-900 text-gray-900 font-bold py-3 px-6 hover:bg-gray-50 transition">
                My Progress
            </Link>
        </div>
      </div>
      {/* Hero Image */}
      <div className="flex-1 flex justify-center md:justify-end">
        <img 
            src="https://img.freepik.com/free-vector/happy-students-with-books_23-2148165992.jpg" 
            alt="School Learning" 
            className="shadow-lg max-w-md w-full object-cover h-64 md:h-80"
            onError={(e) => e.target.src = "https://via.placeholder.com/500x300?text=School+Education"}
        />
      </div>
    </div>
  </div>
);

const CourseCard = ({ course }) => (
  <Link to={`/courses/${course.id}`} className="group block min-w-[280px] max-w-[300px] snap-start">
    <div className="relative aspect-video overflow-hidden border border-gray-200">
      <img
        src={course.image}
        alt={course.title}
        className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
      />
    </div>
    <div className="pt-3 pb-4">
      <h3 className="font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-purple-700 transition">
        {course.title}
      </h3>
      <p className="text-xs text-gray-500 mt-1 truncate">{course.instructor}</p>
      
      {/* Rating */}
      <div className="flex items-center gap-1 mt-1">
        <span className="font-bold text-sm text-yellow-700">{course.rating}</span>
        <div className="flex text-yellow-500 text-xs">
           {[...Array(5)].map((_, i) => (
             <FiStar key={i} className={i < Math.floor(course.rating) ? "fill-current" : ""} />
           ))}
        </div>
        <span className="text-xs text-gray-400">({course.reviews})</span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2 mt-2">
        <span className="font-bold text-gray-900">₹{course.price}</span>
        {course.originalPrice && (
             <span className="text-sm text-gray-400 line-through">₹{course.originalPrice}</span>
        )}
      </div>
      
      {/* Badge */}
      {course.bestseller && (
         <div className="mt-2 text-xs font-bold bg-yellow-200 text-yellow-800 px-2 py-0.5 inline-block">
            Top Rated
         </div>
      )}
    </div>
  </Link>
);

const CourseRow = ({ title, courses }) => (
  <div className="mb-12">
    <div className="flex justify-between items-end mb-4 px-4">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <Link to="/courses" className="text-purple-600 font-bold text-sm hover:text-purple-800">
           See all
        </Link>
    </div>
    <div className="flex gap-4 overflow-x-auto pb-4 px-4 snap-x hide-scrollbar scroll-pl-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  </div>
);

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { user: profileData } = useProfile();
  const currentUser = profileData || user;
  
  // Mock Data for School Subjects (5th-12th)
  const recentCourses = [
     {
        id: 1,
        title: "Class 10 Mathematics - Complete NCERT Guide",
        instructor: "R.K. Sharma",
        rating: 4.8,
        reviews: "1,240",
        price: 999,
        originalPrice: 2999,
        image: "https://img.freepik.com/free-vector/math-background_23-2148148386.jpg",
        bestseller: true
     },
     {
        id: 2,
        title: "Physics Masterclass for Class 12 - Board Exams 2024",
        instructor: "Dr. H.C. Verma Designate",
        rating: 4.9,
        reviews: "890",
        price: 1499,
        originalPrice: 4999,
        image: "https://img.freepik.com/free-vector/physic-formula-chalkboard-background_23-2148166044.jpg",
        bestseller: true
     },
     {
        id: 3,
        title: "English Grammar & Writing Skills (Class 5-8)",
        instructor: "Mrs. Smitha Patil",
        rating: 4.5,
        reviews: "560",
        price: 499,
        originalPrice: 999,
        image: "https://img.freepik.com/free-vector/english-book-illustration_23-2147502097.jpg",
     }
  ];

  const recommendedCourses = [
    {
        id: 4,
        title: "Chemistry: Organic & Inorganic (Class 11)",
        instructor: "Prof. A.K. Gupta",
        rating: 4.7,
        reviews: "780",
        price: 1299,
        originalPrice: 3500,
        image: "https://img.freepik.com/free-vector/chemistry-laboratory-concept_23-2148525381.jpg",
        bestseller: true
     },
     {
        id: 5,
        title: "Biology Fundamentals: Cell to Organism (Class 9)",
        instructor: "Dr. Neha Biology",
        rating: 4.6,
        reviews: "450",
        price: 899,
        originalPrice: 1999,
        image: "https://img.freepik.com/free-vector/biology-laboratory-workspace_23-2148529731.jpg",
     },
     {
        id: 6,
        title: "History of India: Modern & Ancient (Class 10)",
        instructor: "Social Studies Expert",
        rating: 4.5,
        reviews: "320",
        price: 599,
        originalPrice: 1299,
        image: "https://img.freepik.com/free-vector/history-doodle-concept_23-2147514802.jpg",
     },
     {
        id: 7,
        title: "Vedic Maths Tricks for Speedy Calculations",
        instructor: "Math Wizard",
        rating: 4.8,
        reviews: "2,100",
        price: 299,
        originalPrice: 999,
        image: "https://img.freepik.com/free-vector/abacus-math-concept_23-2148536979.jpg",
        bestseller: true
     }
  ];

  return (
    <div className="bg-white min-h-screen pb-12">
      <HeroSection user={currentUser} />
      
      <div className="max-w-7xl mx-auto">
         {/* Learning Stats */}
         <div className="px-4 mb-8">
            <div className="bg-gray-50 border border-gray-200 p-4 flex gap-8 overflow-x-auto rounded-lg">
                 <div className="flex items-center gap-3 min-w-max">
                    <div className="bg-indigo-100 p-3 rounded-full text-indigo-600"><FiClock /></div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Study Time</p>
                        <p className="font-bold text-gray-800">12h 30m</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 min-w-max">
                    <div className="bg-green-100 p-3 rounded-full text-green-600"><FiUser /></div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">My Subjects</p>
                        <p className="font-bold text-gray-800">4 Active</p>
                    </div>
                 </div>
            </div>
         </div>

         <CourseRow title={`Pick up where you left off, ${currentUser?.name?.split(' ')[0] || 'Student'}`} courses={recentCourses} />
         <CourseRow title="Recommended for your Class" courses={recommendedCourses} />
         <CourseRow title="Popular in Science" courses={[recommendedCourses[0], recommendedCourses[1]]} />
      </div>
    </div>
  );
}
