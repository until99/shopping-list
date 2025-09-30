const get_all_items = async () => {
  const response = await fetch("http://127.0.0.1:8000/items/?limit=10&page=1");
  const data = await response.json();
  return data.items;
};

const populate_items = async () => {
  const items = await get_all_items();
  const itemList = document.getElementById("item-list");

  if (!itemList) {
    console.error("Element with id 'item-list' not found.");
    return;
  }

  if (!items || items.length === 0) {
    console.error("No items found.");
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    itemList.appendChild(li);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  populate_items();
});
