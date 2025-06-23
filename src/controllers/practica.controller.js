const BaseController = require('./base.controller');
const practicaService = require('../services/practica.service');

class PracticaController extends BaseController {
  constructor() {
    super(practicaService);
  }

  async create(req) {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { parcialId, asignaturaId } = req.pathParameters;
      data.parcialId = parcialId;
      data.asignaturaId = asignaturaId;
      const result = await this.service.createPractica(data);
      return createResponse(201, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async getById(req) {
    try {
      const { id } = req.pathParameters;
      const result = await this.service.getPractica(id);
      if (!result) {
        return createResponse(404, { error: 'Práctica no encontrada' });
      }
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async update(req) {
    try {
      const { id } = req.pathParameters;
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const result = await this.service.updatePractica(id, data);
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async delete(req) {
    try {
      const { id } = req.pathParameters;
      await this.service.deletePractica(id);
      return createResponse(204);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async listByParcial(req) {
    try {
      const { parcialId, asignaturaId } = req.pathParameters;
      const result = await this.service.listPracticasByParcial(parcialId, asignaturaId);
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async listByLaboratorio(req) {
    try {
      const { laboratorioId } = req.pathParameters;
      const { fecha } = req.queryStringParameters || {};
      const result = await this.service.listPracticasByLaboratorio(laboratorioId, fecha);
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async getConUsos(req) {
    try {
      const { id } = req.pathParameters;
      const result = await this.service.getPracticaConUsos(id);
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }
}

module.exports = new PracticaController();
