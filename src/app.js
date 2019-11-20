const express = require('express');
const app = express();

const path = require('path');

// configuraciones del puerto de escucha
app.set('port', process.env.PORT || 3000);

/*archivos estaticos */
app.use(express.static(path.join(__dirname, 'public')));

// iniciar server 
module.exports = app;
