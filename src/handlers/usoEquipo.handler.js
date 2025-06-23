const { createApiGatewayHandler } = require('../libs/apiGateway');
const usoEquipoController = require('../controllers/usoEquipo.controller');

// Create handlers for each endpoint
module.exports.registrarUso = createApiGatewayHandler(
  usoEquipoController.registrarUso.bind(usoEquipoController)
);

module.exports.finalizarUso = createApiGatewayHandler(
  usoEquipoController.finalizarUso.bind(usoEquipoController)
);

module.exports.obtenerUso = createApiGatewayHandler(
  usoEquipoController.getById.bind(usoEquipoController)
);

module.exports.listarUsosPorEstudiante = createApiGatewayHandler(
  usoEquipoController.listByEstudiante.bind(usoEquipoController)
);

module.exports.listarUsosPorPractica = createApiGatewayHandler(
  usoEquipoController.listByPractica.bind(usoEquipoController)
);

module.exports.listarUsosPorLaboratorio = createApiGatewayHandler(
  usoEquipoController.listByLaboratorio.bind(usoEquipoController)
);

module.exports.obtenerEstadisticasLaboratorio = createApiGatewayHandler(
  usoEquipoController.getEstadisticasLaboratorio.bind(usoEquipoController)
);
