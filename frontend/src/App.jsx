import { useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Route, Routes, Link } from 'react-router-dom'
import './App.css'
import LevelCreate from './components/level/create';
import LevelList from './components/level/read';

function App() {
  return (
    <>
      <h2>
        Cadastro de Desenvolvedores
      </h2>
      <nav>
        <ul>
          <li><Link to="/">Listar Níveis</Link></li>
          <li><Link to="/level">Cadastrar Níveis</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<LevelList />} />
        <Route path="/level" element={<LevelCreate />} />
      </Routes>
    </>
  )
}

export default App
