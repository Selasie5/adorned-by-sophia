"use client";

import React from "react";
import * as Yup from "yup";
import Modal from "../../core/ui/Modal";
import Form from "../../core/ui/form";
import Input from "../../core/ui/input";
import SelectInput from "../../core/ui/SelectInput";
import Button from "../../core/ui/button";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { showToast } from "../../core/ui/toast";
import { Admin } from "./AdminsTable";

const CREATE_ADMIN = gql`
  mutation CreateAdmin(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $role: AdminRole!
  ) {
    createAdmin(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
      role: $role
    ) {
      id
      email
      firstName
      lastName
      role
      isActive
      twoFactorEnabled
      createdAt
    }
  }
`;

const UPDATE_ADMIN = gql`
  mutation UpdateAdmin(
    $id: ID!
    $firstName: String
    $lastName: String
    $role: AdminRole
    $isActive: Boolean
  ) {
    updateAdmin(
      id: $id
      firstName: $firstName
      lastName: $lastName
      role: $role
      isActive: $isActive
    ) {
      id
      email
      firstName
      lastName
      role
      isActive
      twoFactorEnabled
      lastLogin
      createdAt
    }
  }
`;

export const GET_ADMINS = gql`
  query GetAdmins($role: AdminRole) {
    getAdmins(role: $role) {
      id
      email
      firstName
      lastName
      role
      isActive
      twoFactorEnabled
      lastLogin
      createdAt
    }
  }
`;

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin?: Admin | null;
  mode?: "create" | "edit" | "view";
}

const roleOptions = [
  { id: "SUPER_ADMIN", label: "Super Admin", value: "SUPER_ADMIN" },
  { id: "ADMIN", label: "Admin", value: "ADMIN" },
  { id: "MANAGER", label: "Manager", value: "MANAGER" },
];

const statusOptions = [
  { id: "active", label: "Active", value: "true" },
  { id: "inactive", label: "Inactive", value: "false" },
];

const AdminModal = ({
  isOpen,
  onClose,
  admin = null,
  mode = "create",
}: AdminModalProps) => {
  const isCreateMode = mode === "create";
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters"),
    lastName: Yup.string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    email: Yup.string().when([], {
      is: () => isCreateMode,
      then: (schema) =>
        schema
          .required("Email is required")
          .email("Please enter a valid email address"),
      otherwise: (schema) => schema.optional(),
    }),
    password: Yup.string().when([], {
      is: () => isCreateMode,
      then: (schema) =>
        schema
          .required("Password is required")
          .min(8, "Password must be at least 8 characters")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
          ),
      otherwise: (schema) => schema.optional(),
    }),
    confirmPassword: Yup.string().when([], {
      is: () => isCreateMode,
      then: (schema) =>
        schema
          .required("Please confirm your password")
          .oneOf([Yup.ref("password")], "Passwords must match"),
      otherwise: (schema) => schema.optional(),
    }),
    role: Yup.string().required("Role is required"),
    isActive: Yup.string().when([], {
      is: () => !isCreateMode,
      then: (schema) => schema.required("Status is required"),
      otherwise: (schema) => schema.optional(),
    }),
  });

  const [createAdmin, { loading: createLoading }] = useMutation(CREATE_ADMIN, {
    onCompleted: () => {
      showToast("Admin created successfully", "success");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      showToast(error.message, "error");
    },
    refetchQueries: [{ query: GET_ADMINS }],
  });

  const [updateAdmin, { loading: updateLoading }] = useMutation(UPDATE_ADMIN, {
    onCompleted: () => {
      showToast("Admin updated successfully", "success");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      showToast(error.message, "error");
    },
    refetchQueries: [{ query: GET_ADMINS }],
  });

  const loading = createLoading || updateLoading;

  const getTitle = () => {
    switch (mode) {
      case "edit":
        return "Edit Admin";
      case "view":
        return "View Admin";
      default:
        return "Create New Admin";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "edit":
        return "Update the admin details";
      case "view":
        return "View admin information";
      default:
        return "Add a new admin to your team";
    }
  };

  const handleSubmit = (values: any) => {
    if (mode === "edit" && admin) {
      updateAdmin({
        variables: {
          id: admin.id,
          firstName: values.firstName,
          lastName: values.lastName,
          role: values.role,
          isActive: values.isActive === "true",
        },
      });
    } else if (mode === "create") {
      createAdmin({
        variables: {
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          role: values.role,
        },
      });
    }
  };

  const initialValues = {
    firstName: admin?.firstName || "",
    lastName: admin?.lastName || "",
    email: admin?.email || "",
    password: "",
    confirmPassword: "",
    role: admin?.role || "",
    isActive: admin?.isActive ? "true" : "false",
  };

  return (
    <Modal
      title={getTitle()}
      description={getDescription()}
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      footer={
        !isViewMode && (
          <Button
            label={
              loading
                ? mode === "edit"
                  ? "Updating..."
                  : "Creating..."
                : mode === "edit"
                ? "Update Admin"
                : "Create Admin"
            }
            primary
            type="submit"
            disabled={loading}
            onClick={() => {
              document.querySelector("form")?.dispatchEvent(
                new Event("submit", { cancelable: true, bubbles: true })
              );
            }}
          />
        )
      }
    >
      <Form
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        className="w-full"
      >
        {(formik) => (
          <div className="w-full flex flex-col gap-4">
            {isCreateMode && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.firstName && formik.errors.firstName
                      ? formik.errors.firstName
                      : undefined
                  }
                  required
                  disabled={isViewMode}
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.lastName && formik.errors.lastName
                      ? formik.errors.lastName
                      : undefined
                  }
                  required
                  disabled={isViewMode}
                />
                 <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : undefined
                }
                required
                disabled={!isCreateMode}
              />
               <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && formik.errors.password
                      ? formik.errors.password
                      : undefined
                  }
                  required
                />

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword && formik.errors.confirmPassword
                      ? formik.errors.confirmPassword
                      : undefined
                  }
                  required
                />
                 <SelectInput
              label="Role"
              name="role"
              placeholder="Select role"
              value={formik.values.role}
              onChange={(value) => formik.setFieldValue("role", value)}
              options={roleOptions}
              required
            />
             <SelectInput
                label="Status"
                name="isActive"
                placeholder="Select status"
                value={formik.values.isActive}
                onChange={(value) => formik.setFieldValue("isActive", value)}
                options={statusOptions}
                required
              />
              </div>
            )}

           
 {isEditMode&& (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.firstName && formik.errors.firstName
                      ? formik.errors.firstName
                      : undefined
                  }
                  required
                  disabled={isViewMode}
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.lastName && formik.errors.lastName
                      ? formik.errors.lastName
                      : undefined
                  }
                  required
                  disabled={isViewMode}
                />
                 <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : undefined
                }
                required
                disabled={!isCreateMode}
              />
               <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && formik.errors.password
                      ? formik.errors.password
                      : undefined
                  }
                  required
                />

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword && formik.errors.confirmPassword
                      ? formik.errors.confirmPassword
                      : undefined
                  }
                  required
                />
                 <SelectInput
              label="Role"
              name="role"
              placeholder="Select role"
              value={formik.values.role}
              onChange={(value) => formik.setFieldValue("role", value)}
              options={roleOptions}
              required
            />
             <SelectInput
                label="Status"
                name="isActive"
                placeholder="Select status"
                value={formik.values.isActive}
                onChange={(value) => formik.setFieldValue("isActive", value)}
                options={statusOptions}
                required
              />
              </div>
            )}

          

            {isViewMode && admin && (
              <div className="w-full flex flex-col justify-center items-start gap-6">
 <div className="flex flex-col  justify-center items-start mt-4 p-4 border border-gray-200 border-dotted rounded-lg space-y-2 w-full">
                <div className="flex flex-col justify-center items-start gap-3 w-full">
                  <p className="text-gray-600 text-xs">General Information</p>
<div className="grid grid-cols-2 w-full place-items-start gap-4">
<div className="flex flex-col justify-center item-start gap-2">
  <span className="text-sm text-gray-700">Name</span>
   <span
                    className={`text-sm font-medium  text-gray-500 `}
                  >
                   {admin.firstName + " " + admin.lastName} 
                  </span>
  </div>

<div className="flex flex-col justify-center item-start gap-2">
  <span className="text-sm text-gray-700">Email</span>
   <span
                    className={` text-sm font-medium  text-gray-500  `}
                  >
                    {admin.email}
                  </span>
  </div>
  <div className="flex flex-col justify-center item-start gap-2">
  <span className="text-sm text-gray-700">Role</span>
   <span
                    className={`px-2 py-1 text-xs font-medium rounded-sm text-gray-500 uppercase border bg-gray-100 border-gray-200`}
                  >
                    {admin.role}
                  </span>
  </div>
  <div className="flex flex-col justify-center item-start gap-2">
  <span className="text-sm text-gray-700">Status</span>
   <span
                    className={`px-2 py-1 text-xs font-medium rounded-sm text-gray-500 uppercase border bg-gray-100 border-gray-200`}
                  >
                    {admin.isActive ? "Active" : "Inactive"}
                  </span>
  </div>
  </div>
                  </div>
               
              </div>
 <div className="flex flex-col  justify-center items-start mt-4 p-4 border border-gray-200 border-dotted rounded-lg space-y-2 w-full">
                <div className="flex flex-col justify-center items-start gap-3 w-full">
                  <p className="text-gray-600 text-xs">Meta Information</p>
<div className="grid grid-cols-2 w-full place-items-start gap-4">
<div className="flex flex-col justify-center item-start gap-2">
  <span className="text-sm text-gray-700">Two Factor Auth</span>
   <span
                    className={`px-2 py-1 text-xs font-medium rounded-sm text-gray-500 uppercase border bg-gray-100 border-gray-200`}
                  >
                    {admin.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </span>
  </div>
<div className="flex flex-col justify-center item-start gap-2">
  <span className="text-sm text-gray-700">Created At</span>
   <span
                    className={`text-sm font-medium  text-gray-500 `}
                  >
                   {new Date(parseInt(admin.createdAt)).toLocaleString()}
                  </span>
  </div>
<div className="flex flex-col justify-center item-start gap-2">
  <span className="text-sm text-gray-700">Last Login</span>
   <span
                    className={` text-sm font-medium  text-gray-500  `}
                  >
                    {admin.lastLogin
                      ? new Date(parseInt(admin.lastLogin)).toLocaleString()
                      : "Never"}
                  </span>
  </div>
  </div>
                  </div>
               
              </div>
                </div>
             
            )}
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default AdminModal;
