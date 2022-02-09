import logo from './logo.svg';
import './App.css';
import Topbar from "./components/Topbar/Topbar.js"
import CardNavigation from './components/CardNavigation/CardNavigation.js';
import React from 'react';
import Flashcard from './components/Flashcard/FlashCard';
//import   './Topbar.css';
function App() {
  return(
    <React.Fragment>
      <Topbar/>
      <div style = {{display: "flex"}}>
        <CardNavigation/>
        <Flashcard/>
      </div>

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
