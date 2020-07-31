const socket = io();

let username = '';
let userList = [];

let loginPage = document.querySelector('#loginPage');
let chatPage = document.querySelector('#chatPage');

let loginName = document.querySelector('#loginName');
let chatMessage = document.querySelector('#chatMessage');

loginPage.style.display = 'flex';
chatPage.style.display = 'none';

function renderUserList() {
  let ul = document.querySelector('.userList');
  ul.innerHTML = '';

  userList.forEach(user => {
    ul.innerHTML += '<li>'+user+'</li>';
  })
}

loginName.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    let name = loginName.value.trim();
    if(name != ' '){
      username = name;
      document.title = 'Chat ('+username+')';
      socket.emit('join-request', username);
    }
  }
});

socket.on('user-ok', (connectedUsers) => {
  loginPage.style.display = 'none';
  chatPage.style.display = 'flex';
  chatMessage.focus();

  userList = connectedUsers;
  renderUserList();
})