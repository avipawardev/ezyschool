import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { createTicketService } from "@/services/support-service";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";

function CreateTicketDialog({ onTicketCreated }) {
  const [open, setOpen] = useState(false);
  const { auth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
  });
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!formData.title || !formData.description) {
        toast({ title: "Error", description: "All fields are required", variant: "destructive" });
        return;
    }

    const { user } = auth;
    const payload = {
        ...formData,
        userId: user._id,
        userName: user.userName,
        userEmail: user.userEmail
    };

    const response = await createTicketService(payload);
    if (response.success) {
      toast({ title: "Success", description: "Ticket created successfully" });
      setOpen(false);
      setFormData({ title: "", description: "", priority: "medium" });
      if (onTicketCreated) onTicketCreated();
    } else {
        toast({ title: "Error", description: "Failed to create ticket", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold">Create Ticket</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Issue Summary"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your issue..."
            />
          </div>
          <div>
            <Label>Priority</Label>
            <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
            >
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreate} className="w-full">Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTicketDialog;
