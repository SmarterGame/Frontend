import { getAccessToken } from '@auth0/nextjs-auth0';
import axios from "axios"

export default async function loginHandler(req, res) {

  const url = "http://" + process.env.BACKEND_URI + "/user/saveProfile"
  let token = await getAccessToken(req,res)
  token = "Bearer " + token.accessToken

  try{
    const result = await axios({
      method: "get",
      url: url,
      headers: {
        Authorization: token,
      },
    })

  }catch(error){
    console.log("Errore in ricerca utente")
  }
  res.writeHead(302, { Location: '/' })
  res.end();
}
