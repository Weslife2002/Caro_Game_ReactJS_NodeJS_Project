import React, { Component } from 'react';
import css from './GameBoard.css';

class Cell extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        { if (this.props.value == 'x'){
            return <div
            className='board-cell x-cell'
            key={'row' + this.props.cell_index + 'col' + this.props.row_index}
            onClick={() => { this.props.onClick(this.props.cell_index, this.props.row_index) }}>
            {this.props.value}
            </div>
        }
        else{
            return <div
            className='board-cell o-cell'
            key={'row' + this.props.cell_index + 'col' + this.props.row_index}
            onClick={() => { this.props.onClick(this.props.cell_index, this.props.row_index) }}>
            {this.props.value}
            </div>
        }
        }
    }
}
export default class GameBoard extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className='container'>
                <p className='description'> My Game Board</p>
                <div className='board-container'>
                    {this.props.gameData.map((row, row_index) => {
                        return <div className='board-row' key={'row' + row_index}>
                            {row.map((cell, cell_index) => {
                                return <Cell 
                                    key={`row${cell_index}cell${row_index}`} 
                                    value={cell} 
                                    row_index={row_index} cell_index={cell_index} 
                                    onClick={this.props.handleClick} 
                                />
                            })}
                        </div>
                    })}
                </div>
            </div>
        );
    }
};