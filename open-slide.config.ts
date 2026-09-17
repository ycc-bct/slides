import type { OpenSlideConfig } from '@open-slide/core';

// The config is evaluated by Node, but this project does not ship Node's type definitions.
declare const process: { env: Record<string, string | undefined> };

const openSlideConfig: OpenSlideConfig = {
  // GitHub Pages serves this repo under /slides/; CI sets OPEN_SLIDE_BASE for that build.
  base: process.env.OPEN_SLIDE_BASE ?? '/',
};

export default openSlideConfig;
