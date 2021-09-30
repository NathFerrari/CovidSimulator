class Human{
    constructor(vaccinated, withMask, infected){
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

        this.x = Math.floor(Math.random() * 1000);
        this.y = Math.floor(Math.random() * 750);
    }

    set_infected(){
        this.infected = true;
    }

    casual_move(){
        if(Math.floor(Math.random()) && Math.floor(Math.random())){
            this.x++;
        }else if (Math.floor(Math.random()) || Math.floor(Math.random())){
            this.x--;
        }

        if(Math.floor(Math.random()) && Math.floor(Math.random())){
            this.y++;
        }else if (Math.floor(Math.random()) || Math.floor(Math.random())){
            this.y--;
        }
    }

    print(){
        
    }
}

function createHuman(numTot, numInfect, numWithMask, numVaccinated){
    var people = new Array();
    if(document.getElementById("container") == null){
        document.getElementById("body").innerHTML += '<div id="container">';
    }
    if(numInfect + numVaccinated + numWithMask <= numTot){
        for(var i = 0; i < numInfect; i++){
            people.push(new Human(false,false,true));
            people[people.length - 1].print();
        }
        for(var i = 0; i < numVaccinated; i++){
            people.push(new Human(true,false,false));
            people[people.length - 1].print();
        }
        for(var i = 0; i < numWithMask; i++){
            people.push(new Human(false,true,false));
            people[people.length - 1].print();
        }
        var normalPeople = numTot-(numInfect + numVaccinated + numWithMask);
        for(var i = 0; i < normalPeople; i++){
            people.push(new Human(false,false,false));
            people[people.length - 1].print();
        }
    }
    document.getElementById("body").innerHTML += '</div>';
}