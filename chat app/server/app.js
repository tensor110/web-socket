import express from 'express'
import {createServer} from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const port = 3000

const app = express()
const server = createServer(app)
const io = new Server(server,{
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
})

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}))

app.get('/', (req, res)=>{
    res.send("Hello world")
})

const isLoggedIn = true
// middleware 
io.use((socket, next) =>{
    if(isLoggedIn) next()
})

io.on("connection", (socket) => {
    console.log("User connected, user id- ", socket.id)
    // socket.emit("welcome", "Welcome to the server")   //It gives message to all sockets
    // socket.broadcast.emit("welcome", "Welcome to the server")   //It gives message to all sockets without the current socket

    socket.on('message', ({room, message})=>{
        console.log({room, message})
        // io.emit('receive-message', message)   // To all users
        // io.broadcast.emit('receive-message', message)   // To all users expect sender
        io.to(room).emit('receive-message', message)
    })

    socket.on('join-room', (room)=> {
        socket.join(room)
    });

    socket.on('disconnect', ()=>{
        console.log("User disconnected")
    })
})

server.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})