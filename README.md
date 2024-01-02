# Validatori JS
Con questo progetto si vogliono semplificare e migliorare i controlli in JS.
Il sistema di validazione funziona in modo molto simile ai [validatori symfony](https://symfony.com/doc/current/validation.html).

## Utilizzo
Per integrare i validatori basta importare il file [Asserts.js](./Asserts.js) con l'istruzione:

```javascript
import {
    Validator,
    IsNumber
} from './Asserts.js'
```

Ovviamente è possibile importare tutte le classi degli assert desiderati.

Per effettuare le validazioni bisogna creare una "mappa" di regole (assert) e successivamente validare una struttura dati.

La mappa delle regole è un oggetto js dove le proprietà sono i campi validi e i valori sono regole o array di regole da applicare al campo. Ad esempio:

```javascript
// Dati da validare
const data = {
    nome:"Cosimo",
    altezza: 176,
};

// Mappa delle regole
const mappaRegole = {
    nome: [
        new IsString(),
        new NotEmpty()
    ],
    altezza: [
        new IsInt(),
        new NotEmpty(),
        new GreaterThan(0)
    ],
};

// Oggetto per le validazioni
const validatore = new Validator(mappaRegole)

/*
 * Risultati di validazione:
 *  - checkErrore sarà true se ci sono errori
 *  - errori sarà un oggetto contenente per ogni chiave l'array degli errori
 */
const [checkErrore, errori] = validatore.validate(data)
```

## Callback per assert fallito
Sebbene i risultati di validazione siano particolarmente efficaci se vogliamo (ad esempio) fornire una risposta dal back-end al front-end in un contesto server, sono davvero scomodi se abbiamo usato gli assert per validare un form lato front-end e vogliamo semplicemente mostrare l'errore.

In questo caso possiamo passare ad ogni validatore, una funzione per gestire l'errore (ad esempio mostrandolo in un div). La funzione potrà essere scritta in riga e riceverà semplicemente il messaggio dell'errore. Ad esempio:

```javascript
const fnErroreNome = function(message){
    const lblErroreNome = document.getElementById('lblErroreNome')

    if (message === ''){
        lblErroreNome.innerHTML('')
        return
    }

    lblErroreNome.innerHTML(lblErroreNome.innerHTML + '<br/>' + message)
};

const fnErroreAltezza = function(message){
    const lblErroreAltezza = document.getElementById('lblErroreAltezza')

    if (message === ''){
        lblErroreAltezza.innerHTML('')
        return
    }

    lblErroreAltezza.innerHTML(lblErroreAltezza.innerHTML + '<br/>' + message)
};

const data = {
    nome:"Cosimo",
    altezza: 176,
};

const errori = new Validator({
    nome: [
        new IsString(fnErroreNome),
        new NotEmpty(fnErroreNome)
    ],
    altezza: [
        new IsInt(fnErroreAltezza),
        new NotEmpty(fnErroreAltezza),
        new GreaterThan(0,fnErroreAltezza)
    ],
}).validate(data);
```

Quello che bisogna tenere presente è che la funzione verrà chiamata in due momenti:
 1. Alla creazione dell'assert (es. `new IsString(fnErroreNome)`) con un messaggio vuoto per "pulire" l'errore
 1. Alla validazione **SOLO** se si verifica l'errore

Ne consegue che è consogliabile creare funzioni che in caso in cui il messaggio sia vuoto puliscano la lable di errore, altrimenti accodino i vari errori.

## Lista di validatori
Di seguito una tabella con la lista dei validatori una descrizione e un riepilogo dei parametri del costruttore:

| Assert | Parametri | Descrizione |
|:-:|:-:|:-:|
| [Assert](./Asserts/Assert.js) | `value`: valore del confronto <br>`output`: callback di errore <br>`message`: messaggio di errore personalizzato | Classe da estendere per gli altri assert non effettua alcuna validazione |
| [All](./Asserts/All.js) | `asserts`: Lista degli assert che i valori devono rispettare <br>`output`: callback di errore <br>`message`: messaggio di errore personalizzato | Classe che valida un array di elementi con gli assert ricevuti |
| [Choice](./Asserts/Choice.js) | `choices`: Lista dei valori validi <br>`output`: callback di errore <br>`message`: messaggio di errore personalizzato | Questo assert controlla che il valore sia tra quelli possibili (scelte) |
| [Collection](./Asserts/Collection.js) | `asserts`: Oggetto di validatori, è possibile specificare un assert, un array di assert o una collection per ogni proprietà <br>`output`: callback di errore <br>`message`: messaggio di errore personalizzato | Controllo su più campi usando altri assert |
| [Email](./Asserts/Email.js) | `output`: callback di errore <br>`message`: messaggio di errore personalizzato | Valida una email |
| [Equal](./Asserts/Equal.js) | `value`: valore del confronto <br>`output`: callback di errore<br>`strict`: se true valida tipo e valore, altrimenti solo il valore <br>`message`: messaggio di errore personalizzato | Controlla che due valori siano uguali |
| [GreaterThan](./Asserts/GreaterThan.js) | `value`: valore del confronto <br>`output`: callback di errore <br>`equal`: se true consente valori uguali <br>`message`: messaggio di errore personalizzato | Controlla che il valore si maggiore di un valore fisso |
| [LessThan](./Asserts/LessThan.js) | `value`: valore del confronto <br>`output`: callback di errore <br>`equal`: se true consente valori uguali <br>`message`: messaggio di errore personalizzato | Controlla che il valore si minore di un valore fisso |
| [IsBool](./Asserts/IsBool.js) | `output`: callback di errore <br>`message`: messaggio di errore personalizzato | Controlla che il valore sia di tipo booleano |
| [IsDate](./Asserts/IsDate.js) | `output`: callback di errore <br>`strict`: bool se true indica che il valore deve essere un oggetto Date (o deve estenderlo)<br>`message`: messaggio di errore personalizzato | strict:true => oggetto Date o che lo estende, altrimenti una data in uno dei seguenti formati: <br>d/m/Y<br>m-d-Y<br>Y-m-d<br>[legenda simboli](#legenda-simboli-datetime) |
| [IsDateTime](./Asserts/IsDateTime.js) | `output`: callback di errore <br>`strict`: bool se true indica che il valore deve essere un oggetto Date (o deve estenderlo)<br>`message`: messaggio di errore personalizzato | strict:true => oggetto Date o che lo estende, altrimenti un datetime in uno dei seguenti formati: <br>d/m/Y H:i:s<br>m-d-Y H:i:s<br>Y-m-d H:i:s<br>(secondi opzionali) [legenda simboli](#legenda-simboli-datetime) |
| [IsFloat](./Asserts/IsFloat.js) | `output`: callback di errore <br>`strict`: se true il valore deve essere di tipo `number`<br>`message`: messaggio di errore personalizzato | Controlla se il numero ha la virgola se strict = false consente stringhe numeriche |
| [IsInt](./Asserts/IsInt.js) | `output`: callback di errore <br>`strict`: se true il valore deve essere di tipo `number`<br>`message`: messaggio di errore personalizzato | Controlla se il numero è intero se strict = false consente stringhe numeriche |
| [IsNumber](./Asserts/IsNumber.js) | `output`: callback di errore <br>`strict`: se true il valore deve essere di tipo `number`<br>`message`: messaggio di errore personalizzato | Controlla se il valore è un numero, se strict = false consente stringhe numeriche |
| [IsString](./Asserts/IsString.js) | `output`: callback di errore <br>`strict`: se true il valore deve essere di tipo `string`<br>`message`: messaggio di errore personalizzato | Controlla se il valore è una stringa, se strict = false accetta `number` |
| [NotEmpty](./Asserts/NotEmpty.js) | `output`: callback di errore <br>`message`: messaggio di errore personalizzato | Controlla che il valore sia [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) e non `undefined`, per array controlla che non siano vuoti e per oggetti controlla che sia presente almeno una proprietà |
| [NotNull](./Asserts/NotNull.js) | `output`: callback di errore <br>`message`: messaggio di errore personalizzato | Controlla che il valore sia diverso da `null` |
| [NotUndefined](./Asserts/NotUndefined.js) | `value`: valore del confronto <br>`output`: callback di errore <br>`message`: messaggio di errore personalizzato | Controlla che il valore sia diverso da undefined |
| [Optional](./Asserts/Optional.js) | `asserts`: regole da controllare se il campo è definito<br>`output`: callback di errore <br>`message`: messaggio di errore personalizzato | Questo assert non da mai errore, semplicemente controlla gli assert ricevuti se il valore è diverso da undefined |
| [RegExp](./Asserts/RegExp.js) | `regExp`: espressione regolare da verificare<br>`output`: callback di errore <br>`message`: messaggio di errore personalizzato | Ritorna il risultato dell'espressione regolare sul valore |
| [Url](./Asserts/Url.js) | `output`: callback di errore <br>`message`: messaggio di errore personalizzato | Verifica che il valore sia un url valido (parametri e http/https supportati) |

### Legenda simboli Datetime
 - d: giorno nel formato 2 cifre da 01 a 31
 - m: mese nel formato 2 cifre da 01 a 12
 - Y: anno nel formato 4 cifre da 0000 a 9999
 - H: ore nel formato 2 cifre da 00 a 23
 - i: minuti nel formato 2 cifre da 00 a 59
 - s: secondi nel formato 2 cifre da 00 a 59

## Creazione di assert custom
Per creare un assert custom è sufficiente **estendere la classe** `Assert` e seguire alcune regole di base:
 1. sovrascrivere la proprietà `_message` con l'errore che si vuole mostrare in caso di fallimento
 1. se necessario modificare il metodo `constructor` richiamando comunque sempre il costruttore di `Assert` passandogli almeno message e output (per alcuni assert value non è necessario, in questi casi passate `undefined` al costruttore di Assert)
 1. Nel metodo `resolve` modificare semplicemente `this._error` in base alle proprie esigenze e restituire il risultato del metodo `resolve` di `Assert` (es. `return super.resolve(value)`) per mostrare l'errore e rispettare l'interfaccia di comunicazione con altri assert.