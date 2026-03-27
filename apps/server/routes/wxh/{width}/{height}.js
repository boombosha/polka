'use strict';

const queryParams = [
  { name: 'bg', in: 'query', required: false, schema: { type: 'string', description: 'Цвет фона hex без #' } },
  { name: 'fg', in: 'query', required: false, schema: { type: 'string', description: 'Цвет текста hex без #' } },
  { name: 'text', in: 'query', required: false, schema: { type: 'string' } },
  { name: 'rounded', in: 'query', required: false, schema: { type: 'integer', minimum: 0 } },
  { name: 'font', in: 'query', required: false, schema: { type: 'integer', description: 'Размер шрифта' } },
  { name: 'gradient', in: 'query', required: false, schema: { type: 'string', description: 'h|v-color1-color2' } },
];

module.exports = function wxhPlain(generatePlaceholder, config) {
  function GET(req, res) {
    const w = Number(req.params.width);
    const h = Number(req.params.height);
    if (!Number.isInteger(w) || w < 1 || w > config.placeholderMaxWidth) {
      return res.status(400).json({ error: 'Неверная ширина' });
    }
    if (!Number.isInteger(h) || h < 1 || h > config.placeholderMaxHeight) {
      return res.status(400).json({ error: 'Неверная высота' });
    }
    const { bg, fg, text, rounded, font, gradient } = req.query;
    const svg = generatePlaceholder({
      width: w,
      height: h,
      bg,
      fg,
      text,
      rounded,
      fontSize: font,
      gradient,
      maxWidth: config.placeholderMaxWidth,
      maxHeight: config.placeholderMaxHeight,
    });
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(svg);
  }

  GET.apiDoc = {
    tags: ['WxH'],
    summary: 'Плейсхолдер без текста в пути',
    operationId: 'getWxhPlaceholder',
    parameters: [
      {
        name: 'width',
        in: 'path',
        required: true,
        schema: { type: 'integer', minimum: 1, maximum: 32000 },
      },
      {
        name: 'height',
        in: 'path',
        required: true,
        schema: { type: 'integer', minimum: 1, maximum: 32000 },
      },
      ...queryParams,
    ],
    responses: {
      200: {
        description: 'SVG',
        content: {
          'image/svg+xml': {
            schema: { type: 'string' },
          },
        },
      },
      400: {
        description: 'Неверные параметры',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: { error: { type: 'string' } },
            },
          },
        },
      },
    },
    'x-express-openapi-disable-response-validation-middleware': true,
  };

  return { GET };
};
