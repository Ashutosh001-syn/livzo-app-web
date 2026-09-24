"use client";

import { useState } from "react";
import { Check, CheckCircle2, KeyRound, Loader2, ShieldCheck, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageFrame } from "@/components/layout/page-frame";
import { useAuth } from "@/components/providers/auth-provider";

export default function ProfilePage() {
  const { user, isLoading, updateProfile } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [handle, setHandle] = useState(user?.handle ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state if user loads after mount
  if (user && !displayName && !handle) {
    setDisplayName(user.displayName);
    setHandle(user.handle);
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSavedSuccess(false);
    setIsSaving(true);

    const result = await updateProfile({ displayName, handle });
    setIsSaving(false);

    if (!result.ok) {
      setErrorMessage(result.error ?? "Failed to save profile changes.");
      return;
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  if (isLoading) {
    return (
      <PageFrame>
        <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
          <Loader2 className="size-8 animate-spin text-violet-400" />
        </main>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <main className="mx-auto w-full max-w-3xl px-[clamp(16px,4vw,48px)] py-10 sm:py-14">
        <div className="flex items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-400 text-xl font-bold text-white shadow-lg">
            {user?.displayName ? user.displayName.slice(0, 1).toUpperCase() : <User />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{user?.displayName ?? "Your Profile"}</h1>
              <Badge className="border-violet-400/30 bg-violet-500/10 text-violet-300 uppercase text-[10px]">
                {user?.role ?? "user"}
              </Badge>
            </div>
            <p className="text-sm text-zinc-400">@{user?.handle ?? "creator"} · {user?.email}</p>
          </div>
        </div>

        <Card className="mt-8 p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Public Profile</h2>
              <p className="text-xs text-zinc-400">This information appears in your live rooms and comments.</p>
            </div>
            {user?.emailVerifiedAt && (
              <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                <ShieldCheck className="mr-1 size-3.5" />
                Verified
              </Badge>
            )}
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSave}>
            {errorMessage && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                {errorMessage}
              </div>
            )}
            {savedSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>Profile details saved successfully.</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-300">Display Name</label>
              <Input
                className="mt-1.5"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300">Handle</label>
              <div className="relative mt-1.5 flex items-center">
                <span className="absolute left-3 text-sm text-zinc-500">@</span>
                <Input
                  className="pl-8"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  placeholder="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300">Email address</label>
              <Input
                className="mt-1.5 opacity-60 cursor-not-allowed"
                value={user?.email ?? ""}
                disabled
              />
              <span className="mt-1 block text-xs text-zinc-500">
                Email address cannot be changed directly for security purposes.
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:from-violet-400 hover:to-blue-400"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Check className="mr-2 size-4" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Security / Change Password Card */}
        <Card className="mt-8 p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Security & Password</h2>
              <p className="text-xs text-zinc-400">Update your password to keep your LivZo account secure.</p>
            </div>
          </div>

          <ChangePasswordSection />
        </Card>
      </main>
    </PageFrame>
  );
}

function ChangePasswordSection() {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("New password must be at least 8 characters long.");
      return;
    }

    setIsChanging(true);
    const result = await changePassword(currentPassword, newPassword);
    setIsChanging(false);

    if (!result.ok) {
      setErrorMsg(result.error ?? "Failed to change password.");
      return;
    }

    setSuccessMsg("Your password has been changed successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      {errorMsg && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-300">Current Password</label>
        <Input
          type="password"
          className="mt-1.5"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-zinc-300">New Password</label>
          <Input
            type="password"
            className="mt-1.5"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300">Confirm New Password</label>
          <Input
            type="password"
            className="mt-1.5"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isChanging}
          className="bg-white text-zinc-950 hover:bg-zinc-200"
        >
          {isChanging ? <Loader2 className="mr-2 size-4 animate-spin" /> : <KeyRound className="mr-2 size-4" />}
          {isChanging ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
}
