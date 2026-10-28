import type { APIRoute } from 'astro';
import { business } from '@/lib/business';
import { site } from '@/lib/site';
import { fill } from '@/lib/text';

export const GET: APIRoute = () => {
  const lines = [
    `# ${business.name}`,
    '',
    `> ${business.tagline}. Presupuestos, recepción en 3D, órdenes de trabajo, pintura, calidad, cobros, membresías y métricas en una sola aplicación web para talleres en México.`,
    '',
    '## Funciones',
    ...site.modules.map((m) => `- [${m.data.cardTitle}](${site.href.abs(site.href.moduleEntry(m.data.slug))}): ${fill(m.data.cardTagline)}`),
    '',
    '## Páginas',
    ...site.pages
      .filter((p) => p.data.nav)
      .sort((a, b) => a.data.order - b.data.order)
      .map((p) => `- [${p.data.title}](${site.href.abs(site.href.page(site.pageKey(p.id)))}): ${p.data.seoDescription}`),
    '',
    '## Aplicación',
    `- [Crear cuenta](${business.appSignup})`,
    `- [Iniciar sesión](${business.appLogin})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
