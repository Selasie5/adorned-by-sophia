import React from 'react'
import * as Yup from "yup"

const CategoryModal = () => {
  const categoryValidationSchema =Yup.object().shape(
    {
      name: Yup.string().required("Category name is required").min(3,"Category name must be at least 3 characters"),
      description: Yup.string().optional(),
    }
  )
  return (
    <div>
      
    </div>
  )
}

export default CategoryModal
