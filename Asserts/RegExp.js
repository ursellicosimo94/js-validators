import Assert from "./Assert"

export default class RegExp extends Assert{
    /**
     * Costruttore dell'assert
     * 
     * @param {RegExp} regExp Espressione regolare per il controllo
     * @param {Function|any} output dove e come mostrare l'errore:
     *  - Function: invia l'errore ad una funzione
     *  - altro: non segnala alcun errore
     * @param {string} message Messaggio di errore per input non valido. Se non passato verrà usato "Valore non valido"
     */
    constructor( regExp = /^.*$/, output = null, message = undefined ){
        if( !(regExp instanceof RegExp) ){
            throw new Error('Espressione regolare non valida')
        }

        super(regExp, output,message)
    }

    /**
     * Restituisce il flag errore e il messaggio e se l'assert è fallito mostra l'errore
     * @param {any} value Valore da controllare 
     * @returns {Array} Restituisce due elementi
     *  - error {boolean} true se l'assert è fallito, altrimenti false
     *  - message {string} messaggio di errore 
     */
    resolve(value){
        /* 
         * Per consentire valori null, da escludere eventualmente
         * con gli assert NotEmpty e NotNull, se è null
         * salto il controllo considerando l'assert true
         */
        if(value === null){
            return super.resolve(value)
        }

        this._error = Boolean(this._value.exec(`${value}`))

        return super.resolve(value)
    }
}