import NextAuth from "next-auth";
import axios from "axios";
import https from 'https';
import CredentialsProvider from "next-auth/providers/credentials";
import config from '../../../../config/config';


const agent = new https.Agent({  
  rejectUnauthorized: false
});

 const handler = NextAuth(
    { 
       secret: process.env.NEXTAUTH_SECRET, 
        session : {
            strategy: 'jwt'
        },
        pages: {
            signIn: '/login',
        },
        // Configure one or more authentication providers
        providers: [
              CredentialsProvider({
              //   credentials: {
              //     email: {},
              //     password: {}
              // },
              async authorize(credentials, req) {
                try {
                  let formData = new FormData();
                  formData.append('txtEmail', credentials.txtUserName);
                  formData.append('txtPassWord', credentials.txtPassWord);
                  const response  = await axios.post(config.LOGIN,formData,{
                    httpsAgent: agent
                  });
                  const userData = response.data?.root;
                  if(userData.status == '1' && userData.userId && userData.userName){
                    return{
                      id : userData.userId,
                      name : userData.userName
                    }
                  }else if(userData.status == '0'){
                    let errMsg = userData.message
                    throw new Error(userData.message);
                  }
                  return null;
                } catch (error) {
                  console.error("Login error:", error.message);
                  throw new Error(error.message); 
                }  
              }
          })
        ],
        callbacks: {
          async jwt({ token, user }) {
            if (user) {
              token.id = user.id;
            }
            return token;
          },
          async session({ session, token }) {
            if (token) {
              session.user.id = token.id;
            }
            return session;
          },
          async redirect(props) {
              const { baseUrl } = props;
              console.log("baseUrl",baseUrl);
              // let { url } = props;

          //     // const cleanedUpUrl = new URL(url);
          //     // console.log("cleanedUpUrl",cleanedUpUrl);
          //     // cleanedUpUrl.searchParams.delete("callbackUrl");
          //     // url = cleanedUpUrl.toString();
          //     // console.log("url-->",url);
          //     // // // Allows relative callback URLs
          //     // if (url.startsWith("/")) return `${baseUrl}${url}`
          //     // // // Allows callback URLs on the same origin
          //     // else if (new URL(url).origin === baseUrl) return url
              return `${baseUrl}/login`
          }
      },
    }
 )


export {handler as GET ,handler as POST};