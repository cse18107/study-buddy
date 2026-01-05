import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Save, Bell, Clock, Palette, User, Zap, Settings as SettingsIcon, Shield, Laptop} from "lucide-react";

interface SettingsState {
  defaultQuizLength: "short" | "medium" | "long";
  feedbackMode: "instant" | "delayed";
  enableNotifications: boolean;
  allowPublicProfile: boolean;
  emailUpdates: boolean;
  defaultUsername: string;
}

const initialSettings: SettingsState = {
  defaultQuizLength: "medium",
  feedbackMode: "delayed",
  enableNotifications: true,
  allowPublicProfile: false,
  emailUpdates: true,
  defaultUsername: "GEN_ONE_USER",
};

const Settings = () => {
  const [settings, setSettings] = useState<SettingsState>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      alert("SETTINGS UPDATED. SYSTEM STABLE.");
    }, 1000);
  };

  const updateSetting = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings((prev) => ({...prev, [key]: value}));
  };

  const sectionHeader = (icon: any, title: string, color: string) => (
    <div className="flex items-center gap-4 mb-8">
      <div className={`p-3 border-4 border-black ${color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
        {React.createElement(icon, { className: "w-8 h-8 text-black", strokeWidth: 3 })}
      </div>
      <h2 className="text-3xl font-black uppercase leading-none">{title}</h2>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#FDFDFD] p-8 md:p-12">
      {/* Header */}
      <div className="border-8 border-black bg-white p-10 mb-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rotate-[-0.5deg]">
        <div className="flex items-center justify-between">
            <div>
                <span className="text-secondary font-black uppercase text-2xl tracking-widest">System Core</span>
                <h1 className="text-5xl md:text-8xl font-black text-black font-heading uppercase leading-none mt-2">
                    SETTINGS
                </h1>
            </div>
            <SettingsIcon className="w-16 h-16 text-black hidden md:block" strokeWidth={3} />
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="max-w-6xl mx-auto space-y-12">
        {/* Quiz Preferences */}
        <div className="border-8 border-black bg-white p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          {sectionHeader(Zap, "QUIZ_PARAMS", "bg-primary")}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
            <div className="space-y-3">
              <Label className="text-black font-black uppercase text-xs">DEFAULT LENGTH</Label>
              <select
                value={settings.defaultQuizLength}
                onChange={(e) => updateSetting("defaultQuizLength", e.target.value as any)}
                className="w-full bg-white border-4 border-black text-black font-black uppercase px-4 h-16 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none"
              >
                <option value="short">SHORT (5-10 Q)</option>
                <option value="medium">MEDIUM (10-20 Q)</option>
                <option value="long">LONG (20+ Q)</option>
              </select>
            </div>

            <div className="space-y-3">
              <Label className="text-black font-black uppercase text-xs">FEEDBACK FLOW</Label>
              <select
                value={settings.feedbackMode}
                onChange={(e) => updateSetting("feedbackMode", e.target.value as any)}
                className="w-full bg-white border-4 border-black text-black font-black uppercase px-4 h-16 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none"
              >
                <option value="instant">INSTANT (LIT)</option>
                <option value="delayed">DELAYED (SUSPENSE)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="border-8 border-black bg-secondary p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-white">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 border-4 border-black bg-white shadow-[4px_4px_0px_0px_black]">
               <Bell className="w-8 h-8 text-black" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black uppercase leading-none drop-shadow-[2px_2px_0px_black]">PINGS & LOGS</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-white border-4 border-black shadow-[4px_4px_0px_0px_black] text-black">
                <div className="flex items-center gap-4">
                    <Laptop className="w-6 h-6" />
                    <div>
                        <span className="font-black uppercase block leading-none">PUSH PINGS</span>
                        <span className="text-[10px] font-bold opacity-60 uppercase">Real-time status updates</span>
                    </div>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(val) => updateSetting("enableNotifications", val)}
                  className="data-[state=checked]:bg-primary border-2 border-black"
                />
            </div>

            <div className="flex items-center justify-between p-6 bg-white border-4 border-black shadow-[4px_4px_0px_0px_black] text-black">
                <div className="flex items-center gap-4">
                    <Clock className="w-6 h-6" />
                    <div>
                        <span className="font-black uppercase block leading-none">EMAIL SYNC</span>
                        <span className="text-[10px] font-bold opacity-60 uppercase">Weekly progress dumps</span>
                    </div>
                </div>
                <Switch
                  checked={settings.emailUpdates}
                  onCheckedChange={(val) => updateSetting("emailUpdates", val)}
                  className="data-[state=checked]:bg-primary border-2 border-black"
                />
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="border-8 border-black bg-white p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          {sectionHeader(User, "USER_PROFILE", "bg-info")}
          
          <div className="space-y-8 mt-8">
            <div className="space-y-3">
              <Label className="text-black font-black uppercase text-xs">CODENAME</Label>
              <Input
                type="text"
                value={settings.defaultUsername}
                onChange={(e) => updateSetting("defaultUsername", e.target.value)}
                className="w-full bg-white border-4 border-black h-16 px-6 text-xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>

            <div className="flex items-center justify-between p-6 border-4 border-black bg-slate-100 shadow-[4px_4px_0px_0px_black]">
                <div className="flex items-center gap-4 text-black">
                    <Shield className="w-6 h-6" />
                    <div>
                        <span className="font-black uppercase block leading-none">PUBLIC ACCESS</span>
                        <span className="text-[10px] font-bold opacity-60 uppercase">Broadcast your stats to the world</span>
                    </div>
                </div>
                <Switch
                  checked={settings.allowPublicProfile}
                  onCheckedChange={(val) => updateSetting("allowPublicProfile", val)}
                  className="data-[state=checked]:bg-secondary border-2 border-black"
                />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-10 pb-20">
          <button
            type="submit"
            disabled={isSaving}
            className="neo-button bg-primary text-black h-20 w-64 flex items-center justify-center gap-4 text-2xl uppercase"
          >
            {isSaving ? (
              <Loader2 className="w-8 h-8 animate-spin" strokeWidth={4} />
            ) : (
              <Save className="w-8 h-8" strokeWidth={3} />
            )}
            {isSaving ? "SYNCING..." : "COMMIT"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
