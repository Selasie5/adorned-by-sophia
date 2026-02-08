import React from 'react'
import {useFormik,type FormikValues, Form as FormikForm, FormikProvider} from "formik"
import * as Yup from "yup"

interface FormProps<T extends FormikValues>{
  initialValues:T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validationSchema:Yup.ObjectSchema<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit:(values:any)=>void
  children:(formik:ReturnType<typeof useFormik<T>>)=>React.ReactNode
  className?:string
}

function Form<T extends FormikValues>({onSubmit, validationSchema, initialValues, className="", children}: FormProps<T>) {

const formik = useFormik<T>({
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
      className={className}
      onSubmit={formik.handleSubmit}
      noValidate
      >
        {children(formik)}
      </FormikForm>
    </FormikProvider>
  )
}

export default Form
