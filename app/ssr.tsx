import * as start from '@tanstack/start/server';
import { getRouterManifest } from '@tanstack/start/router-manifest';

import { createRouter } from './router';

export default start.createStartHandler({
  createRouter,
  getRouterManifest,
})(start.defaultStreamHandler);
