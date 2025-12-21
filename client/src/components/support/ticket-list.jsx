import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTicketStatusService } from "@/services/support-service";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import TicketDetailsDialog from "./ticket-details-dialog";

function SupportTicketList({ tickets, role, onTicketUpdated }) {
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleStatusChange = async (ticketId, newStatus) => {
    const response = await updateTicketStatusService(ticketId, newStatus);
    if (response.success) {
      toast({ title: "Success", description: "Ticket status updated" });
      if (onTicketUpdated) onTicketUpdated();
    } else {
        toast({ title: "Error", description: "Failed to update ticket", variant: "destructive" });
    }
  };

  const handleView = (ticket) => {
      setSelectedTicket(ticket);
      setIsDialogOpen(true);
  };

  if (!tickets || tickets.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No tickets found.</p>;
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div
          key={ticket._id}
          className="border p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors gap-4"
        >
          <div className="flex-1 cursor-pointer" onClick={() => handleView(ticket)}>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-bold text-lg">{ticket.title}</h3>
              <Badge
                variant={ticket.status === "open" ? "secondary" : "outline"}
                className={
                  ticket.status === "open"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700"
                }
              >
                {ticket.status}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {ticket.priority}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </span>
              {role !== "student" && (
                 <span className="text-xs text-muted-foreground">by {ticket.userName} ({ticket.userEmail})</span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
              {ticket.description}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleView(ticket)}>View</Button>
            {role !== "student" && (
                <Select
                    defaultValue={ticket.status}
                    onValueChange={(val) => handleStatusChange(ticket._id, val)}
                >
                    <SelectTrigger className="w-[130px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
            )}
           </div>
        </div>
      ))}
      
      <TicketDetailsDialog 
        ticket={selectedTicket} 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        role={role}
        onTicketUpdated={() => {
            if (onTicketUpdated) onTicketUpdated();
            // Also update selected ticket if needed, but fetch parent will refresh list. 
            // The Dialog receives `ticket` prop. If parent updates `tickets` prop, `selectedTicket` might be stale references?
            // Actually, `selectedTicket` is state. I should probably re-fetch or parent re-render will re-render list, but `selectedTicket` object is stale.
            // But `useEffect` in Dialog listens to `ticket`. 
            // Better strategy: Pass `onTicketUpdated` which refreshes parent list. Parent list re-renders.
            // But how to update `selectedTicket`? 
            // Option: In Dialog, if I update status, local state updates. 
            // If I add reply, local state updates.
            // If parent list updates, `selectedTicket` is still the old object until I re-select.
            // However, since Dialog manages its own `responses` and `status` via useEffect syncing with `ticket`, it should be okay if I manually update local state too.
            // (I already did `setResponses` and `setStatus` in Dialog handles).
        }}
      />
    </div>
  );
}

export default SupportTicketList;
