const socket = io();

let username = '';
let userList = [];

let loginPage = document.querySelector('#loginPage');
let chatPage = document.querySelector('#chatPage');

let loginName = document.querySelector('#loginName');
let chatMessage = document.querySelector('#chatMessage');

loginPage.style.display = 'flex';
chatPage.style.display = 'none';

loginName.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    let name = loginName.value.trim();
    if(name != ' '){
      username = name;
      document.title = 'Chat ('+username+')';
    }
  }
})