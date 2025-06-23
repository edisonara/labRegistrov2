const BaseController = require('./base.controller');
const parcialService = require('../services/parcial.service');

class ParcialController extends BaseController {
  constructor() {
    super(parcialService);
  }

  async create(req) {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { asignaturaId } = req.pathParameters;
      data.asignaturaId = asignaturaId;
      const result = await this.service.createParcial(data);
      return createResponse(201, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async getById(req) {
    try {
      const { id, asignaturaId } = req.pathParameters;
      const result = await this.service.getParcial(id, asignaturaId);
      if (!result) {
        return createResponse(404, { error: 'Parcial no encontrado' });
      }
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async update(req) {
    try {
      const { id, asignaturaId } = req.pathParameters;
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const result = await this.service.updateParcial(id, asignaturaId, data);
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async delete(req) {
    try {
      const { id, asignaturaId } = req.pathParameters;
      await this.service.deleteParcial(id, asignaturaId);
      return createResponse(204);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async listByAsignatura(req) {
    try {
      const { asignaturaId } = req.pathParameters;
      const result = await this.service.listParcialesByAsignatura(asignaturaId);
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async listActivos() {
    try {
      const result = await this.service.listParcialesActivos();
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async getConPracticas(req) {
    try {
      const { id, asignaturaId } = req.pathParameters;
      const result = await this.service.getParcialConPracticas(id, asignaturaId);
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }
}

module.exports = new ParcialController();
