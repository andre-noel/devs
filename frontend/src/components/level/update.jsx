import React, { useState, useEffect } from 'react';
import { FormField, Button, Form, Message } from 'semantic-ui-react';
import axios from 'axios';

const LevelUpdate = () => {
  const [nivel, setNivel] = useState('');
  const [message, setMessage] = useState('');
  const [id, setId] = useState(null);
  useEffect(() => {
    setId(localStorage.getItem('nivel_id'));
    setNivel(localStorage.getItem('nivel'));
    }, []);    
  const updateAPIData = (event) => {
    event.preventDefault();
    axios
      .put(`http://127.0.0.1:3000/api/niveis/${id}`, { nivel } )
      .then((res) => {
        setMessage(<Message positive><p>{res.data.nivel} ({res.data.id}) alterado com sucesso!</p></Message>);
        setNivel('');
      })
      .catch((err) => {
        setMessage(<Message negative><p>Erro ao alterar: {err.response.data.message}</p></Message>)
      });
  }
  return (
    <>
  <Form>
    <FormField>
      <label>Nome do Nível</label>
      <input placeholder='Junim' onChange={(e) => setNivel(e.target.value)} value={nivel} />
    </FormField>
    <Button onClick={updateAPIData} type='submit'>Atualizar</Button>
  </Form>
  {message}
  </>
)};

export default LevelUpdate