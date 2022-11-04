import * as Utils from '@nikolas.karinja/app-utils'
import { User } from '../User.js'

class UserManager {

    constructor ( io ) {

        this.IO = io
        this.Users = Utils.Storage.createStorageTable()

    }

    create ( socket, data ) {

        this.Users.add( new User( this.IO, socket, data ) )

    }

    get ( socketId ) {

        return this.Users.get( socketId ).byUUID()

    }

    remove ( socketId ) {

        return this.Users.remove( socketId ).byUUID()

    }

}

export { UserManager }