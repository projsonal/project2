const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function generateTable() {
  const tbody = document.getElementById('jadwalBody');
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    addRowToTable(date);
  }
  updateChart();
}

function addRow(date = new Date()) {
  date.setHours(0, 0, 0, 0);
  addRowToTable(date);
  updateChart();
}

function addRowToTable(date) {
  const tbody = document.getElementById('jadwalBody');
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

function updateChart() {
  const statusCounts = {
    "Belum Dilakukan": 0,
    "Sedang Dilakukan": 0,
    "Selesai": 0
  };

  document.querySelectorAll(".status").forEach(cell => {
    if (statusCounts.hasOwnProperty(cell.textContent)) {
      statusCounts[cell.textContent]++;
    }
  });

  const ctx = document.getElementById('statusChart').getContext('2d');
  if (window.statusChart) window.statusChart.destroy();
  window.statusChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(statusCounts),
      datasets: [{
        label: 'Jumlah Status',
        data: Object.values(statusCounts),
        backgroundColor: ['#ccc', '#f4a261', '#2a9d8f']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          precision: 0
        }
      }
    }
  });
}

generateTable();