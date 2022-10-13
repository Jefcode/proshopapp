import asyncHandler from 'express-async-handler';

import Product from '../models/productModel.js';

/**
 * @desc    fetch all products
 * @route   GET /api/products
 * @acess   public
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

/**
 * @desc    fetch a single product by id
 * @route   GET /api/products/:id
 * @acess   public
 */
export const getProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404);
      throw new Error('Product not found!');
    }
  } catch (error) {
    res.status(404);
    throw new Error('Product not found!');
  }
});

/**
 * @desc    Delete product by id
 * @route   DELETE /api/products/:id
 * @acess   Private/Admin
 */
export const deleteProductById = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findById(productId);

  await product.delete();

  res.status(200).json({ message: 'Product was deleted' });
});

/**
 * @desc    Create product
 * @route   POST /api/products
 * @acess   Private/Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @acess   Private/Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, countInStock, category } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // update
  product.name = name;
  product.price = price;
  product.description = description;
  product.image = image;
  product.brand = brand;
  product.category = category;
  product.countInStock = countInStock;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

/**
 * @desc    Create a new review
 * @route   POST /api/products/:id/reviews
 * @acess   Private
 */
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // check if user already reviews
  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  // add review
  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added' });
});

/**
 * @desc    Get top products
 * @route   GET /api/products/top
 * @acess   Public
 */
export const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});
