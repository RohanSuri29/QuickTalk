import { useContext, useEffect, useState } from "react"
import toast from "react-hot-toast";
import { FaLink } from "react-icons/fa";
import apiconnector from "../utils/Apiconnector";
import { projectEndpoints } from "../utils/Api";
import { UserContext } from "../context/Context";
import { FaUserGroup } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ImBin2 } from "react-icons/im";
import Navbar from "../components/common/Navbar";

function Home() {

  const [modalOpen , setModalOpen] = useState(false);
  const [name , setName] = useState("");
  const [loading , setLoading] = useState(false);
  const [projects , setProjects] = useState([])
  const {token} = useContext(UserContext);
  const navigate = useNavigate();

  async function submitHandler(event){

    event.preventDefault();

    setLoading(true);
    const toastId = toast.loading('Loading...');

    try{

      const response = await apiconnector("POST" , projectEndpoints.Project_create_api , {name} , {Authorization:`Bearer ${token}`});

      if(!response?.data?.success){
        throw new Error(response?.data?.message)
      }

      toast.success("Project created Successfully");
      setName("");
      setModalOpen(false);
    }
    catch(error){
      console.error(error);
      toast.error("Unable to create project");
    }

    setLoading(false);
    toast.dismiss(toastId);
  }

  async function getAllProjects() {

    try{

      const response = await apiconnector('GET' , projectEndpoints.Project_getAllProjects_api , null ,  {Authorization:`Bearer ${token}`})
      
      if(!response?.data?.success){
        throw new Error(response?.data?.message)
      }
      
      setProjects(response?.data?.data);

    }
    catch(error){
      console.error(error);
      toast.error("Unable to get Projects")
    }
  }

  async function deleteHandler(projectId) {

    try{

      const response = await apiconnector("POST" , projectEndpoints.Project_deleteProject_api , {projectId} , {Authorization:`Bearer ${token}`})
    
      if(!response?.data?.success){
        throw new Error(response?.data?.message)
      }

      toast.success("Project Deleted Successfully");
      getAllProjects();
    }
    catch(error){
      console.error(error);
      toast.error("Unable to delete project")
    }
  }

  useEffect(() => {
    if(!modalOpen){
      getAllProjects();
    }
  } , [modalOpen])

  return (
    <>
      <div className="flex flex-col overflow-auto relative h-screen">

        <Navbar/>

        <div className="flex flex-wrap gap-5 mt-8 p-4 flex-grow w-screen">

          <button className="px-4 py-5 border bg-[#B58DED] border-slate-300 rounded-full flex gap-3 items-center font-inter font-medium cursor-pointer w-fit h-fit" onClick={() => setModalOpen(true)}>
            New Project <FaLink/>
          </button>  

          {
            projects.map((project) => (

              <div key={project?._id} onClick={() => navigate(`/project/${project?._id}`)} className="flex flex-col gap-2 cursor-pointer p-4 border border-slate-300 rounded-md min-w-52 hover:scale-110 ease-in-out duration-300 transition-all h-fit">
                
                <div className="flex justify-between items-center">

                  <h2 className="font-inter font-semibold">{project?.name}</h2>
                  <button onClick={(event) => {event.stopPropagation() ; deleteHandler(project?._id)}}>
                    <ImBin2 className="text-sm -mr-1"/>
                  </button>
                </div>

                <div className="flex gap-2 items-center">
                  <FaUserGroup/> 
                  <p className="text-sm font-inter">Collaborators:</p>
                  <p className="ml-auto">{project?.users.length}</p>
                </div>
              </div>
            ))
          }
        </div>

      </div>
      {
        modalOpen && (

          <div className="fixed inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm">

            <div className="bg-white p-6 rounded-md shadow-md sm:w-1/3 w-[70%] flex flex-col gap-4">

              <h2 className="text-[22px] mb-4 font-montserrat font-semibold">
                Create New Project
              </h2>

              <form onSubmit={submitHandler} className="flex flex-col gap-8">

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name">
                    <p className="text-sm font-medium font-inter">Project Name</p>
                  </label>
                  <input className="rounded-xl font-montserrat font-medium px-2 py-2 shadow-[0_0_10px_0_rgba(0,_0,_0,_0.2)] w-full text-sm focus:outline-none" type="text" name="name" id="name" placeholder="Enter Project Name" value={name} required onChange={(event) => setName(event.target.value)} />
                </div>

                <div className="flex gap-3 ml-auto">
                  <button className="cursor-pointer rounded-full bg-gray-300 font-montserrat text-sm font-medium px-3 py-2 w-fit" type="button" disabled={loading} onClick={() => setModalOpen(false)}>Cancel</button>
                  <button className="cursor-pointer rounded-full bg-[#B58DED] font-montserrat text-sm font-medium px-3 py-2 w-fit" type="submit" disabled={loading} >Create</button>
                </div>

              </form>
            </div>
              
          </div>
        )
      }
    </>
  )
}

export default Home