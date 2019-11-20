/*Logica de la interfaz */
$(function () {

    // socket.io conexion de cliente
    const socket = io.connect();

    // obtener elementos DOM de la interfaz de chat
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    // obtener elementos DOM de la interfaz de nickname form
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname');

    // obtener elementos DOM del usersname
    const $users = $('#usernames');

    $nickForm.submit(e => {
      //previne el refrescar pagina
      e.preventDefault();

      socket.emit('new user', $nickname.val(), data => {
        if(data) {
          $('#nickWrap').hide();
          $('#contentWrap').show();
          $('#message').focus();
        } else {
          $nickError.html(`
            <div class="alert alert-danger">
              Este usuario ya existe.
            </div>
          `);
        }
      });
      $nickname.val('');
    });

    // eventos
    $messageForm.submit( e => {
      e.preventDefault();
      //emit envia evento de error
      socket.emit('send message', $messageBox.val(), data => {
        //agrega error al chat en dado caso de recibir error
        $chat.append(`<p class="error">${data}</p>`)
      });
      $messageBox.val('');
    });

    socket.on('new message', data => {
      displayMsg(data);
    });

    //carga usuarios en la interfaz
    socket.on('usernames', data => {
      let html = '';
      for(i = 0; i < data.length; i++) {
        html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`; 
      }
      $users.html(html);
    });
    // recibe datos del comando /w
    socket.on('whisper', data => {
      $chat.append(`<p class="whisper"><b>${data.nick}</b>: ${data.msg}</p>`);
    });

    // muestra los mensajes en el front
    socket.on('load old msgs', msgs => {
      for(let i = msgs.length -1; i >=0 ; i--) {
        displayMsg(msgs[i]);
      }
    });

    function displayMsg(data) {
      $chat.append(`<p class="msg"><b>${data.nick}</b>: ${data.msg}</p>`);
    }

});