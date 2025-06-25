import { useContext, useRef, useState } from "react"
import { UserContext } from "../../context/Context"
import { useNavigate } from "react-router-dom";
import { FaCaretDown } from "react-icons/fa";
import toast from "react-hot-toast";
import apiconnector from "../../utils/Apiconnector";
import { authEndpoints } from "../../utils/Api";
import ClickOutside from "../../hook/ClickOutside";

function Navbar () {

    const {token , user , setUser} = useContext(UserContext);
    const navigate = useNavigate();
    const [isOpen , setIsOpen] = useState(false);
    const [modalOpen , setIsModalOpen] = useState(false);
    const navRef = useRef(null);
    const fileInputRef = useRef(null);

    async function logoutHandler() {

        try{
            
            const response = await apiconnector("GET" , authEndpoints.User_logout_api , null, {Authorization:`Bearer ${token}`});

            if(!response?.data?.success){
                throw new Error(response?.data?.message)
            }

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
            toast.success("Logged Out Successfully");
        }
        catch(error) {
            console.error(error);
            toast.error("Unable to Logout")
        }
    }

    async function deleteHandler() {

        try{

            const response = await apiconnector("DELETE" , authEndpoints.User_deleteAccount_api , null , {Authorization:`Bearer ${token}`})
            
            if(!response?.data?.success){
                throw new Error(response?.data?.message)
            }

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/signup')
            toast.success("Account Deleted");
        }
        catch(error){
            console.error(error);
            toast.error("Unable to delete account")
        }
    }

    ClickOutside(navRef , () => setIsOpen(false));

    return (
        <>
            <div className="flex justify-between items-center px-4 py-3 sticky top-0 bg-gradient-to-r w-screen from-blue-500 via-indigo-500 to-purple-500">
                
                <p className="md:text-4xl text-2xl font-montserrat font-semibold">
                    QuickTalk
                </p>

                {
                    !token && (

                        <div className="flex gap-4">

                            <button onClick={() => navigate('/login')} className="rounded-full cursor-pointer text-xl font-inter font-semibold w-fit px-6 py-3 border-white border-2 bg-[#B58DED] hover:scale-110 hover:bg-white transition-all duration-300 ease-in-out">
                                Login
                            </button>

                            <button onClick={() => navigate('/signup')} className="cursor-pointer rounded-full text-xl font-inter font-semibold w-fit px-5 py-3 border-white border-2 bg-[#B58DED] hover:scale-110 hover:bg-white transition-all duration-300 ease-in-out">
                                SignUp
                            </button>

                        </div>
                    )
                }

                {
                    token && (

                        <div className="flex gap-2 items-center w-fit relative">

                            <img src={user?.image} className="aspect-square rounded-full grid place-items-center w-12 h-12" />

                            <FaCaretDown className="text-2xl text-slate-200" onClick={() => setIsOpen(true)}/>

                            {
                                isOpen && (

                                    <div ref={navRef} className="absolute top-16 right-1.5 rounded-lg bg-black/70 backdrop-blur-lg flex flex-col divide-y divide-slate-300">

                                        <button onClick={() => {setIsOpen(false) ; logoutHandler()}} className="px-5 py-4 text-lg font-medium rounded-lg font-inter text-center text-white hover:bg-slate-500 transition-all duration-300 ease-in-out">
                                            Logout
                                        </button>

                                        <button onClick={() => {setIsOpen(false) ; setIsModalOpen(true)}} className="px-2 py-3 rounded-lg text-lg font-inter text-center font-medium text-white hover:bg-slate-500 transition-all duration-300 ease-in-out">
                                            Delete
                                        </button>
                                    </div>
                                )
                            }

                        </div>
                    )
                }

            </div>
            {
                modalOpen && (

                    <div className="fixed inset-0 flex justify-center items-center w-full h-full bg-black/10 backdrop-blur-sm">

                        <div className="xl:w-1/3 md:w-[60%] w-[70%] rounded-lg bg-white flex flex-col gap-5 h-fit max-h-72 py-6 sm:px-8 px-5">

                            <h2 className="sm:text-5xl text-4xl font-bold font-montserrat">
                                Are You Sure?
                            </h2>

                            <p className="font-mono sm:text-lg text-sm font-semibold text-slate-800 leading-5 sm:leading-6">Deleting an account will permanently delete your data from the app and you won't be able to recover it.</p>

                            <div className="flex gap-4 ml-auto sm:mt-5 mt-2 pb-7">

                                <button onClick={() => setIsModalOpen(false)} className="sm:text-lg text-sm font-medium font-inter sm:px-7 sm:py-3 px-4 py-[0.6rem] rounded-full text-center w-fit cursor-pointer text-white bg-slate-400 hover:scale-105 transition-all duration-300 ease-in-out hover:bg-slate-700">Cancel</button>

                                <button onClick={() => {setIsModalOpen(false) ; deleteHandler()}} className="sm:text-lg text-sm font-medium font-inter sm:px-7 sm:py-4 px-4 py-[0.6rem] rounded-full text-center w-fit cursor-pointer text-white bg-red-600 hover:bg-pink-600 hover:scale-105 transition-all duration-300 ease-in-out">Delete</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Navbar