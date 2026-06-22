"use client";

import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useLanguage } from "@/features/context/LanguageContext";
import { useCreateDispute } from "./hooks/useCreateDispute";
import { toast } from "react-toastify";
import Button from "@/components/input/Button";
import {  Label, Textarea } from "@/components/input";
import { ArrowLeftIcon } from "@/components/icons";
import Select from "@/components/input/Select";
import { options } from "../domain/entities/reasontypes";
import clsx from "clsx";



export default function Disputepage() {

  const navigate = useNavigate();
  const [reasonType, setReasonType] = useState("");
  const [description, setDescription] = useState("");

  
  const {t,isRTLOrder}=useLanguage();
  const createDisputeMutation = useCreateDispute();
   const {bookingId}=useParams();
    const handleSubmit = async () => {
    
      if (!bookingId) {
        toast.error("Booking ID is missing");
        console.log("❌ Missing bookingId");
        return;
      }

      if (!reasonType) {
        toast.error("Please select a reason type");
        console.log("❌ Missing reasonType");
        return;
      }

    
      if (!description || description.trim().length < 10) {
        toast.error("Please enter a valid description");
        console.log("❌ Invalid description");
        return;
      }

      const payload = {
        reasonType,
        description: description.trim(),
        bookingId,
      };

      console.log("🚀 Submitting dispute payload:", payload);

      try {
        const res = await createDisputeMutation.mutateAsync(payload);

        console.log("✅ Success response:", res);

        toast.success("Dispute created successfully");

        navigate("/bookings");
      } catch (err: any) {
        // console.log("❌ Error full object:", err);
        // console.log("❌ Backend response:", err?.response?.data);

        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to create dispute";

        toast.error(message);
      }
    };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      
          <div className={clsx("mb-6",`${isRTLOrder?"self-end":"self-start"}`)}>
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
          <Label htmlFor="reason"  className={clsx("mb-2 text-sm font-medium text-gray-700",`${isRTLOrder?"justify-end":""}`)}>
            {t.disputespage.reason}
          </Label>
            <Select
          options={options}
          onChange={(value) => setReasonType(value)}
          className="w-full"
        />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <Label htmlFor="description" className={clsx("mb-2 text-sm font-medium text-gray-700",`${isRTLOrder?"justify-end":""}`)}>
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
        <div className={clsx("flex",`${isRTLOrder?"justify-start":"self-end"}`)}>
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