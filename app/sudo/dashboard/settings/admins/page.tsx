"use client"

import Header from '@/app/components/layout/Header'
import Button from '@/app/components/core/ui/button'
import React from 'react'

const AdminsPage = () => {
  return (
    <div className='shrink-0'>
      <Header
      title='Admins'
      breadCrumbs={[
        { label: 'Dashboard', to: '/sudo/dashboard/general' },
        { label: 'Settings', to: '/sudo/dashboard/settings' },
        { label: 'Admins', to: '/sudo/dashboard/settings/admins' },
      ]}
       actions={<Button label="+ Create new admin" primary onClick={() => {}} />}
      />
    </div>
  )
}

export default AdminsPage
