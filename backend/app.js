const express = require('express');
require('dotenv').config();
const connection = require('./connection');

const app = express();
app.use(express.json());

const calcAge = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

app.get('/api/niveis', async (req, res) => {
    try {
        const [ results ] = await connection.promise().query(
            'SELECT * FROM `nivel`'
        );
        if (!results.length) {
            res.status(404).json({ message: 'Nenhum nível encontrado' });
            return;
        }
        res.status(200).json(results); // results contains rows returned by server
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/niveis/:id', async (req, res) => {
    const { id } = req.params;
    const [ results ] = await connection.promise().query(
        'SELECT * FROM `nivel` WHERE id = ?',
        [id]
    );

    if (!results.length) {
        res.status(404).json({ message: 'Nível não encontrado' });
        return;
    }
    res.status(200).json(results[0]);
});

app.post('/api/niveis', async (req, res) => {
    const { nivel } = req.body;
    if (!nivel) {
        res.status(400).json({ message: 'Nível é obrigatório' });
        return;
    }
    
    try {
        let [ results ] = await connection.promise().execute(
            'INSERT INTO `nivel` (nivel) VALUES (?)',
            [nivel]
        );
        
        [ results ] = await connection.promise().query(
             'SELECT * FROM `nivel` where id = ?', [results.insertId]
        );
        res.status(201).json(results[0])
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/niveis/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: 'ID é obrigatório' });
        return;
    }
    const { nivel } = req.body;
    if (!nivel) {
        res.status(400).json({ message: 'Nível é obrigatório' });
        return;
    }
    
    try {
        await connection.promise().query(
            'UPDATE `nivel` SET nivel = ? WHERE id = ?',
            [nivel, id]
        );
        const [ results ] = await connection.promise().query(
            'SELECT * FROM `nivel` where id = ?', [id]
        );
        res.status(200).json(results[0])
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.patch('/api/niveis/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: 'ID é obrigatório' });
        return;
    }
    const { nivel } = req.body;
    if (!nivel) {
        res.status(400).json({ message: 'Nível é obrigatório' });
        return;
    }
    
    try {
        await connection.promise().query(
            'UPDATE `nivel` SET nivel = ? WHERE id = ?',
            [nivel, id]
        );
        const [ results ] = await connection.promise().query(
            'SELECT * FROM `nivel` where id = ?', [id]
        );
        res.status(200).json(results[0])
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/niveis/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: 'ID é obrigatório' });
        return;
    }
    
    try {
        const [ results ] = await connection.promise().query(
            'SELECT * FROM `nivel` where id = ?', [id]
        );
        if (!results.length) {
            res.status(404).json({ message: 'Nível não encontrado' });
            return;
        }
        await connection.promise().query(
            'DELETE FROM `nivel` WHERE id = ?',
            [id]
        );
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/desenvolvedores', async (req, res) => {
    try {
        const [ results ] = await connection.promise().query(
            'SELECT * FROM `dev`, `nivel` WHERE dev.nivel_id = nivel.id'
        );
        if (!results.length) {
            res.status(404).json({ message: 'Nenhum desenvolvedor encontrado' });
            return;
        }
        
        results.forEach(async (dev) => {
            dev.hobby = dev.hobby ?? '';
            dev.sexo = dev.sexo ?? '';
            dev.data_nascimento = dev.data_nascimento ?? '';
            dev.nivel = {
                id: dev.nivel_id,
                nivel: dev.nivel
            };
            dev.idade = dev.data_nascimento ? calcAge(dev.data_nascimento) : '';
            delete dev.nivel_id;
        });
        res.status(200).json(results); // results contains rows returned by server
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/desenvolvedores', async (req, res) => {
    const {
        nome,
        sexo = null,
        data_nascimento = null,
        hobby = null,
        nivel_id,
    } = req.body;
    if (!nome || !nivel_id) {
        res.status(400).json({ message: 'Nome e nível são obrigatórios' });
        return;
    }
    
    try {
        let [ results ] = await connection.promise().execute(
            'INSERT INTO `dev` (nome, sexo, data_nascimento, hobby, nivel_id, idade) VALUES (?, ?, ?, ?, ?, ?)',
            [nome, sexo, data_nascimento, hobby, nivel_id, calcAge(data_nascimento)]
        );
        
        [ results ] = await connection.promise().query(
             'SELECT * FROM `dev` where id = ?', [ results.insertId ]
        );
        res.status(201).json(results[0])
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/desenvolvedores/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: 'ID é obrigatório' });
        return;
    }
    const {
        nome,
        sexo = null,
        data_nascimento = null,
        hobby = null,
        nivel_id,
    } = req.body;
    if (!nome || !nivel_id) {
        res.status(400).json({ message: 'Nome e nível são obrigatórios' });
        return;
    }
    
    try {
        await connection.promise().query(
            'UPDATE `dev` SET nome = ?, sexo = ?, data_nascimento = ?, hobby = ?, nivel_id = ?, idade = ? WHERE id = ?',
            [nome, sexo, data_nascimento, hobby, nivel_id, calcAge(data_nascimento), id]
        );
        const [ results ] = await connection.promise().query(
            'SELECT * FROM `dev` where id = ?', [id]
        );
        if (results.length === 0) {
            res.status(404).json({ message: 'Desenvolvedor não encontrado' });
            return;
        }
        res.status(200).json(results[0])
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.patch('/api/desenvolvedores/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: 'ID é obrigatório' });
        return;
    }
    const {
        nome,
        sexo = null,
        data_nascimento = null,
        hobby = null,
        nivel_id,
    } = req.body;
    if (!nome || !nivel_id) {
        res.status(400).json({ message: 'Nome e nível são obrigatórios' });
        return;
    }
    
    try {
        await connection.promise().query(
            'UPDATE `dev` SET nome = ?, sexo = ?, data_nascimento = ?, hobby = ?, nivel_id = ?, idade = ? WHERE id = ?',
            [nome, sexo, data_nascimento, hobby, nivel_id, calcAge(data_nascimento), id]
        );
        const [ results ] = await connection.promise().query(
            'SELECT * FROM `dev` where id = ?', [id]
        );
        if (results.length === 0) {
            res.status(404).json({ message: 'Desenvolvedor não encontrado' });
            return;
        }
        res.status(200).json(results[0])
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/desenvolvedores/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: 'ID é obrigatório' });
        return;
    }
    
    try {
        const [ results ] = await connection.promise().query(
            'SELECT * FROM `dev` where id = ?', [id]
        );
        if (!results.length) {
            res.status(404).json({ message: 'Desenvolvedor não encontrado' });
            return;
        }
        await connection.promise().query(
            'DELETE FROM `dev` WHERE id = ?',
            [id]
        );
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = app;