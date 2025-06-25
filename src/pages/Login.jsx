import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import apiconnector from "../utils/Apiconnector";
import { authEndpoints } from "../utils/Api";
import { UserContext } from "../context/Context";

function Login() {

    const {reset , register , handleSubmit , formState:{errors , isSubmitSuccessful}} = useForm();
    const [showPassword , setShowPassword] = useState(false);
    const [loading , setLoading] = useState(false);
    const {setToken , setUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {

        if(isSubmitSuccessful){
            reset({
                email:"",
                password:""
            })
        }

    },[reset , isSubmitSuccessful])

    async function submitHandler(data) {

        setLoading(true);
        const toastId = toast.loading('Loading...')

        try{

            const response = await apiconnector('POST' , authEndpoints.User_login_api , data);

            if(!response?.data?.success){
                throw new Error(response?.data?.message)
            }

            toast.success('Logged In Successfully')

            localStorage.setItem('user' , JSON.stringify(response?.data?.user));
            localStorage.setItem('token' , JSON.stringify(response?.data?.token));
            setUser(response?.data?.user);
            setToken(response?.data?.token);
            navigate('/')
        }
        catch(error){
            console.error(error);
            toast.error("Unable to login")
        }

        setLoading(false);
        toast.dismiss(toastId)
    }

    return (

        <div className="h-screen w-screen sm:bg-[linear-gradient(135deg,_white_54.5%,_#1B8AF1_50%,_#B58DED_85%)] bg-[linear-gradient(120deg,_white_52%,_#1B8AF1_50%,_#B58DED_85%)] flex flex-col items-center">
            
            <div className="my-auto sm:w-[434px] w-[70%] h-fit rounded-2xl shadow-[0_4px_8px_rgba(0,_0,_0,_0.2)_,_0_6px_20px_0_rgba(0,_0,_0,_0.19)] bg-white ">

                <h2 className="font-bold font-mono sm:text-5xl text-3xl sm:mt-11 mt-4 sm:mb-5 text-center">Login</h2>

                <form onSubmit={handleSubmit(submitHandler)}  className="px-7 sm:py-7 py-5 flex flex-col sm:gap-6 gap-5">
                    
                    {/* email */}
                    <div className="flex flex-col sm:gap-1.5">
                        <label htmlFor="email">
                            <p className="sm:text-lg text-sm font-medium font-inter">Email Address</p>
                        </label>
                        <input className="rounded-xl lg:placeholder:text-lg sm:placeholder:text-xs font-montserrat font-medium px-3 py-3 shadow-[0_0_10px_0_rgba(0,_0,_0,_0.2)] w-full text-sm sm:text-lg focus:outline-none" type="email" name="email" id="email" placeholder="Enter Your Email" {...register('email' , {required:{value:true , message:"Please enter your email"}})}/>
                        {
                            errors.email && (<span className="-mt-1 text-[12px] text-red-600">{errors.email.message}</span>)
                        }
                    </div>

                    {/* password */}
                    <div className="flex flex-col sm:gap-1.5">
                        <label htmlFor="password">
                            <p className="sm:text-lg text-sm font-medium font-inter">Password</p>
                        </label>
                        <div className="relative">
                            <input className="rounded-xl lg:placeholder:text-lg sm:placeholder:text-xs font-montserrat font-medium px-3 py-3 shadow-[0_0_10px_0_rgba(0,_0,_0,_0.2)] w-full text-sm sm:text-lg focus:outline-none" type={`${showPassword ? "text" : "password"}`} name="password" id="password" placeholder="Enter Your Password" {...register('password' , {required:{value:true , message:"Please enter your password"} , minLength:{value:6 , message:"Password should have minimum 6 characters"}})}/>
                            <span className="absolute right-3 top-[14px] cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>
                                {showPassword ? <AiOutlineEyeInvisible fontSize={23} fill="#AFB2BF"/> : <AiOutlineEye fontSize={23} fill="#AFB2BF"/>}
                            </span>
                        </div>
                        {errors.password && (<span className="-mt-1 text-[12px] text-red-600">{errors.password.message}</span>)}
                    </div>

                    <NavLink to={'/forgot-password'}><p className="sm:text-[0.875rem] text-xs -mt-4 text-blue-600 text-left">Forgot Password</p></NavLink>

                    <button type="Submit" disabled={loading} className="cursor-pointer rounded-full bg-[#B58DED] font-montserrat sm:text-xl text-lg font-medium sm:px-16 px-8 sm:py-3.5 py-2.5 w-fit mx-auto shadow-[0_4px_8px_rgba(181,_141,_237,_0.7)]">Login</button>
                </form>

                <p className="text-center font-edu-sa text-lg mt-7 mb-2">Don't have an account?<NavLink to={'/signup'} className={'text-blue-700 font-inter underline font-medium text-sm'}>Signup</NavLink></p>
            </div>

        </div>
    )
}

export default Login