import { io } from 'socket.io-client'
import { Manager } from './Manager.js'

class SocketManager extends Manager {

    constructor ( system ) {

        super( system )

        this.id = null

        this.Socket = io( 'ws://localhost:3000/' )

    }

    getId () {

        if ( this.id ) {

            return this.id

        } else {

            this.System.Managers.Logs.createMethodLog( 'error', 'SocketManager', 'getId', `The user hasn't established connection yet.` )

            return

        }

    }

    waitForConnection () {

        return new Promise( ( resolve ) => {

            const begin = performance.now()

            this.Socket.on( '[client] connected', () => {

                this.id = this.Socket.id

                this.System.Managers.Logs.createLog( 
                    'log', `You %c(socket-id: %c${ this.getId() }%c) %care now connected.`,
                    [ 'color: cyan;', 'color: limegreen;', 'color: cyan;', 'color: white;' ]
                )

                const end = performance.now()

                this.System.Managers.Logs.createLog( 
                    'log', `It took around %c${ Math.round( end - begin ) }%cms %cfor you to connect.`,
                    [ 'color: magenta;', 'color: cyan;', 'color: white;' ]
                )

                resolve()
            
            } )

        } )    

    }

}

export { SocketManager }