const express = require('express');
require('dotenv').config();
const connection = require('./connection');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

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
    const returnData = {
        data : [],
        total: 0,
        per_page: 5,
        current_page: 1,
        last_page: 1,
    };
    try {
        const page = req.query.page ?? 1;
        const [ results ] = await connection.promise().query(
            'SELECT tnivel.*, count(tdev.id) as devs FROM ' 
            + '(select * from `nivel` order by id) tnivel '
            + 'left join '
            + '(select id, nivel_id from `dev`) tdev '
            + 'on (tnivel.id = tdev.nivel_id) '
            + 'group by tnivel.id limit 5 offset ?', [(page - 1) * 5]
        );
        if (!results.length) {
            res.status(404).json({ message: 'Nenhum nível encontrado' });
            return;
        }
        const [ countLevels ] = await connection.promise().query(
            'SELECT count(*) as total FROM `nivel`'
        );
        returnData.total = countLevels[0]['total'];
        returnData.per_page = 5;
        returnData.current_page = Number(page);
        returnData.last_page = Math.ceil(returnData.total / returnData.per_page);
        returnData.data = results;
        res.status(200).json(returnData); // results contains rows returned by server
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/niveis/all', async (req, res) => {
    try {
        const [ results ] = await connection.promise().query(
            'SELECT * FROM `nivel` order by nivel'
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
    console.log(req);
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
        const [ checkFK ] = await connection.promise().query(
            'SELECT count(*) as qtd FROM `dev` where nivel_id = ?', [id]
        );
        if (checkFK[0]['qtd'] > 0) {
            res.status(400).json({ message: 'Não é possível excluir níveis com desenvolvedores associados' });
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
    const returnData = {
        data : [],
        total: 0,
        per_page: 5,
        current_page: 1,
        last_page: 1,
    };
    const page = req.query.page ?? 1;
    try {
        const [ results ] = await connection.promise().query(
            'SELECT dev.*, nivel.nivel FROM `dev`, `nivel` WHERE dev.nivel_id = nivel.id limit 5 offset ?', [(page - 1) * 5]
        );
        if (!results.length) {
            res.status(404).json({ message: 'Nenhum desenvolvedor encontrado' });
            return;
        }
        const [ countDevs ] = await connection.promise().query(
            'SELECT count(*) as total FROM `dev`'
        );
        returnData.total = countDevs[0]['total'];
        returnData.per_page = 5;
        returnData.current_page = Number(page);
        returnData.last_page = Math.ceil(returnData.total / returnData.per_page);
        
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

        returnData.data = results;

        res.status(200).json(returnData); 
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
    if (sexo && sexo !== 'M' && sexo !== 'F') {
        res.status(400).json({ message: 'Sexo inválido' });
        return;
    }

    if (data_nascimento && !data_nascimento.match(/^\d{4}-\d{2}-\d{2}$/)) {
        res.status(400).json({ message: 'Data de nascimento inválida' });
        return;
    }
    
    try {
        let dataNascStr = null;
        if (data_nascimento) {
            let dataNasc = new Date(data_nascimento);
            dataNascStr = dataNasc.toISOString().split('T')[0];
        }

        let [ results ] = await connection.promise().execute(
            'INSERT INTO `dev` (nome, sexo, data_nascimento, hobby, nivel_id, idade) VALUES (?, ?, ?, ?, ?, ?)',
            [nome, sexo, dataNascStr, hobby, nivel_id, calcAge(data_nascimento)]
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