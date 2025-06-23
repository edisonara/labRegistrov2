const BaseController = require('./base.controller');
const asignaturaService = require('../services/asignatura.service');

class AsignaturaController extends BaseController {
  constructor() {
    super(asignaturaService);
  }

  async getByDocente(req) {
    try {
      const { docenteId } = req.pathParameters;
      const result = await this.service.getAsignaturasByDocente(docenteId);
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async getConParciales(req) {
    try {
      const { id } = req.pathParameters;
      const result = await this.service.getAsignaturaConParciales(id);
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }
}

module.exports = new AsignaturaController();
