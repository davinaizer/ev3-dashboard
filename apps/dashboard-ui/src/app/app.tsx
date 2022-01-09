import React, { useEffect, useState } from 'react';
import { Message } from '@ev3-dashboard/api-interfaces';
import Chat from './Chat';

const wsServerURL = 'ws://127.0.0.1:8080';

export const App = () => {
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h1>Welcome to dashboard-ui!</h1>
      </div>
      <Chat />
    </>
  );
};

export default App;
