import * as HTTP from 'http'
import * as SocketIO from 'socket.io'
import cors from 'cors'
import express from 'express'
import { RoomManager } from './src/managers/RoomManager.js'
import { UserManager } from './src/managers/UserManager.js'
import * as UUG from 'unique-username-generator'

const port = 3000

const App = express()
App.use( cors() )

const Server = HTTP.createServer( App )
const IO = new SocketIO.Server( Server, {
    cors: { origin: '*' },
} )

App.set( 'port', port )

const Managers = {
    Rooms: new RoomManager( IO ),
    Users: new UserManager( IO ),
}

IO.on( 'connection', ( socket ) => {

    console.log( Managers.Rooms.Rooms )

    // create user based on socket **WILL ADD LOGIN FUNCTION LATER**

    Managers.Users.create( socket, {} )

    /**
     * If there is no one online on the website, and this socket is the first,
     * have them create the worldwide chat room.
     */

    if ( !Managers.Rooms.get( 'Worldwide' ) ) {

        Managers.Rooms.create( Managers.Users.get( socket.id ), 'Worldwide' )

    }

    // make socket automatically join worldwide chat room.

    Managers.Rooms.joinRoom( Managers.Users.get( socket.id ), 'Worldwide' )

    // send message to client about connection data

    socket.emit( '[client] connected' )

    // handles general room messages

    socket.on( '[server] message room', ( content ) => {

        if ( Managers.Users.get( socket.id ).isInRoom() ) {

            const ROOM = Managers.Rooms.get( Managers.Users.get( socket.id ).Room.name )
            ROOM.postMessage( Managers.Users.get( socket.id ), content )

        }

    } )

    // called when user disconnects

    socket.on('disconnect', () => {

        const USER = Managers.Users.get( socket.id )
        USER.leaveCurrentRoom()

        Managers.Users.remove( socket.id )

        console.log( `disconnected [${ socket.id }]` )

    } )

} )

Server.listen( port )