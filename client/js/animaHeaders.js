const headers = [];
for (let i = 0; i < 7; i++)
    headers.push(document.getElementById(`header-${i}`));
headers.forEach((header, i) => header.onclick = (ev) => {
        ev.target.children[0].classList.toggle('giù');
        tabelle[i].classList.toggle('giù');
    }
);