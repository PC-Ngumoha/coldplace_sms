import type {
  CreateReceived,
  CreateReceivedLines,
  Supplier,
  Location,
  Unit,
  Product,
} from "@/types";
import { supplierApi } from "@/services/Supplierapi";
import { locationApi } from "@/services/Locationapi";
import { unitsApi } from "@/services/Unitsapi";
import { productsApi } from "@/services/Productsapi";
import { receivedApi } from "@/services/Receivedapi";
import Loading from "@/components/Loading";
import { validateReceipt } from "@/lib/validators";
import { useAuth } from "@/contexts/auth_context";
import { useState, useEffect, useCallback, type SubmitEvent } from "react";
import { Plus, X } from "lucide-react";
import { isAxiosError } from "axios";
import { showSuccess } from "@/services/toasts";

const initialLineValues: CreateReceivedLines = {
  product_id: 0,
  unit_id: 0,
  delivered_qty: "",
  damaged_qty: "",
  damage_reason: "",
  unit_cost: "",
};

type ReceivedValues = Omit<CreateReceived, "lines">;

const initialReceivedValues: ReceivedValues = {
  supplier_id: 0,
  location_id: 0,
  delivery_ref: "",
  notes: "",
};

export default function ReceivingForm({
  onClose,
  reloadList,
}: {
  onClose: () => void;
  reloadList: () => void;
}) {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [fields, setFields] = useState<ReceivedValues>(initialReceivedValues);
  const [error, setError] = useState("");
  const [lines, setLines] = useState<CreateReceivedLines[]>([
    initialLineValues,
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const updateFields = (field: string, value: unknown) => {
    setFields((oldFields) => ({ ...oldFields, [field]: value }));
  };

  const updateLines = (idx: number, field: string, value: unknown) => {
    setLines((oldLines) =>
      oldLines.map((line, i) =>
        i === idx ? { ...line, [field]: value } : line,
      ),
    );
  };

  const addProductLine = () =>
    setLines((lines) => [...lines, initialLineValues]);

  const removeProductLine = (idx: number) => {
    setLines((lines) => {
      const newLines = lines.filter((_, i) => i !== idx);

      return [...newLines];
    });
  };

  const hasDamage = (line: CreateReceivedLines) =>
    Number(line.damaged_qty ?? "0") > 0;

  const handleSubmit = async (evt: SubmitEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const issue = validateReceipt(
      fields,
      lines,
      ["admin", "manager"].includes(user!.role),
    );
    if (issue) {
      setError(issue);
      return;
    }
    setError("");
    try {
      const payload = { ...fields, lines };
      await receivedApi.create(payload);
      //   console.log(payload);
      showSuccess("Receipt recorded successfully !!!");
      reloadList(); // Refetch records from the database;
      onClose();
    } catch (err) {
      setError(
        isAxiosError(err)
          ? err.response?.data.error
          : "Operation failed. Please try again later.",
      );
    }
  };

  // FETCHING DATA

  // SUPPLIERS
  const fetchSuppliers = useCallback(async () => {
    const activeSuppliers = await supplierApi.list();
    setSuppliers(activeSuppliers);
  }, []);

  //LOCATIONS
  const fetchLocations = useCallback(async () => {
    const activeLocations = await locationApi.list();
    setLocations(activeLocations);
  }, []);

  // UNITS
  const fetchUnits = useCallback(async () => {
    const activeUnits = await unitsApi.list();
    setUnits(activeUnits);
  }, []);

  // PRODUCTS
  const fetchProducts = useCallback(async () => {
    const activeProducts = await productsApi.list();
    setProducts(activeProducts);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError("");
      try {
        // await new Promise((resolve) => setTimeout(resolve, 4000));
        await Promise.all([
          fetchSuppliers(),
          fetchLocations(),
          fetchUnits(),
          fetchProducts(),
        ]);
      } catch {
        setError("Failed to load data. Please try again later");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [fetchSuppliers, fetchLocations, fetchUnits, fetchProducts]);

  return (
    <form
      className="mb-5 rounded-xl border border-lighter-teal-blue bg-white p-4 sm:p-5"
      onSubmit={handleSubmit}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {error && (
            <div
              className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="flex flex-col text-xs font-medium text-slate-600">
              Supplier / seller
              <select
                className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                name="supplier"
                value={fields.supplier_id}
                onChange={(evt) =>
                  updateFields("supplier_id", parseInt(evt.target.value))
                }
                required
              >
                <option value="0" disabled>
                  Select supplier…
                </option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col text-xs font-medium text-slate-600">
              Delivery reference
              <input
                className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                name="deliveryReference"
                value={fields.delivery_ref}
                onChange={(evt) =>
                  updateFields("delivery_ref", evt.target.value)
                }
                placeholder="Waybill / invoice no."
              />
              <span className="mt-1 block text-[11px] text-slate-400">
                Optional
              </span>
            </label>
            <label className="flex flex-col text-xs font-medium text-slate-600">
              Location
              <select
                className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                name="location"
                value={fields.location_id}
                onChange={(evt) =>
                  updateFields("location_id", evt.target.value)
                }
                required
              >
                <option value="0" disabled>
                  Select location…
                </option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className="mt-5">
            <legend className="mb-2 text-xs font-medium text-slate-500">
              Product lines
            </legend>
            <div className="space-y-2">
              {lines.map((line, idx) => {
                const delivered_qty = line.delivered_qty
                  ? parseFloat(line.delivered_qty)
                  : 0.0;
                const damaged_qty = line.damaged_qty
                  ? parseFloat(line.damaged_qty)
                  : 0.0;
                const accepted_qty = delivered_qty - damaged_qty;

                const selectedUnit = units.find(
                  (unit) => unit.id === line.unit_id,
                );
                const displayedUnit = selectedUnit ? selectedUnit.code : "";

                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-semibold text-slate-800">
                        Product line {idx + 1}
                      </h3>
                      <button
                        type="button"
                        aria-label={`Remove product line ${idx + 1}`}
                        className="h-8 w-8 rounded-full p-0 text-slate-400 hover:bg-red-50 hover:text-red-600
                  flex justify-center items-center"
                        onClick={() => removeProductLine(idx)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <label className="flex flex-col text-xs font-medium text-slate-600">
                        Product
                        <select
                          className="mt-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition
                    focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                          value={line.product_id}
                          onChange={(evt) =>
                            updateLines(
                              idx,
                              "product_id",
                              parseInt(evt.target.value),
                            )
                          }
                          required
                        >
                          <option value="0" disabled>
                            Select…
                          </option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col text-xs font-medium text-slate-600">
                        Delivered qty
                        <input
                          className="mt-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                          type="number"
                          min="0"
                          step="any"
                          value={line.delivered_qty}
                          onChange={(evt) =>
                            updateLines(idx, "delivered_qty", evt.target.value)
                          }
                          required
                        />
                      </label>
                      <label className="flex flex-col text-xs font-medium text-slate-600">
                        Unit
                        <select
                          className="mt-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                          value={line.unit_id}
                          onChange={(evt) =>
                            updateLines(
                              idx,
                              "unit_id",
                              parseInt(evt.target.value),
                            )
                          }
                        >
                          <option value="0" disabled>
                            Select ...
                          </option>
                          {units.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.code}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col text-xs font-medium text-slate-600">
                        Damaged qty
                        <input
                          className="mt-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                          type="number"
                          min="0"
                          step="any"
                          value={line.damaged_qty ?? ""}
                          onChange={(evt) =>
                            updateLines(idx, "damaged_qty", evt.target.value)
                          }
                        />
                        <span className="mt-1 text-[11px] font-normal text-slate-400">
                          Same unit
                        </span>
                      </label>
                      {hasDamage(line) && (
                        <label className="flex flex-col text-xs font-medium text-slate-600">
                          Damage reason
                          <input
                            className="mt-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition
                      focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                            value={line.damage_reason ?? ""}
                            onChange={(evt) =>
                              updateLines(
                                idx,
                                "damage_reason",
                                evt.target.value,
                              )
                            }
                            required
                          />
                        </label>
                      )}
                      <label className="flex flex-col text-xs font-medium text-slate-600">
                        Purchase cost (per accepted qty)
                        <div
                          className=" mt-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm 
                        transition focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20 flex gap-1"
                        >
                          <div className="text-slate-500 font-semibold">₦</div>
                          <input
                            className="flex-1 outline-none "
                            type="number"
                            min="0"
                            step="any"
                            value={line.unit_cost}
                            onChange={(evt) =>
                              updateLines(idx, "unit_cost", evt.target.value)
                            }
                          />
                        </div>
                      </label>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <span className="rounded-full bg-teal-50 px-3 py-1 text-xs text-teal-800">
                        Accepted Qty ≃{" "}
                        <span className="inline-block tracking-wide text-[14px] font-semibold">
                          {accepted_qty.toFixed(1)} {displayedUnit}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>

          {/* Add a new product line */}
          <button
            type="button"
            className="my-4 w-fit p-2 border border-lighter-teal-blue flex justify-center items-center
        text-sm rounded-lg shadow"
            onClick={addProductLine}
          >
            <Plus size={16} />
            <span>Add line</span>
          </button>

          <label className="mt-4 flex flex-col text-xs font-medium text-slate-600">
            Notes / delivery condition
            <textarea
              className="mt-1 min-h-20 resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              name="notes"
              value={fields.notes ?? ""}
              onChange={(evt) => updateFields("notes", evt.target.value)}
              rows={2}
            />
            <span className="mt-1 block text-[11px] text-slate-400">
              Optional
            </span>
          </label>
          <button
            type="submit"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-teal-blue px-4 py-2 text-sm font-semibold
               text-white hover:bg-darker-teal-blue focus:outline-none focus:ring-2 focus:ring-teal-blue 
               focus:ring-offset-2"
          >
            <span aria-hidden="true">✓</span>
            Record receiving
          </button>
        </>
      )}
    </form>
  );
}
