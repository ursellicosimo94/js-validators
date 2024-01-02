export default class Assert{
    _message = "Valore non valido"

    _value = undefined

    _output = undefined

    _error = false

    /**
     * Costruttore dell'assert
     * 
     * @param {any} value Valore di controllo, verrà usato per la verifica dell'assert.
     * @param {Function|any} output dove e come mostrare l'errore:
     *  - Function: invia l'errore ad una funzione
     *  - altro: non segnala alcun errore
     * @param {string} message Messaggio di errore per input non valido. Se non passato verrà usato "Valore non valido"
     */
    constructor( value = undefined, output = null, message = undefined ){
        this._value = value
        
        if( typeof message === 'string' ){
            this._message = message
        }

        if( output instanceof Function ){
            this._output = output 
            this.clearError()
        }
    }

    /**
     * Verifica che un oggetto o un array contengano solo assert
     * 
     * @param {Array|Object} collection Array o oggetto di assert
     */
    static _checkAssertCollection(collection){
        if(collection instanceof Array){
            for(let i = 0; i<collection.length; i+=1){
                if(!(collection[i].constructor.prototype instanceof Assert)){
                    throw new Error('Collezione di assert non valida!')
                }
            }
        }else if(!(collection.constructor.prototype instanceof Assert)){
            throw new Error('Collezione di assert non valida!')
        }
    }

    /**
     * Restituisce il flag errore e il messaggio e se l'assert è fallito mostra l'errore
     * @param {any} value Valore da controllare 
     * @returns {Array} Restituisce due elementi
     *  - error {boolean} true se l'assert è fallito, altrimenti false
     *  - message {string} messaggio di errore 
     */
    // eslint-disable-next-line no-unused-vars
    resolve(value){
        if(this._error){
            this.showError(this._message)
            return [this._error,this._message]
        }

        return [this._error,'']
    }

    /**
     * Mostra il messaggio di errore
     * @returns {null|undefined}
     */
    showError(){
        if(this._output instanceof Function){
            this._output(this._message)
        }
    }

    /**
     * Rimuove il messaggio di errore
     * @returns {null|undefined}
     */
    clearError(){
        if(this._output instanceof Function){
            this._output('')
        }
    }

    /**
     * Restituisce la stringa di errore per il campo
     * @returns {String} Messaggio di errore
     */
    getMessage(){
        return this._message
    }
}
