document.getElementById('prediction-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const numberOfPlants = parseInt(document.getElementById('number-of-plants').value);
    const weatherCondition = document.getElementById('weather-condition').value;
    const soilHealth = parseInt(document.getElementById('soil-health').value);
    const cropManagement = document.getElementById('crop-management').value;

    // Debugging values using console.log
    console.log(`Number of Plants: ${numberOfPlants}`);
    console.log(`Weather Condition: ${weatherCondition}`);
    console.log(`Soil Health: ${soilHealth}`);
    console.log(`Crop Management: ${cropManagement}`);
    
    const botResponse = generateResponse(numberOfPlants, weatherCondition, soilHealth, cropManagement);
    
    displayMessage('user', `Plants: ${numberOfPlants}, Weather: ${weatherCondition}, Soil: ${soilHealth}, Management: ${cropManagement}`);
    setTimeout(() => {
        displayMessage('bot', botResponse.message);
        updateChart(botResponse.chartData);
    }, 500); // Simulating delay for bot response
});

function displayMessage(sender, message) {
    const chatLog = document.getElementById('chat-log') || document.createElement('div');
    chatLog.id = 'chat-log';
    const messageElement = document.createElement('div');
    messageElement.className = `chat-entry ${sender}-message`;
    messageElement.innerText = message;
    chatLog.appendChild(messageElement);
    document.body.appendChild(chatLog);
    chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll to the bottom
}

function generateResponse(numberOfPlants, weatherCondition, soilHealth, cropManagement) {
    const dataset = {
        "normal": { "standard": 0.1, "optimized": 0.12, "advanced": 0.15 },
        "rainy": { "standard": 0.11, "optimized": 0.14, "advanced": 0.17 },
        "dry": { "standard": 0.09, "optimized": 0.11, "advanced": 0.13 },
        "extreme": { "standard": 0.07, "optimized": 0.09, "advanced": 0.11 }
    };

    if (!dataset[weatherCondition]) {
        console.error("Invalid weather condition");
        return { message: "Error: Invalid weather condition", chartData: {} };
    }

    const baseYieldPerPlant = dataset[weatherCondition][cropManagement] * (soilHealth / 10);
    const predictedYield = (numberOfPlants * baseYieldPerPlant).toFixed(2);

    const chartData = {
        labels: ['Predicted Yield'],
        datasets: [{
            label: 'Yield (tons/hectare)',
            data: [predictedYield],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const suggestions = generateSuggestions(predictedYield);

    return { message: `Predicted yield is ${predictedYield} tons/hectare. ${suggestions}`, chartData };
}

function generateSuggestions(predictedYield) {
    if (predictedYield > 1) {
        return "Great yield! Continue using advanced practices and optimize resources.";
    } else if (predictedYield > 0.5) {
        return "Decent yield. Explore additional soil treatments and crop protection measures.";
    } else {
        return "Low yield. Review your practices and consider advanced technologies and more precise data.";
    }
}

function updateChart(chartData) {
    const ctx = document.getElementById('yield-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.myChart) {
        window.myChart.destroy();
    }
    
    // Create a new chart
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
