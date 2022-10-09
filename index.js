const express = require('express');
const path = require('path');
const apiRoutes = require('./routers/app.routers');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, './public')));

// Routes
app.use('/api' , apiRoutes);

app.use('*', (req, res) =>{
  res.status(404).send({success: false, error : -2 , description: `Error ${res.statusCode}: El método ${req.method} para la ruta ${req.baseUrl} no es correcto. Verifique la ruta o consulte al administrador.`})
})

const connectedServer = app.listen(PORT, ()=> {
  console.log(`Server is up and running on port ${PORT}`);
});

connectedServer.on('error', (error) => {
  console.error('Error: ', error);
})