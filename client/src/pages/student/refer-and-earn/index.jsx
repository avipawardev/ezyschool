import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { getReferralStatsService, getReferralPercentageService } from "@/services/referral-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Coins, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

function StudentReferralPage() {
  const { auth } = useContext(AuthContext);
  const [stats, setStats] = useState({ referrals: [], totalEarnings: 0, paidEarnings: 0, count: 0 });
  const [percentage, setPercentage] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (auth?.user?._id) {
        async function fetchData() {
            const statsData = await getReferralStatsService(auth.user._id);
            if (statsData.success) setStats(statsData.data);
            
            const percData = await getReferralPercentageService();
            if (percData.success) setPercentage(percData.data);
        }
        fetchData();
    }
  }, [auth]);

  const copyCode = () => {
      navigator.clipboard.writeText(auth.user.referralCode);
      toast({ title: "Code Copied!", description: "Share it with your friends." });
  }

  return (
      <div className="container mx-auto p-6 space-y-6">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-8 text-white shadow-lg">
              <h1 className="text-4xl font-bold mb-2">Refer & Earn</h1>
              <p className="opacity-90 text-lg mb-6">Invite your friends and earn <span className="font-bold text-yellow-300 text-2xl">{percentage}%</span> commission on every purchase they make!</p>
              
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl inline-flex items-center gap-4">
                  <div>
                      <p className="text-xs uppercase font-bold opacity-70">Your Referral Code</p>
                      <p className="text-2xl font-mono font-bold tracking-wider">{auth.user.referralCode || "Loading..."}</p>
                  </div>
                  <Button variant="secondary" size="icon" onClick={copyCode}>
                      <Copy className="h-4 w-4" />
                  </Button>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                      <Coins className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">₹{stats.totalEarnings}</div>
                      <p className="text-xs text-muted-foreground">
                          {stats.paidEarnings > 0 ? `₹${stats.paidEarnings} withdrawn` : "No withdrawals yet"}
                      </p>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Successful Referrals</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{stats.count}</div>
                  </CardContent>
              </Card>
          </div>

          <Card>
              <CardHeader>
                  <CardTitle>Referral History</CardTitle>
                  <CardDescription>Track your successful referrals and earnings.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {stats.referrals.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">You haven't referred anyone yet. Start sharing!</p>
                      ) : (
                          stats.referrals.map((ref) => (
                              <div key={ref._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                  <div>
                                      <p className="font-bold">{ref.referredUserName}</p>
                                      <p className="text-xs text-muted-foreground">Course: {ref.courseTitle}</p>
                                      <p className="text-xs text-muted-foreground">{new Date(ref.date).toLocaleDateString()}</p>
                                  </div>
                                  <div className="text-right">
                                      <p className="font-bold text-green-600">+₹{ref.amount}</p>
                                      <Badge variant={ref.status === 'paid' ? 'default' : 'secondary'} className={ref.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}>
                                          {ref.status === 'paid' ? 'Paid' : 'Pending'}
                                      </Badge>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
              </CardContent>
          </Card>
      </div>
  );
}

export default StudentReferralPage;
