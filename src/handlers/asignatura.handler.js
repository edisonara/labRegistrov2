const { createApiGatewayHandler } = require('../libs/apiGateway');
const asignaturaController = require('../controllers/asignatura.controller');

// Create handlers for each endpoint
module.exports.crearAsignatura = createApiGatewayHandler(
  asignaturaController.create.bind(asignaturaController)
);

module.exports.obtenerAsignatura = createApiGatewayHandler(
  asignaturaController.getById.bind(asignaturaController)
);

module.exports.actualizarAsignatura = createApiGatewayHandler(
  asignaturaController.update.bind(asignaturaController)
);

module.exports.eliminarAsignatura = createApiGatewayHandler(
  asignaturaController.delete.bind(asignaturaController)
);

module.exports.listarAsignaturas = createApiGatewayHandler(
  asignaturaController.list.bind(asignaturaController)
);

module.exports.obtenerAsignaturasPorDocente = createApiGatewayHandler(
  asignaturaController.getByDocente.bind(asignaturaController)
);

module.exports.obtenerAsignaturaConParciales = createApiGatewayHandler(
  asignaturaController.getConParciales.bind(asignaturaController)
);
