// app/forgot-password/page.tsx
"use client";

import React, { Suspense } from "react";
import { FullLoading } from "@/components/customComponents/FullLoading";
import ForgotPasswordForm from "./ForgotPaswwordFrom";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<FullLoading />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
