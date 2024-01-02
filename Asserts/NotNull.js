import Assert from "./Assert"

export default class NotNull extends Assert{
    _message = "Il valore non può essere null"

    /**
     * Costruttore dell'assert
     * 
     * @param {Function|any} output dove e come mostrare l'errore:
     *  - Function: invia l'errore ad una funzione
     *  - altro: non segnala alcun errore
     * @param {Boolean} strict Se true controlla tipo, altrimenti controlla se il valore è trasformabile
     * @param {string} message Messaggio di errore per input non valido. Se non passato verrà usato "Valore non valido"
     */
    constructor( output = null, message = undefined ){
        super(undefined, output,message)
    }

    /**
     * Restituisce il flag errore e il messaggio e se l'assert è fallito mostra l'errore
     * @param {any} value Valore da controllare 
     * @returns {Array} Restituisce due elementi
     *  - error {boolean} true se l'assert è fallito, altrimenti false
     *  - message {string} messaggio di errore 
     */
    resolve(value){
        if( value === null ){
            this._error = true
        }

        return super.resolve(value)
    }
}