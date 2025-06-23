const BaseController = require('./base.controller');
const usoEquipoService = require('../services/usoEquipo.service');

class UsoEquipoController extends BaseController {
  constructor() {
    super(usoEquipoService);
  }

  async registrarUso(req) {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const result = await this.service.registrarUso(data);
      return createResponse(201, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async finalizarUso(req) {
    try {
      const { id, estudianteId } = req.pathParameters;
      const result = await this.service.finalizarUso(id, estudianteId);
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async getById(req) {
    try {
      const { id, estudianteId } = req.pathParameters;
      const result = await this.service.getUso(id, estudianteId);
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async listByEstudiante(req) {
    try {
      const { estudianteId } = req.pathParameters;
      const result = await this.service.listUsosByEstudiante(estudianteId);
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async listByPractica(req) {
    try {
      const { practicaId } = req.pathParameters;
      const result = await this.service.listUsosByPractica(practicaId);
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async listByLaboratorio(req) {
    try {
      const { laboratorioId } = req.pathParameters;
      const result = await this.service.listUsosByLaboratorio(laboratorioId);
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async getEstadisticasLaboratorio(req) {
    try {
      const { laboratorioId } = req.pathParameters;
      const result = await this.service.getEstadisticasLaboratorio(laboratorioId);
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }
}

module.exports = new UsoEquipoController();
