import { useState, useContext, useEffect } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { AuthContext } from "@/context/auth-context";
import { addReplyService, updateTicketStatusService } from "@/services/support-service";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "../ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";

function TicketDetailsDialog({ ticket, open, onOpenChange, onTicketUpdated, role }) {
  const { auth } = useContext(AuthContext);
  const [replyMessage, setReplyMessage] = useState("");
  const { toast } = useToast();
  // Local state for responses to update UI immediately
  const [responses, setResponses] = useState(ticket?.responses || []);
  const [status, setStatus] = useState(ticket?.status);

  useEffect(() => {
    if (ticket) {
        setResponses(ticket.responses || []);
        setStatus(ticket.status);
    }
  }, [ticket]); // Reset when ticket changes

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;

    const payload = {
        senderId: auth.user._id,
        senderName: auth.user.userName,
        role: role, // 'student', 'instructor', 'admin'
        message: replyMessage
    };

    const response = await addReplyService(ticket._id, payload);
    if (response.success) {
        setResponses(response.data.responses); // Update with server response
        setReplyMessage("");
        toast({ title: "Reply sent" });
        if (onTicketUpdated) onTicketUpdated(); 
    } else {
        toast({ title: "Error", description: "Failed to send reply", variant: "destructive" });
    }
  };

   const handleStatusChange = async (newStatus) => {
    const response = await updateTicketStatusService(ticket._id, newStatus);
    if (response.success) {
      setStatus(newStatus);
      toast({ title: "Success", description: "Ticket status updated" });
      if (onTicketUpdated) onTicketUpdated();
    } else {
        toast({ title: "Error", description: "Failed to update ticket", variant: "destructive" });
    }
  };

  if (!ticket) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            {ticket.title} 
            <Badge variant={status === 'open' ? 'secondary' : 'outline'}>{status}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="font-semibold text-sm mb-1">{ticket.userName} ({ticket.userEmail})</p>
                <p className="text-gray-700 dark:text-gray-300">{ticket.description}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
            
            <separator />
            <h3 className="font-bold">Conversation</h3>

            <ScrollArea className="flex-1 border rounded-md p-4">
                <div className="space-y-4">
                    {responses.length === 0 && <p className="text-center text-muted-foreground text-sm">No replies yet.</p>}
                    {responses.map((res, index) => (
                        <div key={index} className={`flex flex-col ${res.senderId === auth.user._id ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 ${res.senderId === auth.user._id ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                <p className="text-sm font-bold mb-1">{res.senderName} <span className="text-[10px] opacity-70">({res.role})</span></p>
                                <p className="text-sm">{res.message}</p>
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1">{new Date(res.createdAt).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="mt-auto pt-4 space-y-4">
                 <Textarea 
                    placeholder="Type your reply..." 
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                />
                <div className="flex justify-between items-center">
                    {role !== 'student' && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">Status:</span>
                            <Select value={status} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <Button onClick={handleSendReply} className="ml-auto">Send Reply</Button>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TicketDetailsDialog;
