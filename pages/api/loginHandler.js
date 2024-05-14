import { getAccessToken } from '@auth0/nextjs-auth0';
import axios from "axios"

export default async function loginHandler(req, res) {

  const url = process.env.INTERNAL_BACKEND_URI + "/user/saveProfile"
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
    console.log(error);
  }
  res.writeHead(302, { Location: '/home' })
  res.end();
}
