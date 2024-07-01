import React from 'react';
import * as tsr from '@tanstack/react-router';

import { seo } from '~/utils/seo';

export const Route = tsr.createFileRoute('/')({
  component: IndexPage,
  meta: () =>
    seo({
      title: 'Overridden',
      description: 'Overridden 2: Electric Boogaloo',
    }),
});

function IndexPage() {
  return (
    <div>
      <h1>Index Page</h1>
    </div>
  );
}
