import { Button } from "@/components/ui/button";
import type { Category } from "@/types";
import { categoryApi } from "@/services/Categoryapi";
import { Check, Plus, X } from "lucide-react";
import { useEffect, useState, type SubmitEvent } from "react";

export default function Products() {
  const products = [
    {
      code: "CHK-FULL",
      name: "Chicken, whole",
      category: "Chicken",
      carton: 10,
      minStock: 40,
    },
    {
      code: "FSH-TIT",
      name: "Titus fish",
      category: "Fish",
      carton: 12,
      minStock: 30,
    },
    {
      code: "BEEF-CUT",
      name: "Beef, cut",
      category: "Meat",
      carton: 15,
      minStock: 25,
    },
    {
      code: "TUR-WHL",
      name: "Turkey, whole",
      category: "Meat",
      carton: 12,
      minStock: 20,
    },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "categories">(
    "products",
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFields, setCategoryFields] = useState({ name: "" });

  const toggleFormVisibility = () => setIsOpen((visible) => !visible);

  const updateCategoryFields = (field: string, value: string) => {
    setCategoryFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitCategory = (evt: SubmitEvent<HTMLFormElement>) => {
    evt.preventDefault();
    console.log(categoryFields);
  };

  useEffect(() => {
    async function fetchData() {
      const data = await categoryApi.list();
      setCategories(data);
    }

    fetchData();
  }, []);

  return (
    <main className="min-h-screen px-4 py-5 text-slate-900 sm:px-1 sm:py-4">
      <div className="mx-auto max-w-7xl">
        <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold leading-7">
              Products
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Product setup, units, and carton conversion
            </p>
          </div>
          <Button
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl
           bg-teal-blue p-5 text-sm font-semibold text-white transition hover:bg-teal-900 
           focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 sm:w-auto"
            onClick={toggleFormVisibility}
          >
            {!isOpen ? (
              <>
                <Plus size={18} />
                {activeTab === "products" ? (
                  <span>New product</span>
                ) : (
                  <span>New Category</span>
                )}
              </>
            ) : (
              <>
                <X size={18} />
                <span>Close</span>
              </>
            )}
          </Button>
        </header>

        {/* Add Product form */}
        {isOpen && activeTab === "products" && (
          <form
            onSubmit={(event) => event.preventDefault()}
            className="mb-4 rounded-2xl border border-lightest-teal-blue bg-white p-4 sm:p-5"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label
                  htmlFor="product-name"
                  className="mb-1 block text-xs font-medium text-slate-600"
                >
                  Product name
                </label>
                <input
                  id="product-name"
                  name="name"
                  type="text"
                  placeholder="e.g. Chicken, whole"
                  required
                  className="w-full rounded-lg border border-lightest-teal-blue px-2.5 py-2 text-sm outline-none
                   placeholder:text-slate-400 focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                />
              </div>
              <div>
                <label
                  htmlFor="product-code"
                  className="mb-1 block text-xs font-medium text-slate-600"
                >
                  Product code / SKU
                </label>
                <input
                  id="product-code"
                  name="code"
                  type="text"
                  placeholder="e.g. CHK-FULL"
                  required
                  className="w-full rounded-lg border border-lightest-teal-blue px-2.5 py-2 text-sm outline-none
                   placeholder:text-slate-400 focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                />
              </div>
              <div>
                <label
                  htmlFor="product-category"
                  className="mb-1 block text-xs font-medium text-slate-600"
                >
                  Category
                </label>
                <select
                  id="product-category"
                  name="category"
                  defaultValue="Chicken"
                  className="w-full rounded-lg border border-lightest-teal-blue bg-white px-2.5 py-2 text-sm outline-none
                   focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                >
                  {/* <option>Chicken</option>
                  <option>Fish</option>
                  <option>Meat</option> */}
                  <option>Select a category</option>
                  {categories.length > 0 &&
                    categories.map((category) => (
                      <option key={category.id}>{category.name}</option>
                    ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="carton-conversion"
                  className="mb-1 block text-xs font-medium text-slate-600"
                >
                  Carton conversion (kg per carton)
                </label>
                <input
                  id="carton-conversion"
                  name="carton"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="10"
                  className="w-full rounded-lg border border-lightest-teal-blue px-2.5 py-2 text-sm outline-none
                   placeholder:text-slate-400 focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Leave blank if sold by kg only
                </p>
              </div>
              <div>
                <label
                  htmlFor="minimum-stock"
                  className="mb-1 block text-xs font-medium text-slate-600"
                >
                  Minimum stock level (kg)
                </label>
                <input
                  id="minimum-stock"
                  name="minStock"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="30"
                  className="w-full rounded-lg border border-lightest-teal-blue px-2.5 py-2 text-sm outline-none
                   placeholder:text-slate-400 focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Optional, for low-stock alerts
                </p>
              </div>
            </div>
            <Button
              type="submit"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-blue px-4 py-2 text-sm font-medium
               text-white hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
            >
              <Check size={16} />
              Save product
            </Button>
          </form>
        )}

        {/* Add Category form */}
        {isOpen && activeTab === "categories" && (
          <form
            onSubmit={handleSubmitCategory}
            className="mb-4 rounded-2xl border border-lightest-teal-blue bg-white p-4 sm:p-5"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label
                  htmlFor="category-name"
                  className="mb-1 block text-xs font-medium text-slate-600"
                >
                  Category name
                </label>
                <input
                  id="category-name"
                  name="name"
                  type="text"
                  placeholder="e.g. Chicken"
                  value={categoryFields.name}
                  onChange={(evt) => {
                    updateCategoryFields("name", evt.target.value);
                  }}
                  required
                  className="w-full rounded-lg border border-lightest-teal-blue px-2.5 py-2 text-sm outline-none
                   placeholder:text-slate-400 focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-blue px-4 py-2 text-sm font-medium
               text-white hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
            >
              <Check size={16} />
              Save category
            </Button>
          </form>
        )}

        <div
          className="mb-2 inline-flex rounded-lg border border-lightest-teal-blue bg-white p-1"
          role="tablist"
          aria-label="Product setup"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "products"}
            onClick={() => setActiveTab("products")}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium
              transition ${activeTab === "products" ? "bg-teal-blue text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            Products{" "}
            <span className="rounded bg-white/20 px-1.5 text-xs">
              {products.length}
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "categories"}
            onClick={() => setActiveTab("categories")}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium
              transition ${activeTab === "categories" ? "bg-teal-blue text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            Categories{" "}
            <span className="rounded bg-white/20 px-1.5 text-xs">
              {categories.length}
            </span>
          </button>
        </div>

        <section
          aria-label={
            activeTab === "products" ? "Product list" : "Category list"
          }
          className="overflow-x-auto rounded-2xl border border-lightest-teal-blue bg-white"
        >
          {activeTab === "categories" ? (
            <div className="p-5">
              <table className="w-full border-collapse text-sm table-fixed">
                <thead>
                  <tr
                    className="h-10 border-b border-lightest-teal-blue text-left text-xs
                    font-medium uppercase tracking-wide text-slate-500"
                  >
                    <th className="px-3">Name</th>
                    <th className="px-3">Status</th>
                    <th className="px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-3 py-10 text-center">
                        <p className="font-medium text-slate-900">
                          No categories yet
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Add a category using the button above.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr
                        key={category.id}
                        className="h-14 border-b border-lightest-teal-blue last:border-b-0"
                      >
                        <td className="px-3 font-medium">{category.name}</td>
                        <td className="px-3">
                          <span
                            className="inline-flex rounded-full border border-lighter-teal-blue bg-lighter-teal-blue
                        px-2.5 py-1 text-xs font-medium leading-none text-emerald-700"
                          >
                            Active
                          </span>
                        </td>
                        <td className="px-3">
                          <button
                            className="whitespace-nowrap rounded-lg border border-lighter-teal-blue px-3 py-2 font-medium text-slate-900 
                        transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-blue"
                          >
                            Deactivate
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto lg:block p-5">
                <table className="w-full min-w-[680px] table-fixed border-collapse text-sm lg:min-w-[760px]">
                  <thead>
                    <tr
                      className="h-10 border-b border-lightest-teal-blue text-left text-[10px] lg:text-[13px] font-medium uppercase 
                tracking-wide text-slate-500"
                    >
                      <th className="px-2 lg:px-3">Code</th>
                      <th className="px-2 lg:px-3">Name</th>
                      <th className="px-2 lg:px-3">Category</th>
                      <th className="px-2 text-right lg:px-3">Carton = kg</th>
                      <th className="px-2 text-right lg:px-3">Min stock</th>
                      <th className="px-2 lg:px-3">Status</th>
                      <th className="px-2 lg:px-3" aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.code}
                        className="h-14 border-b border-lightest-teal-blue last:border-b-0 text-[10px] lg:text-[13px]"
                      >
                        <td className="px-2 font-mono lg:px-3">
                          {product.code}
                        </td>
                        <td className="px-2 font-medium lg:px-3">
                          {product.name}
                        </td>
                        <td className="px-2 lg:px-3">{product.category}</td>
                        <td className="px-2 text-right tabular-nums lg:px-3">
                          {product.carton}
                        </td>
                        <td className="px-2 text-right tabular-nums lg:px-3">
                          {product.minStock}
                        </td>
                        <td className="px-2 lg:px-3">
                          <span
                            className="inline-flex rounded-full border border-lighter-teal-blue bg-lighter-teal-blue px-2.5 py-1 text-xs 
                      font-medium leading-none text-emerald-700"
                          >
                            Active
                          </span>
                        </td>
                        <td className="px-2 lg:px-3 wrap-break-word break-all">
                          <button
                            className="whitespace-nowrap rounded-lg border border-lighter-teal-blue px-3 py-2 font-medium text-slate-900 
                        transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-blue"
                          >
                            Deactivate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
