import express from 'express'
import {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
    // obtenerTareas,
} from '../controllers/proyectoController.js'
import checkAuth from '../middleware/checkAuth.js'

const router = express.Router()

// router.get('/', checkAuth, obtenerProyectos)
// router.post('/', checkAuth, nuevoProyecto)

router
    .route('/')
    .get(checkAuth, obtenerProyectos)
    .post(checkAuth, nuevoProyecto)

router
    .route('/:id')
    .get(checkAuth, obtenerProyecto)
    .put(checkAuth, editarProyecto)
    .delete(checkAuth, eliminarProyecto);


    router.post('/colaboradores', checkAuth, buscarColaborador)
    router.post('/colaboradores/:id', checkAuth, agregarColaborador)
    router.delete('/colaboradores/:id', checkAuth, eliminarColaborador)

export default router