const { createApiGatewayHandler } = require('../libs/apiGateway');
const practicaController = require('../controllers/practica.controller');

// Create handlers for each endpoint
module.exports.crearPractica = createApiGatewayHandler(
  practicaController.create.bind(practicaController)
);

module.exports.obtenerPractica = createApiGatewayHandler(
  practicaController.getById.bind(practicaController)
);

module.exports.actualizarPractica = createApiGatewayHandler(
  practicaController.update.bind(practicaController)
);

module.exports.eliminarPractica = createApiGatewayHandler(
  practicaController.delete.bind(practicaController)
);

module.exports.listarPracticasPorParcial = createApiGatewayHandler(
  practicaController.listByParcial.bind(practicaController)
);

module.exports.listarPracticasPorLaboratorio = createApiGatewayHandler(
  practicaController.listByLaboratorio.bind(practicaController)
);

module.exports.obtenerPracticaConUsos = createApiGatewayHandler(
  practicaController.getConUsos.bind(practicaController)
);
