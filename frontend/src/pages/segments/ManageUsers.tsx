import { useNavigate, useParams } from "react-router";
import type { Location, User } from "@/types";
import { useEffect, useState } from "react";
import { locationApi } from "@/services/Locationapi";
import { userApi } from "@/services/Userapi";
import CreateUserForm from "@/components/forms/CreateUserForm";
import EditUserForm from "@/components/forms/EditUserForm ";
// import { showError } from '@/services/toasts';

export default function ManageUsers() {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = parseInt(id as string);
  const [locations, setLocations] = useState<Location[]>([]);
  const [user, setUser] = useState<User>();

  const goBack = () => {
    navigate(-1);
  };

  // fetch locations
  useEffect(() => {
    async function fetchLocations() {
      const data = await locationApi.list();
      setLocations(data);
    }

    async function fetchUser() {
      const data = await userApi.retrieve(userId);
      setUser(data);
    }

    fetchLocations();
    fetchUser();
  }, []);

  return user ? (
    <EditUserForm user={user} onClose={goBack} locations={locations} />
  ) : (
    <CreateUserForm onClose={goBack} locations={locations} />
  );
}
