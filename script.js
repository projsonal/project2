const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
let trash = [];

function generateTable() {
  for (let i = 0; i < 7; i++) addRow(i);
}

function addRow(offset = null) {
  const tbody = document.getElementById('jadwalBody');
  const today = new Date();
  const date = new Date(today);
  if (offset !== null) date.setDate(today.getDate() + offset);
  const tanggal = offset !== null ? date.toISOString().split('T')[0] : '';
  const namaHari = offset !== null ? hari[date.getDay()] : '';

  const row = document.createElement('tr');
  row.innerHTML = `
    <td><input type="date" value="${tanggal}" class="border p-2 rounded" onchange="updateDay(this)"></td>
    <td class="day-cell">${namaHari}</td>
    <td><input type="text" class="border p-2 rounded"></td>
    <td>
      <select class="status-dropdown border p-2 rounded" onchange="updateAkhirStatus(this)">
        <option value="Belum Dikerjakan">Belum Dikerjakan</option>
        <option value="Proses">Proses</option>
        <option value="Selesai">Selesai</option>
      </select>
    </td>
    <td><input type="time" class="border p-2 rounded"></td>
    <td><input type="time" class="border p-2 rounded"></td>
    <td class="akhir-status">Belum Selesai tugasnya.</td>
    <td>
      <button class="edit-btn" onclick="editRow(this)">Edit</button>
      <button class="delete-btn" onclick="moveToTrash(this)">Hapus</button>
    </td>
  `;
  tbody.appendChild(row);
}

function updateDay(input) {
  const dayCell = input.parentElement.parentElement.querySelector('.day-cell');
  const date = new Date(input.value);
  dayCell.textContent = isNaN(date) ? '' : hari[date.getDay()];
}

function updateAkhirStatus(select) {
  const akhirStatusCell = select.parentElement.parentElement.querySelector('.akhir-status');
  const value = select.value;

  if (value === 'Belum Dikerjakan') {
    akhirStatusCell.textContent = 'Belum Selesai tugasnya.';
  } else if (value === 'Proses') {
    akhirStatusCell.textContent = 'Sedang dilakukan tugasnya.';
  } else {
    akhirStatusCell.textContent = 'Sudah selesai tugasnya.';
  }
}

function moveToTrash(button) {
  const row = button.parentElement.parentElement;
  trash.push(row.innerHTML);
  row.remove();
  updateTrashTable();
}

function updateTrashTable() {
  const trashBody = document.getElementById('trashBody');
  trashBody.innerHTML = '';
  trash.forEach((rowHtml, index) => {
    const row = document.createElement('tr');
    row.innerHTML = rowHtml;
    row.querySelector(".delete-btn").textContent = "Hapus Permanen";
    row.querySelector(".delete-btn").setAttribute("onclick", `deletePermanently(${index})`);
    row.querySelector(".edit-btn").textContent = "Batal";
    row.querySelector(".edit-btn").setAttribute("onclick", `restoreFromTrash(${index})`);
    trashBody.appendChild(row);
  });
}

function restoreFromTrash(index) {
  const tbody = document.getElementById('jadwalBody');
  const row = document.createElement('tr');
  row.innerHTML = trash[index];
  tbody.appendChild(row);
  trash.splice(index, 1);
  updateTrashTable();
}

function deletePermanently(index) {
  trash.splice(index, 1);
  updateTrashTable();
}

generateTable();
