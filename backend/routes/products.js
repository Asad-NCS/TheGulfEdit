const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: /featured MUST come before /:slug to avoid route conflict
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/products/featured
// Returns up to 8 featured, active products (used on homepage)
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true, active: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .select('-__v');
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products
// Supports: ?category= &brand= &size= &sort= &page= &limit=
router.get('/', async (req, res) => {
  try {
    const {
      category,
      brand,
      size,
      minPrice,
      maxPrice,
      sort    = 'createdAt_desc',
      page    = 1,
      limit   = 12,
      search,
    } = req.query;

    // Build filter
    const filter = { active: true };
    if (category) filter.category = category.toLowerCase();
    if (brand)    filter.brand    = brand;                  // case-sensitive: Splash/Max/R&B
    if (size)     filter['sizes.size'] = size;
    if (minPrice || maxPrice) {
      filter.price_pkr = {};
      if (minPrice) filter.price_pkr.$gte = Number(minPrice);
      if (maxPrice) filter.price_pkr.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort
    const sortMap = {
      createdAt_desc:  { createdAt: -1 },
      createdAt_asc:   { createdAt:  1 },
      price_asc:       { price_pkr:  1 },
      price_desc:      { price_pkr: -1 },
    };
    const sortOption = sortMap[sort] || { createdAt: -1 };

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum).select('-__v'),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page:       pageNum,
        limit:      limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:slug
// Single product by slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({
      slug:   req.params.slug,
      active: true,
    }).select('-__v');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
