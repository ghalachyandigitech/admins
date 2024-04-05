import {Create} from "./Create.js";
import MouseState from "./MouseState.js";
import View from "./View.js";

export default class App{
    constructor(io, userId, baseUrl){
        this.io = io;
        this.userId = userId;
        this.chats = {};
        this.requestList = document.querySelector('#request-list');
        this.fileList = document.querySelector('#file-list');
        this.agentsList = document.querySelector('#agents-list');
        this.chatsWindow = document.querySelector('#chats');
        this.status = {2: 'grey', 3: 'brown', 4: 'green'};

        Create.setWidget(userId, baseUrl);

        //todo team-lead
        this.onlineAgents = new Map();
        this.viewsList = document.querySelector('#views-list');
        this.visitors = document.querySelector('#visitors');
        this.bannedUsersPopup = document.querySelector('#banned-users-popup');
    }


    updatetest(chatId, oldUserId, user){
        const viewRow = this.viewsList.querySelector(`[data-id="${chatId}"]`);
        if(!viewRow) return;

        const oldAgent = viewRow.parentElement;

        let viewList = this.viewsList.querySelector(`[data-id="${user._id}"]`);
        if(!viewList) viewList = Create.viewList(user);

        viewList.append(viewRow);

        this.viewsList.prepend(viewList);

        if(!oldAgent.querySelectorAll('div').length) oldAgent.remove();
    }

    createtest(chat){
        if(this.viewsList.querySelector(`[data-id="${chat._id}"]`)) return;

        let viewList = this.viewsList.querySelector(`[data-id="${chat.user._id}"]`);
        if(!viewList) viewList = Create.viewList(chat.user);

        viewList.append(Create.viewRow(chat._id, chat.companion.name, chat.companion._id));

        this.viewsList.prepend(viewList);
    }

    setBannedUsers(users){
        const body = this.bannedUsersPopup.querySelector('#banned-body');
        body.innerHTML = '';
        users.forEach(user => {
            body.append(Create.banedUserRow(user._id, user.name))
        });
    }

    setBan(date, userId, banReason){
        if(!date){
            const bannedRow = this.bannedUsersPopup.querySelector(`[data-id="${userId}"]`);
            if(bannedRow) bannedRow.remove();
        }

        document.querySelectorAll(`[data-user-id="${userId}"]`).forEach(viewRow => {
            if(this.chats[viewRow.dataset.id]) this.chats[viewRow.dataset.id].ban.set(!!date);
        });
    }

    bannedOpen(){ //todo http
        this.bannedUsersPopup.style.display = 'block';
        this.io.emit('get.banned.users');
    }

    //chats
    userUpdate(agent, agents){
        this.requestList.querySelector(`option[value="${agent.request}"]`).selected = true;
        this.fileList.querySelector(`option[value="${agent.file}"]`).selected = true;

        for(const chat of Object.values(this.chats)){
            if(chat instanceof View){
                this.io.emit('chats.view', chat._id);
            }
        }

        this.viewsList.innerHTML = '';
        agent.views.forEach(view => {
            this.createtest(view);
        });

        this.agentsList.innerHTML = '';
        agents.forEach(agent => {
            this.agentsStatus(agent._id, agent.status, agent.name);
            if(agent._id !== this.userId) this.onlineAgents.set(agent._id, agent);
        });
    }

    //view
    viewClose(viewId){
        const viewRow = this.viewsList.querySelector(`[data-id="${viewId}"]`);
        const agent = viewRow.parentElement;

        viewRow.remove();

        if(!agent.querySelectorAll('div').length) agent.remove();

        const chat = this.chats[viewId];
        if(chat && chat.view) this.deleteChat(viewId);

        this.io.emit('chats.view.end', viewId);
    }

    viewOpen(viewRow){
        if(this.chats[viewRow._id]) return;

        this.chats[viewRow._id] = this.createView();
        this.io.emit('chats.view', viewRow._id);
    }

    createView(viewRow){
        const mouseState = new MouseState();
        const view = new View(this.io);

        mouseState.addMapping('scroll', () => {
            view.scroll();
        });
        mouseState.addMapping('open', () => {
            view.open();
        });
        mouseState.addMapping('chat-end', () => {
            this.viewClose(view._id);
        });
        mouseState.addMapping('ban-send', () => {
            view.banSend();
        });
        mouseState.addMapping('ban-open-button', () => {
            view.ban.open();
        });

        mouseState.buttonsListenTo(view.window);
        mouseState.scrollListenTo(view.messages);

        this.chatsWindow.append(view.window);

        return view;
    }

    //todo agent
    newLog(chatId, message, userId, name){
        if(!this.chats[chatId]) return;

        this.chats[chatId].setLogUser(userId, name);
        this.new(message, '', chatId);
    }

    new(message, hasId, chatId){
        this.chats[chatId].new(message, hasId)
    }

    agentsStatus(userId, status, name){
        if(userId !== this.userId){
            let agent = this.agentsList.querySelector(`[data-id="${userId}"]`);


            console.log(status);

            if(agent && status < 2){
                agent.remove();
                return this.onlineAgents.delete(userId)
            }

            if(!agent){
                agent = Create.agent(userId, name);
                this.onlineAgents.set(userId, {_id: userId, name: name});
            }
            agent.querySelector(`span`).style.backgroundColor = this.status[status];

            this.agentsList.append(agent);
        }
    }

    deleteChat(chatId){
        this.chats[chatId].window.remove();

        delete this.chats[chatId];
    }
}