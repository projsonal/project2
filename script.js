const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function generateTable() {
  const tbody = document.getElementById('jadwalBody');
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const tanggal = date.toISOString().split('T')[0];
    const namaHari = hari[date.getDay()];

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${tanggal}</td>
      <td>${namaHari}</td>
      <td><input type="text" oninput="updateStatus(this)"></td>
      <td><input type="text"></td>
      <td><input type="text"></td>
      <td class="status">Belum Dilakukan</td>
    `;

    tbody.appendChild(row);
  }
}

function updateStatus(input) {
  const statusCell = input.parentElement.parentElement.querySelector('.status');
  const value = input.value.trim().toLowerCase();

  if (value === '') {
    statusCell.textContent = 'Belum Dilakukan';
  } else if (value === 'proses') {
    statusCell.textContent = 'Sedang Dilakukan';
  } else {
    statusCell.textContent = 'Selesai';
  }
}

generateTable();
