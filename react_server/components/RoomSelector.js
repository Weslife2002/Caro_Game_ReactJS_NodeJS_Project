import React, {Component} from 'react';
import css from './RoomSelector.css';
import caro_icon from '../public/caro_icon.png'

export default class RoomSelector extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className = "container">
                <p className='description'> Please Choose Your Room</p>
                <div className='rooms-container'>
                    {this.props.rooms.map((room, roomIndex) =>{
                        return <div key={room.name} className='room-container' onClick={() => this.props.joinRoom(roomIndex)}>
                                    <p className='room-name'>{room.name}</p>
                                    <img src={'../public/caro_icon.png'}/>
                                    <p className='room-description'>This room has {room.players} players</p>
                                </div>
                    })}
                </div>
            </div>
        );
    }
}

