import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { createNotificationService } from "@/services/notification-service";
import { useToast } from "@/hooks/use-toast";

function NotificationCreator({ mode = "admin" }) {
  const [formData, setFormData] = useState({
    recipientType: "all-students",
    userId: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSend = async () => {
    if (!formData.message) {
        toast({
            title: "Error",
            description: "Message is required",
            variant: "destructive"
        })
        return;
    }

    const response = await createNotificationService(formData, mode);
    if (response.success) {
      toast({
        title: "Success",
        description: "Notification sent successfully",
      });
      setFormData({
        recipientType: "all-students",
        userId: "",
        message: "",
      });
    } else {
        toast({
            title: "Error",
            description: response.message || "Failed to send notification",
            variant: "destructive"
        })
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Notification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Recipient</Label>
          <Select
            value={formData.recipientType}
            onValueChange={(value) =>
              setFormData({ ...formData, recipientType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Recipient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-students">All Students</SelectItem>
              {mode === "admin" && (
                <SelectItem value="all-instructors">All Instructors</SelectItem>
              )}
              <SelectItem value="specific-user">Specific User (ID)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.recipientType === "specific-user" && (
          <div className="space-y-2">
            <Label>User ID</Label>
            <Input
              placeholder="Enter User ID"
              value={formData.userId}
              onChange={(e) =>
                setFormData({ ...formData, userId: e.target.value })
              }
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Message</Label>
          <Textarea
            placeholder="Type notification message..."
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
          />
        </div>

        <Button onClick={handleSend} className="w-full">
          Send Notification
        </Button>
      </CardContent>
    </Card>
  );
}

export default NotificationCreator;
