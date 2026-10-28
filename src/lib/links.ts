import { business } from './business';
import { site } from './site';

export const resolveHref = (href: string) => {
  if (href === 'app:signup') return business.appSignup;
  if (href === 'app:sales') return business.appSales;
  if (href === 'app:login') return business.appLogin;
  if (href.startsWith('page:')) return site.href.page(href.slice(5));
  if (href.startsWith('module:')) return site.href.module(href.slice(7));
  return href;
};

export const isExternal = (href: string) => /^https?:\/\//.test(href);
