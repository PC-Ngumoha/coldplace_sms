import { useState, type SubmitEvent } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { isAxiosError } from "axios";
import { userApi } from "@/services/Userapi";
import { showSuccess } from "@/services/toasts";

export default function ChangePasswordForm({
  onClose,
  userId,
}: {
  onClose: () => void;
  userId: number;
}) {
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password.trim()) {
      setError("Please enter a new password.");
      return;
    }

    try {
      await userApi.changePassword(userId, { password });
      showSuccess("Password updated successfully");
      setError("");
      onClose();
    } catch (err) {
      setError(
        isAxiosError(err)
          ? err.response?.data.error
          : "Oops ! please try again later",
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
      className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl sm:p-6"
    >
      <div className="flex items-center justify-between">
        <h2
          id="change-password-title"
          className="text-base font-semibold text-slate-900"
        >
          Change Password
        </h2>
        <button
          type="button"
          onClick={onClose}
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
        <div>
          <label
            htmlFor="new-password"
            className="block text-xs font-medium text-slate-700"
          >
            New Password
            <div className="flex mt-1.5">
              <input
                id="new-password"
                required
                type={isVisible ? "text" : "password"}
                className="w-full rounded-md border border-slate-200 px-3 py-2 pr-10 text-sm outline-none focus:border-teal-blue focus:ring-1 focus:ring-teal-blue"
                placeholder="Enter new password"
                value={password}
                onChange={(evt) => setPassword(evt.target.value)}
              />
              <button
                type="button"
                onClick={() => setIsVisible((visible) => !visible)}
                aria-label={isVisible ? "Hide password" : "Show password"}
                className="flex items-center px-3 text-slate-600 hover:text-slate-900"
              >
                {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-teal-blue px-3 py-2 text-xs font-semibold text-white hover:bg-darker-teal-blue"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}
