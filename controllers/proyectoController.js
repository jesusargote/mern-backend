import mongoose from 'mongoose';
import Proyecto from '../models/Proyecto.js';
import Tarea from '../models/Tarea.js';
import Usuario from '../models/Usuario.js';

const obtenerProyectos = async (req, res) => {
    const proyectos = await Proyecto.find().where('creador').equals(req.usuario).select('-tareas');
    res.json(proyectos);
};

const nuevoProyecto = async (req, res) => {
    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario._id;

    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
       
    }
};

const obtenerProyecto = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'ID no válido' });
    }

    const proyecto = await Proyecto.findById(id).populate('tareas').populate('colaboradores', 'nombre email');

    if (!proyecto) {
        const error = new Error('No encontrado');
        return res.status(404).json({ msg: error.message });
    }
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida');
        return res.status(401).json({ msg: error.message });
    }

    const tareas = await Tarea.find().where('proyecto').equals(proyecto._id);
    res.json(proyecto);
};

const editarProyecto = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'ID no válido' });
    }

    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({ msg: error.message });
    }
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida');
        return res.status(401).json({ msg: error.message });
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
    proyecto.cliente = req.body.cliente || proyecto.cliente;

    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const eliminarProyecto = async (req, res) => {
    const { id } = req.params;

    try {
        const proyecto = await Proyecto.findById(id);

        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Aquí podrías validar que solo el creador pueda eliminarlo

        await proyecto.deleteOne();

        res.json({ msg: 'Proyecto eliminado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al eliminar el proyecto' });
    }
};


const buscarColaborador = async (req, res) => {
    const { email } = req.body;

    const usuario = await Usuario.findOne({ email }).select('-confirmado -createdAt -password -token -updatedAt -__v');

    if (!usuario) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({ msg: error.message });
    }

    res.json(usuario);
};

const agregarColaborador = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'ID de proyecto no válido' });
    }

    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida');
        return res.status(401).json({ msg: error.message });
    }

    const { email } = req.body;

    const usuario = await Usuario.findOne({ email }).select(
        '-password -token -confirmado -createdAt -updatedAt -__v'
    );

    if (!usuario) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({ msg: error.message });
    }

    if (usuario._id.toString() === proyecto.creador.toString()) {
        const error = new Error('El creador del proyecto no puede ser colaborador');
        return res.status(400).json({ msg: error.message });
    }

    if (proyecto.colaboradores.some(id => id.toString() === usuario._id.toString())) {
        const error = new Error('El usuario ya es colaborador');
        return res.status(400).json({ msg: 'El usuario ya es colaborador' });
    }


    proyecto.colaboradores.push(usuario._id);
    await proyecto.save();

    res.json({ msg: 'Colaborador agregado correctamente' });
};

const eliminarColaborador = async (req, res) => {
  const { id } = req.params;
  const { colaboradorId } = req.body;

  try {
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    // Verifica que quien elimina sea el creador
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      return res.status(401).json({ msg: "Acción no permitida" });
    }

    // Eliminar colaborador
    proyecto.colaboradores.pull(colaboradorId);
    await proyecto.save();

    res.json({ msg: "Colaborador eliminado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};


export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
};
