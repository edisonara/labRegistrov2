const { createResponse } = require('../libs/dynamo');

class BaseController {
  constructor(service) {
    this.service = service;
  }

  handleError(res, error) {
    console.error('Error:', error);
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    return createResponse(statusCode, { error: message });
  }

  async create(req) {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const result = await this.service.create(data);
      return createResponse(201, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async getById(req) {
    try {
      const { id } = req.pathParameters;
      const result = await this.service.getById(id);
      if (!result) {
        return createResponse(404, { error: 'Not found' });
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
      const result = await this.service.update(id, data);
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async delete(req) {
    try {
      const { id } = req.pathParameters;
      await this.service.delete(id);
      return createResponse(204);
    } catch (error) {
      return this.handleError({}, error);
    }
  }

  async list(req) {
    try {
      const result = await this.service.list();
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }
}

module.exports = BaseController;
