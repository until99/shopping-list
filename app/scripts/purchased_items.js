let currentPage = 1;
let totalPages = 1;
let totalItems = 0;
let itemsPerPage = 10;

const getPurchasedItems = async (page = 1, limit = itemsPerPage) => {
  const response = await fetch(
    `http://127.0.0.1:8000/items/?limit=${limit}&page=${page}&purchased=true`
  );
  const data = await response.json();

  currentPage = data.pagination.current_page;
  totalPages = data.pagination.total_pages;
  totalItems = data.pagination.total_items;
  itemsPerPage = limit;

  updatePaginationUI();

  return data.items;
};

const populatePurchasedItems = async (page = 1) => {
  const items = await getPurchasedItems(page, itemsPerPage);
  const purchasedItemsList = document.getElementById("purchased-items-list");

  if (!purchasedItemsList) {
    console.error("Element with id 'purchased-items-list' not found.");
    return;
  }

  purchasedItemsList.innerHTML = "";

  if (!items || items.length === 0) {
    const messageField = document.getElementById("message");
    if (messageField) {
      messageField.innerHTML = "";
    }
    const noItemsFound = document.createElement("td");
    noItemsFound.innerHTML = "No purchased items found.";
    noItemsFound.colSpan = 6;

    const row = document.createElement("tr");
    row.appendChild(noItemsFound);
    purchasedItemsList.appendChild(row);
    
    // Set total to 0 when no items
    const totalValueElement = document.getElementById("purchased-total-value");
    if (totalValueElement) {
      totalValueElement.innerHTML = `<strong>$0.00</strong>`;
    }
    
    return;
  }

  const messageField = document.getElementById("message");
  if (messageField) {
    messageField.innerHTML = "";
  }

  let totalValue = 0;

  items.forEach((item) => {
    const row = document.createElement("tr");
    const full_price = item[4] * item[5];
    totalValue += full_price;

    row.innerHTML = `
      <td>${item[1]}</td>
      <td>${item[2]}</td>
      <td>${item[3]}</td>
      <td>$${item[4]}</td>
      <td>${item[5]}</td>
      <td>$${full_price.toFixed(2)}</td>
    `;
    purchasedItemsList.appendChild(row);
  });

  // Update total value display
  const totalValueElement = document.getElementById("purchased-total-value");
  if (totalValueElement) {
    totalValueElement.innerHTML = `<strong>$${totalValue.toFixed(2)}</strong>`;
  }
};

const updatePaginationUI = () => {
  const currentPageElement = document.getElementById("current-page");
  const totalPagesElement = document.getElementById("total-pages");
  const totalItemsElement = document.getElementById("total-items");

  if (currentPageElement) currentPageElement.textContent = currentPage;
  if (totalPagesElement) totalPagesElement.textContent = totalPages;
  if (totalItemsElement) totalItemsElement.textContent = `Total: ${totalItems}`;

  const prevButton = document.getElementById("prev-page-button");
  const nextButton = document.getElementById("next-page-button");

  if (prevButton) prevButton.disabled = currentPage <= 1;
  if (nextButton) nextButton.disabled = currentPage >= totalPages;
};

const setupPaginationEvents = () => {
  const prevButton = document.getElementById("prev-page-button");
  const nextButton = document.getElementById("next-page-button");
  const itemsPerPageSelect = document.getElementById("items-per-page");

  if (prevButton) {
    prevButton.addEventListener("click", async () => {
      if (currentPage > 1) {
        await populatePurchasedItems(currentPage - 1);
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", async () => {
      if (currentPage < totalPages) {
        await populatePurchasedItems(currentPage + 1);
      }
    });
  }

  if (itemsPerPageSelect) {
    itemsPerPageSelect.addEventListener("change", async () => {
      itemsPerPage = parseInt(itemsPerPageSelect.value);
      currentPage = 1;
      await populatePurchasedItems(1);
    });
  }
};

addEventListener("DOMContentLoaded", () => {
  populatePurchasedItems();
  setupPaginationEvents();
});
