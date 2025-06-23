const BaseRepository = require('./base.repository');
const Asignatura = require('../models/asignatura.model');

class AsignaturaRepository extends BaseRepository {
  constructor() {
    super(Asignatura);
  }

  async getByCodigo(codigo) {
    const items = await this.query({
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk',
      FilterExpression: 'codigo = :codigo',
      ExpressionAttributeValues: {
        ':gsi1pk': 'META',
        ':codigo': codigo
      }
    });
    return items.length > 0 ? items[0] : null;
  }

  async getByDocente(docenteId) {
    return this.query({
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk',
      FilterExpression: 'docenteId = :docenteId',
      ExpressionAttributeValues: {
        ':gsi1pk': 'META',
        ':docenteId': docenteId
      }
    });
  }
}

module.exports = new AsignaturaRepository();
