import { useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Route, Routes, Link } from 'react-router-dom'
import './App.css'
import LevelCreate from './components/level/create';
import LevelList from './components/level/read';
import LevelUpdate from './components/level/update';
import DevCreate from './components/dev/create';
import DevList from './components/dev/read';
import DevUpdate from './components/dev/update';

function App() {
  return (
    <>
      <h2>
        Cadastro de Desenvolvedores
      </h2>
      <nav>
        <ul>
          <li><Link to="/dev/read">Listar Desenvolvedores</Link></li>
          <li><Link to="/dev/create">Cadastrar Desenvolvedor</Link></li>
          <li><Link to="/level/read">Listar Níveis</Link></li>
          <li><Link to="/level/create">Cadastrar Nível</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<DevList />} />
        <Route path="/dev/read" element={<DevList />} />
        <Route path="/dev/create" element={<DevCreate />} />
        <Route path="/dev/update" element={<DevUpdate />} />
        <Route path="/level/read" element={<LevelList />} />
        <Route path="/level/create" element={<LevelCreate />} />
        <Route path="/level/update" element={<LevelUpdate />} />
      </Routes>
    </>
  )
}

export default App
