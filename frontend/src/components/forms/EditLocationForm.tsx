import type { Location } from "@/types";
import { X } from "lucide-react";
import { useState } from "react";

export default function EditLocationForm({
  onClose,
  location,
}: {
  onClose: () => void;
  location: Location;
}) {
  const [field, setField] = useState({
    name: location.name,
    address: location.address,
  });

  const updateField = (field: string, value: string) => {
    setField((prev) => ({ ...prev, [field]: value }));
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
            Add Location
          </h2>
          <button
            onClick={() => onClose()}
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
            // setShowAddLocation(false);
          }}
        >
          <label className="block text-xs font-medium text-slate-700">
            Name
            <input
              required
              className="mt-1.5 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none 
                  focus:border-teal-blue focus:ring-1 focus:ring-teal-blue"
              placeholder="Enter location name"
              value={field.name}
              onChange={(evt) => updateField("name", evt.target.value)}
            />
          </label>
          <label className="block text-xs font-medium text-slate-700">
            Address
            <textarea
              required
              className="mt-1.5 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none 
                  focus:border-teal-blue focus:ring-1 focus:ring-teal-blue"
              placeholder="e.g No. 123 Adebayo Chika Str, Ikeja, Lagos."
              value={field.address ?? ""}
              onChange={(evt) => updateField("address", evt.target.value)}
            />
          </label>

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
              Add Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
