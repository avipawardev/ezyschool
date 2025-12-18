import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiFilter, FiStar, FiChevronDown } from "react-icons/fi";
import { courseAPI } from "../api/endpoints.js";

// Mock Data for fallback
const MOCK_COURSES = [
  {
    _id: "m1",
    title: "Class 10 Mathematics - Complete NCERT Guide",
    instructor: "R.K. Sharma",
    rating: 4.8,
    reviews: 1240,
    price: 999,
    originalPrice: 2999,
    thumbnail: "https://img.freepik.com/free-vector/math-background_23-2148148386.jpg",
    class: "10",
    subject: "Mathematics",
    bestseller: true
  },
  {
    _id: "m2",
    title: "Physics Masterclass for Class 12",
    instructor: "Dr. H.C. Verma Designate",
    rating: 4.9,
    reviews: 890,
    price: 1499,
    originalPrice: 4999,
    thumbnail: "https://img.freepik.com/free-vector/physic-formula-chalkboard-background_23-2148166044.jpg",
    class: "12",
    subject: "Physics",
    bestseller: true
  },
  {
    _id: "m3",
    title: "English Grammar & Writing Skills (Class 5-8)",
    instructor: "Mrs. Smitha Patil",
    rating: 4.5,
    reviews: 560,
    price: 499,
    originalPrice: 999,
    thumbnail: "https://img.freepik.com/free-vector/english-book-illustration_23-2147502097.jpg",
    class: "8",
    subject: "English"
  },
  {
    _id: "m4",
    title: "Chemistry: Organic & Inorganic (Class 11)",
    instructor: "Prof. A.K. Gupta",
    rating: 4.7,
    reviews: 780,
    price: 1299,
    originalPrice: 3500,
    thumbnail: "https://img.freepik.com/free-vector/chemistry-laboratory-concept_23-2148525381.jpg",
    class: "11",
    subject: "Chemistry",
    bestseller: true
  },
    {
    _id: "m5",
    title: "Biology Fundamentals (Class 9)",
    instructor: "Dr. Neha Biology",
    rating: 4.6,
    reviews: 450,
    price: 899,
    originalPrice: 1999,
    thumbnail: "https://img.freepik.com/free-vector/biology-laboratory-workspace_23-2148529731.jpg",
    class: "9",
    subject: "Biology"
  },
   {
    _id: "m6",
    title: "History of India (Class 10)",
    instructor: "Social Studies Expert",
    rating: 4.5,
    reviews: 320,
    price: 599,
    originalPrice: 1299,
    thumbnail: "https://img.freepik.com/free-vector/history-doodle-concept_23-2147514802.jpg",
    class: "10",
    subject: "History"
  }
];

const FilterCheckbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer mb-2">
    <input 
      type="checkbox" 
      checked={checked} 
      onChange={onChange}
      className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
    />
    <span className="text-gray-700 text-sm">{label}</span>
  </label>
);

const FilterSection = ({ title, options, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(true);
    
    return (
        <div className="border-t border-gray-200 py-4">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full mb-2 font-bold text-gray-800"
            >
                {title}
                <FiChevronDown className={`transform transition ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-2">
                    {options.map(opt => (
                        <FilterCheckbox 
                            key={opt.value} 
                            label={opt.label} 
                            checked={selected.includes(opt.value)}
                            onChange={() => onChange(opt.value)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  // Filters State
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  useEffect(() => {
    const category = searchParams.get('category');
    if(category) {
        if(category === 'class-5-8') setSelectedClasses(['5', '6', '7', '8']);
        if(category === 'class-9-10') setSelectedClasses(['9', '10']);
        if(category === 'class-11-12') setSelectedClasses(['11', '12']);
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
        setLoading(true);
        try {
             // Race between API and timeout
             const apiPromise = courseAPI.getAll();
             const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 1500));
             
             const response = await Promise.race([apiPromise, timeoutPromise]);
             
             if(isMounted) {
                 const apiCourses = response?.data?.data;
                 if(Array.isArray(apiCourses) && apiCourses.length > 0) {
                     setCourses(apiCourses);
                 } else {
                     setCourses(MOCK_COURSES);
                 }
             }
        } catch (err) {
            console.error(err);
             if(isMounted) setCourses(MOCK_COURSES);
        } finally {
             if(isMounted) setLoading(false);
        }
    };

    loadData();
    return () => { isMounted = false; };
  }, []);
  
  const handleClassFilter = (val) => {
      setSelectedClasses(prev => 
        prev.includes(val) ? prev.filter(p => p !== val) : [...prev, val]
      );
  }

  const handleSubjectFilter = (val) => {
      setSelectedSubjects(prev => 
        prev.includes(val) ? prev.filter(p => p !== val) : [...prev, val]
      );
  }

  // Derived filtered state
  const filteredCourses = (courses || []).filter(course => {
      if(!course) return false;
      const classMatch = selectedClasses.length === 0 || selectedClasses.includes(course.class || "");
      const subjectMatch = selectedSubjects.length === 0 || selectedSubjects.includes(course.subject || "");
      return classMatch && subjectMatch;
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-serif text-gray-900 mb-8">All Courses</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
           {/* Sidebar Filters */}
           <div className="w-full lg:w-64 flex-shrink-0">
               <div className="flex items-center gap-2 mb-4">
                   <FiFilter className="text-lg" />
                   <h2 className="font-bold text-lg">Filter by</h2>
               </div>
               
               <FilterSection 
                    title="Class" 
                    options={[
                        {label: 'Class 5', value: '5'},
                        {label: 'Class 6', value: '6'},
                        {label: 'Class 7', value: '7'},
                        {label: 'Class 8', value: '8'},
                        {label: 'Class 9', value: '9'},
                        {label: 'Class 10', value: '10'},
                        {label: 'Class 11', value: '11'},
                        {label: 'Class 12', value: '12'},
                    ]}
                    selected={selectedClasses}
                    onChange={handleClassFilter}
               />
               
               <FilterSection 
                    title="Subject" 
                    options={[
                        {label: 'Mathematics', value: 'Mathematics'},
                        {label: 'Science', value: 'Science'},
                        {label: 'Physics', value: 'Physics'},
                        {label: 'Chemistry', value: 'Chemistry'},
                        {label: 'Biology', value: 'Biology'},
                        {label: 'English', value: 'English'},
                        {label: 'History', value: 'History'},
                    ]}
                    selected={selectedSubjects}
                    onChange={handleSubjectFilter}
               />
           </div>

           {/* Course List */}
           <div className="flex-1">
               {loading ? (
                   <div className="text-center py-20">Loading courses...</div>
               ) : (
                   <div className="flex flex-col gap-4">
                       {filteredCourses.length === 0 ? (
                           <p className="text-gray-500">No courses match your filters.</p>
                       ) : (
                           filteredCourses.map(course => (
                               <Link 
                                key={course._id} 
                                to={`/courses/${course._id}`}
                                className="flex flex-col md:flex-row gap-4 border-b border-gray-200 pb-4 hover:bg-gray-50 transition p-2 rounded"
                               >
                                   <div className="w-full md:w-64 aspect-video flex-shrink-0">
                                       <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded border border-gray-200" />
                                   </div>
                                   <div className="flex-1">
                                       <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{course.title}</h3>
                                       <p className="text-sm text-gray-500 mb-1">{course.class ? `Class ${course.class}` : 'General'} • {course.subject || 'All Subjects'}</p>
                                       <p className="text-xs text-gray-500 mb-1">
                                            {typeof course.instructor === 'object' ? course.instructor?.name : course.instructor || "Expert Instructor"}
                                        </p>
                                       
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="font-bold text-sm text-yellow-700">{course.rating || 4.5}</span>
                                            <div className="flex text-yellow-500 text-xs">
                                                {[...Array(5)].map((_, i) => (
                                                    <FiStar key={i} className={i < Math.floor(Number(course.rating) || 4.5) ? "fill-current" : ""} />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-400">({course.reviews || 100})</span>
                                        </div>
                                        
                                        {course.bestseller && (
                                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 font-bold rounded-sm">Bestseller</span>
                                        )}
                                   </div>
                                   <div className="text-right">
                                        <span className="font-bold text-lg text-gray-900 block">₹{course.price}</span>
                                        {course.originalPrice && (
                                            <span className="text-sm text-gray-500 line-through block">₹{course.originalPrice}</span>
                                        )}
                                   </div>
                               </Link>
                           ))
                       )}
                   </div>
               )}
           </div>
        </div>
      </div>
    </div>
  );
}
