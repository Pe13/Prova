accendiBtn.onclick = () => socket.emit('forceOn');

spegniBtn.onclick = () => socket.emit('forceOff');

modificaBtn.onclick = () => schedaModifica.classList.toggle('show');

confermaBtn.onclick = () => {
    if (checkBoxes.every(el => !el.checked) || !daInput.value || !aInput.value || !gradiInput.value) return;
    if (
        [0,1,3,4].some(el => isNaN(parseInt(daInput.value[el]))) ||
        parseInt(daInput.value.slice(0, 2)) > 24 ||
        daInput.value[2] !== ':' ||
        parseInt(daInput.value.slice(3)) > 59
    ) {
        daInput.style.color = 'red';
        setTimeout(() => daInput.style.color = 'black', 2000);
        return;
    }
    if (
        [0,1,3,4].some(el => isNaN(parseInt(aInput.value[el]))) ||
        parseInt(aInput.value.slice(0, 2)) > 24 ||
        aInput.value[2] !== ':' ||
        parseInt(aInput.value.slice(3)) > 59
    ) {
        aInput.style.color = 'red';
        setTimeout(() => aInput.style.color = 'black', 2000);
        return;
    }
    if (
        [0,1].some(el => isNaN(parseInt(gradiInput.value[el]))) ||
        parseInt(gradiInput.value) > MAX_TEMP
    ) {
        gradiInput.style.color = 'red';
        setTimeout(() => gradiInput.style.color = 'black', 2000);
        return;
    }

    const da = {
        h: parseInt(daInput.value.slice(0, 2)),
        m: Math.floor(parseInt(daInput.value.slice(3)) / 5)
    }

    const a = {
        h: parseInt(aInput.value.slice(0, 2)),
        m: Math.floor(parseInt(aInput.value.slice(3)) / 5)
    }

    const checked = [];
    checkBoxes.forEach((el, i) => {
            if (el.checked) checked.push(i);
        }
    );

    socket.emit('cambia programma', {
        giorni: checked,
        da,
        a,
        temp: parseInt(gradiInput.value)
    });
}