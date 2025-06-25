const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const http = require('http');
require('dotenv').config();
const initializeSocket = require('./socket');

//importing function to connect database
const dbConnect = require('./config/database');

//importing routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const geminiRoutes = require('./routes/geminiRoutes');

const app = express();
const server = http.createServer(app);

initializeSocket(server);

//activating server at port
const port = process.env.PORT || 4000;
server.listen(port , () => {
    console.log(`Your app is running successfully at the port number ${port}`);
})

//importing middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:"https://quick-talk-two.vercel.app"
}));

//mounting routes
app.use('/api/v1/auth' , authRoutes);
app.use('/api/v1/project' , projectRoutes);
app.use('/api/v1/ai' , geminiRoutes);

//default route
app.get('/' , (req , res) => {
    res.send("<h1> Hello World! </h1>")
})

dbConnect();