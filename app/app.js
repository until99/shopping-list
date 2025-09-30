const get_all_items = async () => {
  const response = await fetch("http://127.0.0.1:8000/items/?limit=10&page=1");
  const data = await response.json();

  console.log(data.items);

  return data.items;
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

    if (item[6] !== true) {
      row.innerHTML = `
            <td>${checkbox.outerHTML}</td>
            <td>${item[0]}</td>
            <td>${item[1]}</td>
            <td>${item[2]}</td>
            <td>${item[3]}</td>
            <td>${item[4]}</td>
        `;
      itemList.appendChild(row);
    }
  });
};
