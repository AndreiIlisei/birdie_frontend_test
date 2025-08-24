'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// The `color` prop has been removed from the interface.
interface SVGIconProps {
  src: string; // The path must be a public URL, e.g., '/icons/my-icon.svg'
  width?: number;
  height?: number;
  className?: string; // Use Tailwind classes for color (e.g., 'text-blue-500')
  onClick?: () => void;
}

/**
 * Fetches the SVG content from a public URL.
 * @param src - The public URL of the SVG file.
 * @returns A promise that resolves to the SVG content as a string.
 */
const fetchSVG = async (src: string) => {
  const response = await fetch(src)
  if (!response.ok) {
    throw new Error(`Failed to fetch SVG from ${src}`)
  }
  return response.text()
}

/**
 * Renders an SVG icon by fetching its content from a public URL.
 * It prepares the SVG to be styled by Tailwind CSS via the className prop.
 * TODO: Implement caching with TanStack Query or SWR
 */
const SVGIcon: React.FC<SVGIconProps> = React.memo(
  ({
    className,
    src,
    width = 24,
    height = 24,
    onClick
  }) => {
    const [svgContent, setSvgContent] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
      if (!src) return;

      let isMounted = true;
      
      const loadSVG = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const content = await fetchSVG(src);
          if (isMounted) {
            setSvgContent(content);
          }
        } catch (err) {
          if (isMounted) {
            setError(err instanceof Error ? err : new Error('Failed to load SVG'));
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      loadSVG();

      return () => {
        isMounted = false;
      };
    }, [src]);

    if (error) {
      console.error(`Error loading SVG from ${src}:`, error)
      return <div style={{ width, height }} aria-hidden="true" />;
    }

    if (isLoading) {
      // Optional: render a placeholder while loading.
      return <div style={{ width, height }} aria-hidden="true" />;
    }

    if (!svgContent) {
      return null;
    }

    // This logic now consistently replaces fill and stroke with `currentColor`.
    // This allows the SVG to inherit the CSS `color` property, which is
    // what Tailwind's `text-*` utility classes modify.
    const processedSVG = svgContent
      .replace(/width="[^"]*"/g, `width="${width}"`)
      .replace(/height="[^"]*"/g, `height="${height}"`)
      .replace(/fill="((?!none|url).)*"/g, `fill="currentColor"`)
      .replace(/stroke="((?!none|url).)*"/g, `stroke="currentColor"`);


    return (
      <div
        className={cn(
          "flex items-center justify-center",
          className
        )}
        dangerouslySetInnerHTML={{ __html: processedSVG }}
        onClick={onClick}
      />
    )
  }
)

SVGIcon.displayName = 'SVGIcon'

export default SVGIcon