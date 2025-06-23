const BaseController = require('./base.controller');
const laboratorioService = require('../services/laboratorio.service');

class LaboratorioController extends BaseController {
  constructor() {
    super(laboratorioService);
  }

  async getDisponibilidad(req) {
    try {
      const { id } = req.pathParameters;
      const { fecha, horaInicio, horaFin } = req.queryStringParameters || {};
      
      if (!fecha || !horaInicio || !horaFin) {
        return createResponse(400, { 
          error: 'Los parámetros fecha, horaInicio y horaFin son requeridos' 
        });
      }
      
      const result = await this.service.getDisponibilidad(id, fecha, horaInicio, horaFin);
      return createResponse(200, result);
    } catch (error) {
      return this.handleError({}, error);
    }
  }
}

module.exports = new LaboratorioController();
