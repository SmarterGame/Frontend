import { useState,useEffect} from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import {getSession } from "@auth0/nextjs-auth0"
import Layout from "../components/Layout"
import Swal from "sweetalert2"
import TeamBox from "../components/TeamBox"
import AddIcon from '@mui/icons-material/Add';
import axios from "axios"

export const getServerSideProps = async ({ req, res }) => {
  const url = "http://" + process.env.BACKEND_URI
  try{
    const session = await getSession(req,res)
    
    // EXIT if the session is null (Not Logged) 
    if(session==null){  
      console.log("Early return")
      return ({ props: {} })
    }
    
    // Fetch classrooms on Page Load 
    const token = "Bearer " + session.accessToken
    const tiles = await axios({
            method: "get",
            url: url + "/user/classrooms",
            headers: {
              Authorization: token,
            },
          })
    console.log(tiles.data)
    return ({ props: { token: session.accessToken, url: url, tiles:tiles.data}})

  }catch(err){
    console.log(err)
    return ({ props: {} })
  }
}

export default function Home({token,url,tiles}) {
  const { user, isLoading } = useUser()
  const [classroom_tiles,setClassroom_tiles] = useState([])
  useEffect(()=>{
    if (tiles){
      setClassroom_tiles([...tiles])
    }
  },[])
  
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
    if (newName){
      const newClass  = await axios({
        method: "get",
        url: url + "/user/addClassroom/" + newName,
        headers: { Authorization: "Bearer " + token }
      })
      setClassroom_tiles([...classroom_tiles,newClass.data]) 
    }
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
        <div className='flex-col items-center'>
          {classroom_tiles.map((element)=>{
            return <TeamBox key={element._id} classroomData={element} removeHandler={removeBoxHandler}/>
          })}
        </div>
        <div className="flex justify-center items-center">
          <button 
            className='rounded-full w-10 h-10 bg-orangeBtn'
            onClick={addBoxHandler}
            >
              <AddIcon/>
          </button>
        </div>
      </div>
    </Layout> 
  )
}
