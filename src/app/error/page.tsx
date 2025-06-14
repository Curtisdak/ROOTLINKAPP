"use client";

import { Suspense } from "react";
import { FullLoading } from "@/components/customComponents/FullLoading"; // optional

import ErrorMessageContent from "./ErrorMessageContent"; // create this

export default function ErrorPage() {
  return (
    <Suspense fallback={<FullLoading />}>
      <ErrorMessageContent />
    </Suspense>
  );
}
