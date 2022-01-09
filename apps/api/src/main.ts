import { v4 as uuidv4 } from 'uuid';
import WebSocket, { WebSocketServer } from 'ws';

const clients = new Map();
const wsServer = new WebSocketServer({ port: 8080 });

wsServer.on('connection', (wsConnection) => {
  const clientData = { id: uuidv4() };
  clients.set(wsConnection, clientData);
  console.log('Client connected: %s', clientData.id);

  // ONMESSAGE
  wsConnection.on('message', (data, isBinary) => {
    console.log('Data Received: %s', data);

    wsServer.clients.forEach((client) => {
      if (client !== wsConnection && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  // ONCLOSE
  wsConnection.on('close', () => {
    const client = clients.get(wsConnection);
    console.log('Client disconnected: %s', client.id);
    clients.delete(wsConnection);
  });
});
