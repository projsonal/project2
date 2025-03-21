const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// Fungsi untuk membuat tabel otomatis
function generateTable() {
  for (let i = 0; i < 7; i++) addRow(i);
}

// Fungsi menambah baris baru
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
    <td class="py-3 px-4"><input type="text" class="w-full border p-2 rounded" oninput="updateStatus(this)"></td>
    <td class="py-3 px-4"><input type="time" class="w-full border p-2 rounded"></td>
    <td class="py-3 px-4"><input type="time" class="w-full border p-2 rounded"></td>
    <td class="py-3 px-4 status text-gray-600">Belum Dilakukan</td>
    <td class="py-3 px-4"><button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onclick="deleteRow(this)">Hapus</button></td>
  `;
  tbody.appendChild(row);
  updateChart();
}

// Fungsi mengupdate hari berdasarkan tanggal yang dipilih
function updateDay(input) {
  const dayCell = input.parentElement.parentElement.querySelector('.day-cell');
  const date = new Date(input.value);
  dayCell.textContent = isNaN(date) ? '' : hari[date.getDay()];
}

// Fungsi mengubah status otomatis
function updateStatus(input) {
  const statusCell = input.parentElement.parentElement.querySelector('.status');
  const value = input.value.trim().toLowerCase();

  if (value === '') {
    statusCell.textContent = 'Belum Dilakukan';
    statusCell.classList.add("text-gray-600");
  } else if (value === 'proses') {
    statusCell.textContent = 'Sedang Dilakukan';
    statusCell.classList.add("text-yellow-600");
  } else {
    statusCell.textContent = 'Selesai';
    statusCell.classList.add("text-green-600");
  }
  updateChart();
}

// Fungsi menghapus baris
function deleteRow(button) {
  button.parentElement.parentElement.remove();
  updateChart();
}

// Fungsi untuk mencetak ke PDF
function printToPDF() {
  const element = document.body;
  html2pdf(element);
}

// Fungsi memperbarui chart
function updateChart() {
  const statuses = Array.from(document.querySelectorAll('.status')).map(cell => cell.textContent);
  const counts = {
    'Belum Dilakukan': 0,
    'Sedang Dilakukan': 0,
    'Selesai': 0
  };
  statuses.forEach(status => {
    if (counts.hasOwnProperty(status)) counts[status]++;
  });

  if (window.statusChart) {
    window.statusChart.data.datasets[0].data = Object.values(counts);
    window.statusChart.update();
  } else {
    const ctx = document.getElementById('statusChart');
    window.statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(counts),
        datasets: [{
          label: 'Jumlah Status',
          data: Object.values(counts),
          backgroundColor: ['#d1d5db', '#facc15', '#4ade80']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}

generateTable();
