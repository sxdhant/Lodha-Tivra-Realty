import Image from 'next/image';
import { site } from '@/lib/site';

type Props = {
  /** original for light backgrounds, reversed for dark ones */
  variant: 'original' | 'reversed';
  className?: string;
  /** Leave empty when the surrounding link already names the brand. */
  alt?: string;
  preload?: boolean;
  /** Use eager for a copy that is hidden at first but must appear without a blink. */
  loading?: 'eager' | 'lazy';
};

export function BrandLogo({ variant, className, alt = site.name, preload, loading }: Props) {
  return (
    <Image
      className={className}
      src={site.logo[variant]}
      alt={alt}
      width={site.logo.width}
      height={site.logo.height}
      preload={preload}
      loading={preload ? undefined : loading}
      // A small, sharp-edged PNG: serve it as supplied rather than re-encoding it.
      unoptimized
    />
  );
}
