import { useState } from "react"
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import apiconnector from "../utils/Apiconnector";
import { authEndpoints } from "../utils/Api";

function ResetPasswordToken() {

    const [email , setEmail] = useState("");
    const [emailSent , setEmailSent] = useState(false);
    const [loading , setLoading] = useState(false);

    async function submitHandler(event) {
        
        event.preventDefault();

        setLoading(true);
        const toastId = toast.loading('Loading...');

        try{

            const response = await apiconnector("POST" , authEndpoints.User_resetPasswordToken_api , {email});

            if(!response?.data?.success){
                throw new Error(response?.data?.message)
            }

            toast.success('Email sent Successfully');
            setEmailSent(true);
        }
        catch(error){
            console.error(error);
            toast.error("Unable to send email")
        }

        setLoading(false);
        toast.dismiss(toastId);
    }

    return(

        <div className="h-screen w-screen sm:bg-[linear-gradient(135deg,_white_54.5%,_#1B8AF1_50%,_#B58DED_85%)] bg-[linear-gradient(120deg,_white_52%,_#1B8AF1_50%,_#B58DED_85%)] flex flex-col items-center">

            <div className="my-auto sm:w-[570px] w-[70%] h-fit rounded-2xl shadow-[0_4px_8px_rgba(0,_0,_0,_0.2)_,_0_6px_20px_0_rgba(0,_0,_0,_0.19)] bg-white p-8 flex flex-col sm:gap-4 gap-6">

                <h2 className="font-bold font-mono sm:text-5xl text-3xl sm:mt-11 sm:mb-5 text-center">
                    {!emailSent ? "Reset Your Password" : "Check Your Email"}
                </h2>

                <p className="font-mono sm:text-lg text-sm font-semibold text-slate-800 leading-5 sm:leading-6 hidden sm:block">
                    {
                        !emailSent ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery" : 
                        `We have sent the reset email to ${email}`
                    }
                </p>

                <form onSubmit={submitHandler} className="flex flex-col gap-8">
                    {
                        !emailSent && (

                            <div className="flex flex-col sm:gap-1.5 gap-0.5">
                                <label htmlFor="email">
                                    <p className="sm:text-lg text-sm font-medium font-inter ml-1">Email Address</p>
                                </label>
                                <input className="rounded-xl lg:placeholder:text-lg sm:placeholder:text-xs font-montserrat font-medium px-3 py-3 shadow-[0_0_10px_0_rgba(0,_0,_0,_0.2)] w-full text-sm sm:text-lg focus:outline-none" type="email" name="email" id="email" placeholder="Enter Your Email Address" required value={email} onChange={(event) => setEmail(event.target.value)}/>
                            </div>
                        )
                    }

                    <button type="Submit" disabled={loading} className="cursor-pointer rounded-full bg-[#B58DED] font-montserrat sm:text-xl text-sm font-medium sm:px-10 px-8 sm:py-3.5 py-2.5 w-fit mx-auto shadow-[0_4px_8px_rgba(181,_141,_237,_0.7)]">
                        {!emailSent ? "Reset Password" : "Resend Email"}
                    </button>
                </form>

                <div>

                    <NavLink to={'/login'}>
                        <p className="flex sm:gap-2 gap-1 items-center text-blue-700 sm:text-lg text-sm mt-3">
                            <BiArrowBack/> Back to Login
                        </p>
                    </NavLink>
                </div>

            </div>


        </div>
    )
}

export default ResetPasswordToken