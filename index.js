// Importa express usando ESModules
import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from "cors"
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';



// Inicializa express
const app = express();

// Permite que express entienda datos en formato JSON
app.use(express.json());

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Conecta a la base de datos
connectDB();

//Configurar CORS
const whitelist =[process.env.FRONTEND_URL]

const corsOptions ={
    origin: function(origin, callback){
        if (whitelist.includes(origin)) {
            // Puede consultar la API
            callback(null, true)
        }else{
            // No esta permitido el req
            callback(new Error("Error de Cors"))
        }
    }
}
app.use(cors(corsOptions))

// Define las rutas base para el endpoint de usuarios
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/tareas', tareaRoutes)


// Define el puerto, usando el valor del entorno si está disponible
const PORT = process.env.PORT || 4000;

// Inicia el servidor
app.listen(4000, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
