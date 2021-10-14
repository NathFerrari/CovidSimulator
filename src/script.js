
//istanzio l'array che servirà a contenere tutti gli human della simulazione
var people = new Array();

//metodo che crea gli umani definiti in quantità
function createHuman(numTot, numInfect, numWithMask, numVaccinated){
    if(document.getElementById("container") == null 
    && Number.isInteger(Number(numTot)) && Number.isInteger(Number(numInfect)) 
    && Number.isInteger(Number(numWithMask)) && Number.isInteger(Number(numVaccinated))){
        document.getElementById("body").innerHTML = '<canvas id="container" width="600" height="500"></canvas>';

        if(numInfect + numVaccinated + numWithMask <= numTot){
            for(var i = 0; i < numInfect; i++){
                people.push(new Human(false,false,true));
                console.log("creato infetto");
                people[people.length - 1].print();
            }
            for(var i = 0; i < numVaccinated; i++){
                people.push(new Human(true,false,false));
                console.log("creato vaccinato");
                people[people.length - 1].print();
            }
            for(var i = 0; i < numWithMask; i++){
                people.push(new Human(false,true,false));
                console.log("creato mascherina");
                people[people.length - 1].print();
            }
            var normalPeople = numTot-(numInfect + numVaccinated + numWithMask);
            for(var i = 0; i < normalPeople; i++){
                people.push(new Human(false,false,false));
                console.log("creato persona");
                people[people.length - 1].print();
            }
        }
    }
    
}

//il metodo invoca 10 volte al secondo il metodo moveEveryOne
setInterval(moveEveryOne, 100);
//funzione che serve a invocare il metodo degli umani che gli permette di muoversi
function moveEveryOne(){
    if(document.getElementById("container") != null){
        var canvas = document.getElementById("container");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 600, 500);
        ctx.stroke();
        for(var i = 0;i < people.length;i++){
            people[i].casual_move();
        }
        infectionControl();
    }
}

//funzione che legge gli input della pagina e crea il numero corretto di persone
function readInput(){
    var numTot = document.getElementById("totHuman").value;
    var numInfect = numTot/100*document.getElementById("contagiati").value;
    var numWithMask = numTot/100*document.getElementById("conMascherina").value;
    var numVaccinated = numTot/100*document.getElementById("vaccinati").value;

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