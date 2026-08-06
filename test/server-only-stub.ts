// Vitest alias target for the "server-only" package (see vitest.config.mts). The real package
// throws unconditionally outside Next's bundler-specific module resolution, which would make any
// module that imports it untestable in plain Node/Vitest. This stub keeps the *intent* of
// `server-only` (a signal to reviewers: "don't import this from a client component") without the
// hard throw, so modules like src/lib/payments.ts and src/lib/server/internal-contact.ts stay
// unit-testable. It has no effect on the real Next.js build, which never resolves through here.
export {};
