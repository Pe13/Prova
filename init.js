const fs = require('fs')

let programma = [];

(() => {
    programma = [];
    const ora = [];
    for (let i = 0; i < 12; i++) {
        ora.push(20);
    }
    const giorno = [];
    for (let i = 0; i < 24; i++) {
        giorno.push(ora);
    }  
    for (let i = 0; i < 7; i++) {
        programma.push(giorno);
    }

    fs.writeFileSync('programma.json', JSON.stringify(programma, null, 2));
})();