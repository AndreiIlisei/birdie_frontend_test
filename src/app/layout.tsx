import { TenantProvider } from '@/contexts/TenantContext';
import { Rubik } from 'next/font/google';
import { siteConfig } from '@/config/site';
import { ColorPalette } from '@/types';
import './globals.css';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-rubik',
});

const generateCssVariables = (palette: ColorPalette) => {
  let css = ':root {\n';
  for (const colorCategory of Object.values(palette)) {
    for (const [key, value] of Object.entries(colorCategory)) {
      const varName = `--${key.replace('_', '-')}`;
      css += `  ${varName}: ${value};\n`;
    }
  }
  css += '}';
  return css;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cssVariables = generateCssVariables(siteConfig.colors);

  return (
    <html lang="en" className={rubik.variable} suppressHydrationWarning>
      <head>
        <title>{siteConfig.name}</title>
        <link rel="icon" href={siteConfig.favicon} sizes="any" />
        <style>{cssVariables}</style>
      </head>
      <body>
        <TenantProvider config={siteConfig}>
          {children}
        </TenantProvider>
      </body>
    </html>
  );
}
