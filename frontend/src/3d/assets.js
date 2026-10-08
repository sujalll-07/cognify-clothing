export const MODELS = {
  hoodie: '/models/cognify-hoodie.glb',
  shirt: '/models/cognify-shirt.glb',
};

export const BRANDING = {
  logoPng: '/branding/cognify-logo.png',
  logoSvg: '/branding/cognify-logo.svg',
  logoWhiteSvg: '/branding/cognify-logo-white.svg',
};

export const GRAPHICS = {
  none: null,
  graphic01: '/graphics/graphic-01.png',
  graphic02: '/graphics/graphic-02.png',
  graphic03: '/graphics/graphic-03.png',
};

export const CUSTOM_COLORS = {
  Black: '#1a1a1a',
  White: '#f4f1ea',
  Gray: '#6B7280',
  Olive: '#858C72',
};

export const FONT_STACKS = {
  sans: 'Inter, system-ui, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

export const FALLBACK_IMAGES = {
  hoodie: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=1200&q=80',
  shirt: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&q=80',
};

export function graphicSrc(graphicId) {
  if (!graphicId || graphicId === 'none') return null;
  if (graphicId === 'graphic01' || graphicId === 'graphic-01') return GRAPHICS.graphic01;
  if (graphicId === 'graphic02' || graphicId === 'graphic-02') return GRAPHICS.graphic02;
  if (graphicId === 'graphic03' || graphicId === 'graphic-03') return GRAPHICS.graphic03;
  return GRAPHICS[graphicId] || null;
}

export function resolveModelType(product) {
  const type = product?.modelType || product?.category;
  if (type === 'hoodie' || type === 'hoodies') return 'hoodie';
  if (type === 'shirt' || type === 'shirts') return 'shirt';
  return null;
}

export function resolveColorHex(color) {
  if (!color) return CUSTOM_COLORS.Black;
  if (typeof color === 'string') {
    if (color.startsWith('#')) return color;
    return CUSTOM_COLORS[color] || color;
  }
  return color.hex || CUSTOM_COLORS[color.name] || CUSTOM_COLORS.Black;
}
