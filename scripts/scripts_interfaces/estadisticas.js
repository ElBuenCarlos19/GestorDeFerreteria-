document.addEventListener('DOMContentLoaded', function() {
    // Gráfico de ventas por mes
    const ctx1 = document.getElementById('ventasPorMes').getContext('2d');
    const ventasPorMesChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril'], // Etiquetas del eje X (meses)
            datasets: [{
                label: 'Ventas por mes',
                data: [1200, 1900, 3000, 5000], // Aquí irán los datos reales del backend
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    const ctx2 = document.getElementById('ventasPorCategoria').getContext('2d');
    const ventasPorCategoriaChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril'], // Etiquetas del eje X (meses)
            datasets: [{
                label: 'Ventas por mes',
                data: [1200, 1900, 3000, 5000], // Aquí irán los datos reales del backend
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    const ctx3 = document.getElementById('evolucionInventario').getContext('2d');
    const evolucionInventarioChart = new Chart(ctx3, {
        type: 'doughnut',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril'], // Etiquetas del eje X (meses)
            datasets: [{
                label: 'Ventas por mes',
                data: [1200, 1900, 3000, 5000], // Aquí irán los datos reales del backend
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
