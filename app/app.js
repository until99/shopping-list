const get_all_items = async () => {
  const response = await fetch("http://127.0.0.1:8000/items/?limit=10&page=1");
  const data = await response.json();

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

const delete_item = async (itemId) => {
  const response = await fetch(`http://127.0.0.1:8000/items/${itemId}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    console.error("Failed to delete item");
    return null;
  }

  return true;
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

    await update_item(item[0], updatedItem);
    dialog.close();
    location.reload();
  };
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

  const data = await response.json();
  return data;
};

const populate_items = async () => {
  const items = await get_all_items();
  const itemList = document.getElementById("table-body");

  if (!itemList) {
    console.error("Element with id 'table-body' not found.");
    return;
  }

  if (!items || items.length === 0) {
    console.error("No items found.");
    return;
  }

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
          <td>${full_price}</td>
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
});

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

  console.log(newItem);

  await add_item(newItem);
  dialog.close();
  location.reload();
});

const purchase_item_button = document.getElementById("purchase-item-button");
purchase_item_button.addEventListener("click", async () => {
  const selectedItems = Array.from(
    document.querySelectorAll("input[type='checkbox']:checked")
  );
  const itemIds = selectedItems.map((checkbox) =>
    checkbox.id.replace("item-", "")
  );
  console.log("Selected item IDs:", itemIds);
});
