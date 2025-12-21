import { useEffect, useState } from "react";
import { getTicketsService } from "@/services/support-service";
import SupportTicketList from "@/components/support/ticket-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AdminSupport() {
  const [tickets, setTickets] = useState([]);

  async function fetchTickets() {
      // For admin, userId is not strictly needed if backend ignores it for role=admin, 
      // but we pass something valid or handle in backend. 
      // Current backend logic: if role != 'student', query is empty (fetches all).
      const response = await getTicketsService("admin", "admin");
      if (response.success) setTickets(response.data);
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Management</CardTitle>
      </CardHeader>
      <CardContent>
         <SupportTicketList tickets={tickets} role="admin" onTicketUpdated={fetchTickets} />
      </CardContent>
    </Card>
  );
}

export default AdminSupport;
