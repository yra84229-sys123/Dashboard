// Global chart instances
let overviewChartInstance = null;
let statusChartInstance = null;

// Initialize Charts
document.addEventListener("DOMContentLoaded", function () {
    initOverviewChart();
    initStatusChart();
});

// Helper to get CSS variable values
function getCssVariable(name) {
    return getComputedStyle(document.body).getPropertyValue(name).trim();
}

// 1. Overview Line Chart
function initOverviewChart() {
    const ctx = document.getElementById('overviewChart');
    if (!ctx) return;

    // Get current theme colors
    const isDark = document.body.classList.contains('dark-theme');
    const labelColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#1f2937' : '#f1f5f9';

    // Create gradient fills
    const ctx2D = ctx.getContext('2d');
    
    // Blue Gradient for Pages
    const blueGradient = ctx2D.createLinearGradient(0, 0, 0, 300);
    blueGradient.addColorStop(0, 'rgba(37, 99, 235, 0.25)');
    blueGradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

    // Green Gradient for Accounts
    const greenGradient = ctx2D.createLinearGradient(0, 0, 0, 300);
    greenGradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    greenGradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    const data = {
        labels: ['Jun 19', 'Jun 20', 'Jun 21', 'Jun 22', 'Jun 23', 'Jun 24', 'Jun 25'],
        datasets: [
            {
                label: 'Pages',
                data: [80, 103, 85, 105, 100, 90, 108],
                borderColor: '#2563eb',
                backgroundColor: blueGradient,
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: '#2563eb',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                label: 'Accounts',
                data: [35, 52, 42, 58, 50, 44, 53],
                borderColor: '#10b981',
                backgroundColor: greenGradient,
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'center',
                    labels: {
                        boxWidth: 8,
                        boxHeight: 8,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20,
                        font: {
                            family: "'Outfit', sans-serif",
                            size: 12,
                            weight: 500
                        },
                        color: labelColor
                    }
                },
                tooltip: {
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    titleColor: isDark ? '#f8fafc' : '#1e293b',
                    bodyColor: isDark ? '#94a3b8' : '#64748b',
                    borderColor: isDark ? '#374151' : '#e2e8f0',
                    borderWidth: 1,
                    padding: 12,
                    boxPadding: 6,
                    cornerRadius: 8,
                    usePointStyle: true,
                    titleFont: {
                        family: "'Outfit', sans-serif",
                        weight: 600
                    },
                    bodyFont: {
                        family: "'Outfit', sans-serif"
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: labelColor,
                        font: {
                            family: "'Outfit', sans-serif",
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: labelColor,
                        font: {
                            family: "'Outfit', sans-serif",
                            size: 11
                        },
                        stepSize: 30
                    },
                    min: 0,
                    max: 120
                }
            }
        }
    };

    window.overviewChartInstance = overviewChartInstance = new Chart(ctx, config);
}

// 2. Status Distribution Doughnut Chart
function initStatusChart() {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;

    const isDark = document.body.classList.contains('dark-theme');
    const bgSecondary = isDark ? '#111827' : '#ffffff';

    const data = {
        labels: ['Green (Good)', 'Yellow (Warning)', 'Red (Bad)', 'Unknown'],
        datasets: [{
            data: [68, 25, 12, 10],
            backgroundColor: [
                '#10b981', // Green
                '#f59e0b', // Yellow
                '#ef4444', // Red
                '#94a3b8'  // Unknown (Gray)
            ],
            borderWidth: 3,
            borderColor: bgSecondary,
            hoverOffset: 4
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: {
                    display: false // Using custom HTML Legend
                },
                tooltip: {
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    titleColor: isDark ? '#f8fafc' : '#1e293b',
                    bodyColor: isDark ? '#94a3b8' : '#64748b',
                    borderColor: isDark ? '#374151' : '#e2e8f0',
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: 8,
                    titleFont: {
                        family: "'Outfit', sans-serif",
                        weight: 600
                    },
                    bodyFont: {
                        family: "'Outfit', sans-serif"
                    }
                }
            }
        }
    };

    window.statusChartInstance = statusChartInstance = new Chart(ctx, config);
}

// 3. Update Charts on Theme Change
function updateChartsTheme(isDark) {
    const labelColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#1f2937' : '#f1f5f9';
    const bgSecondary = isDark ? '#111827' : '#ffffff';

    // Update Overview Chart
    if (overviewChartInstance) {
        overviewChartInstance.options.scales.x.ticks.color = labelColor;
        overviewChartInstance.options.scales.y.ticks.color = labelColor;
        overviewChartInstance.options.scales.y.grid.color = gridColor;
        overviewChartInstance.options.plugins.legend.labels.color = labelColor;
        
        // Tooltip updates
        overviewChartInstance.options.plugins.tooltip.backgroundColor = isDark ? '#111827' : '#ffffff';
        overviewChartInstance.options.plugins.tooltip.titleColor = isDark ? '#f8fafc' : '#1e293b';
        overviewChartInstance.options.plugins.tooltip.bodyColor = isDark ? '#94a3b8' : '#64748b';
        overviewChartInstance.options.plugins.tooltip.borderColor = isDark ? '#374151' : '#e2e8f0';

        // Redraw gradient colors on canvas
        const ctx = document.getElementById('overviewChart');
        if (ctx) {
            const ctx2D = ctx.getContext('2d');
            const blueGradient = ctx2D.createLinearGradient(0, 0, 0, 300);
            blueGradient.addColorStop(0, isDark ? 'rgba(37, 99, 235, 0.15)' : 'rgba(37, 99, 235, 0.25)');
            blueGradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)');
            overviewChartInstance.data.datasets[0].backgroundColor = blueGradient;

            const greenGradient = ctx2D.createLinearGradient(0, 0, 0, 300);
            greenGradient.addColorStop(0, isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.25)');
            greenGradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
            overviewChartInstance.data.datasets[1].backgroundColor = greenGradient;
        }

        overviewChartInstance.update();
    }

    // Update Status Chart
    if (statusChartInstance) {
        statusChartInstance.data.datasets[0].borderColor = bgSecondary;
        statusChartInstance.options.plugins.tooltip.backgroundColor = isDark ? '#111827' : '#ffffff';
        statusChartInstance.options.plugins.tooltip.titleColor = isDark ? '#f8fafc' : '#1e293b';
        statusChartInstance.options.plugins.tooltip.bodyColor = isDark ? '#94a3b8' : '#64748b';
        statusChartInstance.options.plugins.tooltip.borderColor = isDark ? '#374151' : '#e2e8f0';
        statusChartInstance.update();
    }
}
