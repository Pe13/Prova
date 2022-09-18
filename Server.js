const fs = require('fs');

let tempAtt = 15;
let caldaiaOn;

/**
 * @type {Array<Array<Array<Number>>>}
 */
const programma = JSON.parse(require('programma.json'));
/**
 * @returns {Number}
 */
function tempDes() {
    const ora = new Date();
    return programma[ora.getDay()][ora.getHours()][Math.floor(ora.getMinutes()/5)];
}


const info = {
    tempAtt,
    tempDes: tempDes(),
    caldaiaOn,
    programma
};

// Inizializzo il socket;

const clients = [];
let caldaia;

io.sockets.on('connect', socekt => {

    socekt.on('disconnect', () => {
        if (socekt.caldaia) {
            console.warn('RELAY DISCONNESSO!');
            // Più altre misure di sicurezza
        } else {
            for (let i = clients.indexOf(socekt) + 1; i < clients.length; i++) 
                clients[i -1] = clients[i];
            clients.pop();
        }
    })

    socket.on('caldaia', risposta => {
        socekt.caldaia = risposta;
        risposta ? caldaia = socekt : clients.push(socekt);
    });
    socket.emit('?');

    socekt.emit('primo', )

});

function aggiornaClients() {
    for (const client of clients) {
        client.emit('aggiorna', {
            tempAtt,
            tempDes: tempDes(),
            caldaiaOn,
            programma
        });
    }
}

const mainLoop = setInterval(() => {
    const ora = new Date();
    if (programma[ora.getDay()][ora.getHours()][Math.floor(ora.getMinutes()/5)] > tempAtt) {
        caldaiaOn = true;
        aggiornaClients();
        caldaia.emit('on');
    } else {
        caldaiaOn = false;
        aggiornaClients();
        caldaia.emit('off');
    }
}, 60000);


