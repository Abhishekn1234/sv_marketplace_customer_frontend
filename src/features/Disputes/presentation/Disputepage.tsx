"use client";

import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useLanguage } from "@/features/context/LanguageContext";
import { useCreateDispute } from "./hooks/useCreateDispute";
import { toast } from "react-toastify";
import Button from "@/components/input/Button";
import { Input, Label, Textarea } from "@/components/input";
import { ArrowLeftIcon } from "@/components/icons";



export default function Disputepage() {
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  
  const {t}=useLanguage();
  const createDisputeMutation = useCreateDispute();
   const {bookingId}=useParams();
  const handleSubmit = () => {
    if (!bookingId) {
      toast.error("Booking ID is missing");
      return;
    }
    createDisputeMutation.mutate(
      { reason, description, bookingId },
      {
        onSuccess: () => {
         toast.success("Dispute created successfully");
          navigate("/bookings");
        },
       onError: (err: any) => {
  const message =
    err?.response?.data?.message ||   // axios style
    err?.message ||                   // generic error
    "Failed to create dispute";       // fallback

  toast.error(message);
  console.error("Failed to create dispute:", err);
},
      }
    );
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Back Button */}
      <div className="self-start mb-6">
        <Button
         
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm sm:text-base"
          leftIcon={<ArrowLeftIcon className="w-4 h-4" />}
        >
          
          {t.disputespage.back}
        </Button>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10 text-center">
        {t.disputespage.title}
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="w-full max-w-lg space-y-6"
      >
        {/* Reason */}
        <div className="flex flex-col">
          <Label htmlFor="reason" className="mb-2 text-sm font-medium text-gray-700">
            {t.disputespage.reason}
          </Label>
          <Input
            id="reason"
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t.disputespage.reasonPlaceholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <Label htmlFor="description" className="mb-2 text-sm font-medium text-gray-700">
            {t.disputespage.description}
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.disputespage.descriptionPlaceholder}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm sm:text-base font-medium transition"
          >
            {t.disputespage.submit}
          </Button>
        </div>
      </form>
    </div>
  );
}