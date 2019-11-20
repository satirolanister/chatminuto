/*Librerias para inicio de la aplicación*/
const app = require('./app');
/*libreria para server socket.io*/
const http = require('http');
/*libreria socket.io enviar y recibir mensajes en tiempo real */
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio.listen(server);
require('./sockets')(io);
require('./database');

async function main() {
  await server.listen(app.get('port'));
  console.log(`servidor iniciando en el puerto ${app.get('port')}`);
}

main();