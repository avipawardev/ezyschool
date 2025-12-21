import { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfileService } from "@/services";

function MobileNumberDialog() {
  const { auth, setAuth } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (auth?.authenticate && auth?.user && !auth?.user?.phoneNumber) {
      setOpen(true);
    } else {
        setOpen(false);
    }
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
       toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    try {
        const payload = {
            phoneNumber,
            userName: auth?.user?.userName || "", 
        };
        
        const response = await updateUserProfileService(auth.user._id, payload);
        if(response?.success){
             toast({
                title: "Success",
                description: "Mobile number updated successfully",
            });
            // Update local auth state
            setAuth(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    phoneNumber: phoneNumber
                }
            }));
            
            // Update session storage
            const localUser = JSON.parse(sessionStorage.getItem("user"));
            if(localUser) {
                localUser.phoneNumber = phoneNumber;
                sessionStorage.setItem("user", JSON.stringify(localUser));
            }
            
            setOpen(false);
            window.location.reload(); 
        } else {
             toast({
                title: "Error",
                description: response?.message || "Failed to update profile",
                variant: "destructive",
            });
        }
    } catch (error) {
        console.error(error);
         toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()} >
        <DialogHeader>
          <DialogTitle>Update Your Profile</DialogTitle>
          <DialogDescription>
            Your mobile number is required to continue. Please update it below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Mobile
            </Label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="col-span-3"
              placeholder="Enter your mobile number"
            />
          </div>
          <DialogFooter>
             <Button type="button" variant="outline" onClick={() => setOpen(false)}>Close</Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default MobileNumberDialog;
