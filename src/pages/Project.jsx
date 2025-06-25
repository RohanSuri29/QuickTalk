import { useGSAP } from "@gsap/react";
import { useContext, useEffect, useRef, useState } from "react"
import { MdSend } from "react-icons/md"
import { NavLink, useLocation, useParams } from "react-router-dom"
import gsap from "gsap"
import { RiCloseFill, RiCloseLargeFill } from "react-icons/ri";
import apiconnector from "../utils/Apiconnector";
import { aiEndpoints, authEndpoints, projectEndpoints } from "../utils/Api";
import { UserContext } from "../context/Context";
import { HiUserAdd } from "react-icons/hi";
import { IoMdAdd, IoMdArrowBack } from "react-icons/io";
import toast from "react-hot-toast";
import { initializeSocket, recieveMessage, sendMessage } from "../config/Socket";
import Markdown from "markdown-to-jsx";
import 'highlight.js/styles/atom-one-dark.css';
import hljs from 'highlight.js';
import { IoCloseOutline, IoSparkles } from "react-icons/io5";
import { getWebContainer } from "../config/WebContainer";
import { FaPlay } from "react-icons/fa";
import { Editor } from "@monaco-editor/react";
import ClickOutside from "../hook/ClickOutside";

function Project() {

    const [isOpen , setIsOpen] = useState(false);
    const panelRef = useRef(null);
    const {token , user} = useContext(UserContext);
    const [users , setUsers] = useState([]);
    const [project , setProject] = useState({});
    const [loading , setLoading] = useState(false);
    const [selectedId , setSelectedId] = useState(new Set()); // a set is a collection that holds only unique value
    const [modalOpen , setModalOpen] = useState(false);
    const {projectId} = useParams();
    const [message , setMessage] = useState("");
    const [messages , setMessages] = useState([]);
    const messageRef = useRef();
    const [fileTree , setFileTree] = useState(null);
    const [openFiles , setOpenFiles] = useState(new Set());
    const [currentFile , setCurrentFile] = useState(null);
    const [webContainer , setWebContainer] = useState(null);
    const [iframeUrl , setIframeUrl] = useState(null);
    const [runProcess , setRunProcess] = useState(null);
    const [code , setCode] = useState("");
    const [aiResponse , setAiResponse] = useState("");
    const location = useLocation();

    useEffect(() => {

        async function getMessages() {
            
            try{

                const response = await apiconnector("POST" , projectEndpoints.Project_getMessages_api , {projectId} , {Authorization:`Bearer ${token}`})
                
                if(!response?.data?.success){
                    throw new Error(response?.data?.message)
                }

                setMessages(response?.data?.data);
            
            }
            catch(error){
                console.error(error);
                toast.error("Unable to get messages")
            }
        }

        getMessages()

    } , [location.pathname])

    useGSAP(() => {

        if(isOpen){
            gsap.to(panelRef.current , {
                translateX: 0,
            })
        }
        else{
            gsap.to(panelRef.current , {
                translateX: '-100%',

            })
        }
    } ,[isOpen])

    async function getAllUsers () {

        try{

            const response = await apiconnector('POST' , authEndpoints.User_getAllusers_api , {projectId} , {Authorization:`Bearer ${token}`});

            if(!response?.data?.success) {
                throw new Error(response?.data?.message)
            }

            setUsers(response?.data?.data)

        }
        catch(error){
            console.error(error);
        }
    }

    async function addUser () {

        setLoading(true);
        const toastId = toast.loading('Loading');

        try{

            const response = await apiconnector("POST" , projectEndpoints.Project_addUser_api , {projectId , users:Array.from(selectedId)} , {Authorization:`Bearer ${token}`})
        
            if(!response?.data?.success){
                throw new Error(response?.data?.message)
            }

            setProject(response?.data?.data);
            setModalOpen(false);
            toast.success("Collaborators added Successfully")
        }
        catch(error){
            console.error(error);
            toast.error("Unable to add collaborator")
        }

        toast.dismiss(toastId);
        setLoading(false)
    }

    async function getProject () {

        try{

            const response = await apiconnector("POST" , projectEndpoints.Project_getProject_api , {projectId} , {Authorization:`Bearer ${token}`});

            if(!response?.data?.success){
                throw new Error(response?.data?.message)
            }

            setProject(response?.data?.data)

        }
        catch(error){
            console.error(error);
        }
    }

    function handleClick(id) {

        setSelectedId((prev) => {

            const newSet = new Set(prev);

            if(newSet.has(id)){
                newSet.delete(id)
            }
            else{
                newSet.add(id)
            }

            return newSet;
        })
    }

    useEffect(() => {

        getProject();

        initializeSocket(token , projectId);

        if(!webContainer) {
            getWebContainer().then((container) => {setWebContainer(container)})
        }

        const cleanup = recieveMessage('project-message' , (data) => {

            if(data.sender._id === 'ai') {

                const message = JSON.parse(data.message);

                webContainer?.mount(message.fileTree);

                if(message.fileTree) {
                    setFileTree(message.fileTree);
                    setOpenFiles("");
                    setCurrentFile(null)
                }

                setMessages((prev) => [...prev , data])
            }
            else{
                setMessages((prev) => [...prev , data])
            }
        })

        return () => {

            if(typeof cleanup === 'function') {
                cleanup();
            }
        }

    } , [])

    function send() {
        sendMessage('project-message' , {
            message,
            sender: user?._id
        })

        setMessages(prev => [...prev , {sender:user , message}]);
        setMessage("")
    }

    function SyntaxHighlightedCode(props) {

        const ref = useRef(null)

        useEffect(() => {
            if (ref.current && props.className?.includes('lang-') && window.hljs) {
                window.hljs.highlightElement(ref.current)

                // hljs won't reprocess the element unless this attribute is removed
                ref.current.removeAttribute('data-highlighted')
            }
        }, [ props.className, props.children ])

        return <code {...props} ref={ref} />
    }

    function writeMessage(msg) {
        
        const msgObject = JSON?.parse(msg);
    
        return(

            <Markdown
                children={msgObject.text}
                options={{overrides:{code:SyntaxHighlightedCode}}}
            />
        )
    }

    function addFileHandler(file) {
        setCurrentFile(file);
        setOpenFiles((prev) => {

            const newSet = new Set(prev);

            newSet.add(file);

            return newSet
        })
    }

    function removeHandler (file) {

        setOpenFiles((prev) => {

            const newSet = new Set(prev);

            newSet.delete(file);

            return newSet
        })
    }

    function sendOnEnter(event) {

        if(event.key === 'Enter') {
            send();
        }
    }

    async function runHandler() {

        await webContainer?.mount(fileTree);

        const installProcess = await webContainer.spawn("npm" , ["install"]);

        installProcess.output.pipeTo(new WritableStream({

            write(chunk){
                console.log(chunk);
            }
        }))

        await installProcess.exit;

        if(runProcess){
            runProcess.kill();
        }

        const tempProcess = await webContainer.spawn("npm" , ["start"]);

        tempProcess.output.pipeTo(new WritableStream({
            write(chunk){
                console.log(chunk);
            }
        }))

        setRunProcess(tempProcess);

        webContainer.on('server-ready' , (port,url) => {
            setIframeUrl(url)
        })

    }

    async function saveFileTree(ft) {
        
        try{

            const response = await apiconnector("PUT" , projectEndpoints.Project_updateFileTree_api , {projectId , fileTree:ft} , {Authorization:`Bearer ${token}`});

            if(!response?.data?.success){
                throw new Error(response?.data?.message)
            }

        }
        catch(error){
            console.error(error)
        }
    }

    async function getResult () {

        try{

            const response = await apiconnector("POST" , aiEndpoints.Gemini_getResult_api , {code} ,  {Authorization:`Bearer ${token}`});

            if(!response?.data?.success){
                throw new Error(response?.data?.message)
            }

            setAiResponse(response?.data?.data);
        }
        catch(error){
            console.error(error);
            toast.error("Unable to get review from AI")
        }
    }

    ClickOutside(panelRef , () => setIsOpen(false));

    return (

        <div className="h-screen w-screen md:flex">

            {/* left part */}
            <section className={`h-screen md:min-w-60 md:max-w-[30%] w-screen flex flex-col relative overflow-auto ${aiResponse && "hidden"} ${iframeUrl && "hidden"}`}>

                <div className="sticky top-0 py-3 px-5 flex items-center justify-between w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">

                    <NavLink to={'/'} className="text-2xl font-montserrat font-semibold">QuickTalk</NavLink>

                    <button onClick={() => setIsOpen(true)} className="cursor-pointer text-2xl"><HiUserAdd/></button>
                </div>

                <div className="flex flex-col flex-grow w-full">

                    {/* messaging area */}
                    <div ref={messageRef} className="flex flex-grow flex-col p-4 gap-4 bg-slate-100 overflow-auto">

                        {
                            messages.map((msg , index) => (

                                <div key={index} className={`w-fit flex flex-col ${msg.sender?._id == user?._id.toString() ? "ml-auto" : ""}`}>
                                    
                                    <p className="text-xs font-mono">
                                        {msg.sender?.firstName}
                                    </p>

                                    <div className={`bg-white w-fit p-2 text-sm rounded-lg shadow-[0_0_3px_0_rgba(0,_0,_0,_0.2)] ${msg.sender._id === 'ai' ? 'max-w-72' : "max-w-52"}`}>
                                        {
                                            msg.sender._id === 'ai' ? writeMessage(msg.message) : <p>{msg.message}</p>
                                        }
                                    </div>

                                </div>
                            ))
                        }

                    </div>

                    {/* input field */}
                    <div className="flex w-full sticky bottom-0 bg-white">
                        <input className="text-[16px] px-3 py-3 font-inter w-[95%] font-medium outline-none border-t border-slate-300" type="text" placeholder="Enter Message" value={message} onKeyDown={sendOnEnter} onChange={(event) => setMessage(event.target.value)}/>
                        <button className="border-t border-slate-300 text-center text-lg w-[5%] bg-white" onClick={send}><MdSend/></button>
                    </div>
                </div>

                {/* side panel */}
                <div className={`${isOpen ? "backdrop-blur-xs absolute z-20 w-full h-screen" : ""}`}>

                    <div ref={panelRef} className="absolute w-[60%] -translate-x-full h-screen top-0 flex flex-col z-50 border bg-white border-slate-400">
                        
                        <div className="flex justify-between items-center bg-slate-300 px-3 py-3 shadow-[0_0_4px_0_rgba(0,_0,_0,_0.2)]">
                            
                            <h2 className="font-montserrat text-xl font-semibold">Collaborators</h2>
                            
                            <button onClick={() => setIsOpen(false)} className="font-medium text-lg cursor-pointer"><RiCloseLargeFill/></button>
                        </div>

                        <div className="flex flex-col gap-3 mt-4 w-full">
                            {
                                project?.users?.map((user) => (

                                    <div className="cursor-pointer p-2 hover:bg-slate-200 flex gap-4 items-center" key={user?._id}>
                                        
                                        <img src={user?.image} className="aspect-square rounded-full w-8 h-8 grid place-items-center object-fit"/>
                                        
                                        <p className="font-medium font-mono text-lg">{`${user?.firstName} ${user?.lastName}`}</p>
                                    </div>
                                ))
                            }

                        </div>

                        <button className="cursor-pointer flex gap-2 items-center ml-auto mr-2 mt-4 rounded-full w-fit px-3 text-sm py-3 font-montserrat font-medium bg-[#B58DED]" onClick={() => {setModalOpen(true) ; getAllUsers() ; setIsOpen(false)}}>
                            Add Collaborator
                            <IoMdAdd/>
                        </button>

                    </div>
                </div>

            </section>

            {/* right part */}
            {
                fileTree && (

                    <section className="flex flex-grow h-screen overflow-auto">
                
                        {/* explorer section */}
                        <div className="flex flex-col min-w-52 max-w-[25%] bg-slate-300 h-screen gap-4 sticky">
                    
                            <div className="px-3 py-[0.855rem] border-b flex gap-4">
                                <button onClick={() => setIframeUrl(null)} className={`${!iframeUrl && 'hidden'} text-xl hover:scale-110 transition-all duration-300`}><IoMdArrowBack/></button>
                                <p className="text-lg font-montserrat font-semibold text-left">
                                    Explorer
                                </p>
                            </div>

                            <div className="flex flex-col">
                                {
                                    Object.keys(fileTree).map((file , index) => ( // object.keys create an array of object's keys

                                        <button key={index} onClick={() => addFileHandler(file)} className={`px-3 py-2 cursor-pointer font-semibold font-montserrat text-left hover:bg-slate-400 ${currentFile === file ? "bg-slate-400" : ""}`}>
                                            {file}
                                        </button>
                                    ))
                                }
                            </div>

                            <button onClick={() => {setFileTree(null) ; setIframeUrl(null)}} className="rounded-full mt-auto mb-3 py-2 w-fit px-2 mx-auto text-lg font-medium font-montserrat cursor-pointer hover:scale-105 hover:text-white flex gap-2 justify-center items-center bg-[#B58DED] transition-all duration-300 ease-in-out">
                                Review with AI
                                <IoSparkles/>
                            </button>
                        </div>
                
                        {/* code editor */}
                        {
                            currentFile && (

                                <div className={`flex flex-col ${iframeUrl ? "max-w-[45%]" : "flex-grow"} h-screen`}>
                            
                                    {/* top */}
                                    <div className="flex justify-between sticky top-0 bg-slate-200">

                                        <div className="flex gap-2 w-fit p-2">
                                            {
                                                Array.from(openFiles).map((file , index) => (

                                                    <div key={index} onClick={() => setCurrentFile(file)} className={`px-2 py-2 font-medium font-montserrat text-[16px] cursor-pointer flex gap-1.5 items-center w-fit ${currentFile === file ? "scale-110 font-semibold" : ""}`}>
                                                        {file}
                                                        <button onClick={(event) => {event.stopPropagation ; removeHandler(file)}} className="cursor-pointer">
                                                            <IoCloseOutline/>
                                                        </button>
                                                    </div>
                                                ))
                                            }
                                        </div>

                                        <button onClick={runHandler} className="bg-green-500 px-4 py-2 font-mono font-semibold text-lg cursor-pointer flex gap-2 items-center">
                                            Run
                                            <FaPlay className="text-sm"/>
                                        </button>

                                    </div>

                                    {/* bottom */}
                                    <div className="overflow-auto w-full">
                                        {
                                            fileTree[currentFile] && (

                                                <Editor

                                                    height="100vh"
                                                    theme="vs-dark"
                                                    defaultLanguage="javascript"
                                                    value={fileTree[currentFile].file.contents}
                                                    onChange={(updatedContent) => {     
                                                        const ft = {
                                                            ...fileTree,
                                                            [ currentFile ]: {
                                                                file: {
                                                                    contents: updatedContent || ""
                                                                }
                                                            }
                                                        }
                                                        setFileTree(ft)
                                                        saveFileTree(ft)
                                                    }}
                                                    options={{
                                                        fontSize: 14,
                                                        minimap: { enabled: false },
                                                        wordWrap: 'on',
                                                        lineNumbers: 'on',
                                                        scrollBeyondLastLine: false,
                                                        automaticLayout: true,
                                                    }}
                                                />
                                    
                                            )
                                        }
                                    </div>

                                </div>
                            )
                        }

                        {
                            iframeUrl && webContainer && (

                                <div className="h-full w-full flex flex-col">

                                    <input type="text" value={iframeUrl} className="w-full p-6 bg-slate-200" onChange={(event) => setIframeUrl(event.target.value)}/>
                        
                                    <iframe src={iframeUrl} className="h-full w-full"></iframe>
                                </div>
                            )
                        }

                    </section>
                )
            }

            {
                !fileTree && (
                   
                    <section className="flex flex-grow h-screen overflow-auto">

                        <div className="flex flex-col flex-grow h-screen overflow-auto">

                            {/* top */}
                            <div className="flex justify-between items-center p-4 sticky top-0 bg-slate-200">

                                <button onClick={() => setAiResponse("")} className={`${!aiResponse && "hidden"} text-3xl cursor-pointer text-gray-500 hover:scale-110 hover:text-black`}>
                                    <IoMdArrowBack/>
                                </button>

                                <button onClick={getResult} className="ml-auto rounded-full px-3 py-3 text-xl font-medium font-montserrat cursor-pointer hover:scale-105 hover:text-white flex gap-2 items-center bg-[#B58DED] transition-all duration-300 ease-in-out">
                                    Review with AI
                                    <IoSparkles/>
                                </button>
                            </div>

                            {/* bottom */}
                            <div className="flex flex-grow overflow-auto w-full h-full relative">
                                
                                {
                                    code.trim() === "" && (
                                        <div className="absolute text-[#6A9955] font-inter z-10 pointer-events-none top-3 left-14">
                                            // ** Place Your Code Here **
                                        </div>
                                    )
                                }

                                <Editor

                                    height="100vh"
                                    defaultLanguage="javascript"
                                    value={code}
                                    theme="vs-dark"
                                    onChange={(value) => setCode(value)}
                                    options={{
                                        fontSize: 14,
                                        minimap: { enabled: false },
                                        wordWrap: 'on',
                                        lineNumbers: 'on',
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        padding:{top:16}
                                    }}
                                />
                            </div>

                        </div>

                        {
                            aiResponse && (

                                <div className="h-full min-w-[30%] max-w-[55%] overflow-auto p-5 bg-gradient-to-b from-slate-900 via-indigo-800 to-violet-700">

                                    <div className="h-fit w-fit bg-purple-200 rounded-2xl p-5">

                                        <Markdown options={{overrides:{code:SyntaxHighlightedCode}}}>{aiResponse}</Markdown>

                                    </div>                           
                                </div>
                            )
                        }

                    </section>
                )
            }

            {
                modalOpen && (

                    <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">

                        <div className="bg-white p-6 rounded-md shadow-md w-1/3 flex flex-col gap-8 max-h-96 overflow-auto">

                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold font-montserrat">Select Users</h2>
                                <button onClick={() => setModalOpen(false)} className="text-2xl -mt-1 cursor-pointer"><RiCloseFill/></button>
                            </div>

                            <div className="flex flex-col gap-2">
                                {
                                    users.map((user) => (
                                        
                                        <div key={user?._id} className={`cursor-pointer flex gap-4 rounded-full items-center hover:bg-slate-200 px-2 py-3 ${selectedId.has(user?._id) ? "bg-slate-200" : ""}`} onClick={() => handleClick(user?._id)}>

                                            <img src={user?.image} className="aspect-square rounded-full grid place-items-center w-7 h-7 object-fit"/>

                                            <h2 className="text-xl font-mono font-medium">{`${user?.firstName} ${user?.lastName}`}</h2>
                                        </div>
                                    ))
                                }
                            </div>

                            <button onClick={addUser} disabled={loading} className="cursor-pointer flex gap-2 items-center ml-auto rounded-full w-fit px-5 text-sm py-3 font-montserrat font-medium bg-[#B58DED]">
                                Add
                                <IoMdAdd/>
                            </button>
                        </div>

                    </div>
                )
            }
            
        </div>
    )
}

export default Project