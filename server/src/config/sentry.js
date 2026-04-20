/**
 * Sentry backend initialization.
 *
 * Import and call `initSentry(app, env)` BEFORE all other middleware in server.js.
 * Call `sentryErrorHandler()` AFTER your routes but BEFORE your own errorHandler.
 *
 * Usage in server.js:
 *   import { initSentry, sentryErrorHandler } from './src/config/sentry.js';
 *   initSentry(app, env);
 *   // ... all middleware and routes
 *   app.use(sentryErrorHandler());
 *   app.use(errorHandler);
 */

let Sentry = null;

/**
 * Dynamically initialize Sentry only when SENTRY_DSN is provided.
 * Safe-fails gracefully in development (no DSN → no-op).
 * @param {import('express').Application} app
 * @param {object} env - Output of validateEnv()
 */
export async function initSentry(app, env) {
  if (!env.SENTRY_DSN) {
    console.info("[Sentry] SENTRY_DSN not set — error monitoring disabled.");
    return;
  }

  try {
    const SentryModule = await import("@sentry/node");
    Sentry = SentryModule;

    Sentry.init({
      dsn: env.SENTRY_DSN,
      environment: env.NODE_ENV,
      release: `aerogarage-api@${env.APP_VERSION || "1.0.0"}`,
      tracesSampleRate: env.NODE_ENV === "production" ? 0.15 : 1.0,
      // Ignore common non-actionable errors
      ignoreErrors: [
        "CORS: origin",
        "API rate limit exceeded",
        "Not Found",
      ],
    });

    // Attach request handler (must be FIRST middleware)
    app.use(Sentry.Handlers.requestHandler());
    // Attach tracing handler
    app.use(Sentry.Handlers.tracingHandler());

    console.info(`[Sentry] Initialized — environment: ${env.NODE_ENV}`);
  } catch (err) {
    console.warn("[Sentry] Failed to initialize:", err.message);
  }
}

/**
 * Returns Sentry's Express error handler middleware.
 * Mount this AFTER all routes but BEFORE your own errorHandler.
 * @returns {import('express').ErrorRequestHandler}
 */
export function sentryErrorHandler() {
  if (!Sentry) {
    // No-op middleware when Sentry not initialized
    return (err, _req, _res, next) => next(err);
  }
  return Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Report 5xx errors to Sentry; let 4xx pass through silently
      return !error.status || error.status >= 500;
    },
  });
}

/**
 * Manually capture an exception in Sentry.
 * Use in catch blocks for non-HTTP errors.
 * @param {Error} error
 * @param {object} [context] - Extra key/value context
 */
export function captureException(error, context = {}) {
  if (Sentry) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
      Sentry.captureException(error);
    });
  }
}
