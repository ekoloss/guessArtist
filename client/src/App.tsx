import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './translations/i18n';
import Main from './page/main';
import Game from "./page/game";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="game/:gameId" element={<Game />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
