import { useState,useEffect} from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import {getSession } from "@auth0/nextjs-auth0"
import Layout from "../components/Layout"
import Swal from "sweetalert2"
import TeamBox from "../components/TeamBox"
import axios from "axios"

export const getServerSideProps = async ({ req, res }) => {
  const url = "http://" + process.env.BACKEND_URI
  const session = await getSession(req,res)
  if(session==null){  // exit if the session is null (Not Logged) 
    console.log("Early return")
    return ({ props: {} })
  }
  // Fetch classrooms on Page Load 
  const tiles = await axios({
          method: "get",
          url: url + "/user/classrooms",
          headers: {
            Authorization: token,
          },
        })
  return ({ props: { token: session.accessToken, url: url, tiles:tiles}})
}

export default function Home({token,url,tiles}) {
  const { user, isLoading } = useUser()
  const [classroom_tiles,setClassroom_tiles] = useState([])
  if (tiles){
    setClassroom_tiles([...tiles])
  }
  
   // Handler for the TeamBoxes that uses almost everything 
  const addBoxHandler = async ()=>{
    const { value: newName} = await Swal.fire({
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
      url: url + "/user/addClassroom/" + newName,
      headers: { Authorization: "Bearer " + token }
    })
    setClassroom_tiles([...classroom_tiles,newClass]) 
  }
  
  const removeBoxHandler = async (id)=>{
    const newClass  = await axios({
      method: "get",
      url: url + "/user/removeClassroom/" + id,
      headers: { Authorization: "Bearer " + token }
    })
    let tileCopy = [...classroom_tiles],
        pos = tileCopy.findIndex((element) => element._id == id)
    tileCopy.splice(pos,1)
    setClassroom_tiles([...tileCopy]) 
  }

  return (
    <Layout user={user} loading={isLoading}>      
      <div className='flex-col items-center'>
        {classroom_tiles.map((element)=>{
          return <TeamBox key={element._id} classroomData={element} removeHandler={removeBoxHandler}/>
        })}
      </div>
    </Layout> 
  )
}
