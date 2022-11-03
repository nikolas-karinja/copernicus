import * as Utils from '@nikolas.karinja/app-utils'
import { Manager } from './Manager.js'

class Log {

    constructor ( manager, type, message, details = [] ) {

        this.details = details
        this.message = message
        this.name    = `log#${ manager.Logs.array.length }`
        this.type    = type // log, warn, error
        this.uuid    = Utils.UUID.generate()

        // log the message in the console

        this.write()

    }

    write () {

        console[ this.type ]( this.message, ...this.details )

    }

}

class LogManager extends Manager {

    constructor ( system ) {

        super( system )

        this.Logs = Utils.Storage.createStorageTable()

    }

    createLog ( type, message, details = [] ) {

        this.Logs.add( new Log( this, type, message, details ) )

    }

    createMethodLog ( type, methodParentName, methodName, message ) {

        message = `%c<${ methodParentName }.${ methodName }()> %c${ message }`

        this.Logs.add( new Log( this, type, message, [ 'color: cyan;', 'color: white;' ] ) )

    }

}

export { LogManager }