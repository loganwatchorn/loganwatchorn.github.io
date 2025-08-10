const simulations = ['sim.js'];
// const randomSim = simulations[Math.floor(Math.random() * simulations.length)];
const randomSim = simulations[1];

// Dynamically load the selected simulation
const script = document.createElement('script');
script.src = randomSim;
script.onload = function() {
    console.log(`Loaded simulation: ${randomSim}`);
};
script.onerror = function() {
    console.error(`Failed to load simulation: ${randomSim}`);
    // Fallback to solar system if black hole fails to load
    if (randomSim !== 'sim.js') {
        const fallbackScript = document.createElement('script');
        fallbackScript.src = 'sim.js';
        document.head.appendChild(fallbackScript);
    }
};
document.head.appendChild(script);