import * as Utils from '@nikolas.karinja/app-utils'
import { io } from 'socket.io-client'
import { Manager } from './Manager.js'

class SocketManager extends Manager {

    constructor ( system ) {

        super( system )

        this.id = null

        this.Socket = io( 'ws://localhost:3000/' )

    }

    buildSocketEvents () {

        this.Socket.on( '[client] message room', ( timeData, userData, content, messageData ) => {

            this.postMessage( timeData, userData, content, messageData )

        } )

        this.Socket.on( '[client] add stored chats to board', ( storedChats ) => {

            for ( let i = 0; i < storedChats.length; i++ ) {

                if ( i > 0 ) {

                    const CUR_TIME_DATA = JSON.parse( storedChats[ i ][ 0 ] )
                    const PREV_TIME_DATA = JSON.parse( storedChats[ i - 1 ][ 0 ] )

                    const prevDate = `${ PREV_TIME_DATA.monthNumber }/${ PREV_TIME_DATA.dayOfMonth }/${ PREV_TIME_DATA.year }`
                    const curDate = `${ CUR_TIME_DATA.monthNumber }/${ CUR_TIME_DATA.dayOfMonth }/${ CUR_TIME_DATA.year }`

                    if ( curDate != prevDate ) this.postTimeStamp( CUR_TIME_DATA )

                } else {
                    
                    this.postStamp( 'Recorded chats begin here.' )
                    this.postTimeStamp( JSON.parse( storedChats[ i ][ 0 ] ) )

                }

                this.postMessage( ...storedChats[ i ] )

            }

            this.postStamp( 'Text below was created during your surrent session in this room.' )
            this.postTimeStamp( Utils.Time.generateData() )

        } )

    }

    getId () {

        if ( this.id ) {

            return this.id

        } else {

            this.System.Managers.Logs.createMethodLog( 'error', 'SocketManager', 'getId', `The user hasn't established connection yet.` )

            return

        }

    }

    postMessage ( timeData, userData, content, messageData ) {

        timeData = JSON.parse( timeData )
        userData = JSON.parse( userData )

        let message = `
            <div style='display: block; font-size: 16px;'>
                <div style='color: grey; display: inline; font-size: 12px;'>${ timeData.hour12 }:${ Utils.Time.convertToDouble( timeData.minutes ) } ${ timeData.ampm }</div>
                <div style='color: cyan; display: inline;'>${ userData.socketId == this.getId() ? '(You) [' : '[' }</div>
                <div style='color: ${ userData.cssColor }; display: inline;'>${ userData.username }</div>
                <div style='color: cyan; display: inline;'>]</div>
                <div style='color: white; display: inline;'>${ content }</div>
            </div>
        `

        document.body.querySelector( 'page#liveboard div#board' ).innerHTML += message

    }

    postStamp ( content ) {

        let message = `
            <div style='
                display: block; 
                font-size: 12px; 
                text-align: center;
                color: grey;
                width: 100%;
                height: 24px;
                line-height: 24px;
            '>${ content }</div>
        `

        document.body.querySelector( 'page#liveboard div#board' ).innerHTML += message

    }

    postTimeStamp ( timeData ) {

        let message = `
            <div style='
                display: block; 
                font-size: 12px; 
                text-align: center;
                color: grey;
                width: 100%;
                height: 24px;
                line-height: 24px;
            '>${ timeData.month } ${ timeData.dayOfMonth }, ${ timeData.year }</div>
        `

        document.body.querySelector( 'page#liveboard div#board' ).innerHTML += message

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

                this.buildSocketEvents()

                resolve()
            
            } )

        } )    

    }

}

export { SocketManager }