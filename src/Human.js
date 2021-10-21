const RADIUS = 5;
//classe human che serve a descrivere gli umani della simulazione
class Human{
    constructor(vaccinated, withMask, infected,index){
        if(typeof vaccinated == "boolean" 
            && typeof withMask == "boolean" 
            && typeof infected == "boolean"){

            this.vaccinated = vaccinated;
            this.withMask = withMask;
            this.infected = infected;
            if(this.infected){
                this.color = "#FF0000";
            }else if(this.withMask){
                this.color = "#00FF00";
            }else if(this.vaccinated){
                this.color = '#0000FF';
            }else{
                this.color = "#999";
            }
        }else{
            this.vaccinated = false;
            this.withMask = false;
            this.infected = false;
        }
        //in direction ogni 1 vale 45°
        this.direction = Math.floor(Math.random() * 7);
        this.x = Math.floor(Math.random() * 600);
        this.y = Math.floor(Math.random() * 500);
        this.index = index;
    }

    //setta l'Human a infetto
    set_infected(){
        console.log("infettato " + this.index);
        this.infected = true;
        this.color = "#FF0000";
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
        ctx.fillText(this.index,this.x+10,this.y);
        ctx.stroke();
    }

    tryInfect(human){
        if(this.x <= human.x+RADIUS*2 && this.x >= human.x-RADIUS*2
            && this.y <= human.y+RADIUS*2 && this.y >= human.y-RADIUS*2 
            && !human.infected){
            var random = Math.floor(Math.random()*100);
            if(this.vaccinated && human.vaccinated){
                if(random<5){
                    human.set_infected();
                }
            }else if(this.withMask && human.withMask){
                if(random<15){
                    human.set_infected();
                }
            }else if(this.withMask && human.vaccinated){
                if(random<10){
                    human.set_infected();
                }
            }else if(this.vaccinated && human.withMask){
                if(random<10){
                    human.set_infected();
                }
            }else if(human.withMask){
                if(random<30){
                    human.set_infected();
                }
            }else if(this.withMask){
                if(random<30){
                    human.set_infected();
                }
            }else if(this.vaccinated){
                if(random<20){
                    human.set_infected();
                }
            }else if(human.vaccinated){
                if(random<20){
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
