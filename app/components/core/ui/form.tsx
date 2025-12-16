import React, { forwardRef } from 'react'
import {useFormik,type FormikValues, Form as FormikForm, FormikProvider} from "formik"
import * as Yup from "yup"

interface FormProps<T extends FormikValues>{
  initialValues:T,
  validationSchema:Yup.ObjectSchema<T>,
  onSubmit:(values:T)=>void
  children:(formik:ReturnType<typeof useFormik<T>>)=>React.ReactNode
  className?:string
}
const Form = forwardRef<HTMLFormElement, FormProps<any>>(({onSubmit, validationSchema, initialValues, className="", children}, ref) => {

const formik = useFormik({
  initialValues,
  validationSchema,
  onSubmit,
  validateOnBlur: true,
  validateOnChange:true,
  enableReinitialize:true
})
  return (
    <FormikProvider 
    value={formik}>
      <FormikForm
      ref={ref}
      className={className}
      onSubmit={formik.handleSubmit}
      noValidate
      >
        {children(formik)}
      </FormikForm>
    </FormikProvider>
  )
}
);
Form.displayName = 'Form'
export default Form
