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
      <div className="w-full max-w-300 overflow-hidden rounded-2xl sm:rounded-[28px]">
        <div
          className="relative flex min-h-45 flex-col items-center gap-4 
         bg-[linear-gradient(90deg,#176675_0%,#104f5b_50%,#3b6d49_100%)] px-4 pb-5 pt-5
         text-center sm:flex-row sm:items-center sm:gap-4.5 sm:px-7 sm:pb-6 sm:pt-6 sm:text-left"
        >
          <div
            className="relative z-10 flex h-24 w-24 shrink-0 items-center justify-center rounded-full
            bg-white/10 lg:-mb-5 lg:h-36 lg:w-36"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
              className="flex h-19 w-19 items-center justify-center rounded-full text-2xl font-bold tracking-[0.04em]
             shadow-[0_4px_14px_rgba(0,0,0,0.15)] lg:h-29 lg:w-29 lg:text-4xl"
            />
            <div
              className="absolute bottom-1.5 right-1.5 h-4 w-4 rounded-full border-4 border-white 
            bg-[#29b16a] shadow-[0_0_0_2px_rgba(41,177,106,0.12)] lg:bottom-2 lg:right-2 lg:h-5.5 lg:w-5.5"
            />
          </div>

          <div
            className="flex min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-end gap-4 pl-0
          sm:min-h-24 sm:items-start sm:pl-2 lg:flex-row lg:items-end lg:justify-between lg:gap-4"
          >
            <div className="flex min-w-0 max-w-full flex-col justify-center">
              <h2 className="m-0 wrap-break-word text-[clamp(1.45rem,4vw,2.7rem)] font-bold tracking-[-0.04em] text-[#f4f8f6]">
                {user?.name ?? "John Doe"}
              </h2>
              <div className="mt-1.5 break-all text-[0.95rem] font-medium text-white/90 sm:text-[1.05rem]">
                {user?.email ?? "johndoe@coldplace.com"}
              </div>
            </div>

            <button
              className="inline-flex w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-xl
              bg-[linear-gradient(180deg,#176675_0%,#104f5b_100%)] px-4 py-3 text-sm font-bold text-white
              shadow-[0_4px_8px_rgba(14,95,84,0.22)] transition hover:brightness-105 sm:w-auto sm:px-5 sm:py-3.5 lg:min-w-52.5"
              type="button"
              onClick={openChangePasswordForm}
            >
              <KeyIcon />
              Change Password
            </button>
          </div>
        </div>

        {user && (
          <div className="bg-white px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5 lg:px-7">
            <div className="grid grid-cols-1 overflow-hidden rounded-[14px] border border-[#235749]/12 bg-white/20 sm:grid-cols-2">
              <div
                className="flex min-h-29 min-w-0 flex-col justify-center border-b border-[#235749]/12 bg-white/12
            p-4 sm:p-5 sm:border-b-0 sm:border-r"
              >
                <div className="mb-2.5 flex items-center gap-2.5 text-xs font-medium text-[#4d635f]">
                  <User2Icon />
                  <span>Full Name</span>
                </div>
                <div
                  className="flex min-w-0 items-center gap-2.5 wrap-break-word text-sm font-semibold tracking-[-0.02em] 
              text-[#1e2b29]"
                >
                  {user.name}
                </div>
              </div>

              <div
                className="flex min-h-29 min-w-0 flex-col justify-center border-b border-[#235749]/12 
            bg-white/12 p-4 sm:p-5 sm:border-b-0 sm:border-r"
              >
                <div className="mb-2.5 flex items-center gap-2.5 text-xs font-medium text-[#4d635f]">
                  <Mail />
                  <span>Email Address</span>
                </div>
                <div className="flex min-w-0 items-center gap-2.5 break-all text-sm font-semibold tracking-[-0.02em] text-[#1e2b29]">
                  {user.email}
                </div>
              </div>

              <div
                className="flex min-h-29 min-w-0 flex-col justify-center border-b border-[#235749]/12 bg-white/12 p-4
            sm:p-5 sm:border-b-0 sm:border-r"
              >
                <div className="mb-2.5 flex items-center gap-2.5 text-xs font-medium text-[#4d635f]">
                  <UserShield />
                  <span>User Role</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold tracking-[-0.02em] text-[#1e2b29]">
                  <span
                    className={`inline-flex min-w-27.5 items-center justify-center rounded-[10px] py-2 px-4
                    font-bold ${ROLES[user.role].color}`}
                  >
                    {ROLES[user.role].display}
                  </span>
                </div>
              </div>

              <div
                className="flex min-h-29 min-w-0 flex-col justify-center border-b border-[#235749]/12 bg-white/12 p-4 
            sm:p-5 sm:border-b-0 sm:border-r"
              >
                <div className="mb-2.5 flex items-center gap-2.5 text-xs font-medium text-[#4d635f]">
                  <MapPin />
                  <span>Assigned Location</span>
                </div>
                <div className="flex min-w-0 items-center gap-2.5 wrap-break-word text-sm font-semibold tracking-[-0.02em] text-[#1e2b29]">
                  {assignedLocation}
                </div>
              </div>

              <div
                className="flex min-h-29 min-w-0 flex-col justify-center border-b border-[#235749]/12 bg-white/12 p-4 
            sm:p-5 sm:border-b-0 sm:border-r"
              >
                <div className="mb-2.5 flex items-center gap-2.5 text-xs font-medium text-[#4d635f]">
                  <Signal />
                  <span>Status</span>
                </div>
                <div
                  className="flex min-w-0 items-center gap-2.5 wrap-break-word text-sm font-semibold tracking-[-0.02em] 
                text-[#1e2b29]"
                >
                  <span
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-lighter-teal-blue px-3.5 py-2 
                font-bold text-darker-teal-blue capitalize"
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
