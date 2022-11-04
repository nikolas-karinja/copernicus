import * as Utils from '@nikolas.karinja/app-utils'
import { Room } from '../Room.js'

class RoomManager {

    constructor ( io ) {

        this.IO = io
        this.Rooms = Utils.Storage.createStorageTable()

    }

    create ( user, name ) {

        this.Rooms.add( new Room( this.IO, name, user ) )

    }

    get ( name ) {

        return this.Rooms.get( name ).byName()

    }

    joinRoom ( user, name ) {

        const ROOM = this.Rooms.get( name ).byName()

        user.joinRoom( ROOM )

    }

    leaveRoom ( user, name ) {

        const ROOM = this.Rooms.get( name ).byName()

        user.leaveRoom( ROOM )

    }

}

export { RoomManager }