const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');

const {
    getPartidos,
    getPartidoById,
    createPartido,
    updatePartido,
    updateMarcador,
    deletePartido
} = require('../partidosController');

// Middleware errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }
    next();
};

// Validaciones para crear/actualizar partido completo
const partidoValidationRules = [
    body('fecha')
        .notEmpty().withMessage('La fecha es obligatoria')
        .isISO8601().withMessage('La fecha debe tener formato válido (YYYY-MM-DD HH:MM:SS)'),
    body('id_equipo_local')
        .notEmpty().withMessage('El equipo local es obligatorio')
        .isInt({ min: 1 }).withMessage('id_equipo_local debe ser un número entero positivo'),
    body('id_equipo_visitante')
        .notEmpty().withMessage('El equipo visitante es obligatorio')
        .isInt({ min: 1 }).withMessage('id_equipo_visitante debe ser un número entero positivo'),
    body('marcador_local')
        .optional()
        .isInt({ min: 0 }).withMessage('El marcador local debe ser un número entero positivo'),
    body('marcador_visitante')
        .optional()
        .isInt({ min: 0 }).withMessage('El marcador visitante debe ser un número entero positivo'),
];

// Validaciones solo para marcador
const marcadorValidationRules = [
    body('marcador_local')
        .notEmpty().withMessage('El marcador local es obligatorio')
        .isInt({ min: 0 }).withMessage('El marcador local debe ser un número entero positivo'),
    body('marcador_visitante')
        .notEmpty().withMessage('El marcador visitante es obligatorio')
        .isInt({ min: 0 }).withMessage('El marcador visitante debe ser un número entero positivo'),
];

const idParamValidation = [
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
];

// Rutas
router.get('/',                   getPartidos);
router.get('/:id',                idParamValidation, handleValidationErrors, getPartidoById);
router.post('/',                  partidoValidationRules, handleValidationErrors, createPartido);
router.put('/:id',                idParamValidation, partidoValidationRules, handleValidationErrors, updatePartido);
router.patch('/:id/marcador',     idParamValidation, marcadorValidationRules, handleValidationErrors, updateMarcador);
router.delete('/:id',             idParamValidation, handleValidationErrors, deletePartido);

module.exports = router;
