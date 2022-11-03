import express from 'express'
import * as HTTP from 'http'
import * as SocketIO from 'socket.io'
import cors from 'cors'

const port = 3000

const App = express()
App.use( cors() )

const Server = HTTP.createServer( App )
const IO = new SocketIO.Server( Server, {
    cors: { origin: '*' },
} )

App.set( 'port', port )

IO.on( 'connection', ( socket ) => {

    console.log( `Socket connected [id: ${ socket.id } ]` )

    socket.emit( '[client] connected' )

    //

    socket.on( 'message', ( id, content ) => {

        console.log( `[${ id }] ${ content }` )

    } )

} )

Server.listen( port )