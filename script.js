const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
let trash = [];
let savedData = JSON.parse(localStorage.getItem("jadwalData")) || [];

function generateTable() {
  const tbody = document.getElementById('jadwalBody');
  tbody.innerHTML = ""; // Kosongkan tabel saat pertama kali dimuat
  savedData.forEach(data => addRow(data));
}

function addRow(data = null) {
  const tbody = document.getElementById('jadwalBody');
  const row = document.createElement('tr');

  const tanggal = data ? data.tanggal : "";
  const namaHari = data ? data.hari : "";
  const kegiatan = data ? data.kegiatan : "";
  const status = data ? data.status : "Belum Dikerjakan";
  const waktuMulai = data ? data.waktuMulai : "";
  const waktuSelesai = data ? data.waktuSelesai : "";
  const akhirStatus = getAkhirStatus(status);

  row.innerHTML = `
    <td><input type="date" value="${tanggal}" class="border p-2 rounded" onchange="updateDay(this)"></td>
    <td class="day-cell">${namaHari}</td>
    <td><input type="text" class="border p-2 rounded" value="${kegiatan}"></td>
    <td>
      <select class="status-dropdown border p-2 rounded" onchange="updateAkhirStatus(this)">
        <option value="Belum Dikerjakan" ${status === "Belum Dikerjakan" ? "selected" : ""}>Belum Dikerjakan</option>
        <option value="Proses" ${status === "Proses" ? "selected" : ""}>Proses</option>
        <option value="Selesai" ${status === "Selesai" ? "selected" : ""}>Selesai</option>
      </select>
    </td>
    <td><input type="time" class="border p-2 rounded" value="${waktuMulai}"></td>
    <td><input type="time" class="border p-2 rounded" value="${waktuSelesai}"></td>
    <td class="akhir-status">${akhirStatus}</td>
    <td>
      <button class="edit-btn" onclick="editRow(this)">Edit</button>
      <button class="delete-btn" onclick="moveToTrash(this)">Hapus</button>
    </td>
  `;
  tbody.appendChild(row);
  saveData();
}

function updateDay(input) {
  const dayCell = input.parentElement.parentElement.querySelector('.day-cell');
  const date = new Date(input.value);
  dayCell.textContent = isNaN(date) ? '' : hari[date.getDay()];
  saveData();
}

function updateAkhirStatus(select) {
  const akhirStatusCell = select.parentElement.parentElement.querySelector('.akhir-status');
  akhirStatusCell.textContent = getAkhirStatus(select.value);
  saveData();
}

function getAkhirStatus(status) {
  if (status === 'Belum Dikerjakan') return 'Belum Selesai tugasnya.';
  if (status === 'Proses') return 'Sedang dilakukan tugasnya.';
  return 'Sudah selesai tugasnya.';
}

function saveData() {
  const rows = document.querySelectorAll('#jadwalBody tr');
  const newData = [];
  rows.forEach(row => {
    const inputs = row.querySelectorAll('input, select');
    newData.push({
      tanggal: inputs[0].value,
      hari: row.querySelector('.day-cell').textContent,
      kegiatan: inputs[1].value,
      status: inputs[2].value,
      waktuMulai: inputs[3].value,
      waktuSelesai: inputs[4].value,
    });
  });
  localStorage.setItem("jadwalData", JSON.stringify(newData));
}

generateTable();
