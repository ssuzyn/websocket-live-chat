let currentUsername = '';

const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/ws-connect'
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/subscribe/chat', (message) => {
        showMessage(JSON.parse(message.body));
    });
};

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
    setConnected(false);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
    setConnected(false);
};

function setConnected(connected) {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');

    if (connected) {
        statusIndicator.classList.add('connected');
        statusText.textContent = '연결됨';
    } else {
        statusIndicator.classList.remove('connected');
        statusText.textContent = '연결 끊김';
        document.getElementById('message').disabled = true;
        document.getElementById('send').disabled = true;
    }
}

function setUsername() {
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();

    if (username) {
        currentUsername = username;
        document.querySelector('.username-input').style.display = 'none';
        document.getElementById('conversation').style.display = 'block';
        document.getElementById('message').disabled = false;
        document.getElementById('send').disabled = false;

        // Start the connection after username is set
        stompClient.activate();
    }
}

function sendMessage() {
    const messageInput = document.getElementById('message');
    const content = messageInput.value.trim();

    if (content && currentUsername) {
        stompClient.publish({
            destination: "/publish/chat",
            body: JSON.stringify({
                'username': currentUsername,
                'content': content
            })
        });
        messageInput.value = '';
    }
}

function showMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.username === currentUsername ? 'sent' : 'received'}`;

    messageElement.innerHTML = `
        <div class="username">${message.username}</div>
        <div class="message-content">${message.content}</div>
    `;

    messagesDiv.appendChild(messageElement);
    scrollToBottom();
}

function scrollToBottom() {
    const messageArea = document.querySelector('.chat-messages');
    messageArea.scrollTop = messageArea.scrollHeight;
}

// Event Listeners
document.getElementById('set-username').addEventListener('click', setUsername);
document.getElementById('send').addEventListener('click', sendMessage);

document.getElementById('username').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        setUsername();
    }
});

document.getElementById('message').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});