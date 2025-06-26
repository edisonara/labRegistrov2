const asignaturaRepository = require('../repositories/asignatura.repository');
const parcialRepository = require('../repositories/parcial.repository');
const practicaRepository = require('../repositories/practica.repository');

class AsignaturaService {
  // Métodos genéricos esperados por BaseController
  async create(data) {
    return this.createAsignatura(data);
  }

  async getById(id) {
    return this.getAsignatura(id);
  }

  async update(id, data) {
    return this.updateAsignatura(id, data);
  }

  async delete(id) {
    return this.deleteAsignatura(id);
  }

  async list() {
    return this.listAsignaturas();
  }


  async createAsignatura(data) {
    // Validar que no exista una asignatura con el mismo código
    const existente = await asignaturaRepository.getByCodigo(data.codigo);
    if (existente) {
      throw new Error('Ya existe una asignatura con ese código');
    }

    return asignaturaRepository.create(data);
  }

  async getAsignatura(id) {
    const asignatura = await asignaturaRepository.getById(id);
    if (!asignatura) {
      throw new Error('Asignatura no encontrada');
    }
    return asignatura;
  }

  async updateAsignatura(id, data) {
    await this.getAsignatura(id); // Verificar que existe
    
    // Si se está actualizando el código, verificar que no exista otro con el mismo código
    if (data.codigo) {
      const existente = await asignaturaRepository.getByCodigo(data.codigo);
      if (existente && existente.id !== id) {
        throw new Error('Ya existe otra asignatura con ese código');
      }
    }

    return asignaturaRepository.update(id, data);
  }

  async deleteAsignatura(id) {
    // Verificar que no tenga parciales asociados
    const parciales = await parcialRepository.getByAsignatura(id);
    if (parciales && parciales.length > 0) {
      throw new Error('No se puede eliminar la asignatura porque tiene parciales asociados');
    }

    // Verificar que no tenga prácticas asociadas
    const practicas = await practicaRepository.getByAsignatura(id);
    if (practicas && practicas.length > 0) {
      throw new Error('No se puede eliminar la asignatura porque tiene prácticas asociadas');
    }

    return asignaturaRepository.delete(id);
  }

  async listAsignaturas() {
    return asignaturaRepository.query({
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk',
      ExpressionAttributeValues: {
        ':gsi1pk': 'META'
      }
    });
  }

  async getAsignaturasByDocente(docenteId) {
    return asignaturaRepository.getByDocente(docenteId);
  }

  async getAsignaturaConParciales(id) {
    const asignatura = await this.getAsignatura(id);
    const parciales = await parcialRepository.getByAsignatura(id);
    return {
      ...asignatura,
      parciales: parciales || []
    };
  }
}

module.exports = new AsignaturaService();
