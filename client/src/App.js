import React from 'react';
import logo from './logo.svg';
import './App.css';
import Customers from './components/customers/Customers';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Welome to React</p>
      </header>
      <Customers />
    </div>
  );
}

export default App;
