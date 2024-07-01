import * as React from 'react';
import * as tsr from '@tanstack/react-router';
import * as start from '@tanstack/start';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

// TODO - speed insights, analytics
import appCss from '~/styles/app.css?url';
import { seo } from '~/utils/seo';

import { NotFound } from '~/components/NotFound';
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary';

export const Route = tsr.createRootRoute({
  meta: () => [
    {
      charSet: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    ...seo({
      title: 'aidans.computer',
      description: `Aidan is a founder, software developer, and occasional publisher. He identifies as a débrouillard, full of gumption. This is his home on the web.`,
      // TODO - opengraph image?
      keywords:
        'anulman,aidan nulman,software,developer,founder,entrepreneur,writer,author,publisher',
    }),
  ],
  links: () => [
    { rel: 'stylesheet', href: appCss },
    // TODO - favicons, webmanifest
  ],
  scripts: () => [
    // TODO - analytics scripts?
  ],
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <tsr.Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const matches = tsr.useMatches();

  return (
    <start.Html lang="en">
      <start.Head>
        <start.Meta />
        {matches.find((d) => d.staticData?.baseParent) ? (
          <base target="_parent" />
        ) : null}
      </start.Head>

      <start.Body>
        {children}

        <tsr.ScrollRestoration />
        <TanStackRouterDevtools position="bottom-right" />
        <start.Scripts />
      </start.Body>
    </start.Html>
  );
}
