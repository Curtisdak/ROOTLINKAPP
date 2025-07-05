
import React from 'react'
import { Suspense } from 'react'
import AffiliateProductForm from '../../components/customComponents/AffiliateProductForm'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CreatePollForm from '@/components/customComponents/createPollForm';

const AdminPage = async  () => {

   const session = await getServerSession(authOptions);


  if (!session || session.user.role !== "ADMIN") {
    redirect("/error"); // ou "/login"
  }
  return (
    <div className='w-full h-full flex items-center justify-center '>
      

      <Suspense fallback>
        <div className='flex w-lg border-2 p-4 items-center justify-center gap-4'>   
          <AffiliateProductForm/>
          <CreatePollForm/>
          </div>
      </Suspense>


    </div>
  )
}

export default AdminPage



