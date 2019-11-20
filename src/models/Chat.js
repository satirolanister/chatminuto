const mongoose = require('mongoose');
// definicion esquema de mongo
const { Schema } = mongoose;

// creacion de esquema de como lucen los datos 
const ChatSchema = new Schema({
  nick: String,
  msg: String,
  created: { type: Date, default: Date.now }
});


// exporta el modelo para mongo 
module.exports = mongoose.model('Chat', ChatSchema);
