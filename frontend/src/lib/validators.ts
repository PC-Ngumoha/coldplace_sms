import type { CreateReceived, CreateReceivedLines } from "@/types";

const isNumber = (v: string) => /^\d+(\.\d{1,3})?$/.test(v.trim());

export function validateReceipt(
  fields: Omit<CreateReceived, "lines">,
  lines: CreateReceivedLines[],
  needsLocation: boolean, // true for Admin and Manager, false for handlers
): string | null {
  if (!fields.supplier_id) return "Select a supplier";
  if (needsLocation && !fields.location_id) return "Select a location";
  if (lines.length === 0) return "Add at least one product";

  const seen = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const n = i + 1;

    if (!l.product_id) return `Line ${n}: select a product`;
    if (!l.unit_id) return `Line ${n}: select a unit`;

    const key = `${l.product_id}:${l.unit_id}`;
    if (seen.has(key))
      return `Line ${n}: this product and unit are already on the receipt`;
    seen.add(key);

    if (!isNumber(l.delivered_qty) || Number(l.delivered_qty) <= 0)
      return `Line ${n}: enter a delivered quantity above zero`;

    const damaged = (l.damaged_qty ?? "").trim();
    if (damaged !== "") {
      if (!isNumber(damaged))
        return `Line ${n}: damaged quantity is not a valid number`;
      if (Number(damaged) > 0) {
        if (Number(damaged) >= Number(l.delivered_qty))
          return `Line ${n}: damaged quantity must be less than delivered quantity`;
        if (!(l.damage_reason ?? "").trim())
          return `Line ${n}: give a reason for the damage`;
      }
    }

    if (!/^\d+(\.\d{1,2})?$/.test(l.unit_cost.trim()))
      return `Line ${n}: enter a valid unit cost`;
  }

  return null;
}
