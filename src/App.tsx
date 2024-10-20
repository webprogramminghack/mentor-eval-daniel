import React, { useState } from 'react';
import Todo from './Todo';
import EditModal from './components/EditModal/EditModal';

const App: React.FC = () => {
  return (
    <div className='main'>
      <div className='title'>
        <h1>Let's Get Things Done!</h1>
        <h2>One Step Closer to Your Goals</h2>
      </div>
      <Todo />
    </div>
  );
};

export default App;
