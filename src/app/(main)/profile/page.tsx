"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useChangePasswordMutation, useGetMyProfileQuery, useUpdateProfileMutation } from "@/features/profile/profileApi";
import {
  Camera,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MapPin,
  User
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { baseURL } from '../../../utils/BaseURL';

export default function ProfilePage() {
  const { data: profileResponse, isLoading: isFetching } = useGetMyProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const profileData = profileResponse?.data;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    countryCode: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        countryCode: profileData.countryCode || "",
      });
      if (profileData.image) {
        setProfileImage(`${baseURL + profileData.image}`);
      }
    }
  }, [profileData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  const handlePhoneChange = (value: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      phone: value.slice(data.dialCode.length),
      countryCode: `+${data.dialCode}`
    }));
    if (errors.phone) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs.phone;
        return newErrs;
      });
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateProfile = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.address) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = "Current password is required";
    if (!passwordData.newPassword) newErrors.newPassword = "New password is required";
    else if (passwordData.newPassword.length < 6) newErrors.newPassword = "Password must be at least 6 characters";

    if (!passwordData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  console.log(imageFile)

  const handleUpdateProfile = async () => {
    if (!validateProfile()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      const submitData = new FormData();

      // 1. Append the actual file to FormData under the key "image" (as shown in Postman)


      // 2. Prepare the payload for the "data" field
      const payload = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        countryCode: formData.countryCode,
      };

      submitData.append("data", JSON.stringify(payload));
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      const res = await updateProfile(submitData).unwrap();
      toast.success(res.message || "Profile updated successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
      console.error("Update profile error:", err);
    }
  };

  const handleUpdatePassword = async () => {
    if (!validatePassword()) {
      toast.error("Please fill all required password fields correctly");
      return;
    }

    try {
      const res = await changePassword(passwordData).unwrap();
      toast.success(res.message || "Password updated successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  if (isFetching) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#A53200]" />
      </div>
    );
  }

  const initials = formData.name
    ? formData.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "AD";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="space-y-1 mb-8 sm:mb-10 pt-1 sm:pt-0">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2C2E33]">My Profile</h1>
        <p className="text-sm sm:text-base text-gray-500 font-normal">Manage your account information and security settings.</p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Profile Info Section */}
        <section className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-gray-100 space-y-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-center">
            {/* Avatar Upload */}
            <div className="relative group shrink-0">
              <Avatar className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-white shadow-xl">
                <AvatarImage src={profileImage || ""} className="object-cover" />
                <AvatarFallback className="bg-[#F1DED6] text-[#A53200] text-2xl sm:text-3xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-[#A53200] text-white p-2 sm:p-2.5 rounded-full shadow-lg hover:bg-[#E64200] transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#2C2E33]">{formData.name}</h2>
              <p className="text-sm sm:text-base text-gray-500 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4" />
                {formData.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className={`pl-11 sm:pl-12 h-12 sm:h-14 bg-gray-50/30 border-gray-100 rounded-lg sm:rounded-xl text-sm sm:text-base focus:bg-white transition-all ${errors.name ? "border-red-500 ring-1 ring-red-500" : "focus:ring-[#A53200]/20 focus:border-[#A53200]/30"
                    }`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-[10px] sm:text-xs font-medium ml-1 mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Input
                  type="email"
                  value={formData.email}
                  disabled
                  className="pl-11 sm:pl-12 h-12 sm:h-14 bg-gray-100 border-gray-100 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-gray-400 ml-1 mt-1 font-normal">* Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">Phone Number</Label>
              <div className="phone-input-container">
                <PhoneInput
                  country={"mw"}
                  value={formData.countryCode + formData.phone}
                  onChange={handlePhoneChange}
                  containerClass="!w-full !h-12 sm:!h-14"
                  inputClass={`!w-full !h-14 !bg-gray-50/30 !border-gray-100 !rounded-lg sm:!rounded-xl !text-sm sm:!text-base !pl-14 ${errors.phone ? "!border-red-500" : ""}`}
                  buttonClass="!bg-transparent !border-none !rounded-l-xl !pl-3"
                  dropdownClass="!bg-white !rounded-xl !shadow-2xl"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-[10px] sm:text-xs font-medium ml-1 mt-1">{errors.phone}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Textarea
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Enter your address"
                  className={`pl-11 sm:pl-12 pt-4 sm:pt-5 min-h-[100px] bg-gray-50/30 border-gray-100 rounded-lg sm:rounded-xl text-sm sm:text-base focus:bg-white transition-all resize-none ${errors.address ? "border-red-500 ring-1 ring-red-500" : "focus:ring-[#A53200]/20 focus:border-[#A53200]/30"
                    }`}
                />
              </div>
              {errors.address && <p className="text-red-500 text-[10px] sm:text-xs font-medium ml-1 mt-1">{errors.address}</p>}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleUpdateProfile}
              disabled={isUpdating}
              className="w-full sm:w-auto bg-[#A53200] hover:bg-[#E64200] text-white px-8 sm:px-10 h-11 sm:h-12 rounded-lg text-sm sm:text-base font-semibold shadow-lg shadow-orange-100 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Update Profile
            </button>
          </div>
        </section>

        {/* Password Section */}
        <section className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-gray-100 space-y-6">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#2C2E33] flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#A53200]" />
                  Change Password
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Update your password to keep your account secure.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pb-2">
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                    placeholder="Enter current password"
                    className={`pl-11 sm:pl-12 pr-12 h-12 sm:h-14 bg-gray-50/30 border-gray-100 rounded-lg sm:rounded-xl text-sm sm:text-base focus:bg-white transition-all ${errors.currentPassword ? "border-red-500 ring-1 ring-red-500" : "focus:ring-[#A53200]/20 focus:border-[#A53200]/30"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.currentPassword && <p className="text-red-500 text-[10px] sm:text-xs font-medium ml-1 mt-1">{errors.currentPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    placeholder="Enter new password"
                    className={`pl-11 sm:pl-12 pr-12 h-12 sm:h-14 bg-gray-50/30 border-gray-100 rounded-lg sm:rounded-xl text-sm sm:text-base focus:bg-white transition-all ${errors.newPassword ? "border-red-500 ring-1 ring-red-500" : "focus:ring-[#A53200]/20 focus:border-[#A53200]/30"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-500 text-[10px] sm:text-xs font-medium ml-1 mt-1">{errors.newPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                    placeholder="Confirm new password"
                    className={`pl-11 sm:pl-12 pr-12 h-12 sm:h-14 bg-gray-50/30 border-gray-100 rounded-lg sm:rounded-xl text-sm sm:text-base focus:bg-white transition-all ${errors.confirmPassword ? "border-red-500 ring-1 ring-red-500" : "focus:ring-[#A53200]/20 focus:border-[#A53200]/30"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-[10px] sm:text-xs font-medium ml-1 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleUpdatePassword}
                disabled={isChangingPassword}
                className="w-full sm:w-auto bg-[#A53200] hover:bg-[#E64200] text-white px-8 sm:px-10 h-11 sm:h-12 rounded-lg text-sm sm:text-base font-semibold shadow-lg shadow-orange-100 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Update Password
              </button>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .phone-input-container .flag-dropdown {
          border: none !important;
          background: transparent !important;
        }
        .phone-input-container .selected-flag {
          background: transparent !important;
          padding-left: 14px !important;
        }
        .phone-input-container .form-control {
          background: #f9fafb4d !important;
          border: 1px solid #f3f4f6 !important;
          font-family: inherit !important;
          color: #111827 !important;
        }
        .phone-input-container .form-control:focus {
          background: white !important;
          border-color: #a532004d !important;
          box-shadow: 0 0 0 1px #a5320033 !important;
        }
      `}</style>
    </div>
  );
}
