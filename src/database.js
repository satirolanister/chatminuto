const mongoose = require('mongoose');

//conecta la base de datos
mongoose.connect('mongodb://localhost/chat', {
    useNewUrlParser: true
})
  //si conecta nuestra el mensaje
  .then(db => console.log('db conectada'))
  // si no conecta indica error
  .catch(err => console.log(err));