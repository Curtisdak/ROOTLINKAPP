import React from 'react'
import { Suspense } from 'react'
import AffiliateProductForm from '../../components/customComponents/AffiliateProductForm'

const AdminPage = () => {
  return (
    <div className='w-full h-full flex items-center justify-center '>
      
      

      <Suspense fallback>
          <AffiliateProductForm/>
      </Suspense>


    </div>
  )
}

export default AdminPage



