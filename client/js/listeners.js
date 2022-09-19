/**
 * @param programma {number[][][]}
 */
function fillTables(programma) {

    for (const tabella of tabelle)
        tabella.replaceChildren();

    programma.forEach((giorno, i) => {
        tabelle[i].appendChild(document.createElement('div'))
        for (let m = 0; m < 12; m++) {
            const div = document.createElement('div');
            div.innerText = (m * 5).toString();
            tabelle[i].appendChild(div);
        }
        giorno.forEach((ora, j) => {
            const a = document.createElement('div');
            a.innerText = j.toString();
            tabelle[i].appendChild(a);
            ora.forEach((minuti) => {
                const div = document.createElement('div');
                div.innerText = minuti.toString();
                div.className = 'grid-element';
                tabelle[i].appendChild(div);
            });
        });
    });
}

socket.on ('?', () => {
    socket.emit('caldaia', false);
});

socket.on('aggiorna', data => {
    MAX_TEMP = data.MAX_TEMP;
    gradiInput.setAttribute('placeholder', `Max: ${data.MAX_TEMP}`);
    tempAttDiv.innerText = `Temperatura attuale: ${data.tempAtt}°C`;
    tempDesDiv.innerText = `Temperatura desiderata: ${data.tempDes}°C`;
    statoCaldaiaDiv.innerText = `Caldaia ${data.caldaiaOn ? 'Accesa' : 'Spenta'}`;
    data.forceOn ?
        accendiBtn.classList.add('on'):
        accendiBtn.classList.remove('on');
    data.forceOff ?
        spegniBtn.classList.add('on'):
        spegniBtn.classList.remove('on');
    fillTables(data.programma);
})