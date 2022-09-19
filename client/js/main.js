const socket = io();

let MAX_TEMP;

const tempAttDiv = document.getElementById('tempAtt');
const tempDesDiv = document.getElementById('tempDes');
const statoCaldaiaDiv = document.getElementById('statoCaldaia');

const accendiBtn = document.getElementById('accendi');
const spegniBtn = document.getElementById('spegni');

const modificaBtn = document.getElementById('bottone-modifica');
const schedaModifica = document.getElementById('scheda-modifica');
const confermaBtn = document.getElementById('submit');
const daInput = document.getElementById('input-da');
const aInput = document.getElementById('input-a');
const gradiInput = document.getElementById('input-gradi');
/**
 * @type {HTMLInputElement[]}
 */
const checkBoxes = [];
for (let i = 0; i < 7; i++)
    checkBoxes.push(document.getElementById(`checkBox-${i}`));

/**
 * @type {HTMLDivElement[]}
 */
const tabelle = [];
for (let i = 0; i < 7; i++)
    tabelle.push(document.getElementById(`tabella-${i}`));

