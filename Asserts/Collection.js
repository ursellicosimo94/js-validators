import Assert from "./Assert"

export default class Collection extends Assert{
    _message = 'Il valore non è un oggetto valido'

    _allowExtraFields = false

    /**
     * Costruttore per assert multi-campo per validare oggetti
     * 
     * @param {Object} asserts mappa degli assert {nome: [asserts], cognome: assert, skills: collection}
     * @param {Function} output funzione chiamata per gli assert falliti
     * @param {boolean} allowExtraFields se true consente e non valida campi extra
     * @param {string} message messaggio da mostrare in caso di assert falliti
     */
    constructor(asserts = {}, output = null, allowExtraFields = false, message = undefined){
        super(undefined, output, message)

        this._allowExtraFields = Boolean(allowExtraFields)

        Collection.#checkAsserts(asserts)

        this._asserts = asserts
    }

    /**
     * Controlla che ogni proprietà degli assert della collection siano a loro volta array di assert o collection
     * @param {Object} asserts oggetto dove ogni proprietà è il nome del campo atteso e ogni valore è una collection o un array di assert
     */
    static #checkAsserts(asserts = {}){
        const keys = Object.keys(asserts)

        for( let i = 0; i < keys.length; i+=1){
            Collection._checkAssertCollection(asserts[keys[i]])
        }
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

        const errors = {}
        let check = false
        const assertsKeys = Object.keys(this._asserts)

        if(! (value instanceof Object) ){
            throw new Error('Il valore non è un oggetto valido')
        }

        const valueKeys = Object.keys(value)

        // se non sono consentiti campi extra controllo se ce ne sono
        if( !this._allowExtraFields ){
            for(let i=0; i<valueKeys.length; i+=1){
                if( !assertsKeys.includes(valueKeys[i])){
                    errors[valueKeys[i]] = 'Questo campo non era atteso'
                    check = true
                }
            }
        }

        for(let i=0; i<assertsKeys.length; i+=1){
            let v
            const field = assertsKeys[i]
            const assert = this._asserts[field]
            let assertCheck = false
            let assertError

            if( valueKeys.includes(field)){
                v = value[field]
            }

            // Se si tratta di una collection/assert
            if(assert.constructor.prototype instanceof Assert){
                [assertCheck, assertError] = assert.resolve(v)


                if(assertCheck){
                    errors[field] = assertError
                    check = false
                }

                break
            }

            // Avendo validato nel costruttore sappiamo che se non è una
            // Collection/assert è un array di Assert
            for(let j=0; j<assert.length; j+=1){
                [assertCheck, assertError] = assert[j].resolve(v)


                if(assertCheck){
                    if(! (errors[field] instanceof Array)){
                        errors[field] = []
                    }

                    errors[field].push(assertError)
                    check = false
                }
            }
        }

        return [ !check, errors ]
    }
}