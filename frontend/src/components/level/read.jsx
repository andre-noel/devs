
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css';
  import {
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableFooter,
  TableCell,
  TableBody,
  MenuItem,
  Icon,
  Label,
  Menu,
  Table,
  Confirm,
  Message,
} from 'semantic-ui-react'
import { GrEdit } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";

const LevelList = () => {
  const [APIData, setAPIData] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedId, setSelectedId] = useState(0);
  const handleConfirm = async () => {
    try {
      const res = await axios
        .delete(`http://127.0.0.1:3000/api/niveis/${selectedId}`);
      setMessage(<Message positive><p>Nível {selectedId} apagado com sucesso!</p></Message>);
    } catch (err) {
      setMessage(<Message negative><p>Erro ao apagar o nível {selectedId}</p><p>{err.response.data.message}</p></Message>);
    } finally {
      setOpen(false);
      setSelectedId(0);
    }
  };
  const handleCancel = () => {
    setMessage(<Message warning><p>Operação cancelada</p></Message>); 
    setOpen(false);
    setSelectedId(0);
  };
  const setData = (data) => {
    const { id, nivel } = data;
    localStorage.setItem('nivel_id', id);
    localStorage.setItem('nivel', nivel);
  };

  useEffect(() => {
    axios.get(`http://127.0.0.1:3000/api/niveis?page=${pageNumber}`)
      .then((response) => {
          setAPIData(response.data);
      })
  }, [pageNumber, selectedId]);
  return (
    <>
  <Table celled>
    <TableHeader>
      <TableRow>
        <TableHeaderCell>ID</TableHeaderCell>
        <TableHeaderCell>Nível</TableHeaderCell>
        <TableHeaderCell># devs</TableHeaderCell>
        <TableHeaderCell></TableHeaderCell>
        <TableHeaderCell></TableHeaderCell>
      </TableRow>
    </TableHeader>

    <TableBody>
    {APIData.data?.map((data) => {
      return (
      <TableRow key={data.id}>
        <TableCell>{data.id}</TableCell>
        <TableCell>{data.nivel}</TableCell>
        <TableCell>{data.devs}</TableCell>
        <TableCell>
          <Link to="/level/update">
            <button onClick={() => setData(data)}><GrEdit /></button>
          </Link>
        </TableCell>
        < TableCell>
          <button onClick={() => {
            setSelectedId(data.id);
            setOpen(true);
          }}><RiDeleteBin6Line /></button>
        </TableCell>
      </TableRow>
    )})}
    </TableBody>

    <TableFooter>
      <TableRow>
        <TableHeaderCell colSpan='5'>
          <Menu floated='right' pagination>
            <MenuItem as='a' onClick={() => setPageNumber(pageNumber - 1)} icon disabled={(pageNumber <= 1 ? 'disabled' : '')}>
              <Icon name='chevron left' />
            </MenuItem>
            {
              Array.from({ length: APIData.last_page }, (_, i) => i + 1).map((number) => {
                return (
                  <MenuItem as='a' key={number} onClick={() => setPageNumber(number)}>{number}</MenuItem>
                )
              })
            }
            <MenuItem as='a' onClick={() => setPageNumber(pageNumber + 1)} icon disabled={(pageNumber == APIData.last_page ? 'disabled' : '')}>
              <Icon name='chevron right' />
            </MenuItem>
          </Menu>
        </TableHeaderCell>
      </TableRow>
    </TableFooter>
  </Table>
  <Confirm
    open={open}
    onCancel={handleCancel}
    onConfirm={handleConfirm}
    content={<p>Você tem certeza que deseja apagar o nível {selectedId}?</p>}
  />
  {message}
  </>
)};

export default LevelList;