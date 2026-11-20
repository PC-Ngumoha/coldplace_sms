import { Can } from "@/components/permissions";
import ProfileSettings from "@/components/settings/ProfileSettings";

export default function UserProfile() {
  return (
    <main className="px-4 py-6 text-slate-700 sm:px-6 lg:px-8">
      <Can permission="users:profile">
        <ProfileSettings />
      </Can>
    </main>
  );
}
