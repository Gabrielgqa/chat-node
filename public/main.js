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
      if(username == user) {
        ul.innerHTML += '<li class="m-user"><span class="me">'+user+'</span> '+msg+'</li>';
      } else {
        ul.innerHTML += '<li class="m-user"><span>'+user+'</span> '+msg+'</li>';
      }
    break;
  }

  ul.scrollTop = ul.scrollHeight;
}

loginName.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    let name = loginName.value.trim();
    if(name != ''){
      username = name;
      document.title = 'Chat ('+username+')';
      socket.emit('join-request', username);
    }
  }
});

chatMessage.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    let txt = chatMessage.value.trim();
    chatMessage.value = '';

    if(txt != ''){
      addMessage('message', username, txt);
      socket.emit('send-msg', txt);
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

socket.on('show-msg', (data) => {
  addMessage('message', data.username, data.message);
});

socket.on('disconnect', () => {
  addMessage('status', null, 'Você foi desconectado!');
  chatMessage.disabled = true;
  userList = [];
  renderUserList();
});

socket.on('reconnect_error', () => {
  addMessage('status', null, 'Tentando reconectar...');
});

socket.on('reconnect', () => {
  addMessage('status', null, 'Reconectado...');
  chatMessage.disabled = false;

  if(username != '') {
    socket.emit('join-request', username);
  }
});