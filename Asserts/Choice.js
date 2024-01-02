import Assert from "./Assert"

export default class Choice extends Assert{
    _message = "Il valore non è una scelta valida"

    /**
     * Costruttore dell'assert
     * 
     * @param {Function|any} output dove e come mostrare l'errore:
     *  - Function: invia l'errore ad una funzione
     *  - altro: non segnala alcun errore
     * @param {Boolean} strict Se true controlla tipo, altrimenti controlla se il valore è trasformabile
     * @param {string} message Messaggio di errore per input non valido. Se non passato verrà usato "Valore non valido"
     */
    constructor(choices = [], output = null, message = undefined ){
        if ( ! (choices instanceof Array) ){
            throw new Error('Le scelte devono essere di tipo Array')
        }
        super(choices, output,message)
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

        this._error = !this._value.includes(value)
        
        return super.resolve(value)
    }
}