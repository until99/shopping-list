let currentPage = 1;
let totalPages = 1;
let totalItems = 0;
let itemsPerPage = 10;

const get_all_items = async (page = 1, limit = itemsPerPage) => {
  const response = await fetch(
    `http://127.0.0.1:8000/items/?limit=${limit}&page=${page}&purchased=false`
  );
  const data = await response.json();

  currentPage = data.pagination.current_page;
  totalPages = data.pagination.total_pages;
  totalItems = data.pagination.total_items;
  itemsPerPage = limit;

  updatePaginationUI();

  return data.items;
};

const add_item = async (item) => {
  const response = await fetch("http://127.0.0.1:8000/items/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    console.error("Failed to add item");
    return null;
  }

  const data = await response.json();
  return data;
};

const delete_item = async (itemId, skipRefresh = false) => {
  if (itemId) {
    const response = await fetch(`http://127.0.0.1:8000/items/${itemId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        purchased: true,
      }),
    });

    if (!response.ok) {
      console.error("Failed to update item");
      return null;
    }

    if (!skipRefresh) {
      await populate_items(currentPage);
    }

    return;
  }
};

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("update-item-button")) {
    const button = event.target;
    const item = [
      parseInt(button.dataset.itemId),
      button.dataset.itemName,
      button.dataset.itemDescription,
      button.dataset.itemCategory,
      parseFloat(button.dataset.itemPrice),
      parseInt(button.dataset.itemAmount),
      button.dataset.itemPurchased === "true",
    ];

    open_update_item_dialog(item);
  }

  return;
});

const open_update_item_dialog = (item) => {
  const dialog = document.getElementById("update-item-modal");

  dialog.showModal();

  dialog.querySelector("#item-name").value = item[1];
  dialog.querySelector("#item-description").value = item[2];
  dialog.querySelector("#item-price").value = item[4];
  dialog.querySelector("#item-amount").value = item[5];
  dialog.querySelector("#item-category").value = item[3];

  dialog.querySelector("#update-item-button").onclick = async () => {
    const updatedItem = {
      name: dialog.querySelector("#item-name").value,
      description: dialog.querySelector("#item-description").value,
      price: parseFloat(dialog.querySelector("#item-price").value),
      amount: parseInt(dialog.querySelector("#item-amount").value),
      category: dialog.querySelector("#item-category").value,
      updated_at: new Date().toISOString(),
    };

    update_item(item[0], updatedItem);
  };

  return;
};

const update_item = async (itemId, updatedData) => {
  const response = await fetch(`http://127.0.0.1:8000/items/${itemId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    console.error("Failed to update item");
    return null;
  }

  await populate_items(currentPage);
  return;
};

const populate_items = async (page = 1) => {
  const items = await get_all_items(page, itemsPerPage);
  const itemList = document.getElementById("table-body");

  if (!itemList) {
    console.error("Element with id 'table-body' not found.");
    return;
  }

  itemList.innerHTML = "";

  if (!items || items.length === 0) {
    const messageField = document.getElementById("message");
    messageField.innerHTML = "";
    const noItemsFound = document.createElement("td");
    noItemsFound.innerHTML = "No items found.";
    noItemsFound.colSpan = 8;

    const row = document.createElement("tr");
    row.appendChild(noItemsFound);
    itemList.appendChild(row);
    return;
  }

  const messageField = document.getElementById("message");
  messageField.innerHTML = "";

  items.forEach((item) => {
    const row = document.createElement("tr");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `item-${item[0]}`;

    const full_price = item[4] * item[5];

    row.innerHTML = `
          <td>${checkbox.outerHTML}</td>
          <td>${item[1]}</td>
          <td>${item[2]}</td>
          <td>${item[3]}</td>
          <td>${item[4]}</td>
          <td>${item[5]}</td>
          <td>${full_price.toFixed(2)}</td>
          <td>
            <button
              class="update-item-button"
              data-item-id="${item[0]}"
              data-item-name="${item[1]}"
              data-item-description="${item[2]}"
              data-item-category="${item[3]}"
              data-item-price="${item[4]}"
              data-item-amount="${item[5]}"
              data-item-purchased="${item[6]}"
            >
                Update Item
            </button>
          </td>
      `;
    itemList.appendChild(row);
  });
};

addEventListener("DOMContentLoaded", () => {
  populate_items();
  setupPaginationEvents();
});

const updatePaginationUI = () => {
  document.getElementById("current-page").textContent = currentPage;
  document.getElementById("total-pages").textContent = totalPages;
  document.getElementById("total-items").textContent = `Total: ${totalItems}`;

  const prevButton = document.getElementById("prev-page-button");
  const nextButton = document.getElementById("next-page-button");

  prevButton.disabled = currentPage <= 1;
  nextButton.disabled = currentPage >= totalPages;
};

const setupPaginationEvents = () => {
  const prevButton = document.getElementById("prev-page-button");
  const nextButton = document.getElementById("next-page-button");
  const itemsPerPageSelect = document.getElementById("items-per-page");

  prevButton.addEventListener("click", async () => {
    if (currentPage > 1) {
      await populate_items(currentPage - 1);
    }
  });

  nextButton.addEventListener("click", async () => {
    if (currentPage < totalPages) {
      await populate_items(currentPage + 1);
    }
  });

  itemsPerPageSelect.addEventListener("change", async () => {
    itemsPerPage = parseInt(itemsPerPageSelect.value);
    currentPage = 1;
    await populate_items(1);
  });
};

const open_add_item_modal = document.querySelector("#open-add-item-modal");
const close_add_item_modal = document.querySelector("#close-add-item-modal");
const add_item_button = document.querySelector("#add-item-button");

open_add_item_modal.addEventListener("click", () => {
  const dialog = document.getElementById("add-item-modal");
  dialog.showModal();
});

close_update_item_modal = document.querySelector("#close-update-item-modal");
close_add_item_modal.addEventListener("click", () => {
  const dialog = document.getElementById("add-item-modal");
  dialog.close();
});

close_update_item_modal.addEventListener("click", () => {
  const dialog = document.getElementById("update-item-modal");
  dialog.close();
});

add_item_button.addEventListener("click", async (event) => {
  event.preventDefault();

  const dialog = document.getElementById("add-item-modal");
  const formData = new FormData(dialog.querySelector("form"));

  const newItem = {
    name: formData.get("item-name"),
    description: formData.get("item-description"),
    price: parseFloat(formData.get("item-price")),
    amount: parseInt(formData.get("item-amount")),
    category: formData.get("item-category"),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  await add_item(newItem);
  dialog.close();
  await populate_items(currentPage);
});

const purchase_item_button = document.getElementById("purchase-item-button");
purchase_item_button.addEventListener("click", async () => {
  const selectedItems = Array.from(
    document.querySelectorAll("input[type='checkbox']:checked")
  );

  const itemIds = selectedItems.map((checkbox) =>
    checkbox.id.replace("item-", "")
  );

  const itemsOnPage = document.querySelectorAll("#table-body tr").length;
  const shouldGoToPrevPage =
    itemsOnPage === selectedItems.length && currentPage > 1;

  if (selectedItems.length > 0) {
    for (const itemId of itemIds) {
      await delete_item(itemId, true);
    }

    if (shouldGoToPrevPage) {
      await populate_items(currentPage - 1);
    } else {
      await populate_items(currentPage);
    }
  }
});
