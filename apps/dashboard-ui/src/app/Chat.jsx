import React, { useState, useEffect } from 'react';

const URL = 'ws://127.0.0.1:8080';

const Chat = () => {
  const [isConnected, setConnected] = useState(false);
  const [userName, setUserName] = useState('User1');
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [wsConnection, setWsConnection] = useState(null);

  const submitMessage = (usr, msg) => {
    const message = { userName: usr, message: msg };
    wsConnection.send(JSON.stringify(message));
    setMessages([message, ...messages]);
  };

  const connectWebSocket = () => {
    // if there is a connection already, close it
    if (wsConnection && wsConnection.OPEN) {
      wsConnection.close();
      setConnected(false);
      setWsConnection(null);
      return;
    }

    // create a new connection
    const wsConn = new WebSocket(URL);
    wsConn.onopen = () => {
      setConnected(true);
    };
    wsConn.onerror = (e) => {
      console.log('WebSocket error: ', e);
      setConnected(false);
    };
    wsConn.onmessage = (e) => {
      if (wsConn.OPEN) {
        const message = JSON.parse(e.data);
        setMessages([message, ...messages]);
      }
    };
    wsConn.onclose = () => {
      console.log('WebSocket Disconnected');
      setConnected(false);
    };

    setWsConnection(wsConn);
  };

  return (
    <div>
      <button onClick={() => connectWebSocket()}>
        {isConnected ? 'Disconnect' : 'Connect'}
      </button>
      <br />
      <br />

      <label htmlFor="userName">
        Name :
        <input
          type="text"
          id="userName"
          placeholder="User"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </label>

      <ul>
        {messages.reverse().map((message, index) => (
          <li key={index}>
            <b>{message.userName}</b>: <em>{message.message}</em>
          </li>
        ))}
      </ul>

      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          submitMessage(userName, message);
          setMessage([]);
        }}
      >
        <input
          type="text"
          placeholder={'Type a message ...'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input type="submit" value={'Send'} disabled={!isConnected && true} />
      </form>
    </div>
  );
};

export default Chat;
