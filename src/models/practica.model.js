class Practica {
  constructor({
    id,
    parcialId,
    asignaturaId,
    laboratorioId,
    nombre,
    fecha,
    horaInicio,
    horaFin,
    descripcion = '',
    estado = 'pendiente',
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.PK = `PRACTICA#${id}`;
    this.SK = 'META';
    this.id = id;
    this.parcialId = parcialId;
    this.asignaturaId = asignaturaId;
    this.laboratorioId = laboratorioId;
    this.nombre = nombre;
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
    this.descripcion = descripcion;
    this.estado = estado;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.entityType = 'Practica';
  }

  toItem() {
    return {
      ...this,
      GSI1PK: 'META',
      GSI1SK: `PRACTICA#${this.id}`,
      GSI2PK: `LAB#${this.laboratorioId}`,
      GSI2SK: `FECHA#${this.fecha}`
    };
  }

  static fromItem(item) {
    if (!item) return null;
    const id = item.PK.split('#')[1];
    return new Practica({
      id,
      parcialId: item.parcialId,
      asignaturaId: item.asignaturaId,
      laboratorioId: item.laboratorioId,
      nombre: item.nombre,
      fecha: item.fecha,
      horaInicio: item.horaInicio,
      horaFin: item.horaFin,
      descripcion: item.descripcion,
      estado: item.estado,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    });
  }
}

module.exports = Practica;
