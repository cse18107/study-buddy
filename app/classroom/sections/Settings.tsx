import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Save, Bell, Clock, Palette, User, Zap} from "lucide-react";

// --- Color Definitions ---
const BG_DARK = "bg-black";
const BG_MEDIUM = "bg-[#252525]";
const NEON_ACCENT = "#eeffab";
const NEON_TEXT = "text-[#eeffab]";
const NEON_BORDER = "border-[#eeffab]";
const NEON_HOVER = "hover:bg-[#eeffab] hover:text-black";

// --- State Definition ---
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
  defaultUsername: "CypherLearner01",
};

// --- Utility Classes ---
const fieldLabelClasses = `text-sm font-medium ${NEON_TEXT} flex items-center gap-2 mb-1`;
const inputClasses = `
  w-full ${BG_MEDIUM} border-2 border-black ${NEON_TEXT} 
  placeholder-[#eeffab] placeholder-opacity-50 focus:border-[#eeffab] focus:ring-1 focus:ring-[#eeffab]
`;

const Settings = () => {
  const [settings, setSettings] = useState<SettingsState>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    console.log("Saving settings:", settings);

    // Simulate API save time
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  const handleChange = (id: keyof SettingsState, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Custom styling for Shadcn Switch to match the theme
  const CustomSwitch = ({
    id,
    checked,
    onCheckedChange,
  }: {
    id: keyof SettingsState;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
  }) => (
    <Switch
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      // Tailwind CSS overrides for Shadcn Switch
      className={`
        data-[state=checked]:bg-[#eeffab] 
        data-[state=unchecked]:bg-[#252525] 
        border border-black 
        shadow-sm
      `}
      style={
        {
          // Ensure the thumb is always black for high contrast
          "--tw-ring-color": NEON_ACCENT, // Focus ring
        } as React.CSSProperties
      }
      // Apply black thumb style
      thumbClassName={`
        data-[state=unchecked]:bg-black
        data-[state=checked]:bg-black
        data-[state=checked]:translate-x-[22px]
      `}
    />
  );

  return (
    <div className={`p-8 ${BG_DARK} min-h-screen`}>
      <form onSubmit={handleSave} className="max-w-3xl mx-auto space-y-10">
        <h1
          className={`text-4xl font-extrabold ${NEON_TEXT} border-b border-[#252525] pb-4`}
        >
          System Configuration
        </h1>

        {/* --- 1. Quiz Defaults --- */}
        <section
          className={`p-6 ${BG_MEDIUM} rounded-xl border border-[#252525] shadow-lg space-y-6`}
        >
          <h2
            className={`text-2xl font-semibold ${NEON_TEXT} border-b border-black pb-2 flex items-center gap-3`}
          >
            <Zap className="w-6 h-6" /> Quiz Preferences
          </h2>

          {/* Default Quiz Length */}
          <div>
            <Label htmlFor="quizLength" className={fieldLabelClasses}>
              <Clock className="w-4 h-4" /> Default Quiz Length
            </Label>
            {/* Using standard select for maximum color control */}
            <select
              id="defaultQuizLength"
              value={settings.defaultQuizLength}
              onChange={(e) =>
                handleChange(
                  "defaultQuizLength",
                  e.target.value as "short" | "medium" | "long"
                )
              }
              className={
                inputClasses + " p-2 rounded-md appearance-none cursor-pointer"
              }
              style={{paddingRight: "2rem"}} // Space for default browser arrow
            >
              <option value="short">Short (5-8 Questions)</option>
              <option value="medium">Medium (10-15 Questions)</option>
              <option value="long">Long (20+ Questions)</option>
            </select>
          </div>

          {/* Feedback Mode */}
          <div className="flex justify-between items-center pt-2">
            <Label htmlFor="feedbackMode" className={fieldLabelClasses}>
              Instant Feedback (MCQ)
            </Label>
            <CustomSwitch
              id="feedbackMode"
              checked={settings.feedbackMode === "instant"}
              onCheckedChange={(checked) =>
                handleChange("feedbackMode", checked ? "instant" : "delayed")
              }
            />
          </div>
        </section>

        {/* --- 2. Notifications --- */}
        <section
          className={`p-6 ${BG_MEDIUM} rounded-xl border border-[#252525] shadow-lg space-y-6`}
        >
          <h2
            className={`text-2xl font-semibold ${NEON_TEXT} border-b border-black pb-2 flex items-center gap-3`}
          >
            <Bell className="w-6 h-6" /> Notification Settings
          </h2>

          {/* Enable System Notifications */}
          <div className="flex justify-between items-center">
            <Label htmlFor="enableNotifications" className={fieldLabelClasses}>
              Enable Desktop Notifications
            </Label>
            <CustomSwitch
              id="enableNotifications"
              checked={settings.enableNotifications}
              onCheckedChange={(checked) =>
                handleChange("enableNotifications", checked)
              }
            />
          </div>

          {/* Email Updates */}
          <div className="flex justify-between items-center">
            <Label htmlFor="emailUpdates" className={fieldLabelClasses}>
              Receive weekly progress reports via email
            </Label>
            <CustomSwitch
              id="emailUpdates"
              checked={settings.emailUpdates}
              onCheckedChange={(checked) =>
                handleChange("emailUpdates", checked)
              }
            />
          </div>
        </section>

        {/* --- 3. Account Settings --- */}
        <section
          className={`p-6 ${BG_MEDIUM} rounded-xl border border-[#252525] shadow-lg space-y-6`}
        >
          <h2
            className={`text-2xl font-semibold ${NEON_TEXT} border-b border-black pb-2 flex items-center gap-3`}
          >
            <User className="w-6 h-6" /> Account Details
          </h2>

          {/* Username */}
          <div>
            <Label htmlFor="defaultUsername" className={fieldLabelClasses}>
              Username
            </Label>
            <Input
              id="defaultUsername"
              value={settings.defaultUsername}
              onChange={(e) => handleChange("defaultUsername", e.target.value)}
              className={inputClasses}
            />
          </div>

          {/* Public Profile */}
          <div className="flex justify-between items-center pt-2">
            <Label htmlFor="allowPublicProfile" className={fieldLabelClasses}>
              Allow profile visibility to other users
            </Label>
            <CustomSwitch
              id="allowPublicProfile"
              checked={settings.allowPublicProfile}
              onCheckedChange={(checked) =>
                handleChange("allowPublicProfile", checked)
              }
            />
          </div>
        </section>

        {/* --- Save Button --- */}
        <div className="pt-6">
          <Button
            type="submit"
            disabled={isSaving}
            className={`
              w-full h-12 text-lg font-bold 
              ${NEON_HOVER} 
              ${
                isSaving
                  ? "bg-[#252525] border border-black text-[#eeffab] opacity-50 cursor-not-allowed"
                  : "bg-black border-2 " + NEON_BORDER + " " + NEON_TEXT
              } 
              transition-all duration-300
            `}
          >
            {isSaving ? (
              <>
                <Zap className="w-5 h-5 mr-2 animate-pulse" /> Saving
                Configuration...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
