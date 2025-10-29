interface MetricData {
  category: string;
  score: number;
  icon: string;
}

async function fetchData(): Promise<MetricData[]> {
  try {
    const response = await fetch('./data.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: MetricData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

function populate(metrics: MetricData[]) {
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
    })
}

function calculateAverage(metrics: MetricData[]) {
    const total = metrics.reduce((acc, metric) => acc + metric.score, 0);
    return Math.floor(total / metrics.length);
}

function displayAverage(average: number) {
    const averageElement = document.querySelector('.score-js');
    const totalElement = document.querySelector('.score-total-js');
    const verdictElement = document.querySelector('.verdict-js') as HTMLElement;
    if (averageElement && totalElement && verdictElement) {
        averageElement.textContent = average.toString();
        totalElement.textContent = 'of 100';
        verdictElement.classList.add('result-verdict--visible');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    fetchData()
    .then(async (data) => {
        populate(data);
        displayAverage(calculateAverage(data));
    })
    .catch((error) => {
        console.error('Failed to load data:', error);
    });
})