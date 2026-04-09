import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const socketUrl = 'http://localhost:3020/websocket-ms'; // lub za gatewayem

const client = new Client({
  webSocketFactory: () => new SockJS(socketUrl),
  reconnectDelay: 5000,
});

client.onConnect = () => {
  // Subskrypcja pokoju
  client.subscribe('/topic/room.123', (message) => {
    const body = JSON.parse(message.body);
    console.log('New message', body);
    // tutaj aktualizujesz state w React
  });

  // wysłanie wiadomości
  /*
  client.publish({
    destination: '/app/chat.send',
    body: JSON.stringify({
      roomId: '123',
      senderId: 'user-1',
      content: 'Hello',
      timestamp: Date.now(),
    }),
  });
  */
};

client.activate();

export default client;
