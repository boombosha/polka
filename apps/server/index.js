'use strict';

const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { initialize } = require('express-openapi');
const { generatePlaceholder } = require('polka-generator');
const { config, repoRoot } = require('polka-config');

const rootPkg = require(path.join(repoRoot, 'package.json'));

async function main() {
  const app = express();
  app.use(cors());
  app.disable('x-powered-by');

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'polka', version: rootPkg.version });
  });

  const framework = await initialize({
    app,
    apiDoc: path.join(__dirname, 'api-doc.js'),
    paths: path.join(__dirname, 'routes'),
    dependencies: {
      generatePlaceholder,
      config,
    },
    exposeApiDocs: false,
    promiseMode: true,
    errorMiddleware(err, req, res, _next) {
      res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
      });
    },
  });

  app.get('/openapi.json', (_req, res) => {
    res.json(framework.apiDoc);
  });

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(null, { swaggerOptions: { url: '/openapi.json' } }),
  );

  const publicDir = path.join(__dirname, 'public');
  app.use(express.static(publicDir));

  app.get('*', (req, res, next) => {
    if (req.method !== 'GET') return next();
    const p = req.path;
    if (p.startsWith('/docs') || p === '/openapi.json' || p === '/health') return next();
    /* Let express-openapi handle /wxh/:width/:height (+ optional :text); everything else under /wxh is SPA */
    if (/^\/wxh\/\d+\/\d+/.test(p)) return next();
    res.sendFile(path.join(publicDir, 'index.html'), (err) => {
      if (err) next(err);
    });
  });

  app.listen(config.port, () => {
    console.log(`polka http://localhost:${config.port}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
