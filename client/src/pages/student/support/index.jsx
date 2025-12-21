import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { getTicketsService } from "@/services/support-service";
import CreateTicketDialog from "@/components/support/create-ticket-dialog";
import SupportTicketList from "@/components/support/ticket-list";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

function StudentSupportPage() {
  const { auth } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("unresolved");

  const fetchTickets = async () => {
    const response = await getTicketsService(auth.user._id, "student");
    if (response.success) {
      setTickets(response.data);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [auth]);

  const filteredTickets = tickets.filter(ticket => {
    if (activeTab === "all") return true; 
    if (activeTab === "resolved") return ticket.status === "resolved" || ticket.status === "closed";
    return ticket.status === "open";
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col transition-all duration-300 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-white mb-6 rounded-b-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Support</h1>
        <p className="mb-6 opacity-90">
             Begin your journey across world-class programs designed to build real-world expertise.
        </p>
        <div className="bg-white/20 p-1 rounded-lg inline-flex backdrop-blur-sm">
            <button className="px-4 py-1.5 bg-white text-purple-700 font-bold rounded-md shadow-sm text-sm">Tickets</button>
            <button className="px-4 py-1.5 text-white/80 font-medium rounded-md hover:bg-white/10 text-sm">Discussion</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 space-y-6">
        {/* Coordinators Section */}
        <Card>
            <CardHeader>
                <CardTitle>Know your Support Co-ordinators</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 border p-4 rounded-lg w-fit pr-12">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">SM</div>
                    <div>
                        <p className="font-bold text-sm">Sourabh More</p>
                        <p className="text-xs text-muted-foreground">EC</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Tickets Section */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Support Tickets</CardTitle>
                <CreateTicketDialog onTicketCreated={fetchTickets} />
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="unresolved">Unresolved</TabsTrigger>
                        <TabsTrigger value="resolved">Resolved</TabsTrigger>
                        <TabsTrigger value="all">All</TabsTrigger>
                    </TabsList>
                    
                    <div className="space-y-4">
                        <SupportTicketList tickets={filteredTickets} role="student" />
                    </div>
                </Tabs>
            </CardContent>
        </Card>
      </div>
     <div className="h-10"></div>
    </div>
  );
}

export default StudentSupportPage;
