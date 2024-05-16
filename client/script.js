import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
    startChat(`You are connected with id: ${socket.io}`);
})

socket.on('receive-message', msg => {
    displayMsg(msg, 'receive');
})
function startChat(msg){
    // let msgBox = document.createElement("input");
    // msgBox.name = ''
}

let formChat = document.getElementById('frmChat');
let chatAreaDiv = document.getElementById('chatarea');

formChat.addEventListener('submit', e => {
    e.preventDefault();
    if(document.getElementById('txtMsgBox')){
        let msg = document.getElementById('txtMsgBox').value;
        socket.emit('sendMessage', msg);
        displayMsg(msg, 'send');
    }
    else{
        alert("Please type something");
    }
})

let displayMsg = (msg, type) => {
    if(type == "send"){
        let ChatDiv = document.createElement('div');
        ChatDiv.innerHTML = msg;
        ChatDiv.className = "send";
        chatAreaDiv.appendChild(ChatDiv);
    }
    else{
        let ChatDiv = document.createElement('div');
        ChatDiv.innerHTML = msg;
        ChatDiv.className = "receive";
        chatAreaDiv.appendChild(ChatDiv);
    }
}