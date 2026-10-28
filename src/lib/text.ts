import { business } from './business';

const values: Record<string, string> = {
  brand: business.name,
  since: String(business.founded),
  clients: business.stats.clientsRecorded.toLocaleString('es-MX'),
  anchor: business.stats.anchorCustomer,
  email: business.email,
};

export const fill = (text: string) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => {
    if (!(key in values)) throw new Error(`Placeholder desconocido: ${match}`);
    return values[key];
  });
