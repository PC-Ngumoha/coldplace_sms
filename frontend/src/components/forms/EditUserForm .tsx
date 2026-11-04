import type { Location, EditUser, User } from "@/types";
import { type RoleName, ROLES } from "@/lib/definitions";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { userApi } from "@/services/Userapi";
import { showSuccess } from "@/services/toasts";
import {
  type LucideIcon,
  Crown,
  BriefcaseBusiness,
  UserCog,
  Building2,
  Store,
  Eye,
  X,
} from "lucide-react";
import { useState, useMemo, type SubmitEvent } from "react";
import { clsx } from "cn";
import { isAxiosError } from "axios";

const roles: Array<{ name: RoleName; icon: LucideIcon }> = [
  {
    name: "executive",
    icon: Crown,
  },
  {
    name: "manager",
    icon: BriefcaseBusiness,
  },
  {
    name: "admin",
    icon: UserCog,
  },
  {
    name: "central",
    icon: Building2,
  },
  {
    name: "outlet",
    icon: Store,
  },
  {
    name: "viewer",
    icon: Eye,
  },
];

export default function EditUserForm({
  user,
  onClose,
  locations,
}: {
  user: User;
  onClose: () => void;
  locations: Location[];
}) {
  const [field, setField] = useState<EditUser>({
    name: user.name,
    email: user.email,
    role: user.role,
  });
  const [error, setError] = useState("");

  const updateField = (field: string, value: string) => {
    setField((prev) => ({ ...prev, [field]: value }));
  };

  // What locations are available to a new user based on their assigned role.
  const filteredLocations = useMemo(() => {
    if (field.role === "central")
      return locations.filter((location) => location.is_central === 1);
    else if (field.role === "outlet")
      return locations.filter((location) => location.is_central !== 1);
    else return locations;
  }, [field.role, locations]);

  const handleSubmit = async (evt: SubmitEvent<HTMLFormElement>) => {
    evt.preventDefault();
    console.log(field);
    try {
      await userApi.update(user.id, field);
      showSuccess("User account updated successfully");
      onClose();
    } catch (err) {
      setError(
        isAxiosError(err) ? err.response?.data.error : "Operation failed",
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/40 p-4"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-title"
        className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl sm:p-6"
      >
        <div className="flex items-center justify-between">
          <h2
            id="add-user-title"
            className="text-base font-semibold text-slate-900"
          >
            Edit User
          </h2>
          <button
            onClick={() => onClose()}
            aria-label="Close"
            className="rounded p-1 text-slate-600 hover:bg-slate-100"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-xs font-medium text-slate-700 relative">
            Full name{" "}
            <input
              required
              className={clsx(
                "mt-1.5 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none  focus:border-teal-blue focus:ring-1 focus:ring-teal-blue",
              )}
              placeholder="Enter full name"
              value={field.name}
              onChange={(evt) => updateField("name", evt.target.value)}
            />
          </label>

          <label className="block text-xs font-medium text-slate-700">
            Email address
            <input
              required
              type="email"
              className="mt-1.5 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none 
                  focus:border-teal-blue focus:ring-1 focus:ring-teal-blue"
              placeholder="name@example.com"
              value={field.email}
              onChange={(evt) => updateField("email", evt.target.value)}
            />
          </label>
          <label className="block text-xs font-medium text-slate-700">
            Role
            <RadioGroup
              defaultValue={field.role}
              value={field.role}
              onValueChange={(value) => updateField("role", value)}
              className="my-3 grid grid-cols-2"
            >
              {roles.map((role) => {
                const Icon = role.icon;

                return (
                  <Label
                    key={role.name}
                    htmlFor={role.name}
                    className={`border border-lightest-teal-blue p-3 w-full flex
                    rounded-lg shadow ${ROLES[role.name].color} ${ROLES[role.name].label}
                    has-data-checked:font-semibold capitalize`}
                  >
                    <div className="w-full flex flex-col gap-3 items-center">
                      <Icon size={25} />
                      <span>{ROLES[role.name].display}</span>
                    </div>

                    <RadioGroupItem
                      value={role.name}
                      id={role.name}
                      className="self-start data-checked:bg-slate-500"
                    />
                  </Label>
                );
              })}
            </RadioGroup>
          </label>
          {/* The "Assigned location" field should only appears for
              Users with the Central, Outlet or Manager role. */}
          {["central", "outlet", "manager"].includes(field.role) && (
            <label className="block text-xs font-medium text-slate-700">
              Assigned Location
              <select
                className="mt-1.5 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none
                focus:border-teal-blue"
                value={field.location_id}
                onChange={(evt) => updateField("location_id", evt.target.value)}
              >
                <option>Select a location</option>
                {filteredLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onClose()}
              className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-teal-blue px-3 py-2 text-xs font-semibold text-white hover:bg-darker-teal-blue"
            >
              Update user
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
