import {
  KeyIcon,
  User2Icon,
  Mail,
  MapPin,
  Signal,
  UserShield,
  //   Clock,
} from "lucide-react";
import { ROLES } from "@/lib/definitions";
import { useAuth } from "@/contexts/auth_context";
import type { Location } from "@/types";
import { useEffect, useState } from "react";
import { locationApi } from "@/services/Locationapi";
import { useLocation, useNavigate } from "react-router";

export default function ProfileSettings() {
  const location = useLocation();
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      const result = await locationApi.list();
      setLocations(result);
    }

    fetchData();
  }, []);

  const foundLocation = locations.find(
    (location) => location.id === user?.location_id,
  );
  const assignedLocation = foundLocation ? foundLocation.name : "_________";

  const openChangePasswordForm = () => {
    navigate("/edit/users/me/changePassword", {
      state: { background: location },
    });
  };

  return (
    <div className="mb-6 flex w-full items-center justify-center">
      <div className="w-full max-w-300 overflow-hidden rounded-2xl border border-[#235749]/10 bg-white shadow-sm">
        <div
          className="relative flex flex-col items-center gap-4 bg-[#f3f8f6] px-4 py-6
         text-center sm:flex-row sm:gap-5 sm:px-7 sm:py-7 sm:text-left"
        >
          <div
            className="relative z-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-full
            bg-white p-1 ring-1 ring-[#235749]/10 sm:h-24 sm:w-24"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
              className="h-full w-full rounded-full object-cover"
            />
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "12s" }}
              aria-hidden="true"
            >
              <div className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-[#29b16a]" />
            </div>
          </div>

          <div
            className="flex w-full min-w-0 flex-1 flex-col items-center gap-4
          lg:flex-row sm:justify-between lg:gap-6"
          >
            <div className="flex min-w-0 max-w-full flex-col justify-center">
              <h2 className="m-0 wrap-break-word text-xl font-semibold tracking-tight text-[#1e2b29] sm:text-2xl">
                {user?.name ?? "John Doe"}
              </h2>
              <div className="mt-1 break-all text-sm text-[#4d635f]">
                {user?.email ?? "johndoe@coldplace.com"}
              </div>
            </div>

            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg
              bg-[#176675] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#104f5b] sm:w-auto"
              type="button"
              onClick={openChangePasswordForm}
            >
              <KeyIcon />
              Change Password
            </button>
          </div>
        </div>

        {user && (
          <div className="bg-white px-4 py-4 sm:px-6 sm:py-5 lg:px-7">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="flex min-w-0 flex-col justify-center border-b border-[#235749]/10 py-4 sm:px-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#4d635f]">
                  <User2Icon className="h-4 w-4 text-[#176675]" />
                  <span>Full Name</span>
                </div>
                <div
                  className="flex min-w-0 items-center gap-2.5 wrap-break-word text-sm font-medium 
              text-[#1e2b29]"
                >
                  {user.name}
                </div>
              </div>

              <div className="flex min-w-0 flex-col justify-center border-b border-[#235749]/10 py-4 sm:px-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#4d635f]">
                  <Mail className="h-4 w-4 text-[#176675]" />
                  <span>Email Address</span>
                </div>
                <div className="flex min-w-0 items-center gap-2.5 break-all text-sm font-medium text-[#1e2b29]">
                  {user.email}
                </div>
              </div>

              <div className="flex min-w-0 flex-col justify-center border-b border-[#235749]/10 py-4 sm:px-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#4d635f]">
                  <UserShield className="h-4 w-4 text-[#176675]" />
                  <span>User Role</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-medium text-[#1e2b29]">
                  <span
                    className={`inline-flex min-w-27.5 items-center justify-center rounded-md px-3 py-1.5
                    font-medium ${ROLES[user.role].color}`}
                  >
                    {ROLES[user.role].display}
                  </span>
                </div>
              </div>

              <div className="flex min-w-0 flex-col justify-center border-b border-[#235749]/10 py-4 sm:px-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#4d635f]">
                  <MapPin className="h-4 w-4 text-[#176675]" />
                  <span>Assigned Location</span>
                </div>
                <div className="flex min-w-0 items-center gap-2.5 wrap-break-word text-sm font-medium text-[#1e2b29]">
                  {assignedLocation}
                </div>
              </div>

              <div className="flex min-w-0 flex-col justify-center py-4 sm:px-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#4d635f]">
                  <Signal className="h-4 w-4 text-[#176675]" />
                  <span>Status</span>
                </div>
                <div
                  className="flex min-w-0 items-center gap-2.5 wrap-break-word text-sm font-medium 
                text-[#1e2b29]"
                >
                  <span
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#eaf4f1] px-3 py-1.5 
                  font-medium text-[#176675] capitalize"
                  >
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#129a6d] shadow-[0_0_0_3px_rgba(18,154,109,0.12)]" />
                    {user.status}
                  </span>
                </div>
              </div>

              {/* TODO: Might reintroduce this later */}
              {/* <div className="flex min-h-[116px] flex-col justify-center border-b border-[#235749]/[0.12] bg-white/[0.12] p-4 sm:p-5 md:border-b-0">
              <div className="mb-2.5 flex items-center gap-2.5 text-[0.95rem] font-medium text-[#4d635f]">
                <Clock />
                <span>Password Last Changed</span>
              </div>
              <div className="text-[1rem] font-medium text-[#2c403a]/70">
                3 months ago
              </div>
            </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
