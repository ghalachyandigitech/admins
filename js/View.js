import {Create} from './Create.js';
import Ban from './Ban.js';

export default class View{
    constructor(io){
        this._id = '';
        this.io = io;
        this.view = true;
        this.awaitScroll = false;
        this.visible = false;
        this.unreadCount = 0;
        this.visitorUnread = new Set();
        this.agentUnread = new Set();
        this.logUsers = {};
        this.visitorUserId = '';

        this.widgetName = Create.widgetName();
        this.window = Create.window();
        this.body = Create.body();
        this.header = Create.header();
        this.unread = Create.unread();
        this.status = document.createElement('div');
        this.endButton = Create.endButton();
        this.statusLoader = Create.statusLoader();
        this.messageLoader = Create.loader();
        this.messages = Create.messages();
        this.footer = document.createElement('div');
        this.controller = Create.controller();
        this.time = Create.time();
        this.ban = new Ban();

        this.controller.append(this.time, this.ban.window);
        this.footer.append(this.controller);
        this.status.append(this.statusLoader);
        this.body.append(this.messages);
        this.header.append(this.unread, this.status, this.widgetName, this.endButton);
        this.window.append(this.header);
    }


    banSend(){
        this.io.emit('permission.ban', [this.visitorUserId, this.ban.dates.value, this._id])
    }

    transferSet(){}

    setLogUser(userId, name){
        if(!name) return;
        this.logUsers[userId] = name;
    }

    updateTime(){
        const min = this.companionCreated ? Math.round((Date.now() - this.companionCreated)/1000/60): 0;
        this.time.innerText = min + ' min.';
    }

    timeRun(companionCreated){
        this.companionCreated = companionCreated;

        this.updateTime();
        clearInterval(this.timeInterval);

        if(this.companionCreated){
            this.timeInterval = setInterval(() => {
                this.updateTime();
                if(!this.companionCreated) clearInterval(this.timeInterval);
            }, 60*1000);
        }
    }

    setStatus(name, userId, companionCreated){
        if(userId && userId !== this.visitorUserId) return;

        if(!isNaN(companionCreated)) this.timeRun(companionCreated);

        if(name){
            this.statusLoader.remove();
            return this.status.innerText = name;
        }

        this.status.innerHTML = '';
        this.status.append(this.statusLoader);
    }

    setRead(userId){
        if(userId !== this.visitorUserId) this.setUnread(0);

        this.messages.querySelectorAll('.unread').forEach(message => {
            message.classList.remove('unread');
        });

        this.visitorUnread.clear();
    }

    page(messages, ended){
        this.messageLoader.remove();

        if(ended) this.messages.dataset.name = '';

        if(typeof messages[0] === 'object'){
            for(const {id, userId, message, file, date} of messages) {
                this.messages.prepend(Create.message(
                    [id, userId, message, file, date],
                    this.visitorUserId !== userId,
                    this.visitorUnread.has(id),
                    this.logUsers
                ));
            }
        }else{
            for(let i = messages.length-5; i >= 0; i-=5){
                const message = messages.slice(i, i+5);
                this.messages.prepend(Create.message(
                    message,
                    this.visitorUserId !== message[1],
                    this.visitorUnread.has(message[0]),
                    this.logUsers
                ));
            }
        }

        this.awaitScroll = ended;
    }

    close(){}

    end(){}

    ending(){console.log(this);}

    new(message, hashId){
        const messageElement = this.messages.querySelector(`#i${hashId}`);
        if(messageElement) return messageElement.id = `i${message[0]}`;

        this.messages.append(Create.message(message, this.visitorUserId !== message[1], true, this.logUsers));

        if(message[1] === this.visitorUserId) this.setUnread(++this.unreadCount);
    }

    scroll(){
        if(this.awaitScroll) return;

        const firstMessage = this.messages.querySelector('.message');
        if(firstMessage && firstMessage.id) {
            const messagesTop = this.messages.getBoundingClientRect()['top'] - 200;
            const firstMessageTop = firstMessage.getBoundingClientRect()['top'];

            if(firstMessageTop > messagesTop){
                this.messages.prepend(this.messageLoader);
                this.io.emit('message.page', [this._id, firstMessage.id]);
            }
        }
    }

    open(){
        this.visible = !this.visible;

        if(this.visible){
            this.window.append(this.body);
        }else{
            this.body.remove();
        }
    }

    recover(chat, companionName, [messages], visitorUnread, agentUnread, visitorCreated){


        console.log(chat);


        for(const [key, value] of Object.entries(chat.logUsers)) this.logUsers[key] = value;

        this.widgetName.innerText = chat.widgetName;
        this._id = chat._id;
        this.messageLoader.remove();
        this.visitorUserId = chat.companion._id;
        this.body.append(this.footer);
        this.setStatus(companionName, chat.companion._id, visitorCreated);
        this.ban.set(chat.companion.banExpire);
        this.setUnread(agentUnread.length);

        visitorUnread.forEach(messageId => this.visitorUnread.add(messageId));
        agentUnread.forEach(messageId => this.agentUnread.add(messageId));

        if(typeof messages[0] === 'object'){
            for(const {id, userId, message, file, date} of messages) {
                const messageElement = this.messages.querySelector(`#i${id}`);
                if(messageElement) continue;

                this.messages.prepend(Create.message(
                    [id, userId, message, file, date],
                    this.visitorUserId !== userId,
                    this.visitorUserId !== userId ? this.agentUnread.has(id): this.visitorUnread.has(id),
                    this.logUsers
                ));
            }
        }else{
            for(let i = 0; i < messages.length; i+=5){
                const messageElement = this.messages.querySelector(`#i${messages[i]}`);
                if(messageElement) continue;

                const message = messages.slice(i, i+5);
                this.messages.append(Create.message(
                    message,
                    this.visitorUserId !== message[1],
                    this.visitorUserId === message[1] ? this.agentUnread.has(message[0]): this.visitorUnread.has(message[0]),
                    this.logUsers
                ));
            }
        }
    }

    setUnread(unreadCount){
        this.unreadCount = unreadCount;
        if(!unreadCount)
            return this.unread.style.display = 'none';

        this.unread.style.display = 'block';
        this.unread.innerText = unreadCount ? unreadCount: '';
    }
}