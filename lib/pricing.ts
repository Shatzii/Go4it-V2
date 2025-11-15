export type SKU = {
  id: string;
  name: string;
  price: number;
  billing: 'one-time' | 'monthly' | 'annual';
  description?: string;
};

export const PRICING: SKU[] = [
  { id: 'starpath', name: 'StarPath Assessment', price: 249, billing: 'one-time', description: 'Pro scout athletic evaluation + academic/NCAA plan' },
  { id: 'homeschool', name: 'Homeschool Platform', price: 399, billing: 'monthly', description: 'Rinsei Core included' },
  { id: 'full-academy', name: 'Full Academy', price: 599, billing: 'monthly', description: 'Live teachers + Rinsei Pro included' },
  { id: 'rinsei-core', name: 'Rinsei Tracker Core', price: 39, billing: 'monthly' },
  { id: 'rinsei-pro', name: 'Rinsei Tracker Pro', price: 79, billing: 'monthly' },
  // Events
  { id: 'gar-event', name: 'GAR', price: 99, billing: 'one-time' },
  { id: 'fnl-event', name: 'FNL', price: 129, billing: 'one-time' },
  { id: 'combine-event', name: 'Combine + FNL', price: 199, billing: 'one-time' },
  { id: 'iso-highlight', name: 'ISO Highlight Add-on', price: 39, billing: 'one-time' },
];

export function getSku(id: string) {
  return PRICING.find((p) => p.id === id) || null;
}

export default PRICING;
