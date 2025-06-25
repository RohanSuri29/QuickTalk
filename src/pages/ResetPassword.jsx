import { useState } from "react"
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import apiconnector from "../utils/Apiconnector";
import { authEndpoints } from "../utils/Api";

function ResetPassword() {

    const [formState , setFormState] = useState({newPassword:"" , confirmNewPassword:""});
    const [showPassword , setShowPassword] = useState(false);
    const [showConfirmPassword , setShowConfirmPassword] = useState(false);
    const [loading , setLoading] = useState(false);
    const {token} = useParams();
    const navigate = useNavigate();

    function changeHandler(event) {

        setFormState((prev) => (
            {
                ...prev,
                [event.target.name]: event.target.value
            }
        ))
    }

    async function submitHandler(event) {
        
        event.preventDefault();

        setLoading(true);
        const toastId = toast.loading('Loading...');

        const formData = {...formState , token};

        try{
            
            const response = await apiconnector("POST" , authEndpoints.User_resetPassword_api , formData);

            if(!response?.data?.success){
                throw new Error(response?.data?.message)
            }

            toast.success('Password Updated Successfully');
            navigate('/login')
        }
        catch(error){
            console.error(error);
            toast.error("Unable to Reset Password");
        }

        setLoading(false);
        toast.dismiss(toastId);
    }

    return (

        <div className="h-screen w-screen sm:bg-[linear-gradient(135deg,_white_54.5%,_#1B8AF1_50%,_#B58DED_85%)] bg-[linear-gradient(120deg,_white_52%,_#1B8AF1_50%,_#B58DED_85%)] flex flex-col items-center">
            
            <div className="my-auto sm:w-[570px] w-[70%] h-fit rounded-2xl shadow-[0_4px_8px_rgba(0,_0,_0,_0.2)_,_0_6px_20px_0_rgba(0,_0,_0,_0.19)] bg-white py-8 px-8 flex flex-col sm:gap-8 gap-4">

                <h2 className="font-bold font-mono sm:text-5xl text-3xl sm:mt-6 sm:mb-5 text-center">Choose new Password</h2>

                <p className="font-mono sm:text-lg text-sm font-semibold text-slate-800 leading-5 sm:leading-6 hidden sm:block">
                    Almost done. Enter your new password and youre all set.
                </p>

                <form onSubmit={submitHandler} className="flex flex-col gap-7">

                    {/* new Password */}
                    <div className="flex flex-col sm:gap-1.5">

                        <label htmlFor="newPassword">
                            <p className="sm:text-lg text-sm font-medium font-inter">New Password</p>
                        </label>
                        <div className="relative">
                            <input className="rounded-xl lg:placeholder:text-lg sm:placeholder:text-xs font-montserrat font-medium px-3 py-3 shadow-[0_0_10px_0_rgba(0,_0,_0,_0.2)] w-full text-sm sm:text-lg focus:outline-none"  type={`${showPassword ? "text" : "password"}`} name="newPassword" id="newPassword" placeholder="Enter Your Password" required value={formState.newPassword} onChange={changeHandler}/>
                            <span className="absolute right-3 sm:top-[14px] top-[10px] cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>
                                {showPassword ? <AiOutlineEyeInvisible fontSize={23} fill="#AFB2BF"/> : <AiOutlineEye fontSize={23} fill="#AFB2BF"/>}
                            </span>
                        </div>

                    </div>

                    {/* confirm New Password */}
                    <div className="flex flex-col sm:gap-1.5">

                        <label htmlFor="confirmNewPassword">
                            <p className="sm:text-lg text-sm font-medium font-inter">Confirm Password</p>
                        </label>
                        <div className="relative">
                            <input className="rounded-xl lg:placeholder:text-lg sm:placeholder:text-xs font-montserrat font-medium px-3 py-3 shadow-[0_0_10px_0_rgba(0,_0,_0,_0.2)] w-full text-sm sm:text-lg focus:outline-none"  type={`${showConfirmPassword ? "text" : "password"}`} name="confirmNewPassword" id="confirmNewPassword" placeholder="Enter Your Password" required value={formState.confirmNewPassword} onChange={changeHandler}/>
                            <span className="absolute right-3 sm:top-[14px] top-[10px] cursor-pointer" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                                {showConfirmPassword ? <AiOutlineEyeInvisible fontSize={23} fill="#AFB2BF"/> : <AiOutlineEye fontSize={23} fill="#AFB2BF"/>}
                            </span>
                        </div>

                    </div>
                    
                    <button type="submit" disabled={loading} className="cursor-pointer rounded-full bg-[#B58DED] font-montserrat sm:text-xl text-sm font-medium sm:px-10 px-8 sm:py-3.5 py-2.5 w-fit mx-auto shadow-[0_4px_8px_rgba(181,_141,_237,_0.7)]">
                        Reset Password
                    </button>

                </form>

                <NavLink to={'/login'}>
                    <p className="flex sm:gap-2 gap-1 items-center text-blue-700 sm:text-lg text-sm mt-3">
                        <BiArrowBack/> Back to Login
                    </p>
                </NavLink>
            </div>
        </div>
    )
}

export default ResetPassword