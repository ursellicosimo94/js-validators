import Assert from "./Assert"

export default class LessThan extends Assert{
    _message = "Il valore è troppo grande"
    
    #equal = false

    /**
     * Costruttore dell'assert
     * 
     * @param {any} value Valore di controllo, verrà usato per la verifica dell'assert.
     * @param {Function|any} output dove e come mostrare l'errore:
     *  - Function: invia l'errore ad una funzione
     *  - altro: non segnala alcun errore
     * @param {Boolean} equal Se true accetta valori uguali
     * @param {string} message Messaggio di errore per input non valido. Se non passato verrà usato "Valore non valido"
     */
    constructor( value = undefined, output = null, equal = true, message = undefined ){
        super(value, output,message)

        this.#equal = equal
        this._message = `Il valore deve essere minore ${equal ? 'o ugaule a' : 'di'} ${value}`
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

        this._error = this.#equal ? (value > this._value) : (value >= this._value)

        return super.resolve(value)
    }
}