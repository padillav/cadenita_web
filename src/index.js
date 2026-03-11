const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const categoriasRoutes = require('./config/controllers/routes/categoriasRoutes');
const equiposRoutes    = require('./config/controllers/routes/equiposRoutes');
const partidosRoutes   = require('./config/controllers/routes/partidosRoutes');

app.use('/api/categorias', categoriasRoutes);
app.use('/api/equipos',    equiposRoutes);
app.use('/api/partidos',   partidosRoutes);

app.get('/', (req, res) => {
    res.send('API del Torneo funcionando correctamente');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});