
import React from 'react'
import { Suspense } from 'react'
import AffiliateProductForm from '../../components/customComponents/AffiliateProductForm'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const AdminPage = async  () => {

   const session = await getServerSession(authOptions);


  if (!session || session.user.role !== "ADMIN") {
    redirect("/error"); // ou "/login"
  }
  return (
    <div className='w-full h-full flex items-center justify-center '>
      

      <Suspense fallback>
          <AffiliateProductForm/>
      </Suspense>


    </div>
  )
}

export default AdminPage



