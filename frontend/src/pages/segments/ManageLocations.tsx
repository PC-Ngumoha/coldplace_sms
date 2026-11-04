import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { locationApi } from "@/services/Locationapi";
import type { Location } from "@/types";

import CreateLocationForm from "@/components/forms/CreateLocationForm";
import EditLocationForm from "@/components/forms/EditLocationForm";

export default function ManageLocations() {
  const navigate = useNavigate();
  const { id } = useParams();
  const locationId = parseInt(id as string);
  const [location, setLocation] = useState<Location>();

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    async function fetchLocation() {
      const data = await locationApi.retrieve(locationId);
      setLocation(data);
    }

    if (locationId) {
      fetchLocation();
    }
  }, [locationId]);

  return location ? (
    <EditLocationForm onClose={goBack} location={location} />
  ) : (
    <CreateLocationForm onClose={goBack} />
  );
}
