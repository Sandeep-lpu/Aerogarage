export function securityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");

  // Force HTTPS for 2 years, include subdomains, enable preload list
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  // Restrict resource loading to self; relax only what the API actually needs
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none';"
  );

  next();
}
