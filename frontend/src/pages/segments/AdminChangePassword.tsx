import { useNavigate, useParams } from "react-router";

import ChangePasswordForm from "@/components/forms/ChangePasswordForm";

export default function AdminChangePassword() {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = parseInt(id as string);

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
      <ChangePasswordForm onClose={goBack} userId={userId} />
    </div>
  );
}
