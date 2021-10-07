const RADIUS = 5;
//classe human che serve a descrivere gli umani della simulazione
class Human{
    constructor(vaccinated, withMask, infected, color){
        if(typeof vaccinated == "boolean" 
            && typeof withMask == "boolean" 
            && typeof infected == "boolean"){

            this.vaccinated = vaccinated;
            this.withMask = withMask;
            this.infected = infected;
        }else{
            this.vaccinated = false;
            this.withMask = false;
            this.infected = false;
        }

        this.color = color;
        //in direction ogni 1 vale 45°
        this.direction = Math.floor(Math.random() * 7);
        this.x = Math.floor(Math.random() * 600);
        this.y = Math.floor(Math.random() * 500);
    }

    //setta l'Human a infetto
    set_infected(){
        console.log("infettato");
        this.infected = true;
        this.color = "#FF0000"
    }

    //muove in maniera casuale l'Human 
    //(cambiando la posizione in maniera completamente casuale)
    //metodo iniziale poco realistico
    /*casual_move(){
        var random1 = Math.floor(Math.random()*2)-1;
        var random2 = Math.floor(Math.random()*2)-1;
        if(random1 ^ random2){
            this.x++;
            this.checkX();
        }else{
            this.x--;
            this.checkX();
        }

        random1 = Math.floor(Math.random()*2)-1;
        random2 = Math.floor(Math.random()*2)-1;
        if(random1 ^ random2){
            this.y++;
            this.checkY();
        }else{
            this.y--;
            this.checkY();
        }

        console.log("nuove coordinate " +this.x+" "+this.y);
        this.print();
    }*/

    //muove in maniera casuale l'Human seguendo una direzione e cambiandola a volte
    casual_move(){
        var random1 = Math.floor(Math.random()*2)-1;
        var random2 = Math.floor(Math.random()*2)-1;
        var random3 = Math.floor(Math.random()*2)-1;
        if(random1 && random2 && random3){
            this.changeDirection();
        }

        switch (this.direction) {
            case 0:
                this.x++;
                break;
            case 1:
                this.x++;
                this.y++;
                break;
            case 2:
                this.y--;
                break;
            case 3:
                this.x--;
                this.y++;
                break;
            case 4:
                this.x--;
                break;
            case 5:
                this.x--;
                this.y--;
                break;
            case 6:
                this.y++;
                break;
            case 7:
                this.x++;
                this.y--;
        }
        //console.log("nuove coordinate " +this.x+" "+this.y);
        this.print();
    }

    //cambia la direzione di movimento dell'human
    changeDirection(){
        var random = Math.floor(Math.random()*2);

        if(random == 1){
            this.direction = this.direction - 1;
        }else{
            this.direction = this.direction + 1;
        }

        //controlli per tenere la direzione nella scala base (0-7)
        if(this.direction == 8){
            this.direction = 0;
        }

        if(this.direction == -1){
            this.direction = 7;
        }
    }

    //controllo che la coordinata x sia all'interno del campo
    checkX(){
        if(this.x < 5){
            this.x = 5;
            this.direction = 0;
        }else if(this.x > 595){
            this.x = 595;
            this.direction = 4;
        }
    }

    //controllo che la coordinata y sia all'interno del campo
    checkY(){
        if(this.y < 5){
            this.y = 5;
            this.direction = 6;
        }else if(this.y > 495){
            this.y = 495;
            this.direction = 2;
        }
    }

    //stampo l'oggetto Human nello stato corrente all'interno del campo della simulazione
    print(){
        this.checkX();
        this.checkY();
        var canvas = document.getElementById("container");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,RADIUS,0,2*Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    tryInfect(human){
        if(this.x <= human.x+5 && this.x >= human.x-5 && this.y <= human.y+5 && this.y >= human.y-5){
            var random = Math.floor(Math.random()*2);
            if(this.vaccinated && human.vaccinated){
                if(random<10){
                    human.set_infected();
                }
            }else if(this.withMask && human.withMask){
                if(random<20){
                    human.set_infected();
                }
            }else if(this.withMask && human.vaccinated){
                if(random<15){
                    human.set_infected();
                }
            }else if(this.vaccinated && human.withMask){
                if(random<15){
                    human.set_infected();
                }
            }else if(human.withMask){
                if(random<50){
                    human.set_infected();
                }
            }else if(this.withMask){
                if(random<50){
                    human.set_infected();
                }
            }else if(this.vaccinated){
                if(random<30){
                    human.set_infected();
                }
            }else if(human.vaccinated){
                if(random<30){
                    human.set_infected();
                }
            }else{
                if(random<80){
                    human.set_infected();
                }
            }
        }
    }
}

//istanzio l'array che servirà a contenere tutti gli human della simulazione
var people = new Array();

//metodo che crea gli umani definiti in quantità
function createHuman(numTot, numInfect, numWithMask, numVaccinated){
    if(document.getElementById("container") == null){
        document.getElementById("body").innerHTML = '<canvas id="container" width="600" height="500" style="border:1px solid #000;"></canvas>';

        if(numInfect + numVaccinated + numWithMask <= numTot){
            for(var i = 0; i < numInfect; i++){
                people.push(new Human(false,false,true,'#ff0000'));
                console.log("creato infetto");
                people[people.length - 1].print();
            }
            for(var i = 0; i < numVaccinated; i++){
                people.push(new Human(true,false,false,'#0000ff'));
                console.log("creato vaccinato");
                people[people.length - 1].print();
            }
            for(var i = 0; i < numWithMask; i++){
                people.push(new Human(false,true,false,'#00ff00'));
                console.log("creato mascherina");
                people[people.length - 1].print();
            }
            var normalPeople = numTot-(numInfect + numVaccinated + numWithMask);
            for(var i = 0; i < normalPeople; i++){
                people.push(new Human(false,false,false,'#fff'));
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


setInterval(infectionControl, 1000);
function infectionControl(){
    for (var i = 0; i < people.length; i++) {
        for (var j = 0; j < people.length; j++) {
            if(people[i].infected){
                people[i].tryInfect(people[j]);
            }
        }
    }
}