import Assert from "./Assert"

export default class Optional extends Assert{
    #asserts = []

    /**
     * Costruttore dell'assert
     * 
     * @param {Array} asserts Array degli assert che il campo deve rispettare
     * @param {Function|any} output dove e come mostrare l'errore:
     *  - Function: invia l'errore ad una funzione
     *  - altro: non segnala alcun errore
     * @param {string} message Messaggio di errore per input non valido. Se non passato verrà usato "Valore non valido"
     */
    constructor( asserts = [], output = null, message = undefined ){
        super(undefined, output, message)

        if(! (asserts instanceof Array) ){
            throw new Error('Gli assert devono essere un array di elementi')
        }

        // Controllo gli assert in modo da essere sicuro di non avere "intrusi"
        Optional._checkAssertCollection(asserts)

        this.#asserts = asserts
    }

    resolve(value){
        /* 
         * Per consentire valori null e undefined, da escludere eventualmente
         * con gli assert NotEmpty, NotUndefined e NotNull, se è uno
         * di questi valori allora salto il controllo considerando l'assert true
         */
        if([null, undefined].includes(value)){
            return super.resolve(value)
        }

        let check = true
        const errors = []

        if(this.#asserts.constructor.prototype instanceof Assert){
            return this.#asserts.resolve(value)
        }

        for(let i = 0; i < this.#asserts.length; i+=1){
            const assert = this.#asserts[i]
            const [assertCheck, assertError] = assert.resolve(value)

            if(assertCheck){
                errors.push(assertError)
                check = false
            }
        }

        return [!check, errors]

    }
}