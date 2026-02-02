"use client"
import Form from '@/app/components/core/ui/form'
import Input from '@/app/components/core/ui/input'
import React from 'react'
import * as Yup from 'yup'
import Link from 'next/link'
import { useMutation } from '@apollo/client/react'
import { SUDO_AUTH_LOGIN } from '@/app/apollo/sudo-auth'
import { useAuth } from '@/app/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { showToast } from '@/app/components/core/ui/toast'

const page = () => {

  const authValidationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  })


  const {setAuthData} = useAuth();
  const navigate = useRouter();

  const [handleLogin ,{data, loading, error}] =  useMutation(SUDO_AUTH_LOGIN, {
    onCompleted: (data:any) => {
      setAuthData(data.login.accessToken, {
        email: data.login.admin.email,
        firstName: data.login.admin.firstName,
        lastName: data.login.admin.lastName,
        isActive: data.login.admin.isActive,
        role: data.login.admin.role
      });
      navigate.push('/sudo/dashboard/general/home');
    },
    onError: (error) => {
      showToast(error.message, 'error');
    },
  })

  const handleSubmit = (values:{email:string, password:string}) => {
    handleLogin({ variables: { email: values.email, password: values.password } }); 
  }
  return (
    
    <main className='flex flex-col justify-center items-center gap-4 h-screen'>
      <div className='flex flex-col justify-center items-start w-1/3'>
        <div className='flex justify-center items-center gap-2'>
 <h1 className='text-2xl font-semibold'>Adorned by Sophia</h1>
 <span className='text-xs bg-rose-600 rounded-none p-1 font-mono text-white'>SUDO</span>
        </div>
        <p className='sub text-sm text-gray-600'>Kindly enter your credentials to proceed.</p>

<Form
initialValues={
  {
    email: '',
    password: ''
  }
}
validationSchema={authValidationSchema}
onSubmit={handleSubmit}
className='sub w-full mt-4 flex flex-col justify-center items-start gap-5'
>
  {
    (formik)=>
    (
      <>
      <Input
      name='email'
      label='Email'
      type='email'
      placeholder='Enter your email'
      value={formik.values.email}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
      required
      />
      <div className='flex flex-col gap-2 w-full'>
 <Input
      name='password'
      label='Password'
      type='password'
      placeholder='Enter your password'
      value={formik.values.password}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
      required
      />
      <Link className='self-end' href='/sudo/auth/forgot-password'>
        <span className='text-sm text-gray-600 hover:underline cursor-pointer'>Forgot Password?</span>
      </Link>
      </div>


      <button className='text-white text-sm px-4 py-3 rounded-md bg-rose-500 w-full mt-4  hover:opacity-80' type='submit' disabled={loading}>
        <span className='text-white text-sm font-medium'>
          {
loading ? 'Logging in...' : 'Login'
          }
        </span>
      </button>

      </>
    )
  }


</Form>
      </div>
     
    </main>
  )
}

export default page
