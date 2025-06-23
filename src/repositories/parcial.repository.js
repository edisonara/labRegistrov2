const BaseRepository = require('./base.repository');
const Parcial = require('../models/parcial.model');

class ParcialRepository extends BaseRepository {
  constructor() {
    super(Parcial);
  }

  async getByAsignatura(asignaturaId) {
    return this.query({
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `ASG#${asignaturaId}`,
        ':sk': 'PARCIAL#'
      }
    });
  }

  async getActivos() {
    const now = new Date().toISOString();
    const items = await this.query({
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk',
      FilterExpression: 'estado = :estado AND fechaInicio <= :now AND fechaFin >= :now',
      ExpressionAttributeValues: {
        ':gsi1pk': 'META',
        ':estado': 'activo',
        ':now': now
      }
    });
    return items;
  }
}

module.exports = new ParcialRepository();
