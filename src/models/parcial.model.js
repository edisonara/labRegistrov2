class Parcial {
  constructor({
    id,
    asignaturaId,
    nombre,
    fechaInicio,
    fechaFin,
    descripcion = '',
    estado = 'pendiente',
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.PK = `ASG#${asignaturaId}`;
    this.SK = `PARCIAL#${id}`;
    this.id = id;
    this.asignaturaId = asignaturaId;
    this.nombre = nombre;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.descripcion = descripcion;
    this.estado = estado;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.entityType = 'Parcial';
  }

  toItem() {
    return {
      ...this,
      GSI1PK: `PARCIAL#${this.id}`,
      GSI1SK: `ASG#${this.asignaturaId}`,
    };
  }

  static fromItem(item) {
    if (!item) return null;
    const asignaturaId = item.PK.split('#')[1];
    const id = item.SK.split('#')[1];
    return new Parcial({
      id,
      asignaturaId,
      nombre: item.nombre,
      fechaInicio: item.fechaInicio,
      fechaFin: item.fechaFin,
      descripcion: item.descripcion,
      estado: item.estado,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    });
  }
}

module.exports = Parcial;
