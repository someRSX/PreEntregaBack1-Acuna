import { Router } from 'express';
import { readCarts, writeCarts } from '../data/carrito.js';

const router = Router();

router.post('/', (req, res) => {
  const carts = readCarts();
  const newCart = {
    id: carts.length + 1,
    products: []
  };

  carts.push(newCart);
  writeCarts(carts);
  res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
  const cid = parseInt(req.params.cid);
  const carts = readCarts();
  const cart = carts.find((c) => c.id === cid);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

router.post('/:cid/product/:pid', (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  const carts = readCarts();
  const cart = carts.find((c) => c.id === cid);

  if (cart) {
    const existingProduct = cart.products.find((p) => p.product === pid);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    writeCarts(carts);
    res.status(201).json(cart);
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

router.delete('/:cid/product/:pid', (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  const carts = readCarts();
  const cart = carts.find((c) => c.id === cid);

  if (cart) {
    cart.products = cart.products.filter((p) => p.product !== pid);
    writeCarts(carts);
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

export default router;