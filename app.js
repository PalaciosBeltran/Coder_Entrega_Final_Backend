const express = require('express');
const errorMiddleware = require('./middleware/error.middleware');
const apiRoutes = require('./routers/app.routers');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);

app.use('*', (req, res) =>{
    res.status(404).send({success: false, error : -2 , description: `Error ${res.statusCode}: El método ${req.method} para la ruta ${req.baseUrl} no es correcto. Verifique la ruta o consulte al administrador.`})
  })

app.use(errorMiddleware);

module.exports = app;