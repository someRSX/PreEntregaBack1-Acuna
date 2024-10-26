import { Router } from 'express';
import { readProducts, writeProducts } from '../data/productos.js';

const router = Router();

router.get('/', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const products = readProducts();
  res.json(limit ? products.slice(0, limit) : products);
});

router.post('/', (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  const products = readProducts();
  const newProduct = {
    id: products.length + 1,
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails: thumbnails || [],
  };

  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
  const pid = parseInt(req.params.pid);
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  
  const products = readProducts();
  const productIndex = products.findIndex((p) => p.id === pid);

  if (productIndex !== -1) {
    const updatedProduct = { ...products[productIndex], title, description, code, price, stock, category, thumbnails };
    products[productIndex] = updatedProduct;
    writeProducts(products);
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

router.delete('/:pid', (req, res) => {
  const pid = parseInt(req.params.pid);
  const products = readProducts();
  
  const newProducts = products.filter((p) => p.id !== pid);
  
  if (newProducts.length !== products.length) {
    writeProducts(newProducts);
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

router.get('/:pid', (req, res) => {
  const pid = parseInt(req.params.pid);
  const products = readProducts();
  const product = products.find((p) => p.id === pid);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

export default router;