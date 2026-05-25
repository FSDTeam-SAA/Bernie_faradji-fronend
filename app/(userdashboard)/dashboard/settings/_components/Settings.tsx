"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Camera, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface UserAddress {
  country: string;
  cityState: string;
  roadArea: string;
  postalCode: string;
  taxId: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  dob: string | null;
  gender: string;
  role: string;
  stripeAccountId: string | null;
  bio: string;
  profileImage: string;
  multiProfileImage: string[];
  pdfFile: string;
  otp: string | null;
  otpExpires: string | null;
  otpVerified: boolean;
  resetExpires: string | null;
  isVerified: boolean;
  refreshToken: string;
  hasActiveSubscription: boolean;
  subscriptionExpireDate: string | null;
  blockedUsers: string[];
  language: string;
  address: UserAddress;
}

interface ProfileResponse {
  status?: boolean;
  success?: boolean;
  message?: string;
  data?: UserProfile;
}

interface ProfileFormState {
  name: string;
  email: string;
  gender: string;
}

interface PasswordFormState {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SessionWithFallbackToken {
  accessToken?: string;
  user?: {
    accessToken?: string;
  };
}

const emptyPasswordForm: PasswordFormState = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const getApiBaseUrl = (): string => {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL;

  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured");
  }

  return apiBaseUrl.replace(/\/+$/, "");
};

const readJsonResponse = async <T,>(res: Response): Promise<T> => {
  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

export default function Settings(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormState | null>(null);
  const [passwordData, setPasswordData] =
    useState<PasswordFormState>(emptyPasswordForm);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");

  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const accessToken =
    session?.accessToken ??
    (session as SessionWithFallbackToken | null)?.user?.accessToken;

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    }),
    [accessToken],
  );

  const profileQuery = useQuery<ProfileResponse>({
    queryKey: ["user-profile"],
    enabled: status === "authenticated" && Boolean(accessToken),
    queryFn: async () => {
      const res = await fetch(`${getApiBaseUrl()}/user/me`, {
        headers: authHeaders,
      });
      const response = await readJsonResponse<ProfileResponse>(res);

      if (!res.ok || response.status === false || response.success === false) {
        throw new Error(response.message || "Failed to fetch user profile");
      }

      return response;
    },
  });

  const userProfile = profileQuery.data?.data;

  const profileDefaults = useMemo<ProfileFormState>(
    () => ({
      name: userProfile?.name || "",
      email: userProfile?.email || "",
      gender: userProfile?.gender || "",
    }),
    [userProfile?.email, userProfile?.gender, userProfile?.name],
  );

  const resolvedProfileData = profileData ?? profileDefaults;

  const updateProfileField = (field: keyof ProfileFormState, value: string) => {
    setProfileData((current) => ({
      ...(current ?? profileDefaults),
      [field]: value,
    }));
  };

  useEffect(
    () => () => {
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }
    },
    [profileImagePreview],
  );

  const updateProfileMutation = useMutation({
    mutationFn: async (body: { name: string; gender?: string }) => {
      const res = await fetch(`${getApiBaseUrl()}/user/me`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(body),
      });
      const response = await readJsonResponse<ProfileResponse>(res);

      if (!res.ok || response.status === false || response.success === false) {
        throw new Error(response.message || "Failed to update profile");
      }

      return response;
    },
    onSuccess: async () => {
      toast.success("Profile updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (body: { oldPassword: string; newPassword: string }) => {
      const res = await fetch(`${getApiBaseUrl()}/auth/change-password`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(body),
      });
      const response = await readJsonResponse<{
        message?: string;
        status?: boolean;
        success?: boolean;
      }>(res);

      if (!res.ok || response.status === false || response.success === false) {
        throw new Error(response.message || "Failed to change password");
      }

      return response;
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
      setPasswordData(emptyPasswordForm);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const uploadProfileImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await fetch(`${getApiBaseUrl()}/user/upload-avatar`, {
        method: userProfile?.profileImage ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      const response = await readJsonResponse<ProfileResponse>(res);

      if (!res.ok || response.status === false || response.success === false) {
        throw new Error(response.message || "Failed to upload profile image");
      }

      return response;
    },
    onSuccess: async () => {
      toast.success("Profile image updated successfully");
      setProfileImageFile(null);
      setProfileImagePreview((current) => {
        if (current) {
          URL.revokeObjectURL(current);
        }
        return "";
      });
      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const clearSelectedProfileImage = () => {
    setProfileImageFile(null);
    setProfileImagePreview((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return "";
    });
  };

  const handleProfileImageChange = (file?: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setProfileImageFile(file);
    setProfileImagePreview((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return objectUrl;
    });
  };

  const handleProfileSubmit = async () => {
    const name = resolvedProfileData.name.trim();
    const gender = resolvedProfileData.gender.trim();

    if (!name) {
      toast.error("Name is required");
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        name,
        ...(gender ? { gender } : {}),
      });

      if (profileImageFile) {
        await uploadProfileImageMutation.mutateAsync(profileImageFile);
      }
    } catch {
      // Mutation callbacks already show the API error toast.
    }
  };

  const handlePasswordSubmit = () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.error("Old password and new password are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    changePasswordMutation.mutate({
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const handleSave = () => {
    if (activeTab === "profile") {
      void handleProfileSubmit();
      return;
    }

    handlePasswordSubmit();
  };

  const handleDiscard = () => {
    if (activeTab === "profile") {
      setProfileData(null);
      clearSelectedProfileImage();
      return;
    }

    setPasswordData(emptyPasswordForm);
  };

  const isSaving =
    updateProfileMutation.isPending ||
    uploadProfileImageMutation.isPending ||
    changePasswordMutation.isPending;
  const displayName = resolvedProfileData.name || "User";
  const displayEmail = resolvedProfileData.email || "";
  const profileImage = profileImagePreview || userProfile?.profileImage || "";

  if (status === "loading" || profileQuery.isLoading) {
    return <SettingsPageSkeleton />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="w-full rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-700">
        Please log in to update your settings.
      </div>
    );
  }

  if (status === "authenticated" && !accessToken) {
    return (
      <div className="w-full rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
        Login session found, but access token is missing. Please log out and log in
        again.
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen font-sans antialiased text-[#1e293b]">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="w-full bg-white border border-slate-200 rounded-xl p-1.5 flex items-center">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex-1 cursor-pointer text-center py-2.5 text-sm font-semibold rounded-[12px] transition-all ${
              activeTab === "profile"
                ? "bg-[#0052cc] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`flex-1 cursor-pointer text-center py-2.5 text-sm font-semibold rounded-[12px] transition-all ${
              activeTab === "security"
                ? "bg-[#0052cc] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Security
          </button>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden p-6 pb-8 flex flex-col items-center relative">
          <div className="w-full h-44 bg-[#5c9ce6] rounded-xl mb-16 relative" />

          <div
            className="absolute top-32 w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-200 bg-cover bg-center"
            style={
              profileImage ? { backgroundImage: `url(${profileImage})` } : {}
            }
          >
            {profileQuery.isLoading ? (
              <Skeleton className="h-full w-full rounded-full" />
            ) : !profileImage ? (
              <div className="flex h-full w-full items-center justify-center bg-[#e6f0fa] text-3xl font-bold text-[#0052cc]">
                {getInitials(displayName)}
              </div>
            ) : null}
            {activeTab === "profile" && !profileQuery.isLoading ? (
              <label className="absolute inset-x-0 bottom-0 flex h-9 cursor-pointer items-center justify-center bg-slate-950/65 text-white transition hover:bg-slate-950/75">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    handleProfileImageChange(event.target.files?.[0] || null);
                    event.target.value = "";
                  }}
                />
              </label>
            ) : null}
          </div>

          <div className="text-center space-y-3 mt-2">
            <h1 className="text-3xl font-serif font-bold text-[#1a253c] tracking-wide flex items-center justify-center gap-1.5">
              {profileQuery.isLoading ? (
                <Skeleton className="h-9 w-48" />
              ) : (
                displayName
              )}
              {userProfile?.isVerified ? (
                <CheckCircle2 className="w-5 h-5 text-[#0052cc] fill-[#0052cc] stroke-white stroke-[2.5]" />
              ) : null}
            </h1>

            {profileQuery.isLoading ? (
              <Skeleton className="mx-auto h-4 w-56" />
            ) : displayEmail ? (
              <p className="text-sm font-medium text-slate-400">
                {displayEmail}
              </p>
            ) : null}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8">
          {profileQuery.isLoading ? (
            <SettingsFormSkeleton />
          ) : profileQuery.isError ? (
            <div className="rounded-lg border border-red-100 bg-red-50 py-10 text-center text-sm font-medium text-red-500">
              {profileQuery.error instanceof Error
                ? profileQuery.error.message
                : "Failed to fetch user profile"}
            </div>
          ) : activeTab === "profile" ? (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#1a253c] tracking-tight">
                Personal Information
              </h3>

             

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500">
                    Name
                  </label>
                  <input
                    type="text"
                    value={resolvedProfileData.name}
                    onChange={(event) => updateProfileField("name", event.target.value)}
                    className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={resolvedProfileData.email}
                      disabled
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-400 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500">
                      Gender
                    </label>
                    <Select
                      value={resolvedProfileData.gender}
                      onValueChange={(value) => updateProfileField("gender", value)}
                    >
                      <SelectTrigger className="w-full cursor-pointer px-4 py-3.5 bg-white border border-slate-200 rounded-[12px] text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all !h-12">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male" className="cursor-pointer">
                          Male
                        </SelectItem>
                        <SelectItem value="female" className="cursor-pointer">
                          Female
                        </SelectItem>
                        <SelectItem value="other" className="cursor-pointer">
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#1a253c] tracking-tight">
                Password Settings
              </h3>

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500">
                    Old Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="********"
                      value={passwordData.oldPassword}
                      onChange={(event) =>
                        setPasswordData({
                          ...passwordData,
                          oldPassword: event.target.value,
                        })
                      }
                      className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-[12px] text-slate-400 transition-colors hover:text-slate-600"
                    >
                      {showOldPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2 relative">
                    <label className="text-xs font-bold text-slate-500">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="********"
                        value={passwordData.newPassword}
                        onChange={(event) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: event.target.value,
                          })
                        }
                        className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-[12px] text-slate-400 transition-colors hover:text-slate-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 relative">
                    <label className="text-xs font-bold text-slate-500">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="********"
                        value={passwordData.confirmPassword}
                        onChange={(event) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: event.target.value,
                          })
                        }
                        className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-[12px] text-slate-400 transition-colors hover:text-slate-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-8 mt-4 border-t border-slate-50">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={isSaving}
              className="cursor-pointer px-6 py-3 bg-white border border-red-200 hover:bg-red-50 text-red-500 font-medium text-xs rounded-[12px] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={
                isSaving || profileQuery.isLoading || profileQuery.isError
              }
              className="inline-flex cursor-pointer items-center justify-center gap-2 px-6 py-3 bg-[#0052cc] hover:bg-blue-700 text-white font-semibold text-xs rounded-[12px] shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsFormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-48" />
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-12 w-full rounded-[12px]" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-[12px]" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-4 border-t border-slate-50 pt-8">
        <Skeleton className="h-10 w-32 rounded-[12px]" />
        <Skeleton className="h-10 w-32 rounded-[12px]" />
      </div>
    </div>
  );
}

function SettingsPageSkeleton() {
  return (
    <div className="w-full min-h-screen font-sans antialiased text-[#1e293b]">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <div className="flex w-full items-center rounded-xl border border-slate-200 bg-white p-1.5">
          <Skeleton className="h-10 flex-1 rounded-[12px]" />
          <Skeleton className="ml-1.5 h-10 flex-1 rounded-[12px]" />
        </div>

        <div className="relative flex flex-col items-center overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 pb-8 shadow-sm">
          <Skeleton className="mb-16 h-44 w-full rounded-xl" />

          <div className="absolute top-32 h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-md">
            <Skeleton className="h-full w-full rounded-full" />
          </div>

          <div className="mt-2 space-y-3 text-center">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="mx-auto h-4 w-56" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <SettingsFormSkeleton />
        </div>
      </div>
    </div>
  );
}
