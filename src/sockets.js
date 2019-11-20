// importacion del esquema para guardar los datos
const Chat = require('./models/Chat');

module.exports = io => {

  // almacena usuarios en un objeto
  let users = {};

  io.on('connection', async socket => {
    //envia evento con los mensajes anteriores con limite de 8
    let messages = await Chat.find({}).limit(8).sort('-created');

    socket.emit('load old msgs', messages);

    socket.on('new user', (data, cb) => {
      if (data in users) {
        cb(false);
      } else {
        cb(true);
        socket.nickname = data;
        // almacena la informacion del socket de cada usuario
        users[socket.nickname] = socket;
        updateNicknames();
      }
    });

    // recibe mensaje del broadcasting
    socket.on('send message', async (data, cb) => {
      //elimina los espacios de mas de los mensajes
      var msg = data.trim();

      //verifica los 3 primeros caracteres del mensaje
      if (msg.substr(0, 3) === '/w ') {
        msg = msg.substr(3);
        // estable el espacio en blanco del mensaje
        var index = msg.indexOf(' ');
        if(index !== -1) {
          // determina del usuario
          var name = msg.substring(0, index);
          // determina del mensaje
          var msg = msg.substring(index + 1);
          if (name in users) {
            //emite al usuario que se indique en el comando el mensaje secreto
            users[name].emit('whisper', {
              msg,
              nick: socket.nickname 
            });
          } else {
            //callback error usuario
            cb('Error! Ingrese un usuario valido');
          }
        } else {
          //callback error de mensaje
          cb('Error! Por favor ingrese mensaje');
        }
      } else {
        var newMsg = new Chat({
          msg,
          nick: socket.nickname
        });
        await newMsg.save();
      
        io.sockets.emit('new message', {
          msg,
          nick: socket.nickname
        });
      }
    });

    // evento desconexion socket
    socket.on('disconnect', data => {
      if(!socket.nickname) return;
      // eliminar el socket del usuario que se desconecte
      delete users[socket.nickname];
      updateNicknames();
    });

    function updateNicknames() {
      // envia un array de usuarios
      io.sockets.emit('usernames', Object.keys(users));
    }
  });

}
