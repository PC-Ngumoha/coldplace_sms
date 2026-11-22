import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { supplierApi } from "@/services/Supplierapi";
import type { Supplier } from "@/types";

import CreateSupplierForm from "@/components/forms/CreateSupplierForm";
import EditSupplierForm from "@/components/forms/EditSupplierForm";

export default function ManageSuppliers() {
  const navigate = useNavigate();
  const { id } = useParams();
  const supplierId = parseInt(id as string);
  const [supplier, setSupplier] = useState<Supplier>();

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    async function fetchSupplier() {
      const data = await supplierApi.retrieve(supplierId);
      setSupplier(data);
    }

    if (supplierId) {
      fetchSupplier();
    }
  }, [supplierId]);

  return supplier ? (
    <EditSupplierForm onClose={goBack} supplier={supplier} />
  ) : (
    <CreateSupplierForm onClose={goBack} />
  );
}
