const fs = require('fs');
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const PORT = 5689;

const MAX_TEMP = 22;
let tempAtt = 15;
let caldaiaOn;
let forceOn = false;
let forceOff = false;

/**
 * @type {Array<Array<Array<Number>>>}
 */
const programma = JSON.parse(fs.readFileSync('./programma.json'));
/**
 * @returns {Number}
 */
function tempDes() {
    const ora = new Date();
    return programma[ora.getDay()][ora.getHours()][Math.floor(ora.getMinutes()/5)];
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

server.listen(PORT, () => {
    console.log(`Server online sulla porta: ${PORT}`);
});

/**
 * @type {Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>[]}
 * */
const clients = [];
let caldaia;

io.sockets.on('connect', socket => {

    socket.on('disconnect', () => {
        if (socket.caldaia) {
            console.warn('RELAY DISCONNESSO!');
            // Più altre misure di sicurezza
        } else {
            for (let i = clients.indexOf(socket) + 1; i < clients.length; i++)
                clients[i -1] = clients[i];
            clients.pop();
        }
    })

    socket.on('caldaia', risposta => {
        socket.caldaia = risposta;
        risposta ? caldaia = socket : clients.push(socket);
    });

    socket.on('forceOn', () => {
        forceOff = false;
        forceOn = !forceOn;
        loop();
    });

    socket.on('forceOff', () => {
        forceOn = false;
        forceOff = !forceOff;
        loop();
    });

    socket.on('cambia programma', data => {
        for (const i of data.giorni) {
            const giorno = programma[i];
            const ore = [];
            for (let i = data.da.h; i < data.a.h + 1; i++)
                ore.push(i);
            if (ore.length > 1) {
                const minutiDa = [];
                for (let i = data.da.m; i < 12; i++)
                    minutiDa.push(i);
                const minutiA = [];
                for (let i = 0; i < data.a.m + 1; i++)
                    minutiA.push(i);
                let ora = ore.shift();
                for (const i of minutiDa)
                    giorno[ora][i] = data.temp;
                ora = ore.pop();
                for (const i of minutiA)
                    giorno[ora][i] = data.temp;
                for (const ora of ore)
                    for (const i of Array(12).keys())
                        giorno[ora][i] = data.temp;
            } else {
                const ora = ore[0];
                for (let i = data.da.m; i < data.a.m + 1; i++)
                    giorno[ora][i] = data.temp
            }
        }
        fs.writeFileSync('./programma.json', JSON.stringify(programma, null, 2));
    });

    socket.emit('?');

    socket.emit('aggiorna', {
        tempAtt,
        tempDes: tempDes(),
        MAX_TEMP,
        caldaiaOn,
        forceOff,
        forceOn,
        programma
    });
});

function aggiornaClients() {
    for (const client of clients) {
        client.emit('aggiorna', {
            tempAtt,
            tempDes: tempDes(),
            MAX_TEMP,
            caldaiaOn,
            forceOff,
            forceOn,
            programma
        });
    }
}

function aggiornaCaldaia() {
    if (caldaia) {
        caldaiaOn ?
            caldaia.emit('on'):
            caldaia.emit('off');
    } else {
        console.log('LA CALDAIA CONTINUA A NON RISPONDERE');
    }
}

function loop() {
    const ora = new Date();
    if (forceOn)
        caldaiaOn = true;
    else if (forceOff)
        caldaiaOn = false;
    else {
        if (programma[ora.getDay()][ora.getHours()][Math.floor(ora.getMinutes() / 5)] > tempAtt) {
            caldaiaOn = true;
        } else {
            caldaiaOn = false;
        }
    }
    aggiornaClients();
    aggiornaCaldaia();
}

setInterval(loop, 60000);


