/* The site only renders Naksha components from data (the README previews and the home page specs),
   so it types the package loosely instead of pulling its types across folders. */
declare const Naksha: Record<string, any> & { toast: ((message: unknown, options?: unknown) => string) & Record<string, (...a: unknown[]) => unknown> };
export = Naksha;
