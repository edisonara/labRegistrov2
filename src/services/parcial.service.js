const parcialRepository = require('../repositories/parcial.repository');
const asignaturaService = require('./asignatura.service');
const practicaRepository = require('../repositories/practica.repository');

class ParcialService {
  async createParcial(data) {
    // Verificar que la asignatura existe
    await asignaturaService.getAsignatura(data.asignaturaId);
    
    // Validar fechas
    if (new Date(data.fechaInicio) >= new Date(data.fechaFin)) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
    }

    return parcialRepository.create(data);
  }

  async getParcial(id, asignaturaId) {
    const parcial = await parcialRepository.getById(id, `ASG#${asignaturaId}`);
    if (!parcial) {
      throw new Error('Parcial no encontrado');
    }
    return parcial;
  }

  async updateParcial(id, asignaturaId, data) {
    await this.getParcial(id, asignaturaId); // Verificar que existe
    
    // Si se está actualizando la asignatura, verificar que exista
    if (data.asignaturaId) {
      await asignaturaService.getAsignatura(data.asignaturaId);
    }

    return parcialRepository.update(id, data, `ASG#${asignaturaId}`);
  }

  async deleteParcial(id, asignaturaId) {
    // Verificar que no tenga prácticas asociadas
    const practicas = await practicaRepository.getByParcial(id);
    if (practicas && practicas.length > 0) {
      throw new Error('No se puede eliminar el parcial porque tiene prácticas asociadas');
    }

    return parcialRepository.delete(id, `ASG#${asignaturaId}`);
  }

  async listParcialesByAsignatura(asignaturaId) {
    await asignaturaService.getAsignatura(asignaturaId);
    return parcialRepository.getByAsignatura(asignaturaId);
  }

  async listParcialesActivos() {
    return parcialRepository.getActivos();
  }

  async getParcialConPracticas(id, asignaturaId) {
    const parcial = await this.getParcial(id, asignaturaId);
    const practicas = await practicaRepository.getByParcial(id);
    
    return {
      ...parcial,
      practicas: practicas || []
    };
  }
}

module.exports = new ParcialService();
