import { useState,useEffect, useRef, use } from 'react'
import Swal from "sweetalert2"
import TeamBox from "../components/TeamBox"
import Layout from "../components/Layout"

import { useUser } from "@auth0/nextjs-auth0/client"
import {getSession} from "@auth0/nextjs-auth0"
import axios from "axios"

export const getServerSideProps = ({res,req}) => {
  url = "https://" + process.env.BACKEND_URI
  const session = getSession(req, res)
  if (!session) return { props: {} }
  return { props: { token: session.accessToken, url: url}}
}



export default function Home({accessToken,url}) {
  const { user, isLoading } = useUser()
  const [classroom_tiles,setClassroom_tiles] = useState([])
  useEffect(()=>{
    if (user){
      //axios()  // checkProfile call with token 
    }
  },[user])

  // Handler for the TeamBoxes that uses almost everything 
  const addBoxHandler = async ()=>{
    const { value: id } = await Swal.fire({
      title: "Create a New Class",
      input: "text",
      inputPlaceholder: "Name the class",
      showCancelButton: true,
      closeOnCancel: true,
      confirmButtonColor: "#FFB900",
      cancelButtonColor: "#374151",
      confirmButtonText: 'Create',
    })
    const newClass  = await axios({
      method: "get",
      url: url + "/user/addBox/"+id,
      headers: { Authorization: "Bearer " + token }
    })
    setClassroom_tiles([...classroom_tiles,newClass]) 
    //if (id) router.push({ pathname: "/form", query: { draftID: id } })
  }
  
  return (
    <>
      <Layout user={user} loading={isLoading}>      
        Testo di prova Children 
      </Layout>      
    </>
  )
}

