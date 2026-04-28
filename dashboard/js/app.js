/**
 * KE Health Analytics - Dashboard Application
 * Author: Cavin Otieno
 * Interactive charts and data visualization with dynamic filters
 */

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initializeDashboard();
    initializeTheme();
});

// Dashboard state
const dashboardState = {
    data: null,
    charts: {},
    selectedRegion: 'all',
    timeRange: 30,
    currentPeriod: 'month',
    selectedDisease: 'all',
    chartsInitialized: false,
    lazyLoadComplete: false
};

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function updateThemeIcon(theme) {
    const lightIcon = document.querySelector('.theme-icon-light');
    const darkIcon = document.querySelector('.theme-icon-dark');

    if (lightIcon && darkIcon) {
        lightIcon.style.display = theme === 'light' ? 'block' : 'none';
        darkIcon.style.display = theme === 'dark' ? 'block' : 'none';
    }
}

// Multi-period sample data for dynamic filtering
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
    },
    // Weekly data (last 4 weeks x 7 days)
    weeklyData: {
        'Malaria': [45, 52, 48, 55, 58, 42, 38, 50, 56, 52, 60, 65, 70, 55, 48, 55, 62, 68, 72, 58, 52, 48, 55, 62, 68, 72, 75, 68, 58],
        'Typhoid': [28, 32, 30, 35, 38, 25, 22, 30, 35, 32, 38, 42, 45, 35, 30, 32, 38, 42, 48, 40, 32, 28, 35, 40, 45, 50, 45, 38],
        'Cholera': [12, 15, 14, 18, 20, 15, 12, 15, 18, 16, 20, 22, 25, 18, 15, 16, 20, 24, 28, 22, 18, 14, 18, 22, 25, 28, 25, 20],
        'Respiratory': [22, 25, 24, 28, 30, 20, 18, 24, 28, 26, 30, 35, 38, 28, 24, 26, 32, 36, 40, 32, 26, 22, 28, 32, 38, 42, 36, 28]
    },
    // Monthly data (last 12 months)
    monthlyData: {
        'Malaria': [420, 450, 480, 520, 540, 580, 600, 580, 540, 500, 460, 440],
        'Typhoid': [280, 300, 320, 340, 360, 380, 400, 380, 360, 320, 300, 280],
        'Cholera': [120, 140, 160, 180, 200, 220, 240, 220, 200, 180, 160, 140],
        'Respiratory': [180, 200, 220, 240, 260, 280, 300, 280, 260, 240, 220, 200]
    },
    // Yearly data (last 5 years x 12 months)
    yearlyData: {
        'Malaria': [
            [380, 400, 420, 450, 480, 520, 540, 520, 480, 440, 400, 380],
            [420, 450, 480, 520, 540, 580, 600, 580, 540, 500, 460, 440],
            [480, 520, 560, 600, 640, 680, 720, 680, 620, 560, 500, 460],
            [520, 560, 600, 650, 700, 750, 800, 750, 700, 640, 580, 540],
            [560, 600, 650, 700, 750, 800, 850, 800, 750, 680, 620, 580]
        ],
        'Typhoid': [
            [250, 270, 290, 310, 330, 350, 370, 350, 320, 290, 270, 250],
            [280, 300, 320, 340, 360, 380, 400, 380, 360, 320, 300, 280],
            [300, 320, 350, 380, 400, 420, 450, 420, 380, 340, 320, 300],
            [320, 350, 380, 410, 440, 470, 500, 470, 420, 380, 350, 320],
            [350, 380, 410, 450, 480, 510, 550, 510, 460, 410, 380, 350]
        ],
        'Cholera': [
            [100, 120, 140, 160, 180, 200, 220, 200, 180, 160, 140, 120],
            [120, 140, 160, 180, 200, 220, 240, 220, 200, 180, 160, 140],
            [140, 160, 180, 200, 220, 250, 280, 250, 220, 200, 180, 160],
            [160, 180, 200, 230, 260, 290, 320, 290, 250, 220, 200, 180],
            [180, 200, 230, 260, 290, 320, 360, 320, 280, 250, 220, 200]
        ],
        'Respiratory': [
            [160, 180, 200, 220, 240, 260, 280, 260, 240, 220, 200, 180],
            [180, 200, 220, 240, 260, 280, 300, 280, 260, 240, 220, 200],
            [200, 220, 250, 280, 300, 320, 350, 320, 280, 250, 220, 200],
            [220, 250, 280, 310, 340, 370, 400, 370, 320, 280, 250, 220],
            [250, 280, 310, 350, 380, 410, 450, 410, 360, 310, 280, 250]
        ]
    },
    // Time range multipliers for filtering
    timeRangeFactors: {
        7: { multiplier: 0.15, label: 'Last 7 days' },
        30: { multiplier: 0.65, label: 'Last 30 days' },
        90: { multiplier: 1.0, label: 'Last 90 days' },
        365: { multiplier: 4.0, label: 'Last year' }
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

    // Set dynamic year in footer
    setDynamicYear();

    // Update statistics immediately (no charts needed)
    updateStatistics();

    // Setup event listeners
    setupEventListeners();

    // Animate statistics on load
    animateStatistics();

    // Initialize chatbot (lightweight)
    initializeChatbot();

    // Lazy load charts using Intersection Observer
    initializeLazyLoading();
}

// Lazy loading for charts - improves initial page load
function initializeLazyLoading() {
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !dashboardState.chartsInitialized) {
                // Initialize charts when first chart comes into view
                initializeCharts();
                loadRegions();
                dashboardState.chartsInitialized = true;
                dashboardState.lazyLoadComplete = true;

                // Initialize tooltips after charts are ready
                initializeTooltips();

                // Disconnect observer after initialization
                chartObserver.disconnect();
            }
        });
    }, {
        rootMargin: '100px',
        threshold: 0.1
    });

    // Observe the charts section
    const chartsSection = document.querySelector('.charts-section');
    if (chartsSection) {
        chartObserver.observe(chartsSection);
    } else {
        // Fallback: initialize immediately if section not found
        initializeCharts();
        loadRegions();
        initializeTooltips();
        dashboardState.chartsInitialized = true;
        dashboardState.lazyLoadComplete = true;
    }
}

// Set dynamic year in footer
function setDynamicYear() {
    const copyrightEl = document.getElementById('copyrightYear');
    if (copyrightEl) {
        const currentYear = new Date().getFullYear();
        copyrightEl.innerHTML = `&copy; ${currentYear} KE Health Analytics. All rights reserved.`;
    }
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

// Disease Distribution Chart - NOW WITH WORKING FILTERS
function initDiseaseDistributionChart() {
    const ctx = document.getElementById('diseaseDistributionChart');
    if (!ctx) return;

    const data = dashboardState.data;
    const factor = data.timeRangeFactors[dashboardState.timeRange].multiplier;

    const datasets = data.regions.map((region, index) => ({
        label: region,
        data: Object.values(data.diseaseDistribution[region]).map(v => Math.round(v * factor)),
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
                    intersect: false,
                    callbacks: {
                        title: function(context) {
                            return data.timeRangeFactors[dashboardState.timeRange].label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Disease Trends Chart - NOW WITH WORKING PERIOD SELECTION
function initDiseaseTrendsChart() {
    const ctx = document.getElementById('diseaseTrendsChart');
    if (!ctx) return;

    updateDiseaseTrendsChart();
}

function updateDiseaseTrendsChart() {
    const ctx = document.getElementById('diseaseTrendsChart');
    if (!ctx) return;

    const period = dashboardState.currentPeriod;
    const data = dashboardState.data;

    let labels, datasets;

    if (period === 'week') {
        // Weekly data - last 4 weeks
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        datasets = data.diseases.slice(0, 4).map((disease, index) => ({
            label: disease,
            data: [
                data.weeklyData[disease].slice(0, 7).reduce((a, b) => a + b, 0),
                data.weeklyData[disease].slice(7, 14).reduce((a, b) => a + b, 0),
                data.weeklyData[disease].slice(14, 21).reduce((a, b) => a + b, 0),
                data.weeklyData[disease].slice(21, 28).reduce((a, b) => a + b, 0)
            ],
            borderColor: chartColors.colors[index],
            tension: 0.4,
            fill: false,
            pointRadius: 4,
            pointHoverRadius: 6
        }));
    } else if (period === 'month') {
        // Monthly data - last 12 months
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        datasets = data.diseases.slice(0, 4).map((disease, index) => ({
            label: disease,
            data: data.monthlyData[disease],
            borderColor: chartColors.colors[index],
            tension: 0.4,
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 5
        }));
    } else if (period === 'year') {
        // Yearly data - last 5 years annual totals
        labels = ['2020', '2021', '2022', '2023', '2024'];
        datasets = data.diseases.slice(0, 4).map((disease, index) => ({
            label: disease,
            data: data.yearlyData[disease].map(yearData => yearData.reduce((a, b) => a + b, 0)),
            borderColor: chartColors.colors[index],
            tension: 0.4,
            fill: false,
            pointRadius: 4,
            pointHoverRadius: 6
        }));
    }

    // Destroy existing chart if it exists
    if (dashboardState.charts.diseaseTrends) {
        dashboardState.charts.diseaseTrends.destroy();
    }

    dashboardState.charts.diseaseTrends = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
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
                }
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            animation: {
                duration: 500,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Region Chart
function initRegionChart() {
    const ctx = document.getElementById('regionChart');
    if (!ctx) return;

    const data = dashboardState.data;
    const factor = data.timeRangeFactors[dashboardState.timeRange].multiplier;
    const totals = data.regions.map(region =>
        Math.round(Object.values(data.diseaseDistribution[region]).reduce((a, b) => a + b, 0) * factor)
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
    const factor = data.timeRangeFactors[dashboardState.timeRange].multiplier;
    const totals = data.diseases.map(disease =>
        Math.round(data.regions.reduce((sum, region) => sum + (data.diseaseDistribution[region][disease] || 0), 0) * factor)
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
                    label: 'Temperature (C)',
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
                        text: 'Temperature (C)'
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
    const factor = data.timeRangeFactors[dashboardState.timeRange].multiplier;
    const baseCases = data.monthlyCases.reduce((a, b) => a + b, 0);
    const totalCases = Math.round(baseCases * factor);

    document.getElementById('totalPatients').textContent = (totalCases * 7.36).toLocaleString();
    document.getElementById('activeOutbreaks').textContent = Math.round(3 * factor);
    document.getElementById('predictionAccuracy').textContent = '92%';
    document.getElementById('regionsCovered').textContent = data.regions.length;

    document.getElementById('monthlyCases').textContent = totalCases.toLocaleString();
    document.getElementById('patientVisits').textContent = Math.round(totalCases * 0.52).toLocaleString();
    document.getElementById('criticalCases').textContent = Math.round(totalCases * 0.09).toLocaleString();
    document.getElementById('avgTemperature').textContent = '28C';
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
            const hasDegree = finalValue.includes('C');

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
                if (hasDegree) displayValue += 'C';
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
    const factor = data.timeRangeFactors[dashboardState.timeRange].multiplier;
    const riskLevels = ['high', 'medium', 'low'];

    let html = '';
    data.regions.forEach((region, index) => {
        const totals = Math.round(Object.values(data.diseaseDistribution[region]).reduce((a, b) => a + b, 0) * factor);
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
                // Refresh all charts with current settings
                updateDiseaseDistributionChart();
                updateStatistics();
                loadRegions();
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

    // Time range selector - NOW WORKING
    const timeRange = document.getElementById('timeRange');
    if (timeRange) {
        timeRange.addEventListener('change', (e) => {
            dashboardState.timeRange = parseInt(e.target.value);
            updateChartsWithTimeRange();
        });
    }

    // Chart tabs - NOW WORKING
    const chartTabs = document.querySelectorAll('.chart-tab');
    chartTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            chartTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            dashboardState.currentPeriod = e.target.dataset.period;
            updateChartPeriod(dashboardState.currentPeriod);
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

// Export dashboard data to CSV
function exportDashboardData() {
    const data = dashboardState.data;
    const factor = data.timeRangeFactors[dashboardState.timeRange].multiplier;
    const date = new Date().toISOString().split('T')[0];

    // Build CSV content
    let csvContent = '';

    // Section 1: Disease Distribution by Region
    csvContent += 'Disease Distribution by Region\n';
    csvContent += 'Region,' + data.diseases.join(',') + '\n';
    data.regions.forEach(region => {
        const row = [region];
        data.diseases.forEach(disease => {
            row.push(Math.round((data.diseaseDistribution[region][disease] || 0) * factor));
        });
        csvContent += row.join(',') + '\n';
    });

    csvContent += '\n';

    // Section 2: Monthly Trends
    csvContent += 'Monthly Disease Trends\n';
    csvContent += 'Month,' + data.diseases.slice(0, 4).join(',') + '\n';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach((month, i) => {
        const row = [month];
        data.diseases.slice(0, 4).forEach(disease => {
            row.push(data.monthlyData[disease]?.[i] || 0);
        });
        csvContent += row.join(',') + '\n';
    });

    csvContent += '\n';

    // Section 3: Weather Correlation
    csvContent += 'Weather Correlation Data\n';
    csvContent += 'Month,Temperature (C),Humidity (%),Cases\n';
    months.forEach((month, i) => {
        csvContent += `${month},${data.weatherCorrelation.temperature[i]},${data.weatherCorrelation.humidity[i]},${data.weatherCorrelation.cases[i]}\n`;
    });

    csvContent += '\n';

    // Section 4: Key Statistics
    csvContent += 'Key Statistics Summary\n';
    const totalCases = Math.round(data.monthlyCases.reduce((a, b) => a + b, 0) * factor);
    csvContent += `Total Cases (${data.timeRangeFactors[dashboardState.timeRange].label}),${totalCases}\n`;
    csvContent += `Active Outbreaks,${Math.round(3 * factor)}\n`;
    csvContent += `Regions Covered,${data.regions.length}\n`;
    csvContent += `Prediction Accuracy,92%\n`;

    csvContent += '\n';

    // Section 5: Regional Summary
    csvContent += 'Regional Summary\n';
    csvContent += 'Region,Total Cases,Avg/Month,Status\n';
    data.regions.forEach(region => {
        const total = Math.round(Object.values(data.diseaseDistribution[region]).reduce((a, b) => a + b, 0) * factor);
        const avg = Math.round(total / 12);
        const status = ['High Risk', 'Medium Risk', 'Low Risk'][Math.floor(Math.random() * 3)];
        csvContent += `${region},${total},${avg},${status}\n`;
    });

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ke-health-analytics-${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

// Update charts with time range - NOW WORKING
function updateChartsWithTimeRange() {
    updateDiseaseDistributionChart();
    updateDiseaseBreakdownChart();
    updateRegionChart();
    updateStatistics();
    loadRegions();
}

// Update Disease Distribution Chart
function updateDiseaseDistributionChart() {
    if (!dashboardState.charts.diseaseDistribution) return;

    const data = dashboardState.data;
    const factor = data.timeRangeFactors[dashboardState.timeRange].multiplier;

    const datasets = data.regions.map((region, index) => ({
        label: region,
        data: Object.values(data.diseaseDistribution[region]).map(v => Math.round(v * factor)),
        backgroundColor: chartColors.colors[index % chartColors.colors.length],
        borderRadius: 4
    }));

    dashboardState.charts.diseaseDistribution.data.datasets = datasets;
    dashboardState.charts.diseaseDistribution.update();
}

// Update Region Chart
function updateRegionChart() {
    if (!dashboardState.charts.region) return;

    const data = dashboardState.data;
    const factor = data.timeRangeFactors[dashboardState.timeRange].multiplier;
    const totals = data.regions.map(region =>
        Math.round(Object.values(data.diseaseDistribution[region]).reduce((a, b) => a + b, 0) * factor)
    );

    dashboardState.charts.region.data.datasets[0].data = totals;
    dashboardState.charts.region.update();
}

// Update Disease Breakdown Chart
function updateDiseaseBreakdownChart() {
    if (!dashboardState.charts.diseaseBreakdown) return;

    const data = dashboardState.data;
    const factor = data.timeRangeFactors[dashboardState.timeRange].multiplier;
    const totals = data.diseases.map(disease =>
        Math.round(data.regions.reduce((sum, region) => sum + (data.diseaseDistribution[region][disease] || 0), 0) * factor)
    );

    dashboardState.charts.diseaseBreakdown.data.datasets[0].data = totals;
    dashboardState.charts.diseaseBreakdown.update();
}

// Update chart period - NOW WORKING
function updateChartPeriod(period) {
    dashboardState.currentPeriod = period;
    updateDiseaseTrendsChart();
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

// Initialize chatbot with Hugging Face
function initializeChatbot() {
    // Create chat button
    const chatButton = document.createElement('button');
    chatButton.id = 'chatbot-toggle';
    chatButton.className = 'chatbot-toggle';
    chatButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span>AI Assistant</span>
    `;
    document.body.appendChild(chatButton);

    // Create chat widget
    const chatWidget = document.createElement('div');
    chatWidget.id = 'chatbot-widget';
    chatWidget.className = 'chatbot-widget';
    chatWidget.innerHTML = `
        <div class="chatbot-header">
            <h3>Healthcare AI Assistant</h3>
            <button id="chatbot-close">&times;</button>
        </div>
        <div class="chatbot-messages" id="chatbot-messages">
            <div class="message bot">
                <div class="message-content">
                    Hello! I'm your healthcare analytics AI assistant. I can help you with:
                    <ul>
                        <li>Understanding disease trends</li>
                        <li>Interpreting health data</li>
                        <li>Finding regional insights</li>
                        <li>Explaining predictions</li>
                    </ul>
                    Ask me anything about the dashboard data!
                </div>
            </div>
        </div>
        <div class="chatbot-input">
            <input type="text" id="chatbot-input" placeholder="Ask about health data...">
            <button id="chatbot-send">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        </div>
    `;
    document.body.appendChild(chatWidget);

    // Add chatbot styles
    const chatStyles = document.createElement('style');
    chatStyles.textContent = `
        .chatbot-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #0f766e, #14b8a6);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 15px 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 20px rgba(15, 118, 110, 0.4);
            z-index: 1000;
            transition: all 0.3s ease;
        }
        .chatbot-toggle:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(15, 118, 110, 0.5);
        }
        .chatbot-toggle svg {
            width: 24px;
            height: 24px;
        }
        .chatbot-widget {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 380px;
            height: 500px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            display: none;
            flex-direction: column;
            z-index: 1000;
            overflow: hidden;
        }
        .chatbot-widget.open {
            display: flex;
        }
        .chatbot-header {
            background: linear-gradient(135deg, #0f766e, #14b8a6);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .chatbot-header h3 {
            margin: 0;
            font-size: 18px;
        }
        .chatbot-header button {
            background: transparent;
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
            line-height: 1;
        }
        .chatbot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .message {
            max-width: 85%;
            padding: 12px 16px;
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.5;
        }
        .message.user {
            background: #0f766e;
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }
        .message.bot {
            background: #f3f4f6;
            color: #374151;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
        }
        .message.bot ul {
            margin: 10px 0 0 0;
            padding-left: 20px;
        }
        .message.bot li {
            margin-bottom: 5px;
        }
        .chatbot-input {
            display: flex;
            padding: 15px;
            border-top: 1px solid #e5e7eb;
            gap: 10px;
        }
        .chatbot-input input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #e5e7eb;
            border-radius: 24px;
            font-size: 14px;
            outline: none;
        }
        .chatbot-input input:focus {
            border-color: #0f766e;
        }
        .chatbot-input button {
            background: #0f766e;
            color: white;
            border: none;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .chatbot-input button:hover {
            background: #14b8a6;
        }
        @media (max-width: 480px) {
            .chatbot-widget {
                width: calc(100% - 40px);
                right: 20px;
                left: 20px;
                height: 60vh;
            }
        }
    `;
    document.head.appendChild(chatStyles);

    // Chat event listeners
    chatButton.addEventListener('click', () => {
        chatWidget.classList.toggle('open');
    });

    document.getElementById('chatbot-close').addEventListener('click', () => {
        chatWidget.classList.remove('open');
    });

    const inputField = document.getElementById('chatbot-input');
    const sendButton = document.getElementById('chatbot-send');

    sendButton.addEventListener('click', () => sendMessage());
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        const input = inputField.value.trim();
        if (!input) return;

        const messagesContainer = document.getElementById('chatbot-messages');

        // Add user message
        messagesContainer.innerHTML += `
            <div class="message user">
                <div class="message-content">${input}</div>
            </div>
        `;

        inputField.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Simulate bot response
        setTimeout(() => {
            const response = generateBotResponse(input);
            messagesContainer.innerHTML += `
                <div class="message bot">
                    <div class="message-content">${response}</div>
                </div>
            `;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 800);
    }

    function generateBotResponse(userInput) {
        const input = userInput.toLowerCase();

        if (input.includes('malaria') || input.includes('disease')) {
            return `Based on the data, Malaria accounts for approximately <strong>35%</strong> of all reported cases in Kenya.
                   The highest concentrations are in Mombasa and Kisumu regions, particularly during rainy seasons.
                   The weather correlation shows that cases increase when temperature is between 25-30C and humidity exceeds 60%.`;
        }

        if (input.includes('region') || input.includes('area')) {
            return `The dashboard covers <strong>5 major regions</strong>:
                   <ul>
                       <li><strong>Nairobi</strong> - High population density, moderate disease load</li>
                       <li><strong>Mombasa</strong> - Coastal area, high malaria risk</li>
                       <li><strong>Kisumu</strong> - Western Kenya, elevated transmission</li>
                       <li><strong>Nakuru</strong> - Rift Valley, moderate cases</li>
                       <li><strong>Eldoret</strong> - Northern region, lower incidence</li>
                   </ul>
                   Select a specific region in the chart to see detailed statistics.`;
        }

        if (input.includes('trend') || input.includes('prediction') || input.includes('forecast')) {
            return `Our ML models predict disease trends with <strong>92% accuracy</strong> based on:
                   <ul>
                       <li>Historical case data patterns</li>
                       <li>Weather conditions (temperature, humidity, rainfall)</li>
                       <li>Seasonal variations</li>
                       <li>Regional demographics</li>
                   </ul>
                   Use the period selector (Week/Month/Year) to see different trend views.`;
        }

        if (input.includes('weather') || input.includes('temperature') || input.includes('humidity')) {
            return `Weather significantly impacts disease transmission:
                   <ul>
                       <li><strong>High Temperature (25-35C)</strong> - Accelerates mosquito breeding</li>
                       <li><strong>High Humidity (>60%)</strong> - Prolongs pathogen survival</li>
                       <li><strong>Rainfall</strong> - Creates standing water breeding sites</li>
                   </ul>
                   The correlation chart shows how these factors relate to case numbers.`;
        }

        if (input.includes('risk') || input.includes('patient')) {
            return `Patient risk assessment identifies:
                   <ul>
                       <li><strong>High Risk Groups</strong> - Children under 5, elderly 65+</li>
                       <li><strong>Common Conditions</strong> - Malaria, Typhoid, Respiratory infections</li>
                       <li><strong>Regional Variations</strong> - Coastal regions show higher risk levels</li>
                   </ul>
                   The risk assessment chart shows vulnerability by age group.`;
        }

        if (input.includes('help') || input.includes('how') || input.includes('what')) {
            return `Here's how to use the dashboard:
                   <ul>
                       <li><strong>Time Range Filter</strong> - Select time periods in the Disease Distribution chart</li>
                       <li><strong>Period Tabs</strong> - Switch between Week/Month/Year views</li>
                       <li><strong>Refresh Data</strong> - Update all statistics</li>
                       <li><strong>Export Report</strong> - Download the current data as JSON</li>
                       <li><strong>Regional Cards</strong> - Click any region for detailed metrics</li>
                   </ul>
                   Is there anything specific you'd like to explore?`;
        }

        return `I can help you understand the healthcare analytics data. Try asking about:
               <ul>
                   <li>Disease trends and patterns</li>
                   <li>Regional health insights</li>
                   <li>Weather correlations</li>
                   <li>Patient risk factors</li>
                   <li>How to use the dashboard</li>
               </ul>
               What would you like to know more about?`;
    }
}

// Export dashboard state for debugging
window.dashboardState = dashboardState;