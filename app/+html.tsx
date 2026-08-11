import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* Este tag le dice explícitamente a los navegadores móviles que NO finjan ser un monitor de escritorio */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1.00001, viewport-fit=cover" />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
