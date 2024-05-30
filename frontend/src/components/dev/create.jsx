import React, { useState, useEffect } from 'react';
import { FormField, Button, Form, Message, Select, Radio } from 'semantic-ui-react';
import axios from 'axios';

const DevCreate = () => {
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [hobby, setHobby] = useState('');
  const [nivel_id, setNivelId] = useState(0);
  const [message, setMessage] = useState('');
  const postData = (event) => {
    event.preventDefault();
    axios
      .post('http://127.0.0.1:3000/api/desenvolvedores', { nome, sexo, data_nascimento: dataNascimento, hobby, nivel_id })
      .then((res) => {
        setMessage(<Message positive><p>{res.data.nome} ({res.data.id}) adicionado com sucesso!</p></Message>);
        setNome('');
      })
      .catch((err) => {
        setMessage(<Message negative><p>Erro ao adicionar: {err.response.data.message}</p></Message>)
      });
  }
  const nivelOptions = [];
  axios.get(`http://127.0.0.1:3000/api/niveis/all`)
  .then((response) => {
      response.data.forEach((nivel) => {
        nivelOptions.push({ key: nivel.id, text: nivel.nivel, value: nivel.id });
      });
});
  return (
    <>
  <Form>
    <FormField>
      <label>Nome</label>
      <input
        placeholder='Junim'
        required={true}
        onChange={(e) => setNome(e.target.value)} value={nome}
      />
    </FormField>
    <FormField>
      <label>Sexo</label>
      <Radio
        label='Masculino'
        name='radioGroup'
        value='M'
        checked={sexo === 'M'}
        onChange={(e, { value }) => setSexo(value)}
      />
      <Radio
        label='Feminino'
        name='radioGroup'
        value='F'
        checked={sexo === 'F'}
        onChange={(e, { value }) => setSexo(value)}
      />
    </FormField>
    <FormField>
      <label>Data de Nascimento</label>
      <input type='date' placeholder='01/01/1990' onChange={(e) => setDataNascimento(e.target.value)} value={dataNascimento} />
    </FormField>
    <FormField>
      <label>Hobby</label>
      <input placeholder='Futebol' onChange={(e) => setHobby(e.target.value)} value={hobby} />
    </FormField>
    <FormField>
      <label>Nível</label>
      <Select
        placeholder='Selecione o nível'
        required  
        options={nivelOptions}
        onChange={(e, { value }) => setNivelId(value)} value={nivel_id} />
    </FormField>
    <Button onClick={postData} type='submit'>Submit</Button>
  </Form>
  {message}
  </>
)};

export default DevCreate