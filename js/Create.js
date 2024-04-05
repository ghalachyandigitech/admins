let __userId = '';
let __baseUrl = 'http://';
const __images = ['jpg', 'jpeg', 'png', 'PNG', 'JPEG'];
const __videos = ['mp4'];
const __timeOptions = ['en-US', {second: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false}];
const __browsers = ['edg', 'firefox', 'chrome', 'safari', 'opera'];
const __platforms = ['windows', 'ubuntu', 'android', 'ios', 'mac'];

export const __labels = {
    'button-disable-file': 'Attach disable',
    'button-enable-file': 'Attach enable',
};

function getBrowser(userAgent){
    if(!userAgent) return __browsers[0];

    userAgent = userAgent.toLowerCase();

    for(const browser of __browsers) if(userAgent.indexOf(browser) > -1) return browser;

    return __browsers[0];
}

function getPlatform(userAgent){
    if(!userAgent) return __platforms[0];

    userAgent = userAgent.toLowerCase();

    for(const platform of __platforms) if(userAgent.indexOf(platform) > -1) return platform;

    return __platforms[0];
}

export class Create{
    static agentRow(userId, name){
        const div = document.createElement('div');
        div.style.width = '100%';
        div.style.height = '25px';
        div.style.marginBottom = '5px';
        div.style.border = '1px solid blue';
        div.innerText = name;
        div.dataset.id = userId;

        const logoutButton = document.createElement('button');
        logoutButton.style.float = 'right';
        logoutButton.style.cursor = 'pointer';
        logoutButton.innerText = 'Logout';
        logoutButton.dataset.name = 'logout-agent';

        const inactiveButton = document.createElement('button');
        inactiveButton.style.float = 'right';
        inactiveButton.style.cursor = 'pointer';
        inactiveButton.innerText = 'Inactive';
        inactiveButton.dataset.name = 'inactive-agent';

        div.append(logoutButton, inactiveButton);

        return div;
    }

    static banedUserRow(userId, name){
        const div = document.createElement('div');
        div.style.width = '100%';
        div.style.height = '25px';
        div.style.marginBottom = '5px';
        div.style.border = '1px solid blue';
        div.innerText = name;
        div.dataset.id = userId;

        const unBanButton = document.createElement('button');
        unBanButton.style.float = 'right';
        unBanButton.style.cursor = 'pointer';
        unBanButton.innerText = 'unBan';
        unBanButton.dataset.name = 'un-ban-from-popup';

        div.append(unBanButton);

        return div;
    }

    static setWidget(userId, baseUrl){
        __userId = userId;
        __baseUrl += baseUrl;
    }

    static window(){
        const window = document.createElement('div');
        window.classList.add('chat-window');

        return window;
    }

    static visitorLoadButton(role){
        const button = document.createElement('button');
        button.dataset.name = 'visitors-load';
        button.dataset.role = role;
        button.style.marginLeft = '45%';
        button.innerText = 'Load';

        return button
    }

    static viewList(user){
        const div = document.createElement('div');
        div.style.border = '1px solid';
        div.dataset.id = user._id;
        div.innerText = user.name;

        return div;
    }

    static viewRow(_id, name, userId){
        const div = document.createElement('div');
        div.style.cursor = 'pointer';
        div.style.border = '1px solid red';
        div.style.marginLeft = '20px';
        div.style.height = '30px';
        div.innerText = name;
        div.dataset.name = 'view';
        div.dataset.id = _id;
        div.dataset.userId = userId;
        div._id = _id;

        const close = document.createElement('button');
        close.innerHTML = '&#x2715;';
        close.style.float = 'right';
        close.style.cursor = 'pointer';
        close.dataset.name = 'delete-view';

        div.append(close);

        return div;
    }

    static widgetName(){
        const div = document.createElement('div');
        div.style.marginLeft = '5px';

        return div;
    }

    static ban(){
        const button = document.createElement('button');
        button.dataset.name = 'ban';
        button.innerText = 'Ban';

        return button;
    }

    static endButton(){
        const span = document.createElement('span');
        span.classList.add('chat-end');
        span.innerHTML = '&#x2715;';
        span.dataset.name = 'chat-end';

        return span;
    }

    static banDates(){
        const select = document.createElement('select');

        [1,2,3,4,5,6].forEach((value) => {
            const option = document.createElement('option');
            option.value = value;
            option.innerText = value;

            select.append(option);
        });

        return select;
    }

    static visitor(visitor){
        const div = document.createElement('div');
        div.classList.add('visitor');
        div.innerText = visitor.name;

        const country = document.createElement('img');
        country.src = __baseUrl + 'flags/' + visitor.countryCode + '.svg';
        country.style.marginLeft = '5px';

        const platform = document.createElement('img');
        platform.src = __baseUrl + 'platforms/' + getPlatform(visitor.userAgent) + '.png';
        platform.style.marginLeft = '5px';

        const browser = document.createElement('img');
        browser.src = __baseUrl + 'browsers/' + getBrowser(visitor.userAgent) + '.png';
        browser.style.marginLeft = '5px';

        const referrer = document.createElement('span');
        referrer.id = 'referrer';
        referrer.style.marginLeft = '5px';

        const pastChatsCount = document.createElement('span');
        pastChatsCount.id = 'past-chats-count';
        pastChatsCount.style.marginLeft = '5px';

        const roleCreated = document.createElement('span');
        roleCreated.id = 'role-created';
        roleCreated.style.marginLeft = '5px';

        const viewButton = document.createElement('button');
        viewButton.style.cursor = 'pointer';
        viewButton.style.display = 'none';
        viewButton.innerText = 'view';
        viewButton.dataset.name = 'view';

        div.append(country, browser, platform, referrer, viewButton, roleCreated, pastChatsCount);

        return div;
    }

    static time(){
        const div = document.createElement('div');

        div.style.width = '55px';
        div.style.textAlign = 'center';
        div.style.padding = '3px';
        div.style.border = '1px solid';

        return div;
    }

    static agent(_id, name){
        const div = document.createElement('div');
        div.innerText = name;
        div.dataset.name = 'internal';
        div.dataset.id = _id;
        div._id = _id; //todo kareli a jnjel
        div.style.border = '1px solid';
        div.style.cursor = 'pointer';

        const status = document.createElement('span');
        status.classList.add('status');

        div.append(status);

        return div;
    }

    static controller(){
        const div = document.createElement('div');
        div.style.width = '566px';
        div.style.height = '165px';
        div.style.backgroundColor = 'burlywood';
        div.style.float = 'left';
        div.style.border = '5px outset';

        return div;
    }

    static statusLoader(){
        const status = document.createElement('span');
        status.classList.add('name-loader');

        return status;
    }

    static unread(){
        const span = document.createElement('span');
        span.style.backgroundColor = 'green';
        span.style.borderRadius = '50%';
        span.style.width = '25px';
        span.style.height = '25px';
        span.style.textAlign = 'center';

        return span;
    }

    static body(){
        const body = document.createElement('div');
        body.classList.add('chat-body');

        return body;
    }

    static header(){
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.backgroundColor = 'burlywood';
        header.style.border = '5px outset';
        header.style.height = '50px';

        header.dataset.name = 'open';

        return header;
    }

    static status(){
        const status = document.createElement('span');
        status.classList.add('status');

        return status;
    }

    static send(){
        const send = document.createElement('button');
        send.innerText = 'Send';
        send.style.display = 'block';
        send.dataset.name = 'message';

        return send;
    }

    static loader(){
        const loadingMessage = document.createElement('div');
        loadingMessage.classList.add('message');

        const loadingImg = document.createElement('img');
        loadingImg.src = 'http://localhost:9026/chat-loading.gif';
        loadingImg.style.width = '100px';
        loadingImg.style.position = 'relative';
        loadingImg.style.left = '105px';

        loadingMessage.append(loadingImg);

        return loadingMessage;
    }

    static file(file){
        let src;
        let type;
        let fileType;
        const fileBlock = document.createElement('div');

        if(typeof file === 'object'){
            src = URL.createObjectURL(file);
            [,type] = file.type.split('/');
        }else{
            const split = file.split('.');
            type = split[split.length-1];
            src = file;
        }

        if(__images.includes(type)){
            fileType = document.createElement('img');
        }else if(__videos.includes(type)){
            fileType = document.createElement('video');
            fileType.controls = 'controls';
        }else{
            return '';
        }

        fileType.style.width = '150px';
        fileType.src = src;

        fileBlock.append(fileType);

        return fileBlock;
    }

    static message(message, chatMessage, unread, logUsers) {
        const block = document.createElement('div');
        block.classList.add('message');
        block.id = `i${message[0]}`;

        if (unread) block.classList.add('unread');
        if (!message[1]){
            const [id, action] = message[2].split('_');
            message[2] = id === __userId ? `You ${action}`: logUsers[id] + ' ' + action;

            block.style.alignItems = 'center';
        }
        else block.style.alignItems = chatMessage ? 'end' : 'start';

        const div = document.createElement('div');
        div.classList.add('message-content');

        const span = document.createElement('span');
        span.innerText = message[2];

        div.append(span);

        const time = document.createElement('div');
        time.innerText = new Date(message[4]).toLocaleTimeString(...__timeOptions);
        time.classList.add('message-time');

        if (message[1]){
            const arrow = document.createElement('span');
            arrow.classList.add('message-content-arrow');
            arrow.style[!chatMessage ? 'left' : 'right'] = '-10px';

            div.append(span, arrow);
        }

        block.append(div, time);

        if(message[3]) div.append(Create.file(message[3]));

        return block;
    }

    static messages(){
        const messages = document.createElement('div');
        messages.classList.add('messages');
        messages.dataset.name = 'scroll';

        return messages;
    }
}