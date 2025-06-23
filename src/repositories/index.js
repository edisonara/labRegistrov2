// Repositorios para interactuar con la base de datos
// Exporta aquí todos los repositorios que se vayan creando

const laboratorioRepository = require('./laboratorio.repository');
const asignaturaRepository = require('./asignatura.repository');
const parcialRepository = require('./parcial.repository');
const practicaRepository = require('./practica.repository');
const usoEquipoRepository = require('./usoEquipo.repository');

module.exports = {
  laboratorioRepository,
  asignaturaRepository,
  parcialRepository,
  practicaRepository,
  usoEquipoRepository
};
