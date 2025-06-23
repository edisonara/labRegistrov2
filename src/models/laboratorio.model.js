class Laboratorio {
  constructor({
    id,
    nombre,
    ubicacion,
    equiposDisponibles = [],
    capacidad,
    descripcion = '',
    estado = 'disponible',
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.PK = `LAB#${id}`;
    this.SK = 'META';
    this.nombre = nombre;
    this.ubicacion = ubicacion;
    this.equiposDisponibles = equiposDisponibles;
    this.capacidad = capacidad;
    this.descripcion = descripcion;
    this.estado = estado;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.entityType = 'Laboratorio';
  }

  toItem() {
    return {
      ...this,
      GSI1PK: `LAB#${this.PK.split('#')[1]}`,
      GSI1SK: 'META',
    };
  }

  static fromItem(item) {
    if (!item) return null;
    const id = item.PK.split('#')[1];
    return new Laboratorio({
      id,
      nombre: item.nombre,
      ubicacion: item.ubicacion,
      equiposDisponibles: item.equiposDisponibles,
      capacidad: item.capacidad,
      descripcion: item.descripcion,
      estado: item.estado,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    });
  }
}

module.exports = Laboratorio;
