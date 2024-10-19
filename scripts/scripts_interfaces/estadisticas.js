const {ipcRenderer} = require('electron');

document.addEventListener('DOMContentLoaded', function() {
    ipcRenderer.send('sendsearchallrows', { dataSearch: ['invoice', 'datetime'] });
    ipcRenderer.on('returnalldata', (event, data) => {
        fechas = data;

        // Inicializar datos para las gráficas
        let ventasPorSemana = [0, 0, 0, 0, 0, 0, 0]; // De Domingo (0) a Sábado (6)
        let ventasPorMes = Array(12).fill(0); // De Enero (0) a Diciembre (11)
        let ventasPorHora = Array(24).fill(0); // De 00:00 a 23:00 horas

        // Iterar sobre las fechas y llenar los datos
        fechas.forEach(fechaObj => {
            const fecha = new Date(fechaObj.datetime);

            // 1. Día de la semana
            const diaSemana = fecha.getDay();
            ventasPorSemana[diaSemana]++;

            // 2. Mes
            const mes = fecha.getMonth();
            ventasPorMes[mes]++;

            // 3. Hora del día
            const hora = fecha.getHours();
            ventasPorHora[hora]++;
        });

        // Gráfico de ventas por semana
        const ctx1 = document.getElementById('ventasPorMes').getContext('2d');
        const ventasPorSemanaChart = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                datasets: [{
                    label: 'Ventas por dia de la semana',
                    data: ventasPorSemana,
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

        // Gráfico de ventas por mes
        const ctx2 = document.getElementById('ventasPorCategoria').getContext('2d');
        const ventasPorMesChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                datasets: [{
                    label: 'Ventas por mes',
                    data: ventasPorMes,
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

        // Gráfico de ventas por hora del día
        const ctx3 = document.getElementById('ventasPorHora').getContext('2d');
        const ventasPorHoraChart = new Chart(ctx3, {
            type: 'line',
            data: {
                labels: Array.from({ length: 24 }, (_, i) => `${i}:00`), // 00:00 - 23:00
                datasets: [{
                    label: 'Ventas por hora del día',
                    data: ventasPorHora,
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
});
