import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { XCircle } from "lucide-react";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentEditUser, setCurrentEditUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(`/admin/users?page=${currentPage}&limit=10`);
        if (response.data.success) {
          setUsers(response.data.data);
          setTotalPages(response.data.meta.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handleUpdateRole = async () => {
    if (!currentEditUser) return;
    try {
        const response = await axiosInstance.put(`/admin/user/${currentEditUser._id}/role`, {
            role: newRole
        });
        if(response.data.success) {
            setUsers(prev => prev.map(user => user._id === currentEditUser._id ? { ...user, role: newRole } : user));
            setOpenDialog(false);
            setCurrentEditUser(null);
        }
    } catch (error) {
        console.error("Failed to update user role:", error);
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
        const response = await axiosInstance.delete(`/admin/user/${userToDelete._id}`);
        if(response.data.success) {
            setUsers(prev => prev.filter(user => user._id !== userToDelete._id));
            setOpenDeleteDialog(false);
            
            toast({
                title: "User deleted successfully",
                description: `${userToDelete.userName} has been removed from the system.`,
            });
            setUserToDelete(null);
        }
    } catch (error) {
        console.error("Failed to delete user:", error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">User Name</TableHead>
                <TableHead className="whitespace-nowrap">Email</TableHead>
                <TableHead className="whitespace-nowrap">Mobile Number</TableHead>
                <TableHead className="whitespace-nowrap">Role</TableHead>
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium whitespace-nowrap">
                          {user.userName}
                          {user.isDeleted && (
                               <XCircle className="inline-block ml-2 text-red-500 h-4 w-4" aria-label="Account Deleted" title="Account Deleted"/>
                          )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{user.userEmail}</TableCell>
                    <TableCell className="whitespace-nowrap">
                        {user.phoneNumber || "N/A"}
                    </TableCell>
                    <TableCell className="capitalize whitespace-nowrap">{user.role}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button variant="outline" size="sm" onClick={() => {
                          setCurrentEditUser(user);
                          setNewRole(user.role);
                          setOpenDialog(true);
                      }}>Edit</Button>
                      <Button variant="destructive" size="sm" className="ml-2" onClick={() => {
                          setUserToDelete(user);
                          setOpenDeleteDialog(true);
                      }}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                  <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">No users found.</TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <div className="flex items-center justify-end space-x-2 py-4 px-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="text-sm font-medium">
            Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateRole}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
                This action cannot be undone. This will permanently delete the user account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default AdminUsers;
