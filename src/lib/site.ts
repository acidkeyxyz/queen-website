import { getCollection } from 'astro:content';
import { business } from './business';

const pages = await getCollection('pages');
const modules = (await getCollection('modules')).sort((a, b) => a.data.order - b.data.order);

const pageKey = (id: string) => id.split('/').pop()!;
const pageByKey = (key: string) => {
  const entry = pages.find((p) => pageKey(p.id) === key);
  if (!entry) throw new Error(`Página desconocida: ${key}`);
  return entry;
};
const moduleByKey = (key: string) => {
  const entry = modules.find((m) => pageKey(m.id) === key);
  if (!entry) throw new Error(`Módulo desconocido: ${key}`);
  return entry;
};

const modulesBase = pageByKey('modules').data.slug;

export const site = {
  pages,
  modules,
  pageKey,
  href: {
    home: () => '/',
    page: (key: string) => {
      const slug = pageByKey(key).data.slug;
      return slug ? `/${slug}/` : '/';
    },
    module: (key: string) => `/${modulesBase}/${moduleByKey(key).data.slug}/`,
    moduleEntry: (slug: string) => `/${modulesBase}/${slug}/`,
    abs: (path: string) => new URL(path, business.url).toString(),
  },
  moduleByKey,
  pageByKey,
};
