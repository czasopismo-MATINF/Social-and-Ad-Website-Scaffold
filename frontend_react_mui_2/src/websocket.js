import keycloak from "./keycloak.js";

import { Client } from '@stomp/stompjs';

const client = new Client({
  reconnectDelay: 2000,
  webSocketFactory: () => {
    keycloak.updateToken(30);
    console.log("Connecting to web socket.");
    return new WebSocket(`ws://localhost:3020/websocket-ms?token=${keycloak.token}`);
  }
});

function connectToWebSocket(msgCallback) {

  if(!client.connected) {

    client.onConnect = () => {

      console.log("Websocket connected.");
      
      client.subscribe(`/topic/room.123`, msg => {
        const body = JSON.parse(msg.body);
        console.log(body);
        /*
        dispatch(addTestMessage({
          message: body
        }));
        */
      });

      client.subscribe(`/user/queue/private`, msg => {
        const body = JSON.parse(msg.body);
        if(msgCallback) {
            msgCallback(body);
        }
      });

      for(let i = 0; i < 3; ++i) {
        client.publish({
          destination: '/app/test.send',
          body: JSON.stringify({
            content: `${i}`
          }),
        });
      }

    };

    client.activate();

  } else {
    console.log("Websocket client already connected.");
  }

}

export default {
    connectToWebSocket
}