import { useNavigate } from "react-router";
import {
  X,
  Crown,
  BriefcaseBusiness,
  UserCog,
  Building2,
  Store,
  Eye,
  type LucideIcon,
} from "lucide-react";
import { type RoleName, ROLES } from "@/lib/definitions";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

export default function ManageUsers() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/40 p-4"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) goBack();
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
            Add User
          </h2>
          <button
            onClick={() => goBack()}
            aria-label="Close"
            className="rounded p-1 text-slate-600 hover:bg-slate-100"
          >
            <X size={24} />
          </button>
        </div>
        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            // setShowAddUser(false);
          }}
        >
          <label className="block text-xs font-medium text-slate-700">
            Full name
            <input
              required
              className="mt-1.5 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none 
                  focus:border-teal-blue focus:ring-1 focus:ring-teal-blue"
              placeholder="Enter full name"
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
            />
          </label>
          <label className="block text-xs font-medium text-slate-700">
            Role
            <RadioGroup
              defaultValue={roles[0].name}
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
          {/* FIXME: The "Assigned location" field should only appear for
              Users with the Outlet role. */}
          <label className="block text-xs font-medium text-slate-700">
            Assigned Location
            <select
              className="mt-1.5 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none
                focus:border-teal-blue"
            >
              <option>Gwarinpa</option>
              <option>Central Area</option>
              <option>Mpape</option>
              <option>Guzape</option>
            </select>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => goBack()}
              className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-teal-blue px-3 py-2 text-xs font-semibold text-white hover:bg-darker-teal-blue"
            >
              Add user
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
