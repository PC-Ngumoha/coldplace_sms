import { X } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { isAxiosError } from "axios";
import { supplierApi } from "@/services/Supplierapi";
import { showSuccess } from "@/services/toasts";

export default function CreateSupplierForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const [field, setField] = useState({
    name: "",
    contact: null,
    notes: null,
    outlet_allowed: false,
  });
  const [error, setError] = useState("");

  const updateField = (field: string, value: unknown) => {
    setField((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (evt: SubmitEvent<HTMLFormElement>) => {
    evt.preventDefault();
    console.log(field);
    try {
      await supplierApi.create(field);
      showSuccess("Location created successfully");
      onClose();
    } catch (err) {
      setError(
        isAxiosError(err)
          ? err.response?.data.error
          : "Oops! please try again later.",
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
            Add Supplier
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
          <label className="block text-xs font-medium text-slate-700">
            Name
            <input
              required
              className="mt-1.5 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none 
                  focus:border-teal-blue focus:ring-1 focus:ring-teal-blue"
              placeholder="Enter Supplier name"
              value={field.name}
              onChange={(evt) => updateField("name", evt.target.value)}
            />
          </label>
          <label className="block text-xs font-medium text-slate-700">
            Phone
            <input
              className="mt-1.5 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none 
                  focus:border-teal-blue focus:ring-1 focus:ring-teal-blue"
              placeholder="Enter Phone Number"
              value={field.contact ?? ""}
              onChange={(evt) => updateField("contact", evt.target.value)}
            />
          </label>
          <label className="block text-xs font-medium text-slate-700">
            Notes
            <textarea
              className="mt-1.5 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none 
                  focus:border-teal-blue focus:ring-1 focus:ring-teal-blue"
              placeholder="e.g No. 123 Adebayo Chika Str, Ikeja, Lagos."
              value={field.notes ?? ""}
              onChange={(evt) => updateField("notes", evt.target.value)}
            />
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              checked={field.outlet_allowed}
              onChange={(evt) =>
                updateField("outlet_allowed", evt.target.checked)
              }
              className="rounded border-slate-300 text-teal-blue focus:ring-teal-blue"
            />
            Outlet allowed
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
              Add Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
