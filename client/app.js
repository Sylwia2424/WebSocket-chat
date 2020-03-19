let userName;
const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');
const socket = io();

messagesSection.classList.remove('show');

socket.on('message',({ author, content }) => { 
  console.log(`New message from ${author}: ${content}`);
    addMessage(author, content);
  });
  
  socket.on('join', (user) => {
    console.log('New user joined the conversation', user);
  });
  
  socket.on('leave', (user) => {
    console.log(user, 'has left the conversation ');
  });
socket.emit('message', { author: 'Chat Bot', content: 'New user has joined the conversation!' });

// login form

const loginHandler = event => {
  event.preventDefault();
  userName = userNameInput.value;

  if(userName == null || userName == '') {
    alert('Fields can\'t be empty!');
 } else {
    const user = socket.id; 

    socket.emit('join', { author: userName, id: user });
    messagesSection.classList.toggle('show');
    loginForm.classList.toggle('show');
 }
} 

loginForm.addEventListener('submit', loginHandler);

// message form

const addMessage = function(author, content) {
  const messsage = document.createElement('li');
  messsage.classList.add('message', 'message--received');
  if (author === userName) {
    messsage.classList.add('message--self');
  }
  messsage.innerHTML = `<h3 class='message__author'>${
    userName === author ? 'You' : author
  }</h3>
<div class='message__content'>${content}</div>`;
  messagesList.appendChild(messsage);
};

function sendMessage(e) {
  e.preventDefault();

  let messageContent = messageContentInput.value;

  if(!messageContent.length) {
    alert('You have to type something!');
  }
  else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent })
    
  }
  
};

addMessageForm.addEventListener('submit', sendMessage);