import React, { Component } from 'react';
import RoomSelector from './RoomSelector';
import GameBoard from './GameBoard';
import io from 'socket.io-client';

class Game extends Component{
   constructor(props){
      super(props);
      this.state = {
         screen: 'roomSelector',
         io: io('http://localhost:4001/'),
         rooms : [],
         current_room_index: -1,
         gameState : 'starting',
         gameData : [],
         role: 'o',
         xNext : true,
         winner: null,
      }
      this.joinRoom = this.joinRoom.bind(this);
      this.handleClick = this.handleClick.bind(this);
   }

   // When component is initialized
   componentDidMount(){
      this.state.io.on('connect', () =>{
         console.log("Connected to the server!")
      })
      this.state.io.on('room list', (data) => {
         this.setState({rooms: data.rooms});
      })
      this.state.io.on('join room request declined', ()=>{
         console.log('Room is full, sorry!')
      })
      this.state.io.on('join room request accepted', (data)=>{
         console.log("join room request accepted")
         this.setState({screen: 'gameBoard',
                        current_room_index: data.roomIndex,
                        gameData : this.gameDataInit()})
      })
      this.state.io.on('please wait for another player', () =>{
         console.log("please wait for another player")
         this.setState({gameState : 'waiting',
                        role: 'x'})
      })
      this.state.io.on('you can start the game now', ()=>{
         console.log("Game started!")
         this.setState({gameState: 'starting'})
      })
      this.state.io.on('update board', (data)=>{
         let newGameData = this.state.gameData.slice()
         console.log('update board received')
         if(this.state.xNext){
            newGameData[data.cell_index][data.row_index] = 'x';
            this.setState({xNext: !this.state.xNext,
                           gameData: newGameData
            })
         }
         else{
            newGameData[data.cell_index][data.row_index] = 'o';
            this.setState({xNext: !this.state.xNext,
                           gameData: newGameData
            })
         }
      })
      this.state.io.on('your opponent left', () =>{
         this.setState({xNext: true,
            gameData : this.gameDataInit(),
            role: 'x',
            winner: null})
      })

      this.state.io.on('winner', (data)=>{
         console.log("update winner!")
         this.setState({winner : data.winner})
      })
      
      this.state.io.on('disconnect', (data) =>{
         console.log('Server is down, sorry!')
      })
   }

   // Send join room request on click
   joinRoom(roomIndex){
      this.state.io.emit('join room request', {roomIndex: roomIndex});
   }

   // Init game data
   gameDataInit(){
      let initData = [];
      for (let i = 0; i< 20; i++){
         initData.push(Array(20).fill(null));
      }
      return initData;
   }

   // Send the move client chose
   handleClick(row_index, cell_index) {
      console.log(this.state)
      if(this.state.gameState == 'starting'
         & this.state.gameData[cell_index][row_index] == null 
         & this.state.winner == null 
         & (this.state.xNext & this.state.role == 'x' | !this.state.xNext & this.state.role == 'o')
         ){
         console.log("OK")

         this.state.io.emit("I go", {row_index: row_index, cell_index: cell_index})

      }
   }

   handleResign(){
      
   }

   handleReset(){
      this.state.io.emit()
   }

   render(){
      if(this.state.screen == 'roomSelector'){
         return <RoomSelector rooms = {this.state.rooms} joinRoom = {this.joinRoom}/>;
      }
      else if(this.state.screen == 'gameBoard'){
         return <GameBoard gameData = {this.state.gameData} handleClick = {this.handleClick}/>
      }
   }
}

export default Game;