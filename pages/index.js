import { Component } from 'react'
import io from 'socket.io-client'
import { render } from 'react-dom'

class Test extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            hello: 'hi'
        }
    }
/*
    componentDidMount() {
        this.socket = io();
        this.socket.on('now', data => {
            this.setState({
                hello: data.message
            })
        });
    }
  */  
    render() {
        return (
            <div>
                <h1>{this.state.hello}</h1>
                <script src="//cdn.jsdelivr.net/npm/phaser@3.22.0/dist/phaser.js"></script>
                <script src="/socket.io/socket.io.js"></script>
                <script type='text/javascript' src='/static/game.js'></script>
            </div>
        )
    }
}

export default Test
