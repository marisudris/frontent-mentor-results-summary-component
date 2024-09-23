"use strict";
async function fetchData() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
function populate(metrics) {
    const metricItems = document.querySelectorAll('.metric-item');
    metricItems.forEach((metricItem, i) => {
        metricItem.innerHTML = `
        <div class="metric-info">
        <img src="${metrics[i].icon}" alt="" aria-hidden="true" class="metric-icon">
        <span class="metric-name">${metrics[i].category}</span>
        </div>
        <p class="metric-score">
        <span class="score-achieved">${metrics[i].score}</span>
        <span class="score-separator" aria-hidden="true"> / </span>
        <span class="score-max">100</span>
        </p>`;
    });
}
function calculateAverage(metrics) {
    const total = metrics.reduce((acc, metric) => acc + metric.score, 0);
    return Math.floor(total / metrics.length);
}
function displayAverage(average) {
    const averageElement = document.querySelector('.score-js');
    const totalElement = document.querySelector('.score-total-js');
    const verdictElement = document.querySelector('.verdict-js');
    if (averageElement && totalElement && verdictElement) {
        averageElement.textContent = average.toString();
        totalElement.textContent = 'of 100';
        verdictElement.style.opacity = '1';
    }
}
window.addEventListener('DOMContentLoaded', () => {
    fetchData()
        .then(async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        populate(data);
        displayAverage(calculateAverage(data));
    })
        .catch((error) => {
        console.error('Failed to load data:', error);
    });
});
