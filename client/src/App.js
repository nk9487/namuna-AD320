import logo from './logo.svg';
import './App.css';
import Topbar from "./components/Topbar/Topbar.js"
import CardNavigation from './components/CardNavigation/CardNavigation.js';
import React from 'react';
//import   './Topbar.css';
function App() {
  return(
    <React.Fragment>
      <Topbar/>
      <CardNavigation/>
    </React.Fragment>
    

  ) 
  //{
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
  
}

export default App;
