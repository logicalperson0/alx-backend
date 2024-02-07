//import express from 'express';
const redis = require('redis');
const express = require('express');
const { promisify } = require('util');


const listProducts = [
  {
    Id: 1, name: 'Suitcase 250', price: 50, stock: 4
  },
  {
    Id: 2, name: 'Suitcase 450', price: 100, stock: 10
  },
  {
    Id: 3, name: 'Suitcase 650', price: 350, stock: 2
  },
  {
    Id: 4, name: 'Suitcase 1050', price: 550, stock: 5
  }
];

const getItemById = (id) => {
  for (const c of listProducts) {
    if (c.Id === id) return(c);
  };
};

// express====================================================
const app = express();
const port = 1245;

app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const itemid = parseInt(req.params.itemId);
  const item = getItemById(itemid);
  console.log(item);

  const curr = await getCurrentReservedStockById(itemid);

  if(item) {
    item.currentQuantity = (curr) ? curr : 0;
    res.json(item);
    return;
  }
  res.status(404).json({"status":"Product not found"});
});

app.get('/reserve_product/:itemId', async(req, res) => {
  const itemid = parseInt(req.params.itemId);
  const item = getItemById(itemid);

  if (!item) {
    res.status(404).json({"status":"Product not found"});
    return;
  }
  const curr = await getCurrentReservedStockById(itemid);
  item.currentQuantity = (curr) ? curr : 0;

  if ((item.stock - item.currentQuantity) < 1) {
    res.status(403).json({ status: 'Not enough stock available', itemid });
    return;
  }
  reserveStockById(itemid, parseInt(curr) + 1);
  res.status(200).json({ status: 'Reservation confirmed', itemid});
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

// redis==============================================================
const Newclient = redis.createClient();
const getAsync = promisify(Newclient.get).bind(Newclient);

const reserveStockById = async (itemId, stock) => {
  Newclient.set(`item:${itemId}`, stock);
};

async function getCurrentReservedStockById(itemId) {
  const stk = await getAsync(itemId);
  return stk;
};

//getItemById(4);