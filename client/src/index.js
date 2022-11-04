import { LogManager } from './managers/LogManager.js'
import { SocketManager } from './managers/SocketManager.js'

class AppSystem {

    constructor () {

        this.Managers = {
            Logs:   new LogManager( this ),
            Socket: new SocketManager( this )
        }

        this.buildWindowVars()

    }

    buildWindowVars () {

        window.createLog       = this.Managers.Logs.createLog
        window.createMethodLog = this.Managers.Logs.createMethodLog

    }

    async start () {

        await this.Managers.Socket.waitForConnection()

        document.body.querySelector( `page#liveboard form#board` )
            .addEventListener( 'submit', ( e ) => {

                e.preventDefault()

                this.Managers.Socket.Socket.emit( 
                    '[server] message room',
                    e.target.querySelector( 'input#input' ).value
                )

                e.target.querySelector( 'input#input' ).value = ''

            } )

    }

}

const App = new AppSystem()
App.start()