const backendUrl = 'http://localhost:3000';

async function addProduct() {
  const res = await fetch(`${backendUrl}/add-product`, { method: 'POST' });
  const text = await res.text();
  document.getElementById('addProductResult').innerText = text;
}

async function fetchAvailableProducts() {
  const res = await fetch(`${backendUrl}/available-products`);
  const data = await res.json();
  renderTable(data, 'productTable');
}

async function updatePrice() {
  const res = await fetch(`${backendUrl}/update-price`, { method: 'PUT' });
  const text = await res.text();
  document.getElementById('updatePriceResult').innerText = text;
}

async function removeProduct() {
  const res = await fetch(`${backendUrl}/remove-product`, { method: 'DELETE' });
  const text = await res.text();
  document.getElementById('removeProductResult').innerText = text;
}

async function runQuery(queryType) {
  const res = await fetch(`${backendUrl}/views/${queryType}`);
  const data = await res.json();
  renderTable(data, 'viewResults');
}

function renderTable(data, tableId) {
  const table = document.getElementById(tableId);
  table.innerHTML = "";

  if (!data.length) {
    table.innerHTML = "<tr><td>No data found</td></tr>";
    return;
  }

  // Table Headers
  const headers = Object.keys(data[0]);
  const headerRow = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
  table.innerHTML += headerRow;

  // Table Rows
  data.forEach(row => {
    const rowHTML = `<tr>${headers.map(h => `<td>${row[h]}</td>`).join('')}</tr>`;
    table.innerHTML += rowHTML;
  });
}
