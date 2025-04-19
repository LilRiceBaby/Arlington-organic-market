const express = require('express');
const router = express.Router();
const db = require('./db'); 


// Q1: Add Almond Nuts Product
router.post('/add-product', async (req, res) => {
  try {
    // 1. Insert vendor
    await db.promise().query(`
      INSERT IGNORE INTO vendor (vId, Vname, Street, City, StateAb, ZipCode)
      VALUES (201, 'Organic Farms', '123 Greenway Blvd', 'Dallas', 'TX', '75001')
    `);

    // 2. Insert item
    await db.promise().query(`
      INSERT IGNORE INTO item (iId, Iname, Sprice, Category)
      VALUES (101, 'Almond Nuts', 12.99, 'Nuts')
    `);

    // 3. Link vendor to item
    await db.promise().query(`
      INSERT IGNORE INTO vendor_item (vId, iId)
      VALUES (201, 101)
    `);

    // 4. Add 50 units to store ID = 1
    await db.promise().query(`
      INSERT INTO store_item (sId, iId, Scount)
      VALUES (1, 101, 50)
      ON DUPLICATE KEY UPDATE Scount = 50
    `);

    res.send('✅ Almond Nuts added successfully.');
  } catch (err) {
    res.status(500).send(`❌ Error adding product: ${err.message}`);
  }
});

// Q2: View available products in store 1
router.get('/available-products', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT i.Iname, i.Sprice, si.Scount
      FROM item i
      JOIN store_item si ON i.iId = si.iId
      WHERE si.sId = 1
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).send(`❌ Error fetching products: ${err.message}`);
  }
});

// Q3: Update price
router.put('/update-price', async (req, res) => {
  try {
    await db.promise().query(`
      UPDATE item
      SET Sprice = 10.99
      WHERE iId = 101
    `);
    res.send('✅ Price updated to $10.99.');
  } catch (err) {
    res.status(500).send(`❌ Error updating price: ${err.message}`);
  }
});

// Q4: Remove product
router.delete('/remove-product', async (req, res) => {
  try {
    // 0. Remove references from order_item (foreign key blocker)
    await db.promise().query(`
      DELETE FROM order_item WHERE iId = 101
    `);

    // 1. Remove from store inventory
    await db.promise().query(`
      DELETE FROM store_item WHERE iId = 101
    `);

    // 2. Remove vendor-item link
    await db.promise().query(`
      DELETE FROM vendor_item WHERE iId = 101
    `);

    // 3. Remove from item table
    await db.promise().query(`
      DELETE FROM item WHERE iId = 101
    `);

    // 4. Remove vendor if it no longer supplies any items
    await db.promise().query(`
      DELETE FROM vendor
      WHERE vId = 201
      AND NOT EXISTS (
        SELECT 1 FROM vendor_item WHERE vId = 201
      )
    `);

    res.send('✅ Product and all related data removed successfully.');
  } catch (err) {
    res.status(500).send(`❌ Error removing product: ${err.message}`);
  }
});


// View-based queries (QV1–QV5)
router.get('/views/top-items', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT Iname, TotalRevenue
      FROM ItemSalesSummary
      ORDER BY TotalRevenue DESC
      LIMIT 3
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).send(`❌ Error fetching top items: ${err.message}`);
  }
});

router.get('/views/items-over-50', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT Iname, TotalQuantitySold
      FROM ItemSalesSummary
      WHERE TotalQuantitySold > 50
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).send(`❌ Error fetching items: ${err.message}`);
  }
});

router.get('/views/top-customer', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT Cname, LoyaltyScore
      FROM TopLoyalCustomers
      ORDER BY LoyaltyScore DESC
      LIMIT 1
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).send(`❌ Error fetching top customer: ${err.message}`);
  }
});

router.get('/views/loyal-customers', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT Cname, LoyaltyScore
      FROM TopLoyalCustomers
      WHERE LoyaltyScore BETWEEN 4 AND 5
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).send(`❌ Error fetching loyal customers: ${err.message}`);
  }
});

router.get('/views/total-revenue', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT SUM(TotalRevenue) AS TotalRevenue
      FROM ItemSalesSummary
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).send(`❌ Error fetching revenue: ${err.message}`);
  }
});

module.exports = router;
