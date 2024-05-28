const express = require('express');
require('dotenv').config();
const connection = require('./connection');

const app = express();
app.use(express.json());

// Default
app.get('/api/niveis', async (req, res) => {
    try {
        const [results, fields] = await connection.promise().query(
            'SELECT * FROM `nivel`'
        );

        res.status(200).json(results); // results contains rows returned by server
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get by num
app.get('/api/niveis/:id', async (req, res) => {
    const { id } = req.params;
    const [results, fields] = await connection.promise().query(
        'SELECT * FROM `nivel` WHERE id = ?',
        [id]
    );

    if (!results.length) {
        res.status(404).json({ message: 'Nível não encontrado' });
        return;
    }
    res.status(200).json(results[0]);
});

// Add new
app.post('/api/niveis', async (req, res) => {
    const { nivel } = req.body;
    if (!nivel) {
        res.status(400).json({ message: 'Nível é obrigatório' });
        return;
    }
    const id = mock.niveis.length + 1;
    mock.niveis.push({ id, nivel });
    res.status(201).json({ id, nivel });
});

// Update one
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
        res.status(204).send();
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
    const index = mock.niveis.findIndex((item) => item.id == id);
    if (index < 0) {
        res.status(404).json({ message: 'Nível não encontrado' });
        return;
    }
    mock.niveis[index].nivel = nivel;
    res.status(200).json(mock.niveis[index]);
});

app.delete('/api/niveis/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: 'ID é obrigatório' });
        return;
    }
    const index = mock.niveis.findIndex((item) => item.id == id);
    if (index < 0) {
        res.status(404).json({ message: 'Nível não encontrado' });
        return;
    }
    mock.niveis.splice(index, 1);
    res.status(204).send();
});

module.exports = app;