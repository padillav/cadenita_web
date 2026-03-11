const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');

const {
    getEquipos,
    getEquipoById,
    createEquipo,
    updateEquipo,
    deleteEquipo
} = require('../equiposController'); // ✅ sube una carpeta: routes → controllers/

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }
    next();
};

const equipoValidationRules = [
    body('nombre')
        .notEmpty().withMessage('El nombre del equipo es obligatorio')
        .isLength({ max: 100 }).withMessage('El nombre no puede superar 100 caracteres'),
    body('id_categoria')
        .notEmpty().withMessage('La categoría es obligatoria')
        .isInt({ min: 1 }).withMessage('id_categoria debe ser un número entero positivo'),
    body('nombre_coach')
        .notEmpty().withMessage('El nombre del coach es obligatorio')
        .isLength({ max: 100 }).withMessage('El nombre del coach no puede superar 100 caracteres'),
];

const idParamValidation = [
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
];

router.get('/',    getEquipos);
router.get('/:id', idParamValidation, handleValidationErrors, getEquipoById);
router.post('/',   equipoValidationRules, handleValidationErrors, createEquipo);
router.put('/:id', idParamValidation, equipoValidationRules, handleValidationErrors, updateEquipo);
router.delete('/:id', idParamValidation, handleValidationErrors, deleteEquipo);

module.exports = router;