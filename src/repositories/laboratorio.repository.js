const BaseRepository = require('./base.repository');
const Laboratorio = require('../models/laboratorio.model');

class LaboratorioRepository extends BaseRepository {
  constructor() {
    super(Laboratorio);
  }

  async getByNombre(nombre) {
    const items = await this.query({
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk',
      FilterExpression: 'contains(nombre, :nombre)',
      ExpressionAttributeValues: {
        ':gsi1pk': 'META',
        ':nombre': nombre
      }
    });
    return items;
  }

  async getDisponibles(fecha, horaInicio, horaFin) {
    // Implementar lógica para obtener laboratorios disponibles en un horario
    const items = await this.query({
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :gsi2pk',
      FilterExpression: 'estado = :estado',
      ExpressionAttributeValues: {
        ':gsi2pk': 'META',
        ':estado': 'disponible'
      }
    });
    return items;
  }
}

module.exports = new LaboratorioRepository();
