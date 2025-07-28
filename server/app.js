require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Conexión a Mysql
const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

conexion.connect((err) => {
    if (err) {
        console.error('❌ Error de conexión a MySQL:', err.message);
        return;
    }
    console.log('✅ Conexión a MySQL exitosa');
})

// Ruta de prueba
app.get('/usuarios', (req, res) => {
    conexion.query('select * from usuarios', (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Ruta para agregar usuarios
app.post('/usuarios', (req, res) => {
  const { nombres, apellidos, documento, correo } = req.body;
  const sql = 'insert into usuarios (nombres, apellidos, documento, correo) VALUES (?, ?, ?, ?)';
  conexion.query(sql, [nombres, apellidos, documento, correo], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, nombres, apellidos, documento, correo });
  });
});

// Ruta para editar un usuario
app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, documento, correo } = req.body;
  const sql = 'update usuarios set nombres = ?, apellidos = ?, documento = ?, correo = ? where id = ?';
  conexion.query(sql, [nombres, apellidos, documento, correo, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Usuario actualizado exitosamente' });
  });
});

// Ruta para eliminar un usuario
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'delete from usuarios where id = ?';
  conexion.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Usuario eliminado exitosamente' });
  });
});

app.listen(3000, () => {
    console.log('🚀 Servidor corriendo en http://localhost:3000');
});