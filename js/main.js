import { io } from './client.js';
import MouseState from './MouseState.js';
import App from './App.js';
import Users from './Users.js';
import {Create} from './Create.js';

const baseUrl = 'localhost:9026/';
// const baseUrl = '52.148.200.159:3000';
const userId = '66029b19abe2d9d11fe5ef5d';
const socket = io(`ws://${baseUrl}658941de12cd6a8a644d5066`, {
    auth: {
        name: 'admin 1',
        role: 'admins',
        userId: userId,
    }
});

const mouseState = new MouseState();
const app = new App(socket, userId, baseUrl);
const users = new Users();

const agentsListPopup = document.querySelector('#agents-list-popup');

mouseState.addMapping('close-agents-list', () => {
    agentsListPopup.style.display = 'none';
});
mouseState.addMapping('logout-agent', (target) => {
    socket.emit('agents.logout', target.parentElement.dataset.id);
});
mouseState.addMapping('inactive-agent', (target) => {
    socket.emit('agents.inactive', target.parentElement.dataset.id);
});
mouseState.addMapping('open-agents-list-popup', () => {
    agentsListPopup.style.display = 'block';
    socket.emit('get.agents.list');
});
socket.on('set.agents.list', (agents) => {
    const body = agentsListPopup.querySelector('#agents-list-body');
    body.innerHTML = '';

    agents.forEach(agent => {
        body.append(Create.agentRow(agent._id, agent.name))
    });
});

socket.on('user.update', ([agent, agents]) => {
    users.update(agent.visitors);
    app.userUpdate(agent, agents);
});
mouseState.addMapping('search', (target) => {
    users.search(target.previousElementSibling.value);
});
socket.on('visitors.update', (visitor) => {
    users.updateUser(visitor);
});
socket.on('chats.view', function([chat, companionName, messages, visitorUnread, agentUnread, visitorCreated]){ //todo chats.recover.view
    app.createtest(chat);
    app.chats[chat._id].recover(chat, companionName, messages, visitorUnread, agentUnread, visitorCreated);
});
mouseState.addMapping('view', (target) => {
    app.viewOpen(target);
});
mouseState.addMapping('visitors-load', (target) => {
    users.rollList(target.dataset.role, 'page');
});
mouseState.addMapping('open-banned-popup', () => {
    app.bannedOpen();
});
socket.on('permission.ban.set', function([date, userId, banReason]){
    app.setBan(date, userId, banReason);
});
socket.on('set.banned.users', (users) => {
    app.setBannedUsers(users)
});
mouseState.addMapping('un-ban-from-popup', (target) => {
    socket.emit('permission.ban', [target.parentElement.dataset.id]);
});
mouseState.addMapping('close-banned', () => {
    app.bannedUsersPopup.style.display = 'none';
});
socket.on('chats.views.list.update', function([chatId, oldUserId, user]){
    app.updatetest(chatId, oldUserId, user);
});
document.querySelector('#file-list').addEventListener('change', (e) => {
    socket.emit('admins.set.file', e.target.value);
});
document.querySelector('#request-list').addEventListener('change', (e) => {
    socket.emit('admins.set.request', e.target.value);
});
mouseState.addMapping('delete-view', (target) => {
    app.viewClose(target.parentElement.dataset.id);
});
socket.on('disconnect',() => {
    users.clear();
});
mouseState.addMapping('logout', () => {
    socket.emit('logout');
});
socket.on('agents.update.status', ([userId, status, name]) => {
    app.agentsStatus(userId, status, name);
});
socket.on('chats.status', ([name, userId, chatId, companionCreated]) => {
    app.chats[chatId].setStatus(name, userId, companionCreated);
});
socket.on('message.read', ([userId, chatId]) => {
    app.chats[chatId].setRead(userId);
});
socket.on('message.page', ([messages, ended, chatId]) => {
    app.chats[chatId].page(messages, ended);
});
socket.on('message.new', ([message, hasId, chatId]) => {
    app.new(message, hasId, chatId);
});
socket.on('message.new.log', ([chatId, message, userId, name]) => {
    app.newLog(chatId, message, userId, name);
});

mouseState.buttonsListenTo(document.querySelector('#window'));