const Footer = require('../models/Footer');

// Helper to extract a Meta Pixel ID if user pastes entire snippet
function parsePixelId(input) {
  if (!input) return '';
  const trimmed = String(input).trim();
  
  // If it's already just numeric ID (e.g. 15-16 digits)
  if (/^\d{10,20}$/.test(trimmed)) {
    return trimmed;
  }

  // If user pasted full fbq('init', '1234567890') snippet
  const matchFbq = trimmed.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d+)['"]\s*\)/);
  if (matchFbq && matchFbq[1]) {
    return matchFbq[1];
  }

  // If user pasted <script> or URL containing id=1234567890
  const matchQuery = trimmed.match(/id=(\d{10,20})/);
  if (matchQuery && matchQuery[1]) {
    return matchQuery[1];
  }

  // Fallback: search for first 12-18 consecutive digits
  const matchDigits = trimmed.match(/\b\d{12,18}\b/);
  if (matchDigits && matchDigits[0]) {
    return matchDigits[0];
  }

  return trimmed;
}

// GET /api/meta-pixel
exports.getMetaPixel = async (req, res, next) => {
  try {
    let footer = await Footer.findOne();
    if (!footer) {
      footer = await Footer.create({});
    }

    return res.status(200).json({
      success: true,
      data: {
        metaPixelId: footer.metaPixelId || '',
        metaPixelEnabled: footer.metaPixelEnabled !== false,
        updatedAt: footer.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/meta-pixel
exports.updateMetaPixel = async (req, res, next) => {
  try {
    const { metaPixelId, metaPixelEnabled } = req.body || {};
    let footer = await Footer.findOne();
    if (!footer) {
      footer = new Footer({});
    }

    if (metaPixelId !== undefined) {
      footer.metaPixelId = parsePixelId(metaPixelId);
    }
    if (metaPixelEnabled !== undefined) {
      footer.metaPixelEnabled = Boolean(metaPixelEnabled);
    }

    await footer.save();

    return res.status(200).json({
      success: true,
      message: 'Meta Pixel settings saved successfully',
      data: {
        metaPixelId: footer.metaPixelId,
        metaPixelEnabled: footer.metaPixelEnabled,
        updatedAt: footer.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

