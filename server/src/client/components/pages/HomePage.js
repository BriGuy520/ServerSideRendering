import React from 'react';

const Home = () => {
  return (
    <div>
      <div>Home Component</div>
      <button onClick={() => console.log('Clicked button')}>Click Me!</button>
    </div>
  );
}

export default {
  component: Home
};