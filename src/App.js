import './App.css';
import React from 'react';
import { useState } from 'react';
import * as consts from './components/constants';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UserPage from './components/UserPage';
import ShopPage from './components/ShopPage';

import { addUser, loginCheck } from './data_structures';

function App() {
  const [screen, setScreen] = useState(consts.SCREEN_MAIN);
  const [curUser, setUser] = useState(null);
  switch (screen) {
    case consts.SCREEN_MAIN: return <MainPage curUser={curUser} setUser={setUser} switchHandler={setScreen} />;
    case consts.SCREEN_LOGIN: return <LoginPage curUser={curUser} setUser={setUser} switchHandler={setScreen} loginHandler={(name, pass) => {
      try {
        setUser(loginCheck(name, pass));
        setScreen(consts.SCREEN_USER);
      }
      catch (e) {
        alert(e.message);
        setUser(null);
      }
    }} />;
    case consts.SCREEN_REGISTER: return <RegisterPage curUser={curUser} setUser={setUser} switchHandler={setScreen} registerHandler={(name, pass, locX, locY, contacts) => {
      try {
        setUser(addUser(name, pass, locX, locY, contacts));
        setScreen(consts.SCREEN_USER);
      }
      catch (e) {
        alert(e.message);
        setUser(null);
      }

    }} />;
    case consts.SCREEN_USER: return <UserPage switchHandler={setScreen} curUser={curUser} setUser={setUser} />;
    case consts.SCREEN_SHOP: return <ShopPage switchHandler={setScreen} curUser={curUser} setUser={setUser} />;
    default: return <div></div>
  }
}

export default App;
