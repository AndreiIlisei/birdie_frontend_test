import { TenantConfig } from '@/types';
import logo from '@/assets/logo.svg';

export const siteConfig: TenantConfig = {
  logo: logo,
  favicon: "/favicon.ico",
  name: "Birdie",
  colors: {
    brand: {
      'brand-1': '#380527',
      'brand-2': '#f58ed3',
      'brand-3': '#FCD9F0',
      'brand-4': '#FDECF8',
      'brand-5': '#fef6fb',
    },
    semiBrand: {
      'semiBrand-1': '#FAFAFA',
      'semiBrand-2': '#F2F2F2',
      'semiBrand-3': '#FEFEFE',
      'semiBrand-4': '#FFFFFF',
      'semiBrand-5': '#FFFFFF',
    },
    system: {
      'system-1': '#666666',
      'system-2': '#C2C2C2',
      'system-3': '#CCCCCC', 
      'system-4': '#E0E0E0', 
      'system-5': '#EBEBEB', 
    },
  },
};