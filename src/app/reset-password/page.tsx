// app/forgot-password/page.tsx
"use client";

import React, { Suspense } from "react";
import { FullLoading } from "@/components/customComponents/FullLoading";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<FullLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
