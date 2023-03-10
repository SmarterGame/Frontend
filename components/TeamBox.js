import {useRouter} from "next/router"
import { use } from "react"

const TeamBox = ({classroomData})=>{
  router = useRouter()
  return (
    <div>
      <button
        className=""
        onClick={()=>{
          router.push({
            pathname: "/gameSelection", // Non esiste ancora la pagina
            query: { ClassID: classroomData._id},
          })
        }}
      >
        <div className="flex justify-left gap-3">
          <p> {classroomData.ClassName} </p>
          <p> {classroomData.CreationDate} </p>
        </div>
      </button>
    </div>
  )
}
export default TeamBox
