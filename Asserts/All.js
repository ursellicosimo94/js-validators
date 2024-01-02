import Assert from "./Assert"

export default class All extends Assert{
    #asserts = []

    _message = 'Questo elemento dovrebbe essere un Array'

    /**
     * Costruttore dell'assert
     * 
     * @param {Array} asserts Array degli assert che il campo deve rispettare
     * @param {Function|any} output dove e come mostrare l'errore:
     *  - Function: invia l'errore ad una funzione
     *  - altro: non segnala alcun errore
     * @param {string} message Messaggio di errore per input non valido. Se non passato verrà usato "Valore non valido"
     */
    constructor( asserts = [], output = null, message = undefined, ){
        super(undefined, output, message)

        if(! (asserts instanceof Array) ){
            throw new Error('Gli assert devono essere un array di elementi')
        }

        // Controllo gli assert in modo da essere sicuro di non avere "intrusi"
        All._checkAssertCollection(asserts)

        this.#asserts = asserts
    }

    resolve(value){
        /* 
         * Per consentire valori null, da escludere eventualmente
         * con gli assert NotEmpty e NotNull, se è null
         * salto il controllo considerando l'assert true
         */
        if(value === null){
            return super.resolve(value)
        }

        let check = true
        let errors = []
        
        if(!(value instanceof Array)){
            this._error = true
            return super.resolve(value)
        }

        if(this.#asserts.constructor.prototype instanceof Assert){
            return this.#asserts.resolve(value)
        }

        for(let j=0; j<value.length; j+=1){
            const v = value[j]
            const valueErrors = []

            for(let i = 0; i < this.#asserts.length; i+=1){
                const assert = this.#asserts[i]

                const [assertCheck, assertError] = assert.resolve(v)

                if(assertCheck){
                    valueErrors.push(assertError)
                    check = false
                }
            }
            
            errors.push(valueErrors)
        }

        if(!check){
            errors = []
        }

        return [!check, errors]

    }
}