// This file is transformed at container start into env.js by docker-entrypoint script
// Do not edit env.js directly; change this template instead.
(function (window) {
  window.__env = window.__env || {};
  window.__env.API_URL = "${API_URL}"; // replaced by envsubst
})(this);
