import ProfileSettings from "@/components/settings/ProfileSettings";
import SiteSettings from "@/components/settings/SiteSettings";
import { Can } from "@/components/permissions";

export default function Settings() {
  return (
    <main className="min-h-screen px-4 py-6 text-slate-700 sm:px-6 lg:px-8">
      <Can permission="users:profile">
        <ProfileSettings />
      </Can>

      <Can permission="users:create">
        <SiteSettings />
      </Can>
    </main>
  );
}
