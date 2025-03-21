const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

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
    <td class="py-2 px-4"><input type="date" value="${tanggal}" class="w-full" onchange="updateDay(this)"></td>
    <td class="py-2 px-4 day-cell">${namaHari}</td>
    <td class="py-2 px-4"><input type="text" class="w-full" oninput="updateStatus(this)"></td>
    <td class="py-2 px-4"><input type="time" class="w-full"></td>
    <td class="py-2 px-4"><input type="time" class="w-full"></td>
    <td class="py-2 px-4 status">Belum Dilakukan</td>
  `;
  tbody.appendChild(row);
  updateChart();
}

function updateDay(input) {
  const dayCell = input.parentElement.parentElement.querySelector('.day-cell');
  const date = new Date(input.value);
  dayCell.textContent = isNaN(date) ? '' : hari[date.getDay()];
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
  updateChart();
}

function printToPDF() {
  window.print();
}

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
          backgroundColor: ['#f87171', '#facc15', '#4ade80']
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
