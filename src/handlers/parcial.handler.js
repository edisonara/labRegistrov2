const { createApiGatewayHandler } = require('../libs/apiGateway');
const parcialController = require('../controllers/parcial.controller');

// Create handlers for each endpoint
module.exports.crearParcial = createApiGatewayHandler(
  parcialController.create.bind(parcialController)
);

module.exports.obtenerParcial = createApiGatewayHandler(
  parcialController.getById.bind(parcialController)
);

module.exports.actualizarParcial = createApiGatewayHandler(
  parcialController.update.bind(parcialController)
);

module.exports.eliminarParcial = createApiGatewayHandler(
  parcialController.delete.bind(parcialController)
);

module.exports.listarParcialesPorAsignatura = createApiGatewayHandler(
  parcialController.listByAsignatura.bind(parcialController)
);

module.exports.listarParcialesActivos = createApiGatewayHandler(
  parcialController.listActivos.bind(parcialController)
);

module.exports.obtenerParcialConPracticas = createApiGatewayHandler(
  parcialController.getConPracticas.bind(parcialController)
);
