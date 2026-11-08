import { userApi } from "@/services/Userapi";
import { showSuccess } from "@/services/toasts";
import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { isAxiosError } from "axios";
import { X, Eye, EyeOff } from "lucide-react";

export default function UserChangePassword() {
  const [field, setField] = useState({
    old_password: "",
    new_password: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const updateField = (fieldName: string, fieldValue: string) => {
    setField((prev) => ({ ...prev, [fieldName]: fieldValue }));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!field.old_password.trim()) {
      setError("Please enter your current password.");
      return;
    }

    if (!field.new_password.trim()) {
      setError("Please enter a new password.");
      return;
    }

    try {
      await userApi.changeMyPassword(field);
      showSuccess("Password updated successfully");
      setError("");
      goBack();
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
      className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/40 p-4"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) goBack();
      }}
    >
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
            onClick={goBack}
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
              Old Password
              <div className="flex mt-1.5">
                <input
                  id="old-password"
                  required
                  type={isVisible ? "text" : "password"}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 pr-10 text-sm outline-none focus:border-teal-blue focus:ring-1 focus:ring-teal-blue"
                  placeholder="Enter current password"
                  value={field.old_password}
                  onChange={(evt) =>
                    updateField("old_password", evt.target.value)
                  }
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
            <label
              htmlFor="new-password"
              className="block text-xs font-medium text-slate-700 my-2"
            >
              New Password
              <div className="flex mt-1.5">
                <input
                  id="new-password"
                  required
                  type={isVisible ? "text" : "password"}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 pr-10 text-sm outline-none focus:border-teal-blue focus:ring-1 focus:ring-teal-blue"
                  placeholder="Enter new password"
                  value={field.new_password}
                  onChange={(evt) =>
                    updateField("new_password", evt.target.value)
                  }
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
              onClick={goBack}
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
    </div>
  );
}
