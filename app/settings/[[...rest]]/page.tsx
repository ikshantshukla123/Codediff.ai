import { UserProfile } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/10 pb-20 p-6">
      <div className="max-w-4xl mx-auto space-y-8 py-12">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-[#a1a1aa] text-sm mt-2">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="flex justify-center">
          <UserProfile
            path="/settings"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-[#111111] border border-[#262626] text-white shadow-none w-full",
                navbar: "hidden", // Hide the navbar if we want a simpler view, or keep it. Let's keep it default-ish but styled.
                headerTitle: "text-white",
                headerSubtitle: "text-[#a1a1aa]",
                formButtonPrimary: "bg-white text-black hover:bg-neutral-200",
                formButtonReset: "text-white hover:bg-[#262626]",
                formFieldLabel: "text-[#a1a1aa]",
                formFieldInput: "bg-[#0a0a0a] border-[#262626] text-white",
                footer: "hidden"
              },
              variables: {
                colorBackground: "#111111",
                colorText: "white",
                colorInputBackground: "#0a0a0a",
                colorInputText: "white",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
