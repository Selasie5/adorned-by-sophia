"use client";

import React, { useState } from "react";
import Form from "../components/core/ui/form";
import Input from "../components/core/ui/input";
import { useMutation } from "@apollo/client/react";
import * as Yup from "yup";
import { FingerPrintIcon } from "@heroicons/react/24/solid";
import { gql } from "@apollo/client";

const ResetPasswordPage = () => {
  const [token] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get("token");
    }
    return null;
  });

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("New Password is required"),
  });

  const RESET_PASSWORD = gql`
    mutation ResetPassword($token: String!, $newPassword: String!) {
      resetPassword(token: $token, newPassword: $newPassword)
    }
  `;

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);

  const handleSubmit = (values: { newPassword: string }) => {
    if (!token) return;

    resetPassword({
      variables: {
        token,
        newPassword: values.newPassword,
      },
    });
  };

  if (token === null) {
    return null; // or loading spinner
  }

  if (!token) {
    return (
      <main className="flex flex-col h-screen justify-center items-center gap-4 w-full sub">
        <div className="w-1/3 flex flex-col gap-2">
          <FingerPrintIcon className="w-8 h-8 text-gray-400" />
          <h1 className="text-2xl font-semibold">Invalid Reset Link</h1>
          <p className="text-sm text-gray-600">
            The password reset link is invalid or has expired.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col h-screen justify-center items-center gap-4 w-full sub">
      <div className="w-1/3 flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Reset Password</h1>
        <p className="text-sm text-gray-600">
          Enter your new password to perform the reset
        </p>

        <Form
          initialValues={{ newPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-5 mt-3"
        >
          {(formik) => (
            <>
              <Input
                label="New Password"
                type="password"
                placeholder="Enter your new password"
                {...formik.getFieldProps("newPassword")}
                error={
                  formik.touched.newPassword && formik.errors.newPassword
                    ? formik.errors.newPassword
                    : undefined
                }
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-teal-500 w-full text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
              >
                Reset Password
              </button>
            </>
          )}
        </Form>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
