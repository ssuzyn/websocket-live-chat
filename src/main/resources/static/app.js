let currentUsername = '';

// STOMP 클라이언트 생성 및 WebSocket 연결
const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/ws-connect' // 1. WebSocket 연결 및 Handshake 진행
});

// STOMP 연결 성공 시 실행되는 함수
stompClient.onConnect = (frame) => {
    setConnected(true); // 연결 상태 UI 업데이트
    console.log('Connected: ' + frame);

    // 2. 클라이언트가 특정 채팅 채널 구독 (서버에서 메시지를 받을 준비)
    stompClient.subscribe('/subscribe/chat', (message) => {
        showMessage(JSON.parse(message.body)); // 수신한 메시지를 화면에 출력
    });
};

// WebSocket 연결 오류 발생 시 실행되는 함수
stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
    setConnected(false); // 연결 상태를 끊김으로 설정
};

// STOMP 프로토콜 오류 발생 시 실행되는 함수
stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
    setConnected(false); // 연결 상태를 끊김으로 설정
};

// UI에서 연결 상태를 표시하는 함수
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

// 사용자 이름 설정 및 WebSocket 연결 활성화
function setUsername() {
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();

    if (username) {
        currentUsername = username; // 현재 사용자 이름 저장
        document.querySelector('.username-input').style.display = 'none';
        document.getElementById('conversation').style.display = 'block';
        document.getElementById('message').disabled = false;
        document.getElementById('send').disabled = false;

        // 3. 사용자 이름이 설정된 후 WebSocket 연결 시작
        stompClient.activate();
    }
}

// 메시지를 서버로 전송하는 함수
function sendMessage() {
    const messageInput = document.getElementById('message');
    const content = messageInput.value.trim();

    if (content && currentUsername) {
        // 4. 사용자가 입력한 메시지를 특정 채널로 발행 (publish)
        stompClient.publish({
            destination: "/publish/chat",
            body: JSON.stringify({
                'username': currentUsername,
                'content': content
            })
        });
        messageInput.value = ''; // 메시지 입력창 초기화
    }
}

// 수신한 메시지를 화면에 출력하는 함수
function showMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.username === currentUsername ? 'sent' : 'received'}`;

    messageElement.innerHTML = `
        <div class="username">${message.username}</div>
        <div class="message-content">${message.content}</div>
    `;

    messagesDiv.appendChild(messageElement);
    scrollToBottom(); // 새로운 메시지가 추가될 때 스크롤을 가장 아래로 이동
}

// 메시지 창이 자동으로 아래로 스크롤되도록 하는 함수
function scrollToBottom() {
    const messageArea = document.querySelector('.chat-messages');
    messageArea.scrollTop = messageArea.scrollHeight;
}

// 이벤트 리스너 등록 (버튼 클릭 및 엔터 키 입력 처리)
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
