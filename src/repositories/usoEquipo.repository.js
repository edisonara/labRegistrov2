const BaseRepository = require('./base.repository');
const UsoEquipo = require('../models/usoEquipo.model');

class UsoEquipoRepository extends BaseRepository {
  constructor() {
    super(UsoEquipo);
  }

  async getByEstudiante(estudianteId) {
    return this.query({
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `EST#${estudianteId}`,
        ':sk': 'USO#'
      }
    });
  }

  async getByPractica(practicaId) {
    return this.query({
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk',
      ExpressionAttributeValues: {
        ':gsi1pk': `PRACTICA#${practicaId}`
      }
    });
  }

  async getByLaboratorio(laboratorioId) {
    return this.query({
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :gsi2pk',
      ExpressionAttributeValues: {
        ':gsi2pk': `LAB#${laboratorioId}`
      }
    });
  }

  async finalizarUso(id, estudianteId) {
    const uso = await this.getById(id, `EST#${estudianteId}`);
    if (!uso) {
      throw new Error('Uso de equipo no encontrado');
    }

    if (uso.estado === 'finalizado') {
      throw new Error('El uso de equipo ya está finalizado');
    }

    return this.update(id, { 
      estado: 'finalizado',
      horaFin: new Date().toISOString()
    }, `EST#${estudianteId}`);
  }

  async verificarDisponibilidadEquipo(laboratorioId, equipo, fecha, horaInicio, horaFin) {
    const items = await this.query({
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk',
      FilterExpression: 'equipo = :equipo AND laboratorioId = :laboratorioId AND '
        + '((:horaInicio BETWEEN horaInicio AND horaFin) OR '
        + '(:horaFin BETWEEN horaInicio AND horaFin) OR '
        + '(horaInicio BETWEEN :horaInicio AND :horaFin))',
      ExpressionAttributeValues: {
        ':gsi1pk': 'META',
        ':equipo': equipo,
        ':laboratorioId': laboratorioId,
        ':horaInicio': horaInicio,
        ':horaFin': horaFin
      }
    });

    return items.length === 0;
  }
}

module.exports = new UsoEquipoRepository();
