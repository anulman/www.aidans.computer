import * as tsr from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

import { DefaultCatchBoundary } from './components/DefaultCatchBoundary';
import { NotFound } from './components/NotFound';

export function createRouter() {
  const router = tsr.createRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultErrorComponent: DefaultCatchBoundary,
    defaultStaleTime: 1,
    defaultNotFoundComponent: () => <NotFound />,
    context: {
      assets: [],
    },
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }

  interface StaticDataRouteOption {
    baseParent?: boolean;
  }
}
