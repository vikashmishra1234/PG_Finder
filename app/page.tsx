
import { loginUserAction, signUpUserAction } from "@/server/actions/auth.action";

export default function Home() {
  const signUp = async()=>{
     const user = await signUpUserAction({
      email:'vikashmishra@gmail.com',
      password:"Vikash@123",
      name:"vikash mishra",
      isPgOwner:false
     })
     console.log(user)
  }
  // signUp()
  const login = async()=>{
     const user = await loginUserAction({
      email:'vikashmishra@gmail.com',
      password:"Vikash@123",
   
     })
     console.log(user)
  }
  login()
  return (
    <div className="">
     hello
    </div>
  );
}
