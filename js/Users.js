import {Create} from "./Create.js";
//todo  socket on  update view list transfer@ menak user role chi poxvum

export default class Users{
    constructor(){
        this.query = '';
        this.page = 10;
        this.roles = {
            'idle': {
                window: document.querySelector('[data-id="idle"]'),
                users: new Map(),
                loader: Create.visitorLoadButton('idle')
            },
            'active': {
                window: document.querySelector('[data-id="active"]'),
                users: new Map(),
                loader: Create.visitorLoadButton('active')
            },
            'visitors': {
                window: document.querySelector('[data-id="visitors"]'),  //todo served
                users: new Map(),
                loader: Create.visitorLoadButton('visitors')
            },
            'incoming': {
                window: document.querySelector('[data-id="incoming"]'),
                users: new Map(),
                loader: Create.visitorLoadButton('incoming')
            },
            'assigned': {
                window: document.querySelector('[data-id="assigned"]'),
                users: new Map(),
                loader: Create.visitorLoadButton('assigned')
            }
        };

        setInterval(() => {
            ['assigned', 'incoming', 'visitors'].forEach((role) => {
                this.roles[role].window.querySelectorAll('div > .visitor').forEach((visitor) => {
                    const row = visitor.querySelector('#role-created');
                    row.innerText = Users.calcRoleCreated(row.roleCreated) + ' .min';
                });
            });
        }, 60*5*1000);
    }

    static calcRoleCreated(roleCreated){
        return parseInt((Date.now() - new Date(roleCreated).getTime())/1000/60);
    }

    static updateRowData(element, visitor){
        const viewButton = element.querySelector('button');
        if(visitor.role === 'visitors'){
            viewButton._id = visitor.chatId;
            viewButton.style.display = 'inline';
        }else{
            viewButton.style.display = 'none';
        }

        element.querySelector('#referrer').innerText = visitor.referrer;
        element.querySelector('#past-chats-count').innerText = visitor.pastChats ? visitor.pastChats + ' Chats': '';
        element.querySelector('#role-created').innerText = visitor.roleCreated ? Users.calcRoleCreated(visitor.roleCreated) + ' .min': '';
        element.querySelector('#role-created').roleCreated = visitor.roleCreated ? visitor.roleCreated: 0;
    }

    clear(){
        for(const role of Object.keys(this.roles)){
            this.roles[role].users.clear();
            this.roles[role].window.querySelector('div').innerHTML = '';
            this.roles[role].loader.remove();
            this.roles[role].window.previousElementSibling.querySelector('span').innerHTML = '0';
        }
    }

    update(roles){
        for(const [role, visitors] of Object.entries(roles)){
            for(const visitor of visitors){
                this.updateRow({role: role, ...visitor});
            }
        }
    }

    updateUser(visitor){
        const {_id, oldRole, role} = visitor;

        if(oldRole && role){
            this.updateRow(visitor, oldRole !== role ? this.removeRow(_id, oldRole): this.roles[oldRole].users.get(_id));
        }else if(!oldRole && role){
            this.updateRow(visitor);
        }else if(oldRole && !role){
            this.removeRow(_id, oldRole);
        }
    }

    search(query){
        for(const role of Object.keys(this.roles))  this.rollList(role, 'search', query);
    }

    removeRow(_id, role){
        const element = this.roles[role].users.get(_id);
        if(element){
            element.remove();
            this.roles[role].users.delete(_id);
        }

        this.rollList(role);

        return element;
    }

    updateRow(visitor, element){
        if(!element) element = Create.visitor(visitor);
        Users.updateRowData(element, visitor);

        this.roles[visitor.role].users.set(visitor._id, element);

        this.rollList(visitor.role);
    }

    rollList(role, type, text){
        role = this.roles[role];
        const list = role.window.querySelector('div');

        role.loader.remove();

        //loader@ anpayman jnum a bayc petq chi
        //misht slice a anum bayc petq chi

        if(type === 'search'){
            this.query = text;
            list.innerHTML = '';
        }

        const visitors = Array.from(role.users).slice(list.childElementCount);
        if(this.query){
            for(const [, element] of visitors){
                if(element.textContent.indexOf(this.query) > -1){
                    list.append(element);
                }
            }
        }else{
            let i = type === 'page' ? 0: list.childElementCount;
            for(const [, element] of visitors){
                if(i >= this.page) {role.window.append(role.loader); break;}
                list.append(element);
                i++;
            }
        }

        if(this.query){
            role.window.previousElementSibling.querySelector('span').innerHTML = list.childElementCount.toString();
        }else{
            role.window.previousElementSibling.querySelector('span').innerHTML = role.users.size.toString()
        }
    }
}