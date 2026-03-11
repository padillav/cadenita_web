const db = require('../db');

// GET /api/categorias
const getCategorias = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const rows = await conn.query('SELECT * FROM categorias');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener categorías', detalle: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// GET /api/categorias/:id
const getCategoriaById = async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await db.getConnection();
        const rows = await conn.query('SELECT * FROM categorias WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener la categoría', detalle: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// POST /api/categorias
const createCategoria = async (req, res) => {
    const { nombre, edad_min, edad_max } = req.body;
    let conn;
    try {
        conn = await db.getConnection();
        const result = await conn.query(
            'INSERT INTO categorias (nombre, edad_min, edad_max) VALUES (?, ?, ?)',
            [nombre, edad_min, edad_max]
        );
        res.status(201).json({ mensaje: 'Categoría creada exitosamente', id: Number(result.insertId) });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear la categoría', detalle: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// PUT /api/categorias/:id
const updateCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre, edad_min, edad_max } = req.body;
    let conn;
    try {
        conn = await db.getConnection();
        const categoria = await conn.query('SELECT id FROM categorias WHERE id = ?', [id]);
        if (categoria.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        await conn.query(
            'UPDATE categorias SET nombre = ?, edad_min = ?, edad_max = ? WHERE id = ?',
            [nombre, edad_min, edad_max, id]
        );
        res.json({ mensaje: 'Categoría actualizada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar la categoría', detalle: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// DELETE /api/categorias/:id
const deleteCategorias = async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await db.getConnection();
        const categoria = await conn.query('SELECT id FROM categorias WHERE id = ?', [id]);
        if (categoria.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        await conn.query('DELETE FROM categorias WHERE id = ?', [id]);
        res.json({ mensaje: 'Categoría eliminada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la categoría', detalle: err.message });
    } finally {
        if (conn) conn.release();
    }
};

module.exports = { getCategorias, getCategoriaById, createCategoria, updateCategoria, deleteCategorias };