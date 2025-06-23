const { createApiGatewayHandler } = require('../libs/apiGateway');
const laboratorioController = require('../controllers/laboratorio.controller');

// Create handlers for each endpoint
module.exports.crearLaboratorio = createApiGatewayHandler(
  laboratorioController.create.bind(laboratorioController)
);

module.exports.obtenerLaboratorio = createApiGatewayHandler(
  laboratorioController.getById.bind(laboratorioController)
);

module.exports.actualizarLaboratorio = createApiGatewayHandler(
  laboratorioController.update.bind(laboratorioController)
);

module.exports.eliminarLaboratorio = createApiGatewayHandler(
  laboratorioController.delete.bind(laboratorioController)
);

module.exports.listarLaboratorios = createApiGatewayHandler(
  laboratorioController.list.bind(laboratorioController)
);

module.exports.verificarDisponibilidad = createApiGatewayHandler(
  laboratorioController.getDisponibilidad.bind(laboratorioController)
);
