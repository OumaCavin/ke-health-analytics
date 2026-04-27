/**
 * KE Health Analytics - Dashboard Application
 * Author: Cavin Otieno
 * Interactive charts and data visualization
 */

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initializeDashboard();
});

// Dashboard state
const dashboardState = {
    data: null,
    charts: {},
    selectedRegion: 'all',
    timeRange: 30
};

// Sample data for demonstration
const sampleData = {
    regions: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'],
    diseases: ['Malaria', 'Typhoid', 'Cholera', 'Respiratory', 'Other'],
    monthlyCases: [1250, 1480, 1320, 1590, 1420, 1680, 1750, 1620, 1490, 1380, 1520, 1690],
    diseaseDistribution: {
        'Nairobi': { Malaria: 320, Typhoid: 280, Cholera: 120, Respiratory: 240, Other: 140 },
        'Mombasa': { Malaria: 480, Typhoid: 320, Cholera: 280, Respiratory: 180, Other: 160 },
        'Kisumu': { Malaria: 520, Typhoid: 240, Cholera: 180, Respiratory: 140, Other: 120 },
        'Nakuru': { Malaria: 280, Typhoid: 220, Cholera: 100, Respiratory: 180, Other: 100 },
        'Eldoret': { Malaria: 240, Typhoid: 180, Cholera: 80, Respiratory: 160, Other: 80 }
    },
    weatherCorrelation: {
        temperature: [25, 26, 27, 28, 29, 30, 31, 32, 31, 30, 28, 27],
        humidity: [75, 72, 70, 68, 65, 62, 60, 58, 62, 68, 72, 74],
        cases: [320, 340, 360, 380, 400, 420, 440, 420, 400, 380, 360, 340]
    }
};

// Chart color palette
const chartColors = {
    primary: '#0f766e',
    primaryLight: '#14b8a6',
    secondary: '#6366f1',
    secondaryLight: '#818cf8',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    gray: '#6b7280',
    colors: [
        '#0f766e', '#6366f1', '#f59e0b', '#ef4444', '#10b981',
        '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#84cc16'
    ]
};

// Initialize dashboard
function initializeDashboard() {
    // Load sample data
    dashboardState.data = sampleData;

    // Initialize all charts
    initializeCharts();

    // Update statistics
    updateStatistics();

    // Load regions
    loadRegions();

    // Setup event listeners
    setupEventListeners();

    // Animate statistics on load
    animateStatistics();

    // Initialize tooltips
    initializeTooltips();
}

// Initialize all charts
function initializeCharts() {
    // Cases Trend Chart
    initCasesTrendChart();

    // Visits Chart
    initVisitsChart();

    // Critical Cases Chart
    initCriticalChart();

    // Temperature Chart
    initTempChart();

    // Disease Distribution Chart
    initDiseaseDistributionChart();

    // Disease Trends Chart
    initDiseaseTrendsChart();

    // Region Chart
    initRegionChart();

    // Disease Breakdown Chart
    initDiseaseBreakdownChart();

    // Weather Correlation Chart
    initWeatherCorrelationChart();

    // Risk Assessment Chart
    initRiskAssessmentChart();
}

// Cases Trend Chart
function initCasesTrendChart() {
    const ctx = document.getElementById('casesTrendChart');
    if (!ctx) return;

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 60);
    gradient.addColorStop(0, 'rgba(15, 118, 110, 0.3)');
    gradient.addColorStop(1, 'rgba(15, 118, 110, 0)');

    dashboardState.charts.casesTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                data: [65, 72, 68, 78, 82, 88, 92],
                borderColor: chartColors.primary,
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            }
        }
    });
}

// Visits Chart
function initVisitsChart() {
    const ctx = document.getElementById('visitsChart');
    if (!ctx) return;

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 60);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

    dashboardState.charts.visits = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                data: [45, 52, 48, 55, 58, 42, 38],
                borderColor: chartColors.secondary,
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            }
        }
    });
}

// Critical Cases Chart
function initCriticalChart() {
    const ctx = document.getElementById('criticalChart');
    if (!ctx) return;

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 60);
    gradient.addColorStop(0, 'rgba(220, 38, 38, 0.3)');
    gradient.addColorStop(1, 'rgba(220, 38, 38, 0)');

    dashboardState.charts.critical = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                data: [28, 32, 25, 22],
                borderColor: chartColors.danger,
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            }
        }
    });
}

// Temperature Chart
function initTempChart() {
    const ctx = document.getElementById('tempChart');
    if (!ctx) return;

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 60);
    gradient.addColorStop(0, 'rgba(234, 88, 12, 0.3)');
    gradient.addColorStop(1, 'rgba(234, 88, 12, 0)');

    dashboardState.charts.temp = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
            datasets: [{
                data: [22, 26, 31, 33, 30, 26],
                borderColor: chartColors.warning,
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            }
        }
    });
}

// Disease Distribution Chart
function initDiseaseDistributionChart() {
    const ctx = document.getElementById('diseaseDistributionChart');
    if (!ctx) return;

    const data = dashboardState.data;
    const datasets = data.regions.map((region, index) => ({
        label: region,
        data: Object.values(data.diseaseDistribution[region]),
        backgroundColor: chartColors.colors[index % chartColors.colors.length],
        borderRadius: 4
    }));

    dashboardState.charts.diseaseDistribution = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.diseases,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' }
                }
            }
        }
    });
}

// Disease Trends Chart
function initDiseaseTrendsChart() {
    const ctx = document.getElementById('diseaseTrendsChart');
    if (!ctx) return;

    dashboardState.charts.diseaseTrends = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Malaria',
                    data: [420, 450, 480, 520, 540, 580, 600, 580, 540, 500, 460, 440],
                    borderColor: chartColors.colors[0],
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Typhoid',
                    data: [280, 300, 320, 340, 360, 380, 400, 380, 360, 320, 300, 280],
                    borderColor: chartColors.colors[1],
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Cholera',
                    data: [120, 140, 160, 180, 200, 220, 240, 220, 200, 180, 160, 140],
                    borderColor: chartColors.colors[2],
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Respiratory',
                    data: [180, 200, 220, 240, 260, 280, 300, 280, 260, 240, 220, 200],
                    borderColor: chartColors.colors[3],
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });
}

// Region Chart
function initRegionChart() {
    const ctx = document.getElementById('regionChart');
    if (!ctx) return;

    const data = dashboardState.data;
    const totals = data.regions.map(region =>
        Object.values(data.diseaseDistribution[region]).reduce((a, b) => a + b, 0)
    );

    dashboardState.charts.region = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.regions,
            datasets: [{
                data: totals,
                backgroundColor: chartColors.colors.slice(0, 5),
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}

// Disease Breakdown Chart
function initDiseaseBreakdownChart() {
    const ctx = document.getElementById('diseaseBreakdownChart');
    if (!ctx) return;

    const data = dashboardState.data;
    const totals = data.diseases.map(disease =>
        data.regions.reduce((sum, region) => sum + (data.diseaseDistribution[region][disease] || 0), 0)
    );

    dashboardState.charts.diseaseBreakdown = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.diseases,
            datasets: [{
                data: totals,
                backgroundColor: chartColors.colors.slice(0, 5),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}

// Weather Correlation Chart
function initWeatherCorrelationChart() {
    const ctx = document.getElementById('weatherCorrelationChart');
    if (!ctx) return;

    const data = dashboardState.data.weatherCorrelation;

    dashboardState.charts.weatherCorrelation = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: data.temperature,
                    borderColor: chartColors.warning,
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y'
                },
                {
                    label: 'Humidity (%)',
                    data: data.humidity,
                    borderColor: chartColors.primary,
                    backgroundColor: 'rgba(15, 118, 110, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y1'
                },
                {
                    label: 'Cases',
                    data: data.cases,
                    borderColor: chartColors.danger,
                    tension: 0.4,
                    borderWidth: 3,
                    yAxisID: 'y2'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Humidity (%)'
                    },
                    grid: { drawOnChartArea: false }
                },
                y2: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Cases'
                    },
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
}

// Risk Assessment Chart
function initRiskAssessmentChart() {
    const ctx = document.getElementById('riskAssessmentChart');
    if (!ctx) return;

    dashboardState.charts.riskAssessment = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Age 0-5', 'Age 6-18', 'Age 19-35', 'Age 36-50', 'Age 51-65', 'Age 65+'],
            datasets: [
                {
                    label: 'Low Risk',
                    data: [15, 25, 35, 30, 20, 10],
                    backgroundColor: chartColors.success,
                    borderRadius: 4
                },
                {
                    label: 'Medium Risk',
                    data: [25, 35, 40, 35, 30, 25],
                    backgroundColor: chartColors.warning,
                    borderRadius: 4
                },
                {
                    label: 'High Risk',
                    data: [60, 40, 25, 35, 50, 65],
                    backgroundColor: chartColors.danger,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentage (%)'
                    },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                }
            }
        }
    });
}

// Update statistics
function updateStatistics() {
    const data = dashboardState.data;
    const totalCases = data.monthlyCases.reduce((a, b) => a + b, 0);
    const activeOutbreaks = 3;
    const predictionAccuracy = 92;
    const regionsCount = data.regions.length;

    document.getElementById('totalPatients').textContent = '12,450';
    document.getElementById('activeOutbreaks').textContent = activeOutbreaks;
    document.getElementById('predictionAccuracy').textContent = predictionAccuracy + '%';
    document.getElementById('regionsCovered').textContent = regionsCount;

    document.getElementById('monthlyCases').textContent = '1,690';
    document.getElementById('patientVisits').textContent = '8,240';
    document.getElementById('criticalCases').textContent = '156';
    document.getElementById('avgTemperature').textContent = '28°C';
}

// Animate statistics
function animateStatistics() {
    const statElements = document.querySelectorAll('.stat-value, .kpi-value');

    statElements.forEach((el, index) => {
        const finalValue = el.textContent;
        const isNumber = /^\d/.test(finalValue);

        if (isNumber) {
            const numericValue = parseInt(finalValue.replace(/,/g, ''));
            const isPercentage = finalValue.includes('%');
            const hasDegree = finalValue.includes('°');

            let current = 0;
            const increment = numericValue / 50;
            const duration = 1500;
            const stepTime = duration / 50;

            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(timer);
                }

                let displayValue = Math.round(current).toLocaleString();
                if (isPercentage) displayValue += '%';
                if (hasDegree) displayValue += '°';
                el.textContent = displayValue;
            }, stepTime);
        }
    });
}

// Load regions
function loadRegions() {
    const container = document.getElementById('regionsContainer');
    if (!container) return;

    const data = dashboardState.data;
    const riskLevels = ['high', 'medium', 'low'];

    let html = '';
    data.regions.forEach((region, index) => {
        const totals = Object.values(data.diseaseDistribution[region]).reduce((a, b) => a + b, 0);
        const avgCases = Math.round(totals / 12);
        const trend = Math.random() > 0.5 ? '+' : '-';
        const trendValue = Math.round(Math.random() * 15);
        const risk = riskLevels[index % 3];

        html += `
            <div class="region-card">
                <div class="region-header">
                    <span class="region-name">${region}</span>
                    <span class="region-status ${risk}">
                        <span class="status-dot"></span>
                        ${risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
                    </span>
                </div>
                <div class="region-stats">
                    <div class="region-stat">
                        <span class="region-stat-value">${totals.toLocaleString()}</span>
                        <span class="region-stat-label">Total Cases</span>
                    </div>
                    <div class="region-stat">
                        <span class="region-stat-value">${avgCases}</span>
                        <span class="region-stat-label">Avg/Month</span>
                    </div>
                    <div class="region-stat">
                        <span class="region-stat-value" style="color: ${trend === '+' ? 'var(--danger)' : 'var(--success)'}">${trend}${trendValue}%</span>
                        <span class="region-stat-label">Trend</span>
                    </div>
                </div>
                <div class="region-chart">
                    <canvas id="regionChart${index}"></canvas>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Initialize mini charts for each region
    data.regions.forEach((region, index) => {
        const ctx = document.getElementById(`regionChart${index}`);
        if (!ctx) return;

        const regionData = Object.values(data.diseaseDistribution[region]);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    data: regionData.slice(0, 6),
                    borderColor: chartColors.colors[index % chartColors.colors.length],
                    tension: 0.4,
                    fill: true,
                    backgroundColor: chartColors.colors[index % chartColors.colors.length] + '20',
                    pointRadius: 2,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: { x: { display: false }, y: { display: false } }
            }
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Alert close button
    const closeAlert = document.getElementById('closeAlert');
    if (closeAlert) {
        closeAlert.addEventListener('click', () => {
            document.getElementById('alertBanner').style.display = 'none';
        });
    }

    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshBtn.innerHTML = '<span class="loading-spinner"></span> Refreshing...';
            setTimeout(() => {
                refreshBtn.innerHTML = '<i data-lucide="refresh-cw"></i> Refresh Data';
                lucide.createIcons();
            }, 1500);
        });
    }

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportDashboardData();
        });
    }

    // Time range selector
    const timeRange = document.getElementById('timeRange');
    if (timeRange) {
        timeRange.addEventListener('change', (e) => {
            dashboardState.timeRange = parseInt(e.target.value);
            updateChartsWithTimeRange();
        });
    }

    // Chart tabs
    const chartTabs = document.querySelectorAll('.chart-tab');
    chartTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            chartTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            updateChartPeriod(e.target.dataset.period);
        });
    });

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
}

// Export dashboard data
function exportDashboardData() {
    const dataStr = JSON.stringify(dashboardState.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ke-health-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Update charts with time range
function updateChartsWithTimeRange() {
    // Update chart data based on selected time range
    console.log('Updating charts for time range:', dashboardState.timeRange);
}

// Update chart period
function updateChartPeriod(period) {
    console.log('Updating chart period:', period);
}

// Initialize tooltips
function initializeTooltips() {
    // Add custom tooltip styles
    const style = document.createElement('style');
    style.textContent = `
        .custom-tooltip {
            position: absolute;
            background: var(--gray-900);
            color: white;
            padding: 0.5rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            pointer-events: none;
            z-index: 1000;
            white-space: nowrap;
        }
    `;
    document.head.appendChild(style);
}

// Export dashboard state for debugging
window.dashboardState = dashboardState;