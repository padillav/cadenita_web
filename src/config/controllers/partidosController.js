const db = require('../db');

// GET /api/partidos - Obtener todos los partidos
const getPartidos = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const rows = await conn.query(`
            SELECT 
                p.id,
                p.fecha,
                el.nombre AS equipo_local,
                ev.nombre AS equipo_visitante,
                p.marcador_local,
                p.marcador_visitante
            FROM partidos p
            JOIN equipos el ON p.id_equipo_local = el.id
            JOIN equipos ev ON p.id_equipo_visitante = ev.id
            ORDER BY p.fecha DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener partidos', detalle: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// GET /api/partidos/:id - Obtener un partido por ID
const getPartidoById = async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await db.getConnection();
        const rows = await conn.query(`
            SELECT 
                p.id,
                p.fecha,
                p.id_equipo_local,
                el.nombre AS equipo_local,
                p.id_equipo_visitante,
                ev.nombre AS equipo_visitante,
                p.marcador_local,
                p.marcador_visitante
            FROM partidos p
            JOIN equipos el ON p.id_equipo_local = el.id
            JOIN equipos ev ON p.id_equipo_visitante = ev.id
            WHERE p.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Partido no encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el partido', detalle: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// POST /api/partidos - Crear un nuevo partido
const createPartido = async (req, res) => {
    const { fecha, id_equipo_local, id_equipo_visitante, marcador_local = 0, marcador_visitante = 0 } = req.body;
    let conn;
    try {
        conn = await db.getConnection();

        // Verificar que no sea el mismo equipo
        if (id_equipo_local === id_equipo_visitante) {
            return res.status(400).json({ error: 'El equipo local y visitante no pueden ser el mismo' });
        }

        // Verificar que ambos equipos existen
        const equipoLocal = await conn.query('SELECT id FROM equipos WHERE id = ?', [id_equipo_local]);
        if (equipoLocal.length === 0) {
            return res.status(400).json({ error: 'El equipo local no existe' });
        }

        const equipoVisitante = await conn.query('SELECT id FROM equipos WHERE id = ?', [id_equipo_visitante]);
        if (equipoVisitante.length === 0) {
            return res.status(400).json({ error: 'El equipo visitante no existe' });
        }

        const result = await conn.query(
            `INSERT INTO partidos (fecha, id_equipo_local, id_equipo_visitante, marcador_local, marcador_visitante)
             VALUES (?, ?, ?, ?, ?)`,
            [fecha, id_equipo_local, id_equipo_visitante, marcador_local, marcador_visitante]
        );
        res.status(201).json({ mensaje: 'Partido creado exitosamente', id: Number(result.insertId) });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el partido', detalle: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// PUT /api/partidos/:id - Actualizar un partido (fecha y equipos)
const updatePartido = async (req, res) => {
    const { id } = req.params;
    const { fecha, id_equipo_local, id_equipo_visitante, marcador_local, marcador_visitante } = req.body;
    let conn;
    try {
        conn = await db.getConnection();

        const partido = await conn.query('SELECT id FROM partidos WHERE id = ?', [id]);
        if (partido.length === 0) {
            return res.status(404).json({ error: 'Partido no encontrado' });
        }

        if (id_equipo_local === id_equipo_visitante) {
            return res.status(400).json({ error: 'El equipo local y visitante no pueden ser el mismo' });
        }

        const equipoLocal = await conn.query('SELECT id FROM equipos WHERE id = ?', [id_equipo_local]);
        if (equipoLocal.length === 0) {
            return res.status(400).json({ error: 'El equipo local no existe' });
        }

        const equipoVisitante = await conn.query('SELECT id FROM equipos WHERE id = ?', [id_equipo_visitante]);
        if (equipoVisitante.length === 0) {
            return res.status(400).json({ error: 'El equipo visitante no existe' });
        }

        await conn.query(
            `UPDATE partidos 
             SET fecha = ?, id_equipo_local = ?, id_equipo_visitante = ?, marcador_local = ?, marcador_visitante = ?
             WHERE id = ?`,
            [fecha, id_equipo_local, id_equipo_visitante, marcador_local, marcador_visitante, id]
        );
        res.json({ mensaje: 'Partido actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el partido', detalle: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// PATCH /api/partidos/:id/marcador - Actualizar solo el marcador
const updateMarcador = async (req, res) => {
    const { id } = req.params;
    const { marcador_local, marcador_visitante } = req.body;
    let conn;
    try {
        conn = await db.getConnection();

        const partido = await conn.query('SELECT id FROM partidos WHERE id = ?', [id]);
        if (partido.length === 0) {
            return res.status(404).json({ error: 'Partido no encontrado' });
        }

        await conn.query(
            'UPDATE partidos SET marcador_local = ?, marcador_visitante = ? WHERE id = ?',
            [marcador_local, marcador_visitante, id]
        );
        res.json({ mensaje: 'Marcador actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el marcador', detalle: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// DELETE /api/partidos/:id - Eliminar un partido
const deletePartido = async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await db.getConnection();

        const partido = await conn.query('SELECT id FROM partidos WHERE id = ?', [id]);
        if (partido.length === 0) {
            return res.status(404).json({ error: 'Partido no encontrado' });
        }

        await conn.query('DELETE FROM partidos WHERE id = ?', [id]);
        res.json({ mensaje: 'Partido eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el partido', detalle: err.message });
    } finally {
        if (conn) conn.release();
    }
};

module.exports = { getPartidos, getPartidoById, createPartido, updatePartido, updateMarcador, deletePartido };