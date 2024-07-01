import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {Container, Typography, Button, TextField, Stack} from "@mui/material";

function App() {
  const [message, setMessage] = useState('')
  const [room, setRoom] = useState('')
  const [socketId, setSocketId] = useState('')
  const [messages, setMessages] = useState([])
  const [roomName, setRoomName] = useState('')
  const socket = useMemo(()=> io('http://localhost:3000'), [])

  const handleSubmit = (e) =>{
    e.preventDefault()
    socket.emit("message", {message, room})
    setMessage('')
    setRoom('')
  }
  
  const joinRoomHandler = () =>{
    e.preventDefault()
    socket.emit('join-rrom', roomName)
    setRoomName('')
  }

  useEffect(()=>{
    socket.on("connect", ()=>{
      setSocketId(socket.id)
      console.log('connected', socket.id)
    })

    socket.on("welcome", (msg)=>{
      console.log(msg)
    })

    socket.on("receive-message", (data)=>{
      console.log(data)
      setMessages((messages) => [...messages, data])
    })

    // return () =>{
    //   socket.disconnect()
    // }
  }, [])
  return (
    <Container maxWidth='sm'>
      <Typography variant="h6">{socketId}</Typography>
      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField value={roomName} onChange={e => setRoomName(e.target.value)} id='outlined-basic' label='Room Name' variant='outlined' />
        <Button type="submit" variant='contained' color="primary">Join</Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField value={message} onChange={e => setMessage(e.target.value)} id='outlined-basic' label='Message' variant='outlined' />
        <TextField value={room} onChange={e => setRoom(e.target.value)} id='outlined-basic' label='Room' variant='outlined' />
        <Button type="submit" variant='contained' color="primary">Send</Button>
      </form>
      <Stack>
        {
          messages.map((m,i)=>{
            <Typography key={i} variant="h6" component='div' gutterBottom>{m}</Typography>
          })
        }
      </Stack>
    </Container>
  );
}

export default App;
