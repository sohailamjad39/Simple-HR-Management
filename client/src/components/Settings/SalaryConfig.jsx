// client/src/components/Settings/SalaryConfig.jsx
import { useState } from "react";
import SuccessToast from "../SuccessToast";

export default function SalaryConfig() {
  const [config, setConfig] = useState({
    basicPercent: 50,
    hraPercent: 20,
    travelAllowance: 5000,
    pfDeduction: 12,
    taxBrackets: [
      { from: 0, to: 250000, rate: 0 },
      { from: 250001, to: 500000, rate: 5 },
      { from: 500001, to: 1000000, rate: 20 },
      { from: 1000001, to: null, rate: 30 },
    ],
  });

  const [newBracket, setNewBracket] = useState({ from: "", to: "", rate: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleAddBracket = () => {
    const { from, to, rate } = newBracket;
    if (!from || !to || !rate) return;
    setConfig((prev) => ({
      ...prev,
      taxBrackets: [
        ...prev.taxBrackets,
        {
          from: Number(from),
          to: Number(to),
          rate: Number(rate),
        },
      ],
    }));
    setNewBracket({ from: "", to: "", rate: "" });
  };

  const handleRemoveBracket = (index) => {
    setConfig((prev) => ({
      ...prev,
      taxBrackets: prev.taxBrackets.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      {/* Success Toast */}
      {showSuccess && (
        <SuccessToast
          message="Salary configuration saved!"
          onClose={() => setShowSuccess(false)}
        />
      )}

      <div className="bg-white/70 border border-gray-100 rounded-2xl overflow-hidden">
        <div className="p-6 border-gray-200 border-b">
          <h3 className="font-semibold text-gray-900 text-lg">
            Salary Configuration
          </h3>
          <p className="text-gray-600 text-sm">
            Set allowance percentages, deductions, and tax rules
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Basic Salary (%)
              </label>
              <input
                type="number"
                name="basicPercent"
                value={config.basicPercent}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                min="1"
                max="100"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                HRA (%)
              </label>
              <input
                type="number"
                name="hraPercent"
                value={config.hraPercent}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                min="0"
                max="50"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Travel Allowance (Rs)
              </label>
              <input
                type="number"
                name="travelAllowance"
                value={config.travelAllowance}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                PF Deduction (%)
              </label>
              <input
                type="number"
                name="pfDeduction"
                value={config.pfDeduction}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                min="0"
                max="13"
                required
              />
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-medium text-gray-900">Tax Brackets</h4>
            <div className="space-y-2 mb-3">
              {config.taxBrackets.map((bracket, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span>
                    Rs.{bracket.from.toLocaleString()} – Rs.
                    {bracket.to ? bracket.to.toLocaleString() : "Above"}
                  </span>
                  <span className="font-medium">{bracket.rate}%</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBracket(index)}
                    className="ml-auto text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="From"
                value={newBracket.from}
                onChange={(e) =>
                  setNewBracket({ ...newBracket, from: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="number"
                placeholder="To"
                value={newBracket.to}
                onChange={(e) =>
                  setNewBracket({ ...newBracket, to: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="number"
                placeholder="Rate %"
                value={newBracket.rate}
                onChange={(e) =>
                  setNewBracket({ ...newBracket, rate: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={handleAddBracket}
                className="bg-indigo-600 px-3 py-2 rounded-lg text-white cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-medium text-white transition-colors cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
