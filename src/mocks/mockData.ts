export interface Cliente {
  id_cliente: number;
  nombre: string;
  apellido: string;
  dni: string;
  direccion: string;
}

export interface Animal {
  id_animal: number;
  sexo: "Macho" | "Hembra";
  peso: number;
  estado: "Sano" | "Enfermo" | "En revisión";
  fecha_nacimiento: string;
  vacunado: boolean;
}

export interface Procedimiento {
  id_procedimiento_veterinario: number;
  id_animal: number;
  tipo: string;
  fecha: string;
}

export interface PresupuestoDetalle {
  id_animal: number;
  precio: number;
  animal: Animal;
}

export interface FacturaAsociada {
  id_factura_venta: number;
  tipo: string;
  importe_total: number;
  fecha: string;
}

export interface Presupuesto {
  id_presupuesto: number;
  fecha: string;
  importe_total: number;
  id_cliente: number;
  cliente: Cliente;
  detalles: PresupuestoDetalle[];
  facturas: FacturaAsociada[];
}

export interface FacturaVenta {
  id_factura_venta: number;
  tipo: string;
  fecha: string;
  importe_total: number;
  id_presupuesto: number;
  presupuesto: Presupuesto;
}

export interface MetodoPago {
  id_metodo_pago: number;
  nombre_metodo_pago: string;
}

export interface Cobro {
  id_cobro: number;
  id_factura_venta: number;
  id_metodo_pago: number;
  importe_total: number;
  fecha: string;
  titular?: string;
  factura_venta: {
    id_factura_venta: number;
    tipo: string;
    importe_total: number;
    presupuesto: {
      id_presupuesto: number;
      cliente: Cliente;
    };
  };
  metodo_pago: MetodoPago;
}

// ----------------- CLIENTES -----------------
export const mockClientes: Cliente[] = [
  {
    id_cliente: 1,
    nombre: "Juan Carlos",
    apellido: "Rodríguez",
    dni: "28.450.912",
    direccion: "Estancia El Ombú, Ruta 5 Km 124",
  },
  {
    id_cliente: 2,
    nombre: "María Eugenia",
    apellido: "Álvarez",
    dni: "31.890.145",
    direccion: "Cabaña Las Lilas, Camino Real 450",
  },
  {
    id_cliente: 3,
    nombre: "Roberto",
    apellido: "Domínguez",
    dni: "24.112.560",
    direccion: "Agropecuaria Domínguez, Ruta Nac. 7 Km 88",
  },
  {
    id_cliente: 4,
    nombre: "Silvina",
    apellido: "Gómez Fontana",
    dni: "29.741.223",
    direccion: "Establecimiento La Querencia, San Antonio de Areco",
  },
  {
    id_cliente: 5,
    nombre: "Carlos Alberto",
    apellido: "Méndez",
    dni: "22.348.910",
    direccion: "Ganadera del Litoral, Ruta 11 Km 32",
  },
];

// ----------------- ANIMALES -----------------
export const mockAnimales: Animal[] = [
  {
    id_animal: 101,
    sexo: "Macho",
    peso: 420,
    estado: "Sano",
    fecha_nacimiento: "2024-03-12T00:00:00.000Z",
    vacunado: true,
  },
  {
    id_animal: 102,
    sexo: "Hembra",
    peso: 385,
    estado: "Sano",
    fecha_nacimiento: "2024-04-18T00:00:00.000Z",
    vacunado: true,
  },
  {
    id_animal: 103,
    sexo: "Macho",
    peso: 460,
    estado: "En revisión",
    fecha_nacimiento: "2023-11-05T00:00:00.000Z",
    vacunado: false,
  },
  {
    id_animal: 104,
    sexo: "Hembra",
    peso: 350,
    estado: "Enfermo",
    fecha_nacimiento: "2024-05-20T00:00:00.000Z",
    vacunado: true,
  },
  {
    id_animal: 105,
    sexo: "Macho",
    peso: 490,
    estado: "Sano",
    fecha_nacimiento: "2023-09-15T00:00:00.000Z",
    vacunado: true,
  },
  {
    id_animal: 106,
    sexo: "Hembra",
    peso: 410,
    estado: "Sano",
    fecha_nacimiento: "2024-02-28T00:00:00.000Z",
    vacunado: true,
  },
  {
    id_animal: 107,
    sexo: "Macho",
    peso: 395,
    estado: "Sano",
    fecha_nacimiento: "2024-06-10T00:00:00.000Z",
    vacunado: true,
  },
  {
    id_animal: 108,
    sexo: "Hembra",
    peso: 430,
    estado: "En revisión",
    fecha_nacimiento: "2023-12-01T00:00:00.000Z",
    vacunado: true,
  },
  {
    id_animal: 109,
    sexo: "Macho",
    peso: 510,
    estado: "Sano",
    fecha_nacimiento: "2023-08-19T00:00:00.000Z",
    vacunado: true,
  },
  {
    id_animal: 110,
    sexo: "Hembra",
    peso: 370,
    estado: "Sano",
    fecha_nacimiento: "2024-07-04T00:00:00.000Z",
    vacunado: true,
  },
  {
    id_animal: 111,
    sexo: "Macho",
    peso: 445,
    estado: "Sano",
    fecha_nacimiento: "2024-01-15T00:00:00.000Z",
    vacunado: true,
  },
  {
    id_animal: 112,
    sexo: "Hembra",
    peso: 360,
    estado: "Sano",
    fecha_nacimiento: "2024-08-01T00:00:00.000Z",
    vacunado: false,
  },
];

// ----------------- PROCEDIMIENTOS -----------------
export const mockProcedimientos: Procedimiento[] = [
  {
    id_procedimiento_veterinario: 1,
    id_animal: 101,
    tipo: "Vacunación Antiaftosa (Campaña 2026) y antiparasitario",
    fecha: "2026-05-10T00:00:00.000Z",
  },
  {
    id_procedimiento_veterinario: 2,
    id_animal: 101,
    tipo: "Control de peso y pesada trimestral (420kg)",
    fecha: "2026-07-22T00:00:00.000Z",
  },
  {
    id_procedimiento_veterinario: 3,
    id_animal: 102,
    tipo: "Vacunación reproductiva y control de celo",
    fecha: "2026-06-15T00:00:00.000Z",
  },
  {
    id_procedimiento_veterinario: 4,
    id_animal: 103,
    tipo: "Tratamiento con antibióticos por renguera en pata delantera",
    fecha: "2026-08-01T00:00:00.000Z",
  },
  {
    id_procedimiento_veterinario: 5,
    id_animal: 103,
    tipo: "Revisión clínica y desinfección podal",
    fecha: "2026-08-10T00:00:00.000Z",
  },
  {
    id_procedimiento_veterinario: 6,
    id_animal: 104,
    tipo: "Diagnóstico de cuadro respiratorio - Tratamiento broncodilatador",
    fecha: "2026-08-14T00:00:00.000Z",
  },
  {
    id_procedimiento_veterinario: 7,
    id_animal: 105,
    tipo: "Vacunación Carbunclo bacteridiano y control general",
    fecha: "2026-04-05T00:00:00.000Z",
  },
  {
    id_procedimiento_veterinario: 8,
    id_animal: 106,
    tipo: "Control ecográfico de preñez",
    fecha: "2026-07-02T00:00:00.000Z",
  },
  {
    id_procedimiento_veterinario: 9,
    id_animal: 108,
    tipo: "Suplementación vitamínica y mineral en corral",
    fecha: "2026-07-29T00:00:00.000Z",
  },
  {
    id_procedimiento_veterinario: 10,
    id_animal: 109,
    tipo: "Evaluación andrológica y control de desarrollo muscular",
    fecha: "2026-06-20T00:00:00.000Z",
  },
];

// ----------------- PRESUPUESTOS -----------------
export const mockPresupuestos: Presupuesto[] = [
  {
    id_presupuesto: 1,
    fecha: "2026-08-10T10:00:00.000Z",
    importe_total: 3850000,
    id_cliente: 1,
    cliente: mockClientes[0],
    detalles: [
      { id_animal: 101, precio: 1350000, animal: mockAnimales[0] },
      { id_animal: 102, precio: 1200000, animal: mockAnimales[1] },
      { id_animal: 106, precio: 1300000, animal: mockAnimales[5] },
    ],
    facturas: [
      {
        id_factura_venta: 1,
        tipo: "Factura A",
        importe_total: 2000000,
        fecha: "2026-08-11T12:00:00.000Z",
      },
    ],
  },
  {
    id_presupuesto: 2,
    fecha: "2026-08-12T14:30:00.000Z",
    importe_total: 2650000,
    id_cliente: 2,
    cliente: mockClientes[1],
    detalles: [
      { id_animal: 105, precio: 1450000, animal: mockAnimales[4] },
      { id_animal: 107, precio: 1200000, animal: mockAnimales[6] },
    ],
    facturas: [
      {
        id_factura_venta: 2,
        tipo: "Factura A",
        importe_total: 2650000,
        fecha: "2026-08-13T12:00:00.000Z",
      },
    ],
  },
  {
    id_presupuesto: 3,
    fecha: "2026-08-15T09:15:00.000Z",
    importe_total: 5200000,
    id_cliente: 3,
    cliente: mockClientes[2],
    detalles: [
      { id_animal: 108, precio: 1600000, animal: mockAnimales[7] },
      { id_animal: 109, precio: 1900000, animal: mockAnimales[8] },
      { id_animal: 111, precio: 1700000, animal: mockAnimales[10] },
    ],
    facturas: [
      {
        id_factura_venta: 3,
        tipo: "Factura B",
        importe_total: 3000000,
        fecha: "2026-08-16T12:00:00.000Z",
      },
    ],
  },
  {
    id_presupuesto: 4,
    fecha: "2026-08-18T11:45:00.000Z",
    importe_total: 1980000,
    id_cliente: 4,
    cliente: mockClientes[3],
    detalles: [
      { id_animal: 110, precio: 1050000, animal: mockAnimales[9] },
      { id_animal: 112, precio: 930000, animal: mockAnimales[11] },
    ],
    facturas: [],
  },
  {
    id_presupuesto: 5,
    fecha: "2026-08-20T16:20:00.000Z",
    importe_total: 4150000,
    id_cliente: 5,
    cliente: mockClientes[4],
    detalles: [
      { id_animal: 101, precio: 1850000, animal: mockAnimales[0] },
      { id_animal: 105, precio: 2300000, animal: mockAnimales[4] },
    ],
    facturas: [
      {
        id_factura_venta: 4,
        tipo: "Factura A",
        importe_total: 4150000,
        fecha: "2026-08-21T12:00:00.000Z",
      },
    ],
  },
  {
    id_presupuesto: 6,
    fecha: "2026-08-22T08:30:00.000Z",
    importe_total: 2400000,
    id_cliente: 1,
    cliente: mockClientes[0],
    detalles: [
      { id_animal: 102, precio: 1150000, animal: mockAnimales[1] },
      { id_animal: 107, precio: 1250000, animal: mockAnimales[6] },
    ],
    facturas: [],
  },
];

// ----------------- FACTURAS DE VENTA -----------------
export const mockFacturas: FacturaVenta[] = [
  {
    id_factura_venta: 1,
    tipo: "Factura A",
    fecha: "2026-08-11T12:00:00.000Z",
    importe_total: 2000000,
    id_presupuesto: 1,
    presupuesto: mockPresupuestos[0],
  },
  {
    id_factura_venta: 2,
    tipo: "Factura A",
    fecha: "2026-08-13T12:00:00.000Z",
    importe_total: 2650000,
    id_presupuesto: 2,
    presupuesto: mockPresupuestos[1],
  },
  {
    id_factura_venta: 3,
    tipo: "Factura B",
    fecha: "2026-08-16T12:00:00.000Z",
    importe_total: 3000000,
    id_presupuesto: 3,
    presupuesto: mockPresupuestos[2],
  },
  {
    id_factura_venta: 4,
    tipo: "Factura A",
    fecha: "2026-08-21T12:00:00.000Z",
    importe_total: 4150000,
    id_presupuesto: 5,
    presupuesto: mockPresupuestos[4],
  },
];

// ----------------- MÉTODOS DE PAGO -----------------
export const mockMetodosPago: Record<number, MetodoPago> = {
  1: { id_metodo_pago: 1, nombre_metodo_pago: "Efectivo" },
  2: { id_metodo_pago: 2, nombre_metodo_pago: "Tarjeta de Crédito/Débito" },
  3: { id_metodo_pago: 3, nombre_metodo_pago: "Transferencia Bancaria" },
};

// ----------------- COBROS -----------------
export const mockCobros: Cobro[] = [
  {
    id_cobro: 1,
    id_factura_venta: 2,
    id_metodo_pago: 3,
    importe_total: 2650000,
    fecha: "2026-08-14T15:00:00.000Z",
    titular: "María Eugenia Álvarez",
    factura_venta: {
      id_factura_venta: 2,
      tipo: "Factura A",
      importe_total: 2650000,
      presupuesto: {
        id_presupuesto: 2,
        cliente: mockClientes[1],
      },
    },
    metodo_pago: mockMetodosPago[3],
  },
  {
    id_cobro: 2,
    id_factura_venta: 4,
    id_metodo_pago: 2,
    importe_total: 4150000,
    fecha: "2026-08-21T18:00:00.000Z",
    titular: "Carlos Alberto Méndez",
    factura_venta: {
      id_factura_venta: 4,
      tipo: "Factura A",
      importe_total: 4150000,
      presupuesto: {
        id_presupuesto: 5,
        cliente: mockClientes[4],
      },
    },
    metodo_pago: mockMetodosPago[2],
  },
];

// ----------------- USUARIOS -----------------
export const mockUsuarios = [
  {
    id_usuario: 1,
    nombre: "Gonzalo Lima",
    email: "admin@lamaja.com",
    contrasena: "123456",
    id_rol: 1,
    rol: "Encargado",
  },
  {
    id_usuario: 2,
    nombre: "Dr. Martín Valenzuela",
    email: "veterinario@lamaja.com",
    contrasena: "123456",
    id_rol: 2,
    matricula: "MP-8492",
    rol: "Veterinario",
  },
];
