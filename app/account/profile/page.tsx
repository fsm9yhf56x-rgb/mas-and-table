"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AccountProfile() {
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [msgProfile, setMsgProfile] = useState("");
  const [msgPwd, setMsgPwd] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      const u = session.user;
      setUser(u);
      setFirstName(u.user_metadata?.first_name ?? "");
      setLastName(u.user_metadata?.last_name ?? "");
      setEmail(u.email ?? "");
    });
  }, []);

  async function handleSaveProfile() {
    setSaving(true);
    setMsgProfile("");
    const { error } = await supabase.auth.updateUser({
      email: email !== user?.email ? email : undefined,
      data: { first_name: firstName, last_name: lastName },
    });
    setSaving(false);
    setMsgProfile(error ? error.message : "Profile updated.");
  }

  async function handleSavePassword() {
    if (newPassword !== confirmPassword) {
      setMsgPwd("Passwords don't match.");
      return;
    }
    if (newPassword.length < 8) {
      setMsgPwd("At least 8 characters.");
      return;
    }
    setSavingPwd(true);
    setMsgPwd("");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPwd(false);
    if (error) {
      setMsgPwd(error.message);
    } else {
      setMsgPwd("Password updated.");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  const inputClass =
    "w-full border border-[#2C2C2C]/20 bg-transparent px-4 py-4 font-sans text-base text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 focus:outline-none focus:border-[#6B7C5C] transition-colors duration-200";

  return (
    <div>
      <div className="mb-10 pb-8 border-b border-[#2C2C2C]/10">
        <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#6B7C5C] mb-2">
          Account
        </p>
        <h1 className="font-serif text-[clamp(1.8rem,4vw,3rem)] text-[#2C2C2C] leading-tight">
          <em>Profile</em>
        </h1>
      </div>

      <div className="mb-14">
        <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/50 mb-6">
          Personal information
        </p>
        <div className="space-y-4 max-w-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-[#2C2C2C]/45 mb-2">
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Sarah"
                className={inputClass}
                style={{ fontWeight: 300 }}
              />
            </div>
            <div>
              <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-[#2C2C2C]/45 mb-2">
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="James"
                className={inputClass}
                style={{ fontWeight: 300 }}
              />
            </div>
          </div>
          <div>
            <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-[#2C2C2C]/45 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              style={{ fontWeight: 300 }}
            />
          </div>
          {msgProfile && (
            <p
              className="font-sans text-sm"
              style={{
                color: msgProfile.includes("updated") ? "#6B7C5C" : "#C4714F",
                fontWeight: 300,
              }}
            >
              {msgProfile}
            </p>
          )}
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="group relative inline-flex items-center gap-3 border border-[#2C2C2C] text-[#2C2C2C] font-sans text-[11px] tracking-[0.4em] uppercase overflow-hidden hover:text-[#F5F0E8] transition-colors duration-500 disabled:opacity-40"
            style={{ padding: "14px 28px" }}
          >
            <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10">
              {saving ? "Saving..." : "Save changes"}
            </span>
          </button>
        </div>
      </div>

      <div className="pt-10 border-t border-[#2C2C2C]/10">
        <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2C2C2C]/50 mb-6">
          Change password
        </p>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-[#2C2C2C]/45 mb-2">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="8 characters minimum"
              className={inputClass}
              style={{ fontWeight: 300 }}
            />
          </div>
          <div>
            <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-[#2C2C2C]/45 mb-2">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSavePassword()}
              placeholder="••••••••"
              className={inputClass}
              style={{ fontWeight: 300 }}
            />
          </div>
          {msgPwd && (
            <p
              className="font-sans text-sm"
              style={{
                color: msgPwd.includes("updated") ? "#6B7C5C" : "#C4714F",
                fontWeight: 300,
              }}
            >
              {msgPwd}
            </p>
          )}
          <button
            onClick={handleSavePassword}
            disabled={savingPwd}
            className="group relative inline-flex items-center gap-3 border border-[#2C2C2C] text-[#2C2C2C] font-sans text-[11px] tracking-[0.4em] uppercase overflow-hidden hover:text-[#F5F0E8] transition-colors duration-500 disabled:opacity-40"
            style={{ padding: "14px 28px" }}
          >
            <span className="absolute inset-0 bg-[#6B7C5C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10">
              {savingPwd ? "Updating..." : "Update password"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}