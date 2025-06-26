class UsoEquipo {
  constructor({
    id,
    estudianteId,
    practicaId,
    laboratorioId,
    equipo,
    horaInicio,
    horaFin = null,
    estado = 'activo',
    observaciones = '',
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.PK = `EST#${estudianteId}`;
    this.SK = `USO#${id}`;
    this.id = id;
    this.estudianteId = estudianteId;
    this.practicaId = practicaId;
    this.laboratorioId = laboratorioId;
    this.equipo = equipo;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
    this.estado = estado;
    this.observaciones = observaciones;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.entityType = 'UsoEquipo';
  }

  toItem() {
    return {
      ...this,
      GSI1PK: 'META',
      GSI1SK: `USO#${this.id}`,
      GSI2PK: `LAB#${this.laboratorioId}`,
      GSI2SK: `EST#${this.estudianteId}`
    };
  }

  static fromItem(item) {
    if (!item) return null;
    const estudianteId = item.PK.split('#')[1];
    const id = item.SK.split('#')[1];
    return new UsoEquipo({
      id,
      estudianteId,
      practicaId: item.practicaId,
      laboratorioId: item.laboratorioId,
      equipo: item.equipo,
      horaInicio: item.horaInicio,
      horaFin: item.horaFin,
      estado: item.estado,
      observaciones: item.observaciones,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    });
  }
}

module.exports = UsoEquipo;
