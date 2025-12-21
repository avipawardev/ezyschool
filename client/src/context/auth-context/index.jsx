import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { setCookie, deleteCookie, getCookie } from "@/utils/cookieUtils";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const { toast } = useToast();
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(event) {
    event.preventDefault();
    try {
      const data = await registerService(signUpFormData);
      if (data?.success) {
          toast({
            title: "Signup successful",
            description: "Account created! Please sign in.",
          });
          return true; // Return success status
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Registration Failed",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      return false;
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);
      console.log(data, "datadatadatadatadata");

      if (data.success) {
        setCookie("accessToken", data.data.accessToken);
        sessionStorage.setItem("accessToken", JSON.stringify(data.data.accessToken)); // Keeping for safety/legacy temporarily if needed elsewhere, but mainly rely on cookie
        
        // Optimistic update of local user state
        sessionStorage.setItem("user", JSON.stringify(data.data.user));

        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        toast({
          title: "Login successful",
          description: `Welcome back, ${data.data.user.userName}!`,
        });
        return true;
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        toast({
          title: "Login Failed",
          description: data?.message || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Login Failed",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      setAuth({
        authenticate: false,
        user: null,
      });
    }
  }

  //check auth user

  async function checkAuthUser() {
    // Optimistic Check
    const localToken = getCookie("accessToken");
    const localUser = JSON.parse(sessionStorage.getItem("user"));
    
    if (localToken && localUser) {
        setAuth({
            authenticate: true,
            user: localUser
        });
        setLoading(false); // Make app interactive immediately
    }

    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        // Update local storage with fresh user data
        sessionStorage.setItem("user", JSON.stringify(data.data.user)); 
        setLoading(false);
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (!error?.response?.data?.success) {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
    deleteCookie("accessToken");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  console.log(auth, "gf");

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        setAuth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
