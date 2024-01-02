import Assert from "./Assert"

export default class IsDateTime extends Assert{
    _message = "Il valore deve essere un datetime valido"
    
    #strict = true

    static #regex = /^(([0-9]{4}\-((0[1-9])|(1[0-2]))\-(([0-2][0-9])|(3[0-1])))|(((0[1-9])|(1[0-2]))\-(([0-2][0-9])|(3[0-1]))\-[0-9]{4})|((([0-2][0-9])|(3[0-1]))\/((0[1-9])|(1[0-2]))\/[0-9]{4})) (([0-1][0-9])|(2[0-3])):[0-5][0-9](:[0-5][0-9])?$/

    /**
     * Costruttore dell'assert
     * 
     * @param {Function|any} output dove e come mostrare l'errore:
     *  - Function: invia l'errore ad una funzione
     *  - altro: non segnala alcun errore
     * @param {Boolean} strict Se true controlla che la data sia un oggetto date o uno che lo estende
     * @param {string} message Messaggio di errore per input non valido. Se non passato verrà usato "Valore non valido"
     */
    constructor( output = null, strict = true, message = undefined ){
        super(undefined, output,message)

        this.#strict = strict
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

        if(this.#strict){
            this._error = !(value.constructor.prototype instanceof Date)

            return super.resolve(value)
        }

        this._error = true
        if(
            value.constructor.prototype instanceof Date ||
            (
                typeof value === 'string' && 
                IsDateTime.#regex.exec(`${value}`)
            )
        ){
            this._error = false
        }

        return super.resolve(value)
    }
}