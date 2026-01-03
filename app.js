const decadeSelect = document.getElementById("decade");
const searchInput = document.getElementById("search");
const tableBody = document.getElementById("songs");

let allRows = [];

function loadCSV(file) {
  fetch(`data/${file}`)
    .then(res => res.text())
    .then(text => {
      const lines = text.split("\n").slice(1);
      allRows = lines.map(l => l.split(","));
      render(allRows);
    });
}

function render(rows) {
  tableBody.innerHTML = "";
  rows.forEach(r => {
    if (r.length < 6) return;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r[0]}</td>
      <td>${r[1]}</td>
      <td>${r[2]}</td>
      <td>${r[4]}</td>
      <td>${r[6]}</td>
      <td>${r[7]}</td>
    `;
    tableBody.appendChild(tr);
  });
}

searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();
  render(allRows.filter(r => r.join(" ").toLowerCase().includes(q)));
});

decadeSelect.addEventListener("change", () => {
  loadCSV(decadeSelect.value);
});

loadCSV(decadeSelect.value);
