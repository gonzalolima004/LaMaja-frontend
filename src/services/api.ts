import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {
  mockAnimales,
  mockClientes,
  mockCobros,
  mockFacturas,
  mockMetodosPago,
  mockPresupuestos,
  mockProcedimientos,
  mockUsuarios,
} from '../mocks/mockData';
import type {
  Animal,
  Procedimiento,
  Presupuesto,
  FacturaVenta,
  Cobro,
} from '../mocks/mockData';

// Mutable in-memory data for session interactivity
let animales: Animal[] = JSON.parse(JSON.stringify(mockAnimales));
let procedimientos: Procedimiento[] = JSON.parse(JSON.stringify(mockProcedimientos));
let presupuestos: Presupuesto[] = JSON.parse(JSON.stringify(mockPresupuestos));
let facturas: FacturaVenta[] = JSON.parse(JSON.stringify(mockFacturas));
let cobros: Cobro[] = JSON.parse(JSON.stringify(mockCobros));
const clientes = JSON.parse(JSON.stringify(mockClientes));

const mockAdapter = async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
  // Normalize URL by removing baseURL, protocol, domain, and /api prefix
  let url = (config.url || '').replace(/^https?:\/\/[^\/]+/, '');
  url = url.replace(/^\/api/, '');
  if (!url.startsWith('/')) {
    url = '/' + url;
  }

  const method = (config.method || 'get').toLowerCase();
  let data: any = config.data;
  if (typeof data === 'string' && data.length > 0) {
    try {
      data = JSON.parse(data);
    } catch {
      // keep raw data
    }
  }

  const response = (resData: any, status = 200): AxiosResponse => ({
    data: resData,
    status,
    statusText: 'OK',
    headers: {},
    config,
  });

  // Small delay to simulate realistic async behavior
  await new Promise((resolve) => setTimeout(resolve, 60));

  // 1. USUARIOS / AUTH
  if (url.includes('/usuarios/login')) {
    const email = data?.email?.toLowerCase() || '';
    const foundUser = mockUsuarios.find((u) => u.email.toLowerCase() === email) || mockUsuarios[0];
    return response({
      token: 'demo-jwt-token-la-maja-2026',
      usuario: foundUser,
    });
  }

  if (url.includes('/usuarios/recuperar')) {
    return response({ mensaje: 'Correo de recuperación enviado con éxito' });
  }

  if (url.includes('/usuarios/restablecer')) {
    return response({ mensaje: 'Contraseña restablecida con éxito' });
  }

  if (url.includes('/usuarios/registrar')) {
    return response({ mensaje: 'Usuario registrado con éxito' });
  }

  // 2. ANIMALES
  const animalIdMatch = url.match(/^\/animales\/(\d+)$/);
  if (animalIdMatch) {
    const id = Number(animalIdMatch[1]);
    if (method === 'get') {
      const animal = animales.find((a) => a.id_animal === id);
      return response(animal ? { animal } : { animal: null });
    }
    if (method === 'put') {
      const index = animales.findIndex((a) => a.id_animal === id);
      if (index !== -1) {
        animales[index] = { ...animales[index], ...data, id_animal: id };
      }
      return response({ mensaje: 'Animal actualizado', animal: animales[index] });
    }
    if (method === 'delete') {
      animales = animales.filter((a) => a.id_animal !== id);
      return response({ mensaje: 'Animal eliminado' });
    }
  }

  if (url === '/animales' || url.startsWith('/animales?')) {
    if (method === 'get') {
      return response([...animales]);
    }
    if (method === 'post') {
      const newAnimal: Animal = {
        id_animal: data.id_animal || Math.max(0, ...animales.map((a) => a.id_animal)) + 1,
        sexo: data.sexo || 'Macho',
        peso: Number(data.peso) || 400,
        estado: data.estado || 'Sano',
        fecha_nacimiento: data.fecha_nacimiento || new Date().toISOString(),
        vacunado: Boolean(data.vacunado),
      };
      animales.unshift(newAnimal);
      return response(newAnimal);
    }
  }

  // 3. PROCEDIMIENTOS
  const procIdMatch = url.match(/^\/procedimientos\/(\d+)$/);
  if (procIdMatch) {
    const id = Number(procIdMatch[1]);
    if (method === 'delete') {
      procedimientos = procedimientos.filter((p) => p.id_procedimiento_veterinario !== id);
      return response({ mensaje: 'Procedimiento eliminado' });
    }
  }

  if (url === '/procedimientos' || url.startsWith('/procedimientos?')) {
    if (method === 'get') {
      return response([...procedimientos]);
    }
    if (method === 'post') {
      const newProc: Procedimiento = {
        id_procedimiento_veterinario:
          Math.max(0, ...procedimientos.map((p) => p.id_procedimiento_veterinario)) + 1,
        id_animal: Number(data.id_animal),
        tipo: data.tipo,
        fecha: data.fecha || new Date().toISOString(),
      };
      procedimientos.unshift(newProc);
      return response(newProc);
    }
  }

  // 4. CLIENTES
  const clienteIdMatch = url.match(/^\/clientes\/(\d+)$/);
  if (clienteIdMatch) {
    const id = Number(clienteIdMatch[1]);
    const foundCliente = clientes.find((c: any) => c.id_cliente === id) || clientes[0];
    return response({ cliente: foundCliente });
  }

  if (url === '/clientes' || url.startsWith('/clientes?')) {
    return response([...clientes]);
  }

  // 5. PRESUPUESTOS
  const presupuestoIdMatch = url.match(/^\/presupuestos\/(\d+)$/);
  if (presupuestoIdMatch) {
    const id = Number(presupuestoIdMatch[1]);
    if (method === 'get') {
      const pres = presupuestos.find((p) => p.id_presupuesto === id);
      return response(pres || presupuestos[0]);
    }
    if (method === 'delete') {
      presupuestos = presupuestos.filter((p) => p.id_presupuesto !== id);
      return response({ mensaje: 'Presupuesto eliminado' });
    }
  }

  if (url === '/presupuestos' || url.startsWith('/presupuestos?')) {
    if (method === 'get') {
      return response([...presupuestos]);
    }
    if (method === 'post') {
      const newId = Math.max(0, ...presupuestos.map((p) => p.id_presupuesto)) + 1;
      const newPres: Presupuesto = {
        id_presupuesto: newId,
        fecha: data.fecha || new Date().toISOString(),
        importe_total: Number(data.importe_total) || 0,
        id_cliente: data.cliente?.id_cliente || 1,
        cliente: data.cliente || mockClientes[0],
        detalles: (data.detalles || []).map((d: any) => ({
          ...d,
          animal: animales.find((a) => a.id_animal === d.id_animal) || mockAnimales[0],
        })),
        facturas: [],
      };
      presupuestos.unshift(newPres);
      return response(newPres);
    }
  }

  // 6. FACTURAS DE VENTA
  const facturaIdMatch = url.match(/^\/facturas_venta\/(\d+)$/);
  if (facturaIdMatch) {
    const id = Number(facturaIdMatch[1]);
    if (method === 'get') {
      const fac = facturas.find((f) => f.id_factura_venta === id);
      return response(fac || facturas[0]);
    }
    if (method === 'delete') {
      facturas = facturas.filter((f) => f.id_factura_venta !== id);
      return response({ mensaje: 'Factura eliminada' });
    }
  }

  if (url === '/facturas_venta' || url.startsWith('/facturas_venta?')) {
    if (method === 'get') {
      return response([...facturas]);
    }
    if (method === 'post') {
      const newId = Math.max(0, ...facturas.map((f) => f.id_factura_venta)) + 1;
      const pres =
        presupuestos.find((p) => p.id_presupuesto === Number(data.id_presupuesto)) ||
        mockPresupuestos[0];

      const newFactura: FacturaVenta = {
        id_factura_venta: newId,
        tipo: data.tipo || 'Factura A',
        fecha: data.fecha || new Date().toISOString(),
        importe_total: Number(data.importe_total) || 0,
        id_presupuesto: Number(data.id_presupuesto),
        presupuesto: pres,
      };

      facturas.unshift(newFactura);

      // Register inside presupuesto facturas
      pres.facturas = pres.facturas || [];
      pres.facturas.push({
        id_factura_venta: newFactura.id_factura_venta,
        tipo: newFactura.tipo,
        importe_total: newFactura.importe_total,
        fecha: newFactura.fecha,
      });

      return response(newFactura);
    }
  }

  // 7. COBROS
  if (url === '/cobros' || url.startsWith('/cobros?')) {
    if (method === 'get') {
      return response([...cobros]);
    }
    if (method === 'post') {
      const newId = Math.max(0, ...cobros.map((c) => c.id_cobro)) + 1;
      const factura =
        facturas.find((f) => f.id_factura_venta === Number(data.id_factura_venta)) ||
        mockFacturas[0];
      const metodoId = Number(data.id_metodo_pago) || 1;
      const metodo = mockMetodosPago[metodoId] || mockMetodosPago[1];

      const newCobro: Cobro = {
        id_cobro: newId,
        id_factura_venta: Number(data.id_factura_venta),
        id_metodo_pago: metodoId,
        importe_total: Number(data.importe_total) || factura.importe_total,
        fecha: new Date().toISOString(),
        titular: data.titular || '',
        factura_venta: {
          id_factura_venta: factura.id_factura_venta,
          tipo: factura.tipo,
          importe_total: factura.importe_total,
          presupuesto: {
            id_presupuesto: factura.presupuesto.id_presupuesto,
            cliente: factura.presupuesto.cliente,
          },
        },
        metodo_pago: metodo,
      };

      cobros.unshift(newCobro);
      return response({ mensaje: 'Cobro registrado correctamente', cobro: newCobro });
    }
  }

  return response({ mensaje: 'OK' });
};

const apiClient = axios.create({
  baseURL: '/api',
  adapter: mockAdapter,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;