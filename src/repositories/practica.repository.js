const BaseRepository = require('./base.repository');
const Practica = require('../models/practica.model');

class PracticaRepository extends BaseRepository {
  constructor() {
    super(Practica);
  }

  async getByAsignatura(asignaturaId) {
    return this.query({
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk',
      FilterExpression: 'asignaturaId = :asignaturaId',
      ExpressionAttributeValues: {
        ':gsi1pk': 'META',
        ':asignaturaId': asignaturaId
      }
    });
  }

  async getByParcial(parcialId) {
    return this.query({
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk',
      FilterExpression: 'parcialId = :parcialId',
      ExpressionAttributeValues: {
        ':gsi1pk': 'META',
        ':parcialId': parcialId
      }
    });
  }

  async getByLaboratorio(laboratorioId, fecha = null) {
    const params = {
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :gsi2pk',
      ExpressionAttributeValues: {
        ':gsi2pk': `LAB#${laboratorioId}`
      }
    };

    if (fecha) {
      params.KeyConditionExpression += ' AND begins_with(GSI2SK, :fecha)';
      params.ExpressionAttributeValues[':fecha'] = `FECHA#${fecha}`;
    }

    return this.query(params);
  }
}

module.exports = new PracticaRepository();
