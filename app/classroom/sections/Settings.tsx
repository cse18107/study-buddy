import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Save, Bell, Clock, Palette, User, Zap, Settings as SettingsIcon, Shield} from "lucide-react";

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
  defaultUsername: "StudyBuddy_Learner",
};

const Settings = () => {
  const [settings, setSettings] = useState<SettingsState>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    console.log("Saving settings:", settings);

    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  const updateSetting = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings((prev) => ({...prev, [key]: value}));
  };

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Colorful Top Bar */}
      <div className="w-full bg-gradient-to-r from-slate-500 via-purple-500 to-indigo-500 h-2"></div>
      
      {/* Header */}
      <div className="p-8 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 font-heading">
            <SettingsIcon className="w-8 h-8 text-slate-600" />
            Settings & Preferences
          </h1>
          <p className="text-slate-600 mt-2">Customize your learning experience</p>
        </div>
      </div>

      {/* Settings Form */}
      <div className="p-8">
        <form onSubmit={handleSave} className="max-w-4xl mx-auto space-y-6">
          {/* Quiz Preferences Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Quiz Preferences</h2>
            </div>

            <div className="space-y-4">
              {/* Quiz Length */}
              <div>
                <Label className="text-slate-700 font-medium mb-2 block">
                  Default Quiz Length
                </Label>
                <select
                  value={settings.defaultQuizLength}
                  onChange={(e) =>
                    updateSetting(
                      "defaultQuizLength",
                      e.target.value as "short" | "medium" | "long"
                    )
                  }
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                >
                  <option value="short">Short (5-10 questions)</option>
                  <option value="medium">Medium (10-20 questions)</option>
                  <option value="long">Long (20+ questions)</option>
                </select>
              </div>

              {/* Feedback Mode */}
              <div>
                <Label className="text-slate-700 font-medium mb-2 block">
                  Feedback Mode
                </Label>
                <select
                  value={settings.feedbackMode}
                  onChange={(e) =>
                    updateSetting(
                      "feedbackMode",
                      e.target.value as "instant" | "delayed"
                    )
                  }
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                >
                  <option value="instant">Instant (Show answers immediately)</option>
                  <option value="delayed">Delayed (Show after completion)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
            </div>

            <div className="space-y-4">
              {/* Enable Notifications */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-slate-600" />
                  <div>
                    <Label className="text-slate-900 font-medium block">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-slate-600">
                      Get notified about new content and updates
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(val) =>
                    updateSetting("enableNotifications", val)
                  }
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>

              {/* Email Updates */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-600" />
                  <div>
                    <Label className="text-slate-900 font-medium block">
                      Email Updates
                    </Label>
                    <p className="text-sm text-slate-600">
                      Receive weekly progress reports via email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.emailUpdates}
                  onCheckedChange={(val) => updateSetting("emailUpdates", val)}
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Account Details</h2>
            </div>

            <div className="space-y-4">
              {/* Username */}
              <div>
                <Label className="text-slate-700 font-medium mb-2 block flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </Label>
                <Input
                  type="text"
                  value={settings.defaultUsername}
                  onChange={(e) =>
                    updateSetting("defaultUsername", e.target.value)
                  }
                  placeholder="Enter your username"
                  className="bg-slate-50 border-2 border-slate-200 text-slate-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl h-12"
                />
              </div>

              {/* Public Profile */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <div>
                    <Label className="text-slate-900 font-medium block">
                      Public Profile
                    </Label>
                    <p className="text-sm text-slate-600">
                      Allow others to view your learning progress
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.allowPublicProfile}
                  onCheckedChange={(val) =>
                    updateSetting("allowPublicProfile", val)
                  }
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 h-12 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
