import React, { useState, useEffect } from 'react';
import { FormField, Button, Form, Message } from 'semantic-ui-react';
import axios from 'axios';

const FormLevel = () => {
  const [nivel, setNivel] = useState('');
  const [message, setMessage] = useState('');
  const postData = (event) => {
    event.preventDefault();
    axios
      .post('http://127.0.0.1:3000/api/niveis', { nivel })
      .then((res) => {
        setMessage(<Message positive><p>{res.data.nivel} ({res.data.id}) adicionado com sucesso!</p></Message>);
        setNivel('');
      })
      .catch((err) => {
        setMessage(<Message negative><p>Erro ao adicionar: {err.response.data.message}</p></Message>)
      });
  }
  return (
    <>
  <Form>
    <FormField>
      <label>Nome do Nível</label>
      <input placeholder='Junim' onChange={(e) => setNivel(e.target.value)} value={nivel} />
    </FormField>
    <Button onClick={postData} type='submit'>Submit</Button>
  </Form>
  {message}
  </>
)};

export default FormLevel