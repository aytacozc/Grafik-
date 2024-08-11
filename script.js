document.addEventListener('DOMContentLoaded', function() {
    function updateRowColors() {
        const rows = document.querySelectorAll('#indexTable tr');
        rows.forEach(row => {
            const changeCell = row.cells[2];
            const changePercentCell = row.cells[3];
            
            if (changeCell.textContent.trim().startsWith('+')) {
                changeCell.classList.add('change-positive');
            } else if (changeCell.textContent.trim().startsWith('-')) {
                changeCell.classList.add('change-negative');
            }
            
            if (changePercentCell.textContent.trim().startsWith('+')) {
                changePercentCell.classList.add('change-positive');
            } else if (changePercentCell.textContent.trim().startsWith('-')) {
                changePercentCell.classList.add('change-negative');
            }
        });
    }

    function updateChart(range) {
        const data = {
            '1d': [39450, 39480, 39470, 39490, 39460, 39480, 39450],
            '1w': [39450, 39480, 39470, 39490, 39510, 39490, 39530],
            '1m': [39450, 39500, 39480, 39520, 39510, 39530, 39500, 39480, 39550, 39520],
            '6m': [39450, 39500, 39460, 39550, 39480, 39600, 39500, 39470, 39620, 39510, 39600, 39580, 39610, 39640],
            '1y': [39450, 39500, 39480, 39530, 39520, 39600, 39510, 39470, 39620, 39540, 39600, 39570, 39610, 39650, 39580, 39600],
            '5y': [39450, 39520, 39480, 39600, 39510, 39620, 39550, 39640, 39580, 39600, 39570, 39630, 39590, 39650, 39620, 39600, 39640, 39630, 39600, 39580, 39610, 39590, 39650, 39560, 39630]
        };

        var ctx = document.getElementById('lineChart').getContext('2d');
        var lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(data[range].length).fill('').map((_, i) => `T${i+1}`),
                datasets: [{
                    label: 'US 30 Index',
                    data: data[range],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1, 
                    pointRadius: 1, 
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.3)' 
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(tooltipItems) {
                                return tooltipItems[0].label;
                            },
                            label: function(tooltipItem) {
                                var indexName = lineChart.data.datasets[0].label;
                                var value = tooltipItem.raw;
                                return indexName + ': ' + value;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        suggestedMin: Math.min(...data[range]) - 50,
                        suggestedMax: Math.max(...data[range]) + 50,
                        ticks: {
                            stepSize: 50
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });

        document.getElementById('indexTable').addEventListener('click', function(event) {
            var target = event.target.closest('tr');
            if (target) {
                var indexName = target.getAttribute('data-index');
                var dataValues = JSON.parse(target.getAttribute('data-values'));

                lineChart.data.datasets[0].label = indexName + ' Index';
                lineChart.data.datasets[0].data = dataValues;
                lineChart.update();
            }
        });
    }

    updateChart('1d');

   
    document.querySelectorAll('.date-buttons button').forEach(button => {
        button.addEventListener('click', function() {
            const range = this.getAttribute('data-range');
            updateChart(range);
        });
    });

    updateRowColors();
});