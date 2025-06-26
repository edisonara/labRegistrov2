const laboratorioRepository = require('../repositories/laboratorio.repository');
const practicaRepository = require('../repositories/practica.repository');
const usoEquipoRepository = require('../repositories/usoEquipo.repository');

class LaboratorioService {
  // Métodos genéricos esperados por BaseController
  async create(data) {
    return this.createLaboratorio(data);
  }

  async getById(id) {
    return this.getLaboratorio(id);
  }

  async update(id, data) {
    return this.updateLaboratorio(id, data);
  }

  async delete(id) {
    return this.deleteLaboratorio(id);
  }

  async list() {
    return this.listLaboratorios();
  }


  async createLaboratorio(data) {
    // Validar que no exista un laboratorio con el mismo nombre
    const existente = await laboratorioRepository.getByNombre(data.nombre);
    if (existente && existente.length > 0) {
      throw new Error('Ya existe un laboratorio con ese nombre');
    }

    return laboratorioRepository.create(data);
  }

  async getLaboratorio(id) {
    const laboratorio = await laboratorioRepository.getById(id);
    if (!laboratorio) {
      throw new Error('Laboratorio no encontrado');
    }
    return laboratorio;
  }

  async updateLaboratorio(id, data) {
    await this.getLaboratorio(id); // Verificar que existe
    return laboratorioRepository.update(id, data);
  }

  async deleteLaboratorio(id) {
    // Verificar que no tenga prácticas asociadas
    const practicas = await practicaRepository.getByLaboratorio(id);
    if (practicas && practicas.length > 0) {
      throw new Error('No se puede eliminar el laboratorio porque tiene prácticas asociadas');
    }

    // Verificar que no tenga usos de equipos asociados
    const usos = await usoEquipoRepository.getByLaboratorio(id);
    if (usos && usos.length > 0) {
      throw new Error('No se puede eliminar el laboratorio porque tiene registros de uso de equipos');
    }

    return laboratorioRepository.delete(id);
  }

  async listLaboratorios() {
    return laboratorioRepository.query({
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk',
      ExpressionAttributeValues: {
        ':gsi1pk': 'META'
      }
    });
  }

  async getDisponibilidad(id, fecha, horaInicio, horaFin) {
    const laboratorio = await this.getLaboratorio(id);
    const practicas = await practicaRepository.getByLaboratorio(id, fecha);
    
    // Filtrar prácticas que se superponen con el horario solicitado
    const practicasEnHorario = practicas.filter(p => {
      return (horaInicio >= p.horaInicio && horaInicio < p.horaFin) ||
             (horaFin > p.horaInicio && horaFin <= p.horaFin) ||
             (horaInicio <= p.horaInicio && horaFin >= p.horaFin);
    });

    // Obtener equipos en uso en ese horario
    const equiposEnUso = new Set();
    for (const practica of practicasEnHorario) {
      const usos = await usoEquipoRepository.getByPractica(practica.id);
      usos.forEach(uso => equiposEnUso.add(uso.equipo));
    }

    // Calcular equipos disponibles
    const equiposDisponibles = laboratorio.equiposDisponibles
      .filter(equipo => !equiposEnUso.has(equipo));

    return {
      laboratorio,
      fecha,
      horaInicio,
      horaFin,
      equiposDisponibles,
      equiposOcupados: Array.from(equiposEnUso),
      totalEquipos: laboratorio.equiposDisponibles.length,
      equiposDisponiblesCount: equiposDisponibles.length
    };
  }
}

module.exports = new LaboratorioService();
