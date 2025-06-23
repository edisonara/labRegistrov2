'use strict';

// Import all handlers
const laboratorioHandlers = require('./src/handlers/laboratorio.handler');
const asignaturaHandlers = require('./src/handlers/asignatura.handler');
const parcialHandlers = require('./src/handlers/parcial.handler');
const practicaHandlers = require('./src/handlers/practica.handler');
const usoEquipoHandlers = require('./src/handlers/usoEquipo.handler');

// Export all handlers
module.exports = {
  // Laboratorio handlers
  crearLaboratorio: laboratorioHandlers.crearLaboratorio,
  obtenerLaboratorio: laboratorioHandlers.obtenerLaboratorio,
  actualizarLaboratorio: laboratorioHandlers.actualizarLaboratorio,
  eliminarLaboratorio: laboratorioHandlers.eliminarLaboratorio,
  listarLaboratorios: laboratorioHandlers.listarLaboratorios,
  verificarDisponibilidad: laboratorioHandlers.verificarDisponibilidad,
  
  // Asignatura handlers
  crearAsignatura: asignaturaHandlers.crearAsignatura,
  obtenerAsignatura: asignaturaHandlers.obtenerAsignatura,
  actualizarAsignatura: asignaturaHandlers.actualizarAsignatura,
  eliminarAsignatura: asignaturaHandlers.eliminarAsignatura,
  listarAsignaturas: asignaturaHandlers.listarAsignaturas,
  obtenerAsignaturasPorDocente: asignaturaHandlers.obtenerAsignaturasPorDocente,
  obtenerAsignaturaConParciales: asignaturaHandlers.obtenerAsignaturaConParciales,
  
  // Parcial handlers
  crearParcial: parcialHandlers.crearParcial,
  obtenerParcial: parcialHandlers.obtenerParcial,
  actualizarParcial: parcialHandlers.actualizarParcial,
  eliminarParcial: parcialHandlers.eliminarParcial,
  listarParcialesPorAsignatura: parcialHandlers.listarParcialesPorAsignatura,
  listarParcialesActivos: parcialHandlers.listarParcialesActivos,
  obtenerParcialConPracticas: parcialHandlers.obtenerParcialConPracticas,
  
  // Práctica handlers
  crearPractica: practicaHandlers.crearPractica,
  obtenerPractica: practicaHandlers.obtenerPractica,
  actualizarPractica: practicaHandlers.actualizarPractica,
  eliminarPractica: practicaHandlers.eliminarPractica,
  listarPracticasPorParcial: practicaHandlers.listarPracticasPorParcial,
  listarPracticasPorLaboratorio: practicaHandlers.listarPracticasPorLaboratorio,
  obtenerPracticaConUsos: practicaHandlers.obtenerPracticaConUsos,
  
  // Uso de Equipo handlers
  registrarUso: usoEquipoHandlers.registrarUso,
  finalizarUso: usoEquipoHandlers.finalizarUso,
  obtenerUso: usoEquipoHandlers.obtenerUso,
  listarUsosPorEstudiante: usoEquipoHandlers.listarUsosPorEstudiante,
  listarUsosPorPractica: usoEquipoHandlers.listarUsosPorPractica,
  listarUsosPorLaboratorio: usoEquipoHandlers.listarUsosPorLaboratorio,
  obtenerEstadisticasLaboratorio: usoEquipoHandlers.obtenerEstadisticasLaboratorio,
  
  // Welcome endpoint
  bienvenida: async (event, context) => {
    try {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          mensaje: '¡Bienvenido al Sistema de Gestión de Laboratorios!',
          descripcion: 'API RESTful para el registro y gestión de uso de laboratorios',
          version: '1.0.0',
          estado: 'En desarrollo',
          endpoints: {
            documentacion: '/docs',
            laboratorios: '/laboratorios',
            asignaturas: '/asignaturas',
            parciales: '/asignaturas/{asignaturaId}/parciales',
            practicas: '/asignaturas/{asignaturaId}/parciales/{parcialId}/practicas',
            usoEquipos: '/uso-equipos'
          }
        })
      };
    } catch (error) {
      console.error('Error en bienvenida:', error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Error interno del servidor',
          detalle: error.message
        })
      };
    }
  }
};
