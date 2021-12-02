
//istanzio l'array che servirà a contenere tutti gli human della simulazione
var people = new Array();

let intervalMovement;
var stopSimulation = false;

var startInfect;
var startWithMask;
var startVaccinated;
var momentInfect;
var vaccinatedInfected = 0;
var withMaskInfected = 0;
var velocita = 100;

//metodo che crea gli umani definiti in quantità
function createHuman(numTot, numInfect, numWithMask, numVaccinated){
    if(numInfect + numVaccinated + numWithMask <= numTot){
        startInfect = numInfect;
        startWithMask = numWithMask;
        startVaccinated = numVaccinated;
        momentInfect = startInfect;
        for(var i = 0; i < numInfect; i++){
            people.push(new Human(false,false,true,i));
            console.log("creato infetto");
            people[people.length - 1].print();
        }
        for(var i = numInfect; i < numVaccinated+numInfect; i++){
            people.push(new Human(true,false,false,i));
            console.log("creato vaccinato");
            people[people.length - 1].print();
        }
        for(var i = numVaccinated+numInfect; i < numWithMask+numVaccinated+numInfect; i++){
            people.push(new Human(false,true,false,i));
            console.log("creato mascherina");
            people[people.length - 1].print();
        }
        for(var i = numWithMask+numVaccinated+numInfect; i < numTot; i++){
            people.push(new Human(false,false,false,i));
            console.log("creato persona");
            people[people.length - 1].print();
        }
        stopSimulation = false;
    }else{
        console.log(numInfect + numVaccinated + numWithMask + " > di " + numTot);
    }
}

function startMovementInterval(){
    if(stopSimulation){
        readInput();
    }
    //il metodo invoca 10 volte al secondo il metodo moveEveryOne
    intervalMovement = setInterval(moveEveryOne, velocita);
    document.getElementById("start").disabled = true;
    document.getElementById("pause").disabled = false;
    document.getElementById("stop").disabled = false;
    console.log("start");
    window.sessionStorage.setItem('stato', 'start');
}

function pauseMovementInterval(){
    clearInterval(intervalMovement);
    document.getElementById("start").disabled = false;
    document.getElementById("pause").disabled = true;
    document.getElementById("stop").disabled = true;
    console.log("pause");
    window.sessionStorage.setItem('stato', 'pause');
}

function stop(){
    stopSimulation = true;
    console.log("stop");
}

//funzione che serve a invocare il metodo degli umani che gli permette di muoversi
function moveEveryOne(){
    var canvas = document.getElementById("container");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 600, 500);
    ctx.stroke();
    if(stopSimulation){
        clearInterval(intervalMovement);
        people = null;
        people = new Array();
        document.getElementById("start").disabled = false;
        document.getElementById("pause").disabled = true;
        document.getElementById("stop").disabled = true;
        //document.getElementById("createHuman").disabled = false;
        ctx.clearRect(0, 0, 600, 500);
        window.sessionStorage.setItem('stato', 'stop');
    }else{
        if(document.getElementById("container") != null){
            for(var i = 0;i < people.length;i++){
                people[i].casual_move();
            }
            infectionControl();
        }
    }
}

//funzione che legge gli input della pagina e crea il numero corretto di persone
function readInput(){
    var numTot = document.getElementById("totHuman").value;
    if(numTot < 10){
        document.getElementById("totHuman").value = 10;
        numTot = document.getElementById("totHuman").value;
    }else if(numTot > 400){
        document.getElementById("totHuman").value = 400;
        numTot = document.getElementById("totHuman").value;
    }
    window.sessionStorage.setItem('stato', 'pause');
    
    var numInfect = Math.round(numTot/100*document.getElementById("contagiati").value);
    var numWithMask = Math.round(numTot/100*document.getElementById("conMascherina").value);
    var numVaccinated = Math.round(numTot/100*document.getElementById("vaccinati").value);

    //document.getElementById("createHuman").disabled = true;
    createHuman(numTot,numInfect,numWithMask,numVaccinated);
}

//controlla che i valori degli slider siano reali(meno del 100% totale)
function checkSliderValue(id){
    var numInfect = Number(document.getElementById("contagiati").value);
    var numWithMask = Number(document.getElementById("conMascherina").value);
    var numVaccinated = Number(document.getElementById("vaccinati").value);

    if(numInfect+numWithMask+numVaccinated>100){
        document.getElementById(id).value = document.getElementById(id).value-1;
        checkSliderValue(id);
    }
    printSliderValue(id);
}

// stampa i valori degli slider
function printSliderValue(id){
    document.getElementById("p"+id).innerHTML = document.getElementById(id).value+"%";
}

//se i checkbox sono attivi vengono abilitati i campi dei 
//vaccinati e di quelli che indossano la mascherina
function implementCheckBoxes(idCheck, idRange){
    document.getElementById(idRange).disabled = true;
    if(document.getElementById(idCheck).checked){
        document.getElementById(idRange).disabled = false;
    }
    if(document.getElementById("vaccinatiAsk").checked) {
        document.getElementById("startVaccinatedRange").style.display = "block";
        document.getElementById("vaccinatedHealtyRange").style.display = "block";
        document.getElementById("vaccinatedInfectedRange").style.display = "block";
    }else{
        document.getElementById("startVaccinatedRange").style.display = "none";
        document.getElementById("vaccinatedHealtyRange").style.display = "none";
        document.getElementById("vaccinatedInfectedRange").style.display = "none";
    }
    if(document.getElementById("conMascherinaAsk").checked){
        document.getElementById("startWithMaskRange").style.display = "block";
        document.getElementById("withMaskHealtyRange").style.display = "block";
        document.getElementById("withMaskInfectedRange").style.display = "block";
    }else{
        document.getElementById("startWithMaskRange").style.display = "none";
        document.getElementById("withMaskHealtyRange").style.display = "none";
        document.getElementById("withMaskInfectedRange").style.display = "none";
    }
}

//controlla chi potrebbe essere infettato e se possibile invoca 
//il metodo tryInfect che calcolerà la probabilità
function infectionControl(){
    for (var i = 0; i < people.length; i++) {
        for (var j = 0; j < people.length; j++) {
            if(people[i].infected){
                people[i].tryChangeInfectedState();
                people[i].tryInfect(people[j]);
            }
        }
    }
}

//sezione del menu
var lastOpenedId = "home";
var opened = false;

function menuIconOpen(x) {
    if(!opened){
        x.classList.toggle("change");
        openMenu();
    }else{
        menuIconClose(x);
    }
    opened = !opened;
}

function menuIconClose(x) {
    document.getElementById("menuSelection").style.display = "none";
    document.getElementById(lastOpenedId).style.display = "block";
    x.classList.toggle("change");
}

function openMenu() {
    document.getElementById("parametriSimulazione").style.display = "none";
    document.getElementById("statistics").style.display = "none";
    document.getElementById("home").style.display = "none";
    document.getElementById("menuSelection").style.display = "block";
}

function menuSelectParametriSimulazione() {
    document.getElementById("parametriSimulazione").style.display = "block";
    lastOpenedId = "parametriSimulazione";
    menuIconOpen(document.getElementById("menu"));
}

function menuSelectStatistiche(){
    document.getElementById("statistics").style.display = "block";
    lastOpenedId = "statistics";
    menuIconOpen(document.getElementById("menu"));
}

function menuSelectHome(){
    document.getElementById("home").style.display = "block";
    lastOpenedId = "home";
    menuIconOpen(document.getElementById("menu"));
}

//sezione statistiche
//questo metodo serve a sapere qunati infetti ci sono e quanti di questi sono vaccinati o indossano la mascherina
setInterval(readState, 1000);
function readState(){
    momentInfect = 0;
    vaccinatedInfected = 0;
    withMaskInfected = 0;
    momentDead = 0;
    for (var i = 0; i < people.length; i++) {
        if(people[i].infected){
            momentInfect += 1;
            if (people[i].vaccinated) {
                vaccinatedInfected += 1;
            }else if(people[i].withMask){
                withMaskInfected += 1;
            }
        }else if(people[i].dead){
            momentDead++;
        }
    }
    makeStatistics();
}
//stampa turtte le statistiche del caso
function makeStatistics(){    
    var calc = ((people.length-startInfect)/(people.length/100)).toFixed();
    document.getElementById("startHealtyRange").innerHTML = people.length-startInfect+": " + calc +"%";
    document.getElementById("startHealtyRange").style.width = calc+"%";
    calc = ((people.length-momentInfect-momentDead)/(people.length/100)).toFixed();
    document.getElementById("totalHealtyRange").innerHTML = people.length-momentInfect-momentDead+": " + calc +"%";
    document.getElementById("totalHealtyRange").style.width = calc+"%";
    calc = (startInfect/(people.length/100)).toFixed();
    document.getElementById("startInfectRange").innerHTML = startInfect+": " + calc +"%";
    document.getElementById("startInfectRange").style.width = calc+"%";
    calc = (momentInfect/(people.length/100)).toFixed();
    document.getElementById("momentInfectRange").innerHTML = momentInfect+": " + calc +"%";
    document.getElementById("momentInfectRange").style.width = calc+"%";
    calc = (startVaccinated/(people.length/100)).toFixed();
    document.getElementById("startVaccinatedRange").innerHTML = startVaccinated+": " + calc +"%";
    document.getElementById("startVaccinatedRange").style.width = calc+"%";
    calc = ((startVaccinated-vaccinatedInfected)/(startVaccinated/100)).toFixed();
    document.getElementById("vaccinatedHealtyRange").innerHTML = startVaccinated-vaccinatedInfected+": " + calc +"%";
    document.getElementById("vaccinatedHealtyRange").style.width = calc+"%";
    calc = (vaccinatedInfected/(startVaccinated/100)).toFixed();
    document.getElementById("vaccinatedInfectedRange").innerHTML = vaccinatedInfected+": " + calc +"%";
    document.getElementById("vaccinatedInfectedRange").style.width = calc+"%";
    calc = (startWithMask/(people.length/100)).toFixed();
    document.getElementById("startWithMaskRange").innerHTML = startWithMask+": " + calc +"%";
    document.getElementById("startWithMaskRange").style.width = calc+"%";
    calc = ((startWithMask-withMaskInfected)/(startWithMask/100)).toFixed();
    document.getElementById("withMaskHealtyRange").innerHTML = startWithMask-withMaskInfected+": " + calc +"%";
    document.getElementById("withMaskHealtyRange").style.width = calc+"%";
    calc = (withMaskInfected/(startWithMask/100)).toFixed();
    document.getElementById("withMaskInfectedRange").innerHTML = startWithMask+": " + calc +"%";
    document.getElementById("withMaskInfectedRange").style.width = calc+"%";
    calc = (momentDead/(people.length/100)).toFixed();
    document.getElementById("DeadRange").innerHTML = momentDead+": " + calc +"%";
    document.getElementById("DeadRange").style.width = calc+"%";
    window.sessionStorage.setItem('infect', momentInfect);
    window.sessionStorage.setItem('healt',people.length-momentInfect-momentDead );
    window.sessionStorage.setItem('dead', momentDead);
}

//setta le percentuali default
function setInfectionPercentageDefault() {
    document.getElementById("nor").value = 40;
    document.getElementById("vax").value = 5;
    document.getElementById("msk").value = 15;
    printSliderValue("nor");
    printSliderValue("vax");
    printSliderValue("msk");
}

//setta la "velocità" di movimento
function setVelocityMovement(){
    velocita = (100/document.getElementById("velocita").value).toFixed();
    document.getElementById("pvelocita").innerHTML = document.getElementById("velocita").value;
    if(window.sessionStorage.getItem('stato')=="start"){
        pauseMovementInterval();
        startMovementInterval();
    }
}

//setta le percentuali degli stati a default
function setChangeStatePercentageDefault(){
    document.getElementById("vaxGravlyIll").value = 25;
    document.getElementById("vaxDead").value = 5;
    document.getElementById("norGravlyIll").value = 35;
    document.getElementById("norDead").value = 20;
    printSliderValue("vaxGravlyIll");
    printSliderValue("vaxDead");
    printSliderValue("norGravlyIll");
    printSliderValue("norDead")
}

