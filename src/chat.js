const http = require('http')
const express =require('express');
const app =express();
const morgan =require('morgan');
const io = require('socket.io');
const Sequelize = require('sequelize');

/*
const sequelize = new Sequelize('bd_chat','jose','josefa',{
    host:'localhost',
    dialect:'mysql',// one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' 
    //pool:{ max:5, min:0, idle:10000}
})
*/

const sequelize = new Sequelize('heroku_3bb7e9ccf44c3d4','b0c3979ceddf2f','ab35583b',{
  host:'eu-cdbr-west-02.cleardb.net',
  dialect:'mysql',// one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' 
  //pool:{ max:5, min:0, idle:10000}
})
sequelize.authenticate()
  .then(() => {
    console.log('Conectado a la BD')
  })
  .catch(err => {
    console.log('No se ha podido conectar a la BD')
  })




const server = http.createServer(app);

//Configuración Servidor http
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'))
app.use(express.static(__dirname + "/public"));


//Inicialización Servidor Http
server.listen(app.get('port'), function(){
    console.log("Servidor iniciado en el puerto " + app.get('port'));
})


// Aquí la Lógica de los Sockets
const sockets=io.listen(server)
require('./sockets')(sockets,sequelize);