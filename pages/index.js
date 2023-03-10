import { useState,useEffect, useRef } from 'react'
import Swal from "sweetalert2"
import TeamBox from "../components/TeamBox"
import Layout from "../components/Layout"

import { useUser } from '@auth0/nextjs-auth0/client';
import {getSession } from "@auth0/nextjs-auth0"
import axios from "axios"

export const getServerSideProps = ({ req, res }) => {
  const url = "http://" + process.env.BACKEND_URI
  const session = getSession(req,res)
  if(!session.hasOwnProperty("accessToken")) return ({ props: {} })
  return ({ props: { token: session.accessToken, url: url}})
}

export default function Home({token,url}) {
  const { user, isLoading } = useUser()
  const [classroom_tiles,setClassroom_tiles] = useState([])
  useEffect(()=>{
    if (user){
      axios({
        method: "get",
        url: url + "/user/checkProfile",
        headers: { Authorization: "Bearer " + token }
      }).then((back_profile)=>{
        setClassroom_tiles([...back_profile.Classes])
      })
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
      url: url + "/user/addClassroom/"+id,
      headers: { Authorization: "Bearer " + token }
    })
    setClassroom_tiles([...classroom_tiles,newClass]) 
  }
  
  return (
    <>
      <Layout user={user} loading={isLoading}>      
        {(classroom_tiles.lenght != 0) ? (
          <div>
            {/* Testo di Federica! */}
          </div>
          ):(
          <div className='flex-col items-center'>
            {classroom_tiles.map((element)=>{
              return <TeamBox classroomData={element}/>
            })}
          </div>
        )}
      </Layout>      
    </>
  )
}

