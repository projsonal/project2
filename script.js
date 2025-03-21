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
    <td class="py-3 px-4"><input type="date" value="${tanggal}" class="w-full border p-2 rounded" onchange="updateDay(this)"></td>
    <td class="py-3 px-4 day-cell">${namaHari}</td>
    <td class="py-3 px-4"><input type="text" class="w-full border p-2 rounded"></td>
    <td class="py-3 px-4">
      <select class="status-dropdown w-full border p-2 rounded" onchange="updateAkhirStatus(this)">
        <option value="Belum Dikerjakan">Belum Dikerjakan</option>
        <option value="Proses">Proses</option>
        <option value="Selesai">Selesai</option>
      </select>
    </td>
    <td class="py-3 px-4"><input type="time" class="w-full border p-2 rounded"></td>
    <td class="py-3 px-4"><input type="time" class="w-full border p-2 rounded"></td>
    <td class="py-3 px-4 akhir-status">Belum Selesai tugasnya.</td>
    <td class="py-3 px-4">
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
  updateTrash();
}

function updateTrash() {
  const trashBody = document.getElementById('trashBody');
  trashBody.innerHTML = '';
  trash.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = item + `
      <td class="py-3 px-4">
        <button class="restore-btn" onclick="restoreRow(${index})">Batal</button>
        <button class="delete-btn" onclick="deletePermanently(${index})">Hapus Permanen</button>
      </td>`;
    trashBody.appendChild(tr);
  });
}

function restoreRow(index) {
  const tbody = document.getElementById('jadwalBody');
  const tr = document.createElement('tr');
  tr.innerHTML = trash[index];
  tbody.appendChild(tr);
  trash.splice(index, 1);
  updateTrash();
}

function deletePermanently(index) {
  trash.splice(index, 1);
  updateTrash();
}

function printToPDF() {
  const element = document.body;
  html2pdf().from(element).save('jadwal_harian.pdf');
}

generateTable();
