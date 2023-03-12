import { useState,useEffect, useRef } from 'react'
import Layout from "../components/Layout"

import { useUser } from '@auth0/nextjs-auth0/client';
import {getSession } from "@auth0/nextjs-auth0"

export const getServerSideProps = async ({ req, res }) => {
  const url = "http://" + process.env.BACKEND_URI
  const session = await getSession(req,res)

  if(session==null){ 
    console.log("Early return")
    return ({ props: {} })
  }
  // console.log(session.accessToken)
  return ({ props: { token: session.accessToken, url: url}})
}

export default function Home({token,url}) {
  const { user, isLoading } = useUser()
  return (
    <>
      <Layout user={user} loading={isLoading}>      
          <div>
            {/* Testo di Federica! */}
          </div>
      </Layout>      
    </>
  )
}

// useEffect(()=>{
  //   if (user){
  //     axios({
  //       method: "get",
  //       url: url + "/user/saveProfile"  ,
  //       headers: { Authorization: "Bearer " + token }
  //     }).then((classes)=>{
  //       setClassroom_tiles([...classes])
  //     }).catch((err)=>{
  //       console.log("Errore in richiesta classi")
  //       console.log(err)
  //     })
  //      
  //   }
  // },[user])

