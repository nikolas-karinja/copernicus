import * as UUG from 'unique-username-generator'

class User {

    constructor ( io, socket, data ) {

        this.username = data.username ? data.username : UUG.generateUsername( '-', 3 )
        this.password = data.password ? data.password : '1234'

        this.name = this.username
        this.uuid = socket.id

        this.color = [ 
            Math.random() * 255, 
            Math.random() * 255, 
            Math.random() * 255 
        ]

        this.IO = io
        this.Room = null
        this.Socket = socket

    }

    broadcastToRoomAll () {

        this.Room.broadcastAll( ...arguments )

    }

    broadcastToRoom () {

        this.Room.broadcast( this, ...arguments )

    }

    generateDataString () {

        return JSON.stringify( {
            username: this.username,
            socketId: this.uuid,
            cssColor: this.getColorForCSS(),
        } )

    }

    getColorForCSS () {

        return `rgb( ${ this.color[ 0 ] }, ${ this.color[ 1 ] }, ${ this.color[ 2 ] } )`

    }

    isInRoom () {

        if ( this.Room != null ) return true
        else return false

    }

    joinRoom ( room ) {

        this.leaveCurrentRoom()

        this.Room = room
        this.Room.join( this )

    }

    leaveRoom ( room ) {

        if ( this.Room.uuid == room.uuid ) this.leaveCurrentRoom()
        else room.leave( this )

    }

    leaveCurrentRoom () {

        if ( this.Room ) {

            this.Room.leave( this )
            this.Room = null

        }

    }

}

export { User }