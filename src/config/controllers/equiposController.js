const db = require('../db');

// GET /api/equipos
const getEquipos = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const rows = await conn.query(`
            SELECT e.id, e.nombre, e.nombre_coach, c.nombre AS categoria
            FROM equipos e
            JOIN categorias c ON e.id_categoria = c.id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener equipos', detalle: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// POST /api/equipos
const createEquipo = async (req, res) => {
    const { nombre, id_categoria, nombre_coach } = req.body;
    let conn;
    try {
        conn = await db.getConnection();
        const categoria = await conn.query('SELECT id FROM categorias WHERE id = ?', [id_categoria]);
        if (categoria.length === 0) {
            return res.status(400).json({ error: 'La categoría especificada no existe' });
        }
        const result = await conn.query(
            'INSERT INTO equipos (nombre, id_categoria, nombre_coach) VALUES (?, ?, ?)',
            [nombre, id_categoria, nombre_coach]
        );
        res.status(201).json({ mensaje: 'Equipo creado exitosamente', id: Number(result.insertId) });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el equipo', detalle: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// PUT /api/equipos/:id
const updateEquipo = async (req, res) => {
    const { id } = req.params;
    const { nombre, id_categoria, nombre_coach } = req.body;
    let conn;
    try {
        conn = await db.getConnection();
        const equipo = await conn.query('SELECT id FROM equipos WHERE id = ?', [id]);
        if (equipo.length === 0) {
            return res.status(404).json({ error: 'Equipo no encontrado' });
        }
        if (id_categoria) {
            const categoria = await conn.query('SELECT id FROM categorias WHERE id = ?', [id_categoria]);
            if (categoria.length === 0) {
                return res.status(400).json({ error: 'La categoría especificada no existe' });
            }
        }
        await conn.query(
            'UPDATE equipos SET nombre = ?, id_categoria = ?, nombre_coach = ? WHERE id = ?',
            [nombre, id_categoria, nombre_coach, id]
        );
        res.json({ mensaje: 'Equipo actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el equipo', detalle: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// DELETE /api/equipos/:id
const deleteEquipo = async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await db.getConnection();
        const equipo = await conn.query('SELECT id FROM equipos WHERE id = ?', [id]);
        if (equipo.length === 0) {
            return res.status(404).json({ error: 'Equipo no encontrado' });
        }
        await conn.query('DELETE FROM equipos WHERE id = ?', [id]);
        res.json({ mensaje: 'Equipo eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el equipo', detalle: err.message });
    } finally {
        if (conn) conn.release();
    }
};

module.exports = { getEquipos, createEquipo, updateEquipo, deleteEquipo };