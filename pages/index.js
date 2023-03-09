import styles from '@/styles/Home.module.css'
import { useState,useEffect, useRef, use } from 'react'
import Head from 'next/head'
// import TeamBox from "../components/TeamBox"
import Layout from "../components/Layout"

import { useUser } from "@auth0/nextjs-auth0/client"
import {getSession} from "@auth0/nextjs-auth0"
import axios from "axios"

export const getServerSideProps = ({res,req}) => {
  const session = getSession(req, res)
  if (!session) return { props: {} }
  return { props: { token: session.accessToken }}
}

export default function Home({accessToken}) {
  const { user, isLoading } = useUser()
  const [classroom_tiles,setClassroom_tiles] = useState([])
  useEffect(()=>{
    if (user){
      //axios()  // checkProfile call with token 
    }
  },[user])

  return (
    <>
      <Layout>      
      </Layout>      
    </>
  )
}

