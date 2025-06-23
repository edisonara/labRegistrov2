// Modelos de la base de datos
// Exporta aquí todos los modelos que se vayan creando

const Laboratorio = require('./laboratorio.model');
const Asignatura = require('./asignatura.model');
const Parcial = require('./parcial.model');
const Practica = require('./practica.model');
const UsoEquipo = require('./usoEquipo.model');

module.exports = {
  Laboratorio,
  Asignatura,
  Parcial,
  Practica,
  UsoEquipo
};
