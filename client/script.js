import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
    startChat(`You are connected to this socket: ${socket.id}`);
})

socket.on('receive-message', msg => {
    // Create a new Date object
    const currentDate = new Date();

    // Get the current time components (hours, minutes, seconds)
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentSecond = currentDate.getSeconds();
    let time = `${currentHour} : ${currentMinute}`;
    displayMsg(msg, 'receive', time);
})

socket.on('joined-message', id => {
    // Create a new Date object
    const currentDate = new Date();

    // Get the current time components (hours, minutes, seconds)
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentSecond = currentDate.getSeconds();
    let time = `${currentHour} : ${currentMinute}`;
    displayMsg(`${id} Joined the room`, 'join', time);
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
        // Create a new Date object
        const currentDate = new Date();

        // Get the current time components (hours, minutes, seconds)
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();
        const currentSecond = currentDate.getSeconds();
        let time = `${currentHour} : ${currentMinute}`;
        displayMsg(msg, 'send', time);
    }
    else{
        alert("Please type something");
    }
})

let displayMsg = (msg, type, time) => {
    let ChatDiv = document.createElement('div');
    let msgDiv = document.createElement('div');
    msgDiv.innerHTML = msg;
    if(type == "send"){
        ChatDiv.className = "send";
    }
    else if(type == "receive"){
        ChatDiv.className = "receive";
    }
    else if(type == "join"){
        ChatDiv.className = "join";
    }
    ChatDiv.appendChild(msgDiv);
    if(time != undefined){
        let timeSpan = document.createElement('span');
        timeSpan.innerHTML = time;
        timeSpan.className = 'spn';
        ChatDiv.appendChild(timeSpan);
    }
    chatAreaDiv.appendChild(ChatDiv);
}
btnJoinRoom.addEventListener('click', ()=>{
    let roomId = document.getElementById("txtRoom").value;
    document.getElementById("roomId").value = roomId;
    socket.emit('join-room', roomId);
    // Create a new Date object
    const currentDate = new Date();

    // Get the current time components (hours, minutes, seconds)
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentSecond = currentDate.getSeconds();
    let time = `${currentHour} : ${currentMinute}`;
    displayMsg(`${socket.id} Joined the room`, 'join', time);
});