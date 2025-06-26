class Asignatura {
  constructor({
    id,
    codigo,
    nombre,
    docenteId,
    creditos = 0,
    descripcion = '',
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.PK = `ASG#${id}`;
    this.SK = 'META';
    this.codigo = codigo;
    this.nombre = nombre;
    this.docenteId = docenteId;
    this.creditos = creditos;
    this.descripcion = descripcion;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.entityType = 'Asignatura';
  }

  toItem() {
    return {
      ...this,
      GSI1PK: 'META',
      GSI1SK: `ASG#${this.PK.split('#')[1]}`,
    };
  }

  static fromItem(item) {
    if (!item) return null;
    const id = item.PK.split('#')[1];
    return new Asignatura({
      id,
      codigo: item.codigo,
      nombre: item.nombre,
      docenteId: item.docenteId,
      creditos: item.creditos,
      descripcion: item.descripcion,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    });
  }
}

module.exports = Asignatura;
