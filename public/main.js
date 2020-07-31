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
};

function addMessage(type, user, msg) {
  let ul = document.querySelector('.chatList');

  switch (type) {
    case 'status':
      ul.innerHTML += '<li class="m-status">'+msg+'</li>';
    break;
    case 'message':
      ul.innerHTML += '<li class="m-user"><span>'+user+'</span> '+msg+'</li>';
    break;
  }
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

  addMessage('status', null, 'Conectado!');

  userList = connectedUsers;
  renderUserList();
});

socket.on('list-update', (data) => {
  if(data.joined){
    addMessage('status', null, data.joined+' entrou na sala.');
  }
  if(data.left){
    addMessage('status', null, data.left+' saiu da sala.');
  }

  userList = data.list;
  renderUserList();
});