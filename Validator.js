import Assert from "./Assert/Assert"

export default class Validator{
    /**
     * @property {any} _value valori da validare
     */
    _value = undefined

    /**
     * @property {Assert|Collection} Collection di regole da applicare
     */
    _rules = undefined

    constructor(rules){
        if(! (rules.constructor.prototype instanceof Assert) ){
            throw new Error('Regole fornite non valide')
        }

        this._rules = rules
    }

    validate(value){
        return this._rules.resolve(value)
    }
}