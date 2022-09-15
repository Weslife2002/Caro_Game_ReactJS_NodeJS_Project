import express from "express";
import http from "http";
import cors from 'cors';
import index from './src/index.js';
import { Server } from "socket.io";
const port = process.env.PORT || 4001;

const app = express();
app.use(cors());

app.use(index);

var rooms =[{name:'room1', players: 0, gameData:[], xNext:true},
            {name:'room2', players: 0, gameData:[], xNext:true},
            {name:'room3', players: 0, gameData:[], xNext:true},
            {name:'room4', players: 0, gameData:[], xNext:true}];

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: "*",
    }
})

io.on("connection", (socket) => {
  let saveRoomIndex = -1;
  console.log("New client connected");

  socket.emit("room list", {rooms: rooms})

  socket.on("join room request", (data) =>{
    console.log(`Receive join room request to join room with index: ${data.roomIndex} with number of players: ${rooms[data.roomIndex].players}`  )
    if(rooms[data.roomIndex].players < 2){
      rooms[data.roomIndex].players += 1;
      socket.emit("join room request accepted", {roomIndex: data.roomIndex});
      saveRoomIndex = data.roomIndex;
      socket.join(rooms[saveRoomIndex].name);
      roomHandle(io, socket, saveRoomIndex);
    }
    else{
      socket.emit("room list", {rooms: rooms});
      socket.emit("join room request declined");
    }
  })

  socket.on("disconnect", () => {
    if(saveRoomIndex >= 0){
      rooms[saveRoomIndex].players -= 1;
      rooms[saveRoomIndex].gameData = [];
      rooms[saveRoomIndex].xNext = true;
      io.to(rooms[saveRoomIndex].name).emit("your opponent left")
    }
    console.log("Client disconnected");
  });

});

server.listen(port, ()=> console.log(`Listening on port ${port}`)); 

function roomHandle(io, socket, saveRoomIndex){
  for(let i = 0 ; i < 20; i++){
    rooms[saveRoomIndex].gameData.push(Array(20).fill(null));
  }
  if(rooms[saveRoomIndex].players == 1){
    socket.emit("please wait for another player");
  }
  else{
    io.to(rooms[saveRoomIndex].name).emit("you can start the game now");
  }

  socket.on("I go", (data) =>{
    console.log("received")
    io.to(rooms[saveRoomIndex].name).emit("update board", {row_index: data.row_index, cell_index: data.cell_index});
    if(rooms[saveRoomIndex].xNext){
      rooms[saveRoomIndex].gameData[data.cell_index][data.row_index] = 'x';
      if(checkWinner('x', data.row_index, data.cell_index, rooms[saveRoomIndex].gameData)){
        console.log("Game end")
        io.to(rooms[saveRoomIndex].name).emit("winner", {'winner':'x'});
      };
      rooms[saveRoomIndex].xNext = false;
    }
    else{
      rooms[saveRoomIndex].gameData[data.cell_index][data.row_index] = 'o';
      if(checkWinner('o', data.row_index, data.cell_index, rooms[saveRoomIndex].gameData)){
        console.log("Game end")
        io.to(rooms[saveRoomIndex].name).emit("winner", {'winner':'o'});
      }
      rooms[saveRoomIndex].xNext = true;
    }
  })
}

function checkWinner(value, row_index, cell_index, gameData){
  console.log(gameData)
  let result = false;
  let directions = [[0,1], [1,0], [1, 1], [1, -1]]
  directions.forEach(
      (direction)=>{
          let count = 1;
          // Follow the direction
          let current_row_index = row_index + direction[0];
          let current_cell_index = cell_index + direction[1];
          while(current_cell_index < 20 
              & current_cell_index >= 0 
              & current_row_index < 20 
              & current_row_index >= 0 ){
                if(gameData[current_cell_index][current_row_index] == value){
                  count += 1;
                  current_row_index += direction[0];
                  current_cell_index += direction[1];
                }
                else{
                  break;
                }  
              }
          // Go against the direction
          current_row_index = row_index - direction[0];
          current_cell_index = cell_index - direction[1];
          while(current_cell_index < 20 
              & current_cell_index >= 0 
              & current_row_index < 20 
              & current_row_index >= 0 ){
                if(gameData[current_cell_index][current_row_index] == value){
                  count += 1;
                  current_row_index -= direction[0];
                  current_cell_index -= direction[1];
                }
                else{
                  break;
                }
              }
          if(count >= 5){
              result = true;
          }
        console.log("Count :", count)
      }
  );
  return result;
}


