import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
    startChat(`You are connected to this socket: ${socket.id}`);
})

socket.on('receive-message', msg => {
    displayMsg(msg, 'receive');
})
function startChat(msg){
    displayMsg(msg, 'start');
}

let formChat = document.getElementById('frmChat');
let chatAreaDiv = document.getElementById('chatarea');
let btnJoinRoom = document.getElementById('btnRoom')

formChat.addEventListener('submit', e => {
    e.preventDefault();
    if(document.getElementById('txtMsgBox')){
        let msg = document.getElementById('txtMsgBox').value;
        let room = document.getElementById('roomId').value;
        socket.emit('sendMessage', msg, room);
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
    else if(type == "receive"){
        let ChatDiv = document.createElement('div');
        ChatDiv.innerHTML = msg;
        ChatDiv.className = "receive";
        chatAreaDiv.appendChild(ChatDiv);
    }
    else{
        document.getElementById("room").innerHTML = msg;
    }
}
btnJoinRoom.addEventListener('click', ()=>{
    let roomId = document.getElementById("txtRoom").value;
    document.getElementById("roomId").value = roomId;
    socket.emit('join-room', roomId);
});