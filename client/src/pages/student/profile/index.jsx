import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getUserProfileService,
  updateUserProfileService,
  fetchStudentBoughtCoursesService,
  getCourseSuggestionsService,
  deleteAccountService,
} from "@/services";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"; // Assuming this exists based on toaster.jsx
import { useNavigate } from "react-router-dom";
import { Watch } from "lucide-react";
import { Progress } from "@/components/ui/progress";

function StudentProfilePage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } = useContext(StudentContext);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("info");
  const [profileData, setProfileData] = useState({
    userName: "",
    userEmail: "",
    bio: "",
    phoneNumber: "",
    address: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: "",
      github: "",
    },
    interests: "",
  });
  const [suggestedCourses, setSuggestedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (auth?.user?._id) {
      fetchUserProfile();
      fetchStudentBoughtCourses();
      fetchCourseSuggestions();
    }
  }, [auth?.user?._id]);

  async function fetchUserProfile() {
    setIsLoading(true);
    const response = await getUserProfileService(auth?.user?._id);
    if (response?.success) {
      setProfileData({
        ...response.data,
        socialLinks: response.data.socialLinks || {
            facebook: "",
            twitter: "",
            linkedin: "",
            instagram: "",
            github: "",
        },
        interests: response.data.interests ? response.data.interests.join(", ") : "",
      });
    }
    setIsLoading(false);
  }

  async function fetchStudentBoughtCourses() {
     // Reusing the context setter if beneficial, or just local if we want to isolate.
     // But using the service directly is fine.
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) {
      setStudentBoughtCoursesList(response?.data);
    }
  }

  async function fetchCourseSuggestions() {
    const response = await getCourseSuggestionsService(auth?.user?._id);
    if (response?.success) {
      setSuggestedCourses(response.data);
    }
  }

  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    calculateProfileCompletion();
  }, [profileData]);

  function calculateProfileCompletion() {
      let score = 0;
      let totalFields = 7; // userName, userEmail, bio, phoneNumber, address, interests, socialLinks(any)

      if(profileData.userName) score++;
      if(profileData.userEmail) score++;
      if(profileData.bio) score++;
      if(profileData.phoneNumber) score++;
      if(profileData.address) score++;
      if(profileData.interests && profileData.interests.length > 0) score++;
      
      const hasSocialLinks = Object.values(profileData.socialLinks || {}).some(link => link.trim() !== "");
      if(hasSocialLinks) score++;

      setProfileCompletion(Math.round((score / totalFields) * 100));
  }

  async function handleUpdateProfile(event) {
    event.preventDefault();
    setIsLoading(true);
    const updatedData = {
        ...profileData,
        interests: profileData.interests.split(",").map(i => i.trim()).filter(i => i),
    };
    
    const response = await updateUserProfileService(auth?.user?._id, updatedData);
    if (response?.success) {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
      // Refresh suggestions as interests might have changed
      fetchCourseSuggestions();
    } else {
        toast({
            title: "Error",
            description: "Failed to update profile",
            variant: "destructive"
        })
    }
    setIsLoading(false);
  }

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { resetCredentials } = useContext(AuthContext);

  async function handleDeleteAccount() {
      const response = await deleteAccountService();
      if(response?.success) {
          toast({
              title: "Account Deleted",
              description: "Your account has been deleted successfully.",
          });
          resetCredentials();
          sessionStorage.clear();
          navigate("/auth");
      } else {
          toast({
              title: "Error",
              description: "Failed to delete account.",
              variant: "destructive"
          });
      }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Profile Completion: {profileCompletion}%</span>
            {profileCompletion < 100 && (
                <span className="text-sm text-red-500 font-medium">Please complete your profile</span>
            )}
        </div>
        <Progress value={profileCompletion} className="h-2 w-full" />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">My Info</TabsTrigger>
          <TabsTrigger value="courses">Enrolled Courses</TabsTrigger>
          <TabsTrigger value="suggestions">Recommended For You</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Username</Label>
                        <Input disabled value={profileData.userName} />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input disabled value={profileData.userEmail} />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input 
                            value={profileData.phoneNumber || ""} 
                            onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label>Address</Label>
                        <Input 
                            value={profileData.address || ""} 
                            onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea 
                        value={profileData.bio || ""}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        placeholder="Tell us about yourself..."
                    />
                </div>

                <div className="space-y-2">
                    <Label>Interests (comma separated)</Label>
                    <Input 
                        value={profileData.interests || ""}
                        onChange={(e) => setProfileData({...profileData, interests: e.target.value})}
                        placeholder="Web Development, Design, Marketing..."
                    />
                </div>
                
                <h3 className="font-semibold mt-4">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>LinkedIn</Label>
                        <Input 
                            value={profileData.socialLinks.linkedin || ""}
                            onChange={(e) => setProfileData({...profileData, socialLinks: {...profileData.socialLinks, linkedin: e.target.value}})}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>GitHub</Label>
                        <Input 
                            value={profileData.socialLinks.github || ""}
                            onChange={(e) => setProfileData({...profileData, socialLinks: {...profileData.socialLinks, github: e.target.value}})}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label>Twitter</Label>
                        <Input 
                            value={profileData.socialLinks.twitter || ""}
                            onChange={(e) => setProfileData({...profileData, socialLinks: {...profileData.socialLinks, twitter: e.target.value}})}
                        />
                    </div>
                </div>


                <Button type="submit" className="mt-4" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

           <Card className="border-red-500 mt-6">
                <CardHeader>
                    <CardTitle className="text-red-500">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                        Delete Account
                    </Button>
                </CardContent>
           </Card>

           <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                            Yes, delete my account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
           </AlertDialog>
        </TabsContent>

        <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
                studentBoughtCoursesList.map((course) => (
                    <Card key={course.courseId} className="flex flex-col">
                    <CardContent className="p-4 flex-grow">
                        <img
                        src={course?.courseImage}
                        alt={course?.title}
                        className="h-52 w-full object-cover rounded-md mb-4"
                        />
                        <h3 className="font-bold mb-1">{course?.title}</h3>
                        <p className="text-sm text-gray-700 mb-2">
                        {course?.instructorName}
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button
                        onClick={() =>
                            navigate(`/course-progress/${course?.courseId}`)
                        }
                        className="flex-1"
                        >
                        <Watch className="mr-2 h-4 w-4" />
                        Start Watching
                        </Button>
                    </CardFooter>
                    </Card>
                ))
                ) : (
                <h1 className="text-xl font-bold">No Courses Enrolled</h1>
                )}
            </div>
        </TabsContent>

        <TabsContent value="suggestions">
             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {suggestedCourses && suggestedCourses.length > 0 ? (
                suggestedCourses.map((course) => (
                    <Card key={course._id} className="flex flex-col">
                    <CardContent className="p-4 flex-grow">
                        <img
                        src={course?.image}
                        alt={course?.title}
                        className="h-52 w-full object-cover rounded-md mb-4"
                        />
                        <h3 className="font-bold mb-1">{course?.title}</h3>
                        <p className="text-sm text-gray-700 mb-2">
                        {course?.instructorName}
                        </p>
                         <p className="text-xs text-gray-500 mb-2">
                        Category: {course?.category}
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button
                        onClick={() => navigate(`/course/details/${course?._id}`)}
                        className="flex-1"
                        >
                        View Details
                        </Button>
                    </CardFooter>
                    </Card>
                ))
                ) : (
                <h1 className="text-xl font-bold">No Suggestions Available</h1>
                )}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default StudentProfilePage;
