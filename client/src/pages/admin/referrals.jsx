import { useEffect, useState } from "react";
import { getReferralPercentageService, updateReferralPercentageService, getAllReferralsService, updateReferralStatusService } from "@/services/referral-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

function AdminReferralPage() {
    const [referrals, setReferrals] = useState([]);
    const [percentage, setPercentage] = useState(0);
    const [newPercentage, setNewPercentage] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const refs = await getAllReferralsService();
        if (refs.success) setReferrals(refs.data);

        const perc = await getReferralPercentageService();
        if (perc.success) {
            setPercentage(perc.data);
            setNewPercentage(perc.data);
        }
    }

    const handleUpdatePercentage = async () => {
        const response = await updateReferralPercentageService(newPercentage);
        if (response.success) {
            setPercentage(newPercentage);
            toast({ title: "Updated", description: "Referral percentage updated." });
        }
    }

    const handleMarkPaid = async (id) => {
        const response = await updateReferralStatusService(id, "paid");
        if(response.success) {
            fetchData(); // Refresh list
            toast({ title: "Paid", description: "Marked as Payment Done." });
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Referral Management</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Global Settings</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <p className="font-bold">Commission Percentage:</p>
                    <Input 
                        type="number" 
                        value={newPercentage} 
                        onChange={(e) => setNewPercentage(e.target.value)} 
                        className="w-24"
                    />
                    <span className="text-xl font-bold">%</span>
                    <Button onClick={handleUpdatePercentage}>Update</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Referrals</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Referrer</TableHead>
                                    <TableHead>Referred User</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {referrals.map((ref) => (
                                    <TableRow key={ref._id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold">{ref.referrerName}</span>
                                                <span className="text-xs text-muted-foreground">{ref.referrerEmail}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold">{ref.referredUserName}</span>
                                                <span className="text-xs text-muted-foreground">{ref.referredUserEmail}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{ref.courseTitle}</TableCell>
                                        <TableCell>{new Date(ref.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-bold text-green-600">₹{ref.amount} ({ref.commissionPercentage}%)</TableCell>
                                        <TableCell>
                                            <Badge className={ref.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}>
                                                {ref.status === 'paid' ? 'Paid' : 'Pending'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {ref.status === 'pending' && (
                                                <Button size="sm" onClick={() => handleMarkPaid(ref._id)}>Payment Done</Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default AdminReferralPage;
