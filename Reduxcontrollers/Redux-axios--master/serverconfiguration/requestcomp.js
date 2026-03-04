import axios from 'axios'
export async  function getRequest(url,controller)
{

   return await axios.get(url+controller)
   

}

export async function postRequest(url,controller,data)
 { 
  return await axios.post(url+controller,data)
 }