import * as Utils from '@nikolas.karinja/app-utils'

class Room {

    constructor ( io, name, user ) {

        this.name        = name
        this.storedChats = []
        this.uuid        = Utils.UUID.generate()

        this.IO    = io
        this.Users = new Utils.Storage.createStorageTable()

        this.join( user )

    }

    broadcastAll () {

        this.IO.to( this.name ).emit( ...arguments )

    }

    broadcast ( user, ...args ) {

        user.Socket.to( this.name ).emit( ...args )

    }

    async join ( user ) {

        console.log( this.storedChats )

        await user.Socket.join( this.name )

        user.Socket.emit( '[client] add stored chats to board', this.storedChats )

        this.Users.add( user )

    }

    leave ( user ) {

        user.Socket.leave( this.name )

        this.Users.remove( user.uuid ).byUUID()

    }

    postMessage ( user, content, data = {} ) {

        const timeDataString = Utils.Time.generateDataString()
        const userDataString = user.generateDataString()

        this.storeChat( timeDataString, userDataString, content, data )
        this.broadcastAll( '[client] message room', timeDataString, userDataString, content, data )

    }

    storeChat ( timeDataString, userDataString, content, data = {} ) {

        this.storedChats.push( [ timeDataString, userDataString, content, data ] )

    }

}

export { Room }