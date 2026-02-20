"use client";

import { useState } from "react";
import { createDL } from "@/lib/actions/dl.action";

type ImageField = {
  file: File | null;
  preview: string | null;
};

export default function DrivingLicenseForm() {
  const [formData, setFormData] = useState({
    drivingLicense: "",
    nationalId: "",
    phoneNumber: "",
    fullname: "",
  });

  const [dlImage, setDlImage] = useState<ImageField>({ file: null, preview: null });
  const [nidImage, setNidImage] = useState<ImageField>({ file: null, preview: null });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<ImageField>>
  ) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter({ file, preview: reader.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      setter({ file: null, preview: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = new FormData();
      data.append("fullname", formData.fullname);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("drivingLicense", formData.drivingLicense);
      data.append("nationalId", formData.nationalId);
      if (dlImage.file) data.append("drivingLicenseImageUrl", dlImage.file);
      if (nidImage.file) data.append("nationalIdImageUrl", nidImage.file);

      await createDL(data);
      setMessage({ text: "Driving License submitted successfully!", type: "success" });
      setFormData({ drivingLicense: "", nationalId: "", phoneNumber: "", fullname: "" });
      setDlImage({ file: null, preview: null });
      setNidImage({ file: null, preview: null });
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to submit. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const ImageUploadBox = ({
    label,
    fieldName,
    state,
    setter,
    accent,
  }: {
    label: string;
    fieldName: string;
    state: ImageField;
    setter: React.Dispatch<React.SetStateAction<ImageField>>;
    accent: string;
  }) => (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</label>
      <label
        className="relative cursor-pointer group block"
        style={{ minHeight: state.preview ? "auto" : "140px" }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e, setter)}
          className="hidden"
          required={!state.file}
        />
        {state.preview ? (
          <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-300">
            <img
              src={state.preview}
              alt={`${fieldName} preview`}
              className="w-full object-cover max-h-48 rounded-xl"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center rounded-xl">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-semibold bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
                Change Image
              </span>
            </div>
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow">
              ✓ Selected
            </div>
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all duration-300 h-36 ${accent} group-hover:scale-[1.01]`}
          >
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600">Click to upload</p>
              <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP up to 10MB</p>
            </div>
          </div>
        )}
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-lg shadow-blue-200 mb-4">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">License Verification</h1>
          <p className="text-gray-500 text-sm mt-1">Submit your documents for verification</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Personal Info Section */}
            <div className="p-8 pb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-5">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">Full Name</label>
                  <input
                    type="text"
                    name="fullname"
                    placeholder="e.g. Arjun Thapa"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                    className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="e.g. 98XXXXXXXX"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="mx-8 border-t border-dashed border-gray-100" />

            {/* Driving License Section */}
            <div className="p-8 pb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-5">Driving License</h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">License Number</label>
                  <input
                    type="text"
                    name="drivingLicense"
                    placeholder="e.g. 01-06-01234567"
                    value={formData.drivingLicense}
                    onChange={handleChange}
                    required
                    className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:border-transparent transition-all"
                  />
                </div>
                <ImageUploadBox
                  label="License Photo"
                  fieldName="drivingLicense"
                  state={dlImage}
                  setter={setDlImage}
                  accent="border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-50"
                />
              </div>
            </div>

            <div className="mx-8 border-t border-dashed border-gray-100" />

            {/* National ID Section */}
            <div className="p-8 pb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-5">National ID</h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">ID Number</label>
                  <input
                    type="text"
                    name="nationalId"
                    placeholder="e.g. 01-01-01-00001"
                    value={formData.nationalId}
                    onChange={handleChange}
                    required
                    className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white focus:border-transparent transition-all"
                  />
                </div>
                <ImageUploadBox
                  label="National ID Photo"
                  fieldName="nationalId"
                  state={nidImage}
                  setter={setNidImage}
                  accent="border-emerald-200 bg-emerald-50 hover:border-emerald-400 hover:bg-emerald-50"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="px-8 pb-8">
              {message && (
                <div
                  className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  <span>{message.type === "success" ? "✅" : "❌"}</span>
                  {message.text}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-[0.98] text-sm tracking-wide"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit for Verification"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}