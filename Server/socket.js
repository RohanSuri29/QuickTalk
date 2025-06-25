const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const Project = require('./models/project');
const User = require('./models/user');
const {GoogleGenerativeAI} = require('@google/generative-ai');
const Msges = require('./models/messages');
require('dotenv').config();


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({
    model:"gemini-1.5-flash",
    generationConfig:{
        responseMimeType:'application/json',
        temperature: 0.4
    },
    systemInstruction:`You are an expert in MERN and Development.You have an experience of 10 years in the development. You always write code 
        in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while
        maintaining the working of previous code. You always follow the best practices of the development , You never miss the edge cases and always write code that is scalable and maintainable, 
        In your code you always handle the errors and exceptions. Your response should always be in JSON with this structure:

        Never use file name like routes/index.js. Use meaningful names that reflect the file purpose (e.g., userRoutes.js)
    
        Examples: 
        
        <example>

        response:{
            "text": "Description of the generated project/code",
            "fileTree":{
                "fileName":{
                    file:{
                        contents:"Full file content here"    
                    },
                },
                "package.json":{
                    file:{
                        contents:"
                            {
                                "name": "temp-server",
                                "version": "1.0.0",
                                "main": "fileName",
                                "scripts": {
                                    "test": "echo \"Error: no test specified\" && exit 1"
                                },
                                "keywords": [],
                                "author": "",
                                "license": "ISC",
                                "description": "",
                                "dependencies": {
                                    "express": "^4.21.2"
                                }
                            }   
                        "
                    },
                },
            },
            "buildCommand":{
                mainItem: "npm",
                commands: ["install"]
            },
            "startCommand":{
                mainItem: "npm",
                commands: ["app.js"]
            }
        }

        </example>


        <example>

            user: "Create an express application"
            respone:{
                "text": "This is your fileTree for the express server.",
                "fileTree":{
                    "app.js":{
                        file:{
                            content:"
                                const express = require('express');
                                const app = express();

                                app.listen(3000 , () => {
                                    console.log("Your server is listening successfully at the port")
                                })

                                app.get('/' , (req,res) => {
                                    res.send("hello World!")
                                })
                            "
                        },
                    },
                    "package.json":{
                        file:{
                            content:"
                                {
                                    "name": "temp-server",
                                    "version": "1.0.0",
                                    "main": "app.js",
                                    "scripts": {
                                        "test": "echo \"Error: no test specified\" && exit 1"
                                    },
                                    "keywords": [],
                                    "author": "",
                                    "license": "ISC",
                                    "description": "",
                                    "dependencies": {
                                        "express": "^4.21.2"
                                    }
                                }
                            "
                        },
                    },
                },
                "buildCommand":{
                    mainItem:"npm",
                    commands:["install"]
                },

                "startCommand":{
                    mainItem:"node",
                    commands:["app.js"]
                }

            }

        </example>

        <example>

            user: "Hello Gemini"
            response:{
                "text": "Hi! How are You?"
            }

        </example>
    
    `
});


let io;

function initializeSocket (server) {

    //creating instance of io
    io = socketIo(server , {
        cors:{
            origin: "https://quick-talk-two.vercel.app",
            methods: ["GET" , "POST"]
        }
    })

    //creating a middleware to allow authenticated users to build connection
    io.use(async (socket , next) => {

        try{

            const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.replace('Bearer ' , '');
            const projectId = socket.handshake.query?.projectId;

            if(!token || !projectId){
                return next(new Error("Authentication failed"))
            }

            const decode = jwt.verify(token , process.env.JWT_SECRET);

            if(!decode){
                return next(new Error("Unable to decode the token to build connection with socket"))
            }

            socket.user = decode

            const project = await Project.findById(projectId);

            if(!project) {
                return next(new Error("Unable to find project"))
            }

            socket.project = project;

            next();
        }
        catch(error){
            next(error);
        }
    })

    //handling io connection
    io.on('connection' , (socket) => {

        console.log('New client connected:' , socket.id);
        
        socket.roomId = socket.project._id.toString();

        socket.join(socket.roomId);

        socket.on('project-message' , async (data) => {

            const message = data.message;

            const user = await User.findById(data.sender);

            const id = socket.project._id;
            
            await Msges.findOneAndUpdate({projectId:id} , {$push:{msges:{sender:user , message:message}}});

            socket.broadcast.to(socket.roomId).emit('project-message' , {sender:user , message:message});

            const aiPresent = message.includes('@ai');

            if(aiPresent){

                const prompt = message.replace('@ai ' , '');

                const result = await model.generateContent(prompt);

                const input = result.response.text();

                await Msges.findOneAndUpdate({projectId:id} , {$push:{msges:{sender:{_id:'ai' , firstName: 'AI'} , message:input}}} , {new:true});

                io.to(socket.roomId).emit('project-message' , {sender:{_id: 'ai' , firstName: 'AI'} , message:result.response.text()});

                return
            }
        })

        socket.on('disconnect' , () => {
            console.log("Client disconnected" , socket.id);
            socket.leave(socket.roomId);
        })
    })

}

module.exports = initializeSocket;
