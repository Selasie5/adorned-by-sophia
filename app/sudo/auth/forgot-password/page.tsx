"use client"
import Form from '@/app/components/core/ui/form'
import Input from '@/app/components/core/ui/input'
import { useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import React from 'react'
import * as Yup from 'yup'
import { showToast } from '@/app/components/core/ui/toast'

const ForgotPasswordPage = () => {
  const emailValidationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
  });

  const REQUEST_PASSWORD_RESET = gql `
    mutation RequestPasswordReset($email: String!) {
  requestPasswordReset(email: $email)
}
  `
  
  const [handleSubmit, { loading }] = useMutation(REQUEST_PASSWORD_RESET, {
    onCompleted: () => {
      showToast('If an account exists with that email, a reset link has been sent.', 'success');
    },
    onError: (err) => {
      showToast(err.message, 'error');
    }
  }
  )
  
  return (
   <main className='sub flex flex-col h-screen justify-center items-center gap-4 w-full'>
    <div className='w-1/3 flex flex-col justify-center items-start gap-2'>
 <h1 className='text-2xl font-semibold'>Forgot Password</h1>
    <p className='text-sm text-gray-600'>Enter your email address below to receive a password reset link.</p>

    <Form
    initialValues={{email: ''}}
    validationSchema={
      emailValidationSchema
    }
    onSubmit={(values)=>{handleSubmit({variables: {email: values.email}})}}
    className='w-full flex flex-col justify-center items-start gap-5 mt-3'
    >
      {
        (formik)=>
        (
          <>
          <Input
          name='email'
          label='Email Address'
          type='email'
          placeholder='Enter your email'
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
          />

          <button
          type='submit'
          className='px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors disabled:opacity-50 w-full'
          disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          </>
        )
      }
    </Form>
    </div>
   
    
   </main>
  )
}

export default ForgotPasswordPage
