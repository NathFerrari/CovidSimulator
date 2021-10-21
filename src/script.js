
//istanzio l'array che servirà a contenere tutti gli human della simulazione
var people = new Array();

let intervalMovement;
var stopSimulation = false;

//metodo che crea gli umani definiti in quantità
function createHuman(numTot, numInfect, numWithMask, numVaccinated){
    if(numInfect + numVaccinated + numWithMask <= numTot){
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
}

function pauseMovementInterval(){
    clearInterval(intervalMovement);
    document.getElementById("start").disabled = false;
    document.getElementById("pause").disabled = true;
    console.log("pause");
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

function menuIcon(x) {
    x.classList.toggle("change");
    openMenu();
}

function openMenu() {
    document.getElementById("parametriSimulazione").style.display = none;
    document.getElementById("menu").style.display = block;
}

function menuSelectParametriSimulazione() {
    document.getElementById("parametriSimulazione").style.display = block;
    document.getElementById("menu").style.display = none;
}

