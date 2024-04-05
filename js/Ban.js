import {Create} from "./Create.js";

export default class Ban{
    constructor(){
        this.window = document.createElement('div');

        this.openButton = document.createElement('button');
        this.openButton.innerText = 'Ban';
        this.openButton.dataset.name = 'ban-open-button';
        this.send = document.createElement('button');
        this.send.innerText = 'send';
        this.send.dataset.name = 'ban-send';
        this.dates = Create.banDates();

    }

    open(){
        this.window.append(this.dates, this.send);
        this.openButton.remove();
    }

    set(status){
        if(status){
            this.dates.remove();
            this.openButton.remove();

            this.send.innerText = 'Unban';

            this.window.append(this.send);
        }else{
            this.send.innerText = 'Ban';
            this.send.remove();
            this.window.append(this.openButton);
        }

    }
}