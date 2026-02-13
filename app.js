const decadeSelect = document.getElementById("decade");
const searchInput = document.getElementById("search");
const tableBody = document.getElementById("songs");
const miniPlayer = document.getElementById("mini-player");
const miniPlayerFrame = document.getElementById("mini-player-frame");
const miniPlayerTitle = document.getElementById("mini-player-title");
const miniPlayerClose = document.getElementById("mini-player-close");

let allRows = [];

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];

  const headers = splitCSVLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = splitCSVLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    return row;
  });
}

function splitCSVLine(line) {
  const parts = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      parts.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  parts.push(current.trim());
  return parts;
}

function buildYouTubeSearchUrl(songTitle, film) {
  const q = [songTitle, film, "Mohammad Rafi"].filter(Boolean).join(" ");
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}

function buildYouTubeEmbedUrl(songTitle, film) {
  const q = [songTitle, film, "Mohammad Rafi"].filter(Boolean).join(" ");
  return `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(q)}&autoplay=1`;
}

function playInMiniPlayer(row) {
  miniPlayerTitle.textContent = `${row.song_title || "Unknown Song"} — ${row.film || "Unknown Film"}`;
  miniPlayerFrame.src = buildYouTubeEmbedUrl(row.song_title, row.film);
  miniPlayer.hidden = false;
}

function closeMiniPlayer() {
  miniPlayer.hidden = true;
  miniPlayerFrame.src = "";
  miniPlayerTitle.textContent = "Now playing";
}

function loadCSV(file) {
  fetch(`data/${file}`)
    .then((res) => res.text())
    .then((text) => {
      allRows = parseCSV(text);
      render(allRows);
    });
}

function render(rows) {
  tableBody.innerHTML = "";

  if (rows.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="7" class="small">No songs found for this decade yet.</td>';
    tableBody.appendChild(tr);
    return;
  }

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    const youtubeLink = row.youtube_url || buildYouTubeSearchUrl(row.song_title, row.film);

    tr.innerHTML = `
      <td>${row.song_title || ""}</td>
      <td>${row.film || ""}</td>
      <td>${row.year || ""}</td>
      <td>${row.category || ""}</td>
      <td>${row.composer || ""}</td>
      <td>${row.lyricist || ""}</td>
      <td>
        <button type="button" class="player-link">Play in app</button>
        <div class="small"><a href="${youtubeLink}" target="_blank" rel="noopener noreferrer">Open YouTube</a></div>
      </td>
    `;

    const button = tr.querySelector(".player-link");
    button.addEventListener("click", () => playInMiniPlayer(row));
    tableBody.appendChild(tr);
  });
}

searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) {
    render(allRows);
    return;
  }

  const filtered = allRows.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(q)
  );
  render(filtered);
});

decadeSelect.addEventListener("change", () => {
  loadCSV(decadeSelect.value);
  searchInput.value = "";
});

miniPlayerClose.addEventListener("click", closeMiniPlayer);

loadCSV(decadeSelect.value);
