## Features Implemented

- Add, update, view, and delete inventory
- Track revenue and customer loyalty via views
- Clean user interface frontend + MySQL-powered backend

## Tech Stack

- Node.js, Express.js, MySQL
- HTML/CSS/JS
- phpMyAdmin (via XAMPP)

## Setup Instructions

1. Import `ArlingtonOrganicMarket.sql` into phpMyAdmin
2. Run `npm install` in the `backend` folder
3. Start backend: `npm run dev`
4. Open `frontend/index.html` in browser

## Backend logic (routes.js)

- The routes.js file defines all the backend routes used in the Arlington Organic Market Web App. It connects the frontend buttons to actual MySQL database operations through a set of organized Express.js endpoints.
- It acts as the control center for all backend operations. Each route corresponds to a specific button or action triggered from the frontend.
- Each route in routes.js is tightly coupled with a specific part of the frontend, creating a fully interactive full-stack experience.

## Code Breakdown

1. Add Product (POST /add-product)

   - Inserts a new vendor if it doesn't exist (Organic Farms)
   - Adds a new product (Almond Nuts)
   - Links the vendor to the item
   - Stocks 50 units of the item at store ID 1
   - Uses INSERT IGNORE and ON DUPLICATE KEY to avoid duplicate errors

   Triggered by: "Add Product" button in UI
   Handles: Q1

2. View Products (GET /available-products)

   - Retrieves all items at store ID 1, including name, price, and stock count

   Triggered by: "View Products" button
   Handles: Q2

3. Update Price (PUT /update-price)

   - Updates the price of Almond Nuts to $10.99 in the item table

   Triggered by: "Update Price" button
   Handles: Q3

4. Remove Product (DELETE /remove-product)

   - Deletes the product and all its dependencies in proper order:

   - Removes associated order_item records

   - Removes stock from store_item

   - Removes link from vendor_item

   - Deletes from item table

   - Deletes the vendor if it no longer supplies any items

   Triggered by: "Remove Product" button
   Handles: Q4
