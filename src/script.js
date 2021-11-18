
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
    //il metodo invoca 10 volte al secondo il metodo moveEveryOne
    intervalMovement = setInterval(moveEveryOne, 100);
    document.getElementById("start").disabled = true;
    document.getElementById("pause").disabled = false;
    console.log("start");
    window.sessionStorage.setItem('stato', 'start');
}

function pauseMovementInterval(){
    clearInterval(intervalMovement);
    document.getElementById("start").disabled = false;
    document.getElementById("pause").disabled = true;
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
        document.getElementById("pause").disabled = false;
        document.getElementById("createHuman").disabled = false;
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

    document.getElementById("createHuman").disabled = true;
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
}

//controlla chi potrebbe essere infettato e se possibile invoca 
//il metodo tryInfect che calcolerà la probabilità
function infectionControl(){
    for (var i = 0; i < people.length; i++) {
        for (var j = 0; j < people.length; j++) {
            if(people[i].infected){
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
    for (var i = 0; i < people.length; i++) {
        if(people[i].infected){
            momentInfect += 1;
            if (people[i].vaccinated) {
                vaccinatedInfected += 1;
            }else if(people[i].withMask){
                withMaskInfected += 1;
            }
        }
    }
    makeStatistics();
}
//stampa turtte le statistiche del caso
function makeStatistics(){    
    var calc = ((people.length-startInfect)/(people.length/100)).toFixed();
    document.getElementById("startHealty").innerHTML = people.length-startInfect+" percentuale rispetto al totale: " + calc +"%";
    document.getElementById("startHealtyRange").value = calc;
    calc = ((people.length-momentInfect)/(people.length/100)).toFixed();
    document.getElementById("totalHealty").innerHTML = people.length-momentInfect+" percentuale rispetto al totale: " + calc +"%";
    document.getElementById("totalHealtyRange").value = calc;
    calc = (startInfect/(people.length/100)).toFixed();
    document.getElementById("startInfect").innerHTML = startInfect+" percentuale rispetto al totale: " + calc +"%";
    document.getElementById("startInfectRange").value = calc;
    calc = (momentInfect/(people.length/100)).toFixed();
    document.getElementById("momentInfect").innerHTML = momentInfect+" percentuale rispetto al totale: " + calc +"%";
    document.getElementById("momentInfectRange").value = calc;
    calc = (startVaccinated/(people.length/100)).toFixed();
    document.getElementById("startVaccinated").innerHTML = startVaccinated+" percentuale rispetto al totale: " + calc +"%";
    document.getElementById("startVaccinatedRange").value = calc;
    calc = ((startVaccinated-vaccinatedInfected)/(people.length/100)).toFixed();
    document.getElementById("vaccinatedHealty").innerHTML = startVaccinated-vaccinatedInfected+" percentuale rispetto al totale: " + calc +"%";
    document.getElementById("vaccinatedHealtyRange").value = calc;
    calc = (vaccinatedInfected/(people.length/100)).toFixed();
    document.getElementById("vaccinatedInfected").innerHTML = vaccinatedInfected+" percentuale rispetto al totale: " + calc +"%";
    document.getElementById("vaccinatedInfectedRange").value = calc;
    calc = (withMaskInfected/(people.length/100)).toFixed();
    document.getElementById("withMaskInfected").innerHTML = withMaskInfected+" percentuale rispetto al totale: " + calc +"%";
    document.getElementById("startWithMaskRange").value = calc;
    calc = ((startWithMask-withMaskInfected)/(people.length/100)).toFixed();
    document.getElementById("withMaskHealty").innerHTML = startWithMask-withMaskInfected+" percentuale rispetto al totale: " + calc +"%";
    document.getElementById("withMaskHealtyRange").value = calc;
    calc = (startWithMask/(people.length/100)).toFixed();
    document.getElementById("startWithMask").innerHTML = startWithMask+" percentuale rispetto al totale: " + calc +"%";
    document.getElementById("withMaskInfectedRange").value = calc;
    window.sessionStorage.setItem('infect', momentInfect);
}

function SetInfectionPercentageDefault() {
    document.getElementById("nor").value = 40;
    document.getElementById("vax").value = 5;
    document.getElementById("msk").value = 15;
    printSliderValue("nor");
    printSliderValue("vax");
    printSliderValue("msk");
}