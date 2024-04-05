export default class MouseState{
    constructor(){
        this.keyMap = new Map();
    }

    handleEvent(event){
        const {name} = event.target.dataset;

        if(!name || !this.keyMap.has(name))
            return;

        event.preventDefault();

        this.keyMap.get(name)(event.target);
    }

    addMapping(name, callBack){
        this.keyMap.set(name, callBack);
    }

    buttonsListenTo(window){
        ['click'].forEach(eventName => {
            window.addEventListener(eventName, (event) => {
                this.handleEvent(event)
            })
        });
    }

    scrollListenTo(window){
        ['scroll'].forEach(eventName => {
            window.addEventListener(eventName, (event) => {
                this.handleEvent(event)
            })
        });
    }
}