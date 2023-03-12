import { useState,useEffect, useRef } from 'react'
import Layout from "../components/Layout"
import Swal from "sweetalert2"
import TeamBox from "../components/TeamBox"
import axios from "axios"

export const getServerSideProps = async ({ req, res }) => {
  const url = "http://" + process.env.BACKEND_URI
  const session = await getSession(req,res)

  if(session==null){ 
    console.log("Early return")
    return ({ props: {} })
  }
  return ({ props: { token: session.accessToken, url: url}})
}

export default function Home({token,url}) {
  const { user, isLoading } = useUser()
  const [classroom_tiles,setClassroom_tiles] = useState([])
  
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

  return (
    <Layout user={user} loading={isLoading}>      
      <div className='flex-col items-center'>
        {classroom_tiles.map((element)=>{
          return <TeamBox key={element._id} classroomData={element}/>
        })}
      </div>
    </Layout> 
  )
}
