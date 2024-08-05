import axios from "axios";
import https from 'https';
import config from '../../../../config/config';

const agent = new https.Agent({  
  rejectUnauthorized: false
});
export async function POST(request) {
    try{
        const {userId, txtCPassword} = await request.json();
      console.log("userId",userId);
      console.log("txtCPassword",txtCPassword);
          // At request level
        const response  = await axios.post(`${config.CHANGE_PASSWORD}?userid=${userId}&txtPassWord=${txtCPassword}`,null,{
            httpsAgent: agent
        });
        console.log("response",response.data);
        return new Response(JSON.stringify(
            { message: 'success', result  : response.data}), {
              status: 200, 
          });
    }catch(err){
        console.log("errr->",err);
        return new Response(JSON.stringify(
            { message: 'faild',result : []}), {
              status: 500, 
          });
    }
}