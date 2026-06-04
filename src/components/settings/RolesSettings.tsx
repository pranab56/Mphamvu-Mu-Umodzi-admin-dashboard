"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useCreateMemberMutation,
  useDeleteMemberMutation,
  useGetAllAdminsQuery,
  useUpdateMemberMutation
} from "@/features/createAdmin/createAdminApi";
import {
  Calendar,
  DollarSign,
  FileText,
  LayoutDashboard,
  Loader2,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  Settings as SettingsIcon,
  Trash2,
  Users
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

const rolesList = [
  { label: "Event Manager", value: "EVENT_MANAGER" },
  { label: "Analytic Manager", value: "ANALYTIC_MANAGER" },
  { label: "Support Manager", value: "SUPPORT_MANAGER" },
  { label: "Content Manager", value: "CONTENT_MANAGER" },
];

const modules = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Members", icon: Users },
  { name: "Events", icon: Calendar },
  { name: "Payments", icon: DollarSign },
  { name: "Reports", icon: FileText },
  { name: "Communication", icon: MessageCircle },
  { name: "Settings", icon: SettingsIcon },
];

interface PageAccess {
  name: string;
  access: boolean;
  _id?: string;
}

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  pageAccess: PageAccess[];
}

export function RolesSettings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  // API Hooks
  const { data: adminsResponse, isLoading: isFetching } = useGetAllAdminsQuery({ page: 1 });
  const [createMember, { isLoading: isCreating }] = useCreateMemberMutation();
  const [updateMember, { isLoading: isUpdatingMember }] = useUpdateMemberMutation();
  const [deleteMember, { isLoading: isDeleting }] = useDeleteMemberMutation();

  // Form State for Add
  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    role: "EVENT_MANAGER",
    pageAccess: modules.map(m => ({ name: m.name, access: false }))
  });

  // Form State for Edit
  const [editFormData, setEditFormData] = useState<TeamMember | null>(null);

  const handleCreate = async () => {
    try {
      await createMember({ data: addFormData }).unwrap();
      toast.success("Member created successfully");
      setIsAddModalOpen(false);
      setAddFormData({
        name: "",
        email: "",
        role: "EVENT_MANAGER",
        pageAccess: modules.map(m => ({ name: m.name, access: false }))
      });
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to create member");
    }
  };

  const handleUpdate = async () => {
    if (!editFormData) return;
    try {
      const { _id, pageAccess, email, name, role } = editFormData;

      // Clean pageAccess to remove _id and only send name/access
      const cleanPageAccess = pageAccess.map((p: PageAccess) => ({
        name: p.name,
        access: !!p.access
      }));

      const updatePayload = {
        name,
        email,
        role,
        pageAccess: cleanPageAccess
      };

      await updateMember({ data: updatePayload, id: _id }).unwrap();
      toast.success("Member updated successfully");
      setIsEditModalOpen(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to update member");
    }
  };

  const handleDelete = async () => {
    if (!deletingMemberId) return;
    try {
      await deleteMember({ id: deletingMemberId }).unwrap();
      toast.success("Member deleted successfully");
      setDeletingMemberId(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to delete member");
    }
  };

  const toggleAddPermission = (moduleName: string) => {
    setAddFormData(prev => ({
      ...prev,
      pageAccess: prev.pageAccess.map(p =>
        p.name === moduleName ? { ...p, access: !p.access } : p
      )
    }));
  };

  const toggleEditPermission = (moduleName: string) => {
    setEditFormData((prev) => {
      if (!prev) return null;
      const existingAccess = prev.pageAccess || [];
      const hasPermission = existingAccess.find((p: PageAccess) => p.name === moduleName);

      if (!hasPermission) {
        // If the permission object doesn't exist yet, add it
        return {
          ...prev,
          pageAccess: [...existingAccess, { name: moduleName, access: true }]
        };
      }

      return {
        ...prev,
        pageAccess: existingAccess.map((p: PageAccess) =>
          p.name === moduleName ? { ...p, access: !p.access } : p
        )
      };
    });
  };

  const admins = (adminsResponse?.data as TeamMember[]) || [];
  const filteredEmployees = admins.filter((emp: TeamMember) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isFetching) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B2F0E]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Role & Permission Editor</h2>
          <p className="text-sm text-gray-500 mt-1">Configure module access permissions for different roles</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#8B2F0E] hover:bg-[#70260B] text-white px-6 py-2.5 rounded-sm flex items-center gap-2 shadow-lg shadow-orange-900/10 transition-all active:scale-95 text-sm font-medium">
              <Plus className="w-4 h-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
            <div className="bg-white p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add New Employee</h2>
                  <p className="text-sm text-gray-500 mt-1">Add a new employee to the platform</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-gray-700 ml-1">Employee Name</label>
                    <Input
                      value={addFormData.name}
                      onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                      placeholder="Enter employee name"
                      className="bg-[#E5E7EB] border-none rounded-sm h-12 mt-1 focus-visible:ring-1 focus-visible:ring-orange-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-gray-700 ml-1">Role</label>
                    <select
                      value={addFormData.role}
                      onChange={(e) => setAddFormData({ ...addFormData, role: e.target.value })}
                      className="w-full bg-[#E5E7EB] border-none rounded-sm h-12 mt-1 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/20"
                    >
                      {rolesList.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-gray-700 ml-1">Email</label>
                  <Input
                    value={addFormData.email}
                    onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                    placeholder="e.g., alex@gmail.com"
                    className="bg-[#E5E7EB] border-none rounded-sm h-12 mt-1 focus-visible:ring-1 focus-visible:ring-orange-500/20"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[13px] font-bold text-gray-900 ml-1">Add Module Permission</label>
                  <div className="grid grid-cols-2 gap-y-4 mt-2">
                    {modules.map((module) => (
                      <div key={module.name} className="flex items-center gap-3">
                        <Checkbox
                          id={`add-${module.name}`}
                          checked={addFormData.pageAccess.find(p => p.name === module.name)?.access}
                          onCheckedChange={() => toggleAddPermission(module.name)}
                          className="w-5 h-5 rounded-md border-none bg-[#E5E7EB] data-[state=checked]:bg-[#8B2F0E]"
                        />
                        <label htmlFor={`add-${module.name}`} className="text-sm font-medium text-gray-600 cursor-pointer">{module.name}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1 h-12 rounded-sm bg-[#E5E7EB] border-none text-gray-600 hover:bg-gray-200">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={isCreating}
                    className="flex-1 h-12 rounded-sm bg-[#8B2F0E] hover:bg-[#70260B] text-white"
                  >
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by name, email, or role..."
          className="bg-[#E5E7EB] border-none rounded-xl h-12 pl-11 text-gray-600 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-[10px] overflow-hidden border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 uppercase tracking-wider">
                <th className="px-8 py-5 text-[11px] font-bold text-gray-500">Employee ID</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-500">Name</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-500">Email</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-500">Role</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEmployees.map((emp: TeamMember) => (
                <tr key={emp._id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-4 text-sm font-bold text-[#1A1C21]">EMP-{emp._id.slice(-3).toUpperCase()}</td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 font-bold border-none">
                        {emp.image ? (
                          <AvatarImage src={emp.image} className="object-cover" />
                        ) : (
                          <AvatarFallback className="bg-[#FF7043] text-white text-[10px]">
                            {emp.name?.split(' ').map((n: string) => n[0]).join('') || "?"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="text-sm font-medium text-gray-900">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm text-gray-500 font-medium">{emp.email}</td>
                  <td className="px-8 py-4 text-sm text-gray-500 font-medium">
                    {rolesList.find(r => r.value === emp.role)?.label || emp.role}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditFormData(emp);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-[#8B2F0E] active:scale-95 shadow-sm cursor-pointer border border-transparent hover:border-gray-100"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={() => setDeletingMemberId(emp._id)}
                            className="p-2 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-red-500 active:scale-95 cursor-pointer shadow-sm border border-transparent hover:border-gray-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white rounded-3xl border-none">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold text-gray-900">Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-500">
                              This action cannot be undone. This will permanently delete the team member
                              <span className="font-semibold text-gray-900 mx-1">{emp.name}</span>
                              and remove their access from the platform.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-3 mt-4">
                            <AlertDialogCancel className="bg-gray-100 border-none rounded-xl h-11 px-6 hover:bg-gray-200 text-gray-600">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-11 px-8 border-none"
                            >
                              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Member"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
          <div className="bg-white p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Employee Information</h2>
                <p className="text-sm text-gray-500 mt-1">Edit the employee information</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-gray-700 ml-1">Employee Name</label>
                  <Input
                    value={editFormData?.name || ""}
                    onChange={(e) => setEditFormData(prev => prev ? { ...prev, name: e.target.value } : null)}
                    placeholder="Enter employee name"
                    className="bg-[#E5E7EB] border-none rounded-sm h-12 mt-1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-gray-700 ml-1">Role</label>
                  <select
                    value={editFormData?.role || ""}
                    onChange={(e) => setEditFormData(prev => prev ? { ...prev, role: e.target.value } : null)}
                    className="w-full bg-[#E5E7EB] border-none rounded-sm h-12 px-3 text-sm focus:outline-none mt-1"
                  >
                    {rolesList.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-gray-700 ml-1">Email</label>
                <Input
                  value={editFormData?.email || ""}
                  onChange={(e) => setEditFormData(prev => prev ? { ...prev, email: e.target.value } : null)}
                  placeholder="e.g., alex@gmail.com"
                  className="bg-[#E5E7EB] border-none rounded-sm h-12 mt-1"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[13px] font-bold text-gray-900 ml-1">Add Module Permission</label>
                <div className="grid grid-cols-2 gap-y-4 mt-1">
                  {modules.map((module) => (
                    <div key={module.name} className="flex items-center gap-3">
                      <Checkbox
                        id={`edit-${module.name}`}
                        checked={editFormData?.pageAccess?.find((p: PageAccess) => p.name === module.name)?.access}
                        onCheckedChange={() => toggleEditPermission(module.name)}
                        className="w-5 h-5 rounded-md border-none bg-[#E5E7EB] data-[state=checked]:bg-[#8B2F0E]"
                      />
                      <label htmlFor={`edit-${module.name}`} className="text-sm font-medium text-gray-600 cursor-pointer">{module.name}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1 h-12 rounded-sm bg-[#E5E7EB] border-none text-gray-600 hover:bg-gray-200">
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={isUpdatingMember}
                  className="flex-1 h-12 rounded-sm bg-[#8B2F0E] hover:bg-[#70260B] text-white"
                >
                  {isUpdatingMember ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save All Changes"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
