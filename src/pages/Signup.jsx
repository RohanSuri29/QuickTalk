import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import apiconnector from "../utils/Apiconnector";
import { authEndpoints } from "../utils/Api";
import { UserContext } from "../context/Context";

function Signup() {

    const {reset , register , handleSubmit , formState:{errors , isSubmitSuccessful}} = useForm();
    const [showPassword , setShowPassword] = useState(false);
    const [showConfirmPassword , setShowConfirmPassword] = useState(false);
    const [loading , setLoading] = useState(false);
    const {setToken , setUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {

        if(isSubmitSuccessful){
            reset({
                firstName:"",
                lastName:"",
                email:"",
                password:"",
                confirmPassword:""
            })
        }

    } , [reset , isSubmitSuccessful])

    async function submitHandler(data) {
    
        setLoading(true);
        const toastId = toast.loading('Loading...');

        try{

            console.log(data)
            const response = await apiconnector('POST' , authEndpoints.User_signup_api , data);

            if(!response?.data?.success){
                throw new Error(response?.data?.message);
            }

            toast.success("Signed Up Successfully");

            localStorage.setItem('user' , JSON.stringify( response?.data?.user));
            localStorage.setItem('token' , JSON.stringify(response?.data?.token));
            setToken(response?.data?.token);
            setUser(response?.data?.user);
            navigate('/');
        }
        catch(error){
            console.error(error);
            toast.error("Unable to Signup")
        }

        setLoading(false);
        toast.dismiss(toastId);
    }

    return (

        <div className="h-screen w-screen sm:bg-[linear-gradient(135deg,_white_54.5%,_#1B8AF1_50%,_#B58DED_85%)] bg-[linear-gradient(120deg,_white_52%,_#1B8AF1_50%,_#B58DED_85%)] flex flex-col items-center">
            
            <div className="my-auto sm:w-[434px] w-[70%] h-fit rounded-2xl shadow-[0_4px_8px_rgba(0,_0,_0,_0.2)_,_0_6px_20px_0_rgba(0,_0,_0,_0.19)] bg-white ">

                <h2 className="font-bold font-mono sm:text-5xl text-3xl sm:mt-11 mt-4 sm:mb-5 text-center">Signup</h2>

                <form onSubmit={handleSubmit(submitHandler)} className="px-7 sm:py-7 py-5 flex flex-col sm:gap-6 gap-5">

                    <div className="flex gap-x-4">

                        {/* firstName */}
                        <div className="flex flex-col sm:gap-1.5">
                            <label htmlFor="firstName">
                                <p className="sm:text-lg text-sm font-medium font-inter">First Name</p>
                            </label>
                            <input className="rounded-xl lg:placeholder:text-lg placeholder:text-xs font-montserrat font-medium px-3 py-3 shadow-[0_0_10px_0_rgba(0,_0,_0,_0.2)] w-full text-sm sm:text-lg focus:outline-none text-center" type="text" id="firstName" name="firstName" placeholder="First Name" {...register('firstName' , {required:{value:true , message:"Please enter your first name"} , minLength:{value:3 , message:"First Name should have atleast 3 characters"}})} />
                            { errors.firstName && (<span className="-mt-1 text-xs -mb-3 text-red-600">{errors.firstName.message}</span>)}
                        </div>

                        {/* lastName */}
                        <div className="flex flex-col sm:gap-1.5">
                            <label htmlFor="lastName">
                                <p className="sm:text-lg text-sm font-medium font-inter">Last Name</p>
                            </label>
                            <input className="rounded-xl lg:placeholder:text-lg placeholder:text-xs font-montserrat font-medium text-center px-3 py-3 shadow-[0_0_10px_0_rgba(0,_0,_0,_0.2)] w-full sm:text-lg text-sm focus:outline-none" type="text" name="lastName" id="lastName" placeholder="Last Name" {...register("lastName" , {minLength:{value:3 , message:"Last Name should have atleast 3 characters"}})}/>
                            {errors.lastName && (<span className="-mt-1 text-xs -mb-3 text-red-600">{errors.lastName.message}</span>)}
                        </div>
                    </div>

                    {/* email */}
                    <div className="flex flex-col sm:gap-1.5">
                        <label htmlFor="email">
                            <p className="sm:text-lg text-sm font-medium font-inter">Email Address</p>
                        </label>
                        <input className="rounded-xl lg:placeholder:text-lg sm:placeholder:text-xs font-montserrat font-medium px-3 py-3 shadow-[0_0_10px_0_rgba(0,_0,_0,_0.2)] w-full text-sm sm:text-lg focus:outline-none text-center" type="email" name="email" id="email" placeholder="Enter Your Email Address" {...register('email' , {required:{value:true , message:"Please enter your email address"}})}/>
                        {errors.email && (<span  className="-mt-1 text-xs -mb-3 text-red-600">{errors.email.message}</span>)}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:gap-x-4 gap-3 sm:gap-0">

                        {/* password */}
                        <div className="flex flex-col sm:gap-1.5">
                            <label htmlFor="password">
                                <p className="text-sm sm:text-lg font-medium font-inter">Password</p>
                            </label>
                            <div className="relative flex gap-1 justify-center">
                                <input className="rounded-xl lg:placeholder:text-lg sm:placeholder:text-xs font-montserrat font-medium px-2 py-3 shadow-[0_0_10px_0_rgba(0,_0,_0,_0.2)] w-full sm:text-lg text-sm focus:outline-none" type={`${showPassword ? "text" : "password"}`} name="password" id="password" placeholder="Your Password" {...register('password' , {required:{value:true , message:"Please enter your password"} , minLength:{value:6 , message:"Password hould have minimum 6 characters"}})}/>
                                <span className="absolute right-3 top-[14px] cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>
                                    {showPassword ? <AiOutlineEyeInvisible fill="#AFB2BF" fontSize={23}/> : <AiOutlineEye fontSize={23} fill="#AFB2BF"/>}
                                </span>
                            </div>
                            {errors.password && (<span  className="-mt-1 text-xs -mb-3 text-red-600">{errors.password.message}</span>)}
                        </div>

                        {/* confirmPassword */}
                        <div className="flex flex-col sm:gap-1.5">
                            <label htmlFor="confirmPassword">
                                <p className="text-sm sm:text-lg font-medium font-inter">Confirm Password</p>
                            </label>
                            <div className="relative flex gap-1 justify-center">
                                <input className="rounded-xl lg:placeholder:text-lg sm:placeholder:text-xs font-montserrat font-medium px-2 py-3 shadow-[0_0_10px_0_rgba(0,_0,_0,_0.2)] w-full sm:text-lg text-sm focus:outline-none" type={`${showConfirmPassword ? "text" : "password"}`} name="confirmPassword" id="confirmPassword" placeholder="Your Password" {...register('confirmPassword' , {required:{value:true , message:"Please confirm your password"} , minLength:{value:6 , message:"Password should have minimum 6 characters"}})}/>
                                <span className="absolute right-3 top-[14px] cursor-pointer" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                                    {showConfirmPassword ? <AiOutlineEyeInvisible fontSize={23} fill="#AFB2BF"/> : <AiOutlineEye fontSize={23} fill="#AFB2BF"/>}
                                </span>
                            </div>
                            {errors.confirmPassword && (<span  className="-mt-1 text-xs -mb-3 text-red-600">{errors.confirmPassword.message}</span>)}
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="cursor-pointer rounded-full bg-[#B58DED] font-montserrat sm:text-xl text-lg font-medium sm:px-16 px-8 sm:py-3.5 py-2.5 w-fit mx-auto shadow-[0_4px_8px_rgba(181,_141,_237,_0.7)] mt-3 sm:mt-0">Signup</button>

                </form>
                
                <p className="text-center font-edu-sa text-lg mt-3 mb-2">Already have an account?<NavLink to={'/login'} className={'text-blue-700 font-inter underline font-medium text-sm'}>Login</NavLink></p>
            </div>

        </div>
    )
}

export default Signup