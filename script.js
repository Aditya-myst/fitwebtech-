// --- App Initialization & Daily Reset Logic ---

// This variable will hold all our application data
let appData;

// This function runs every time a page loads to set up the application
document.addEventListener('DOMContentLoaded', () => {
    checkAndResetForNewDay(); // Check if it's a new day BEFORE loading data
    
    appData = loadData(); // Load the (potentially reset) data

    // Initialize the specific page based on its content
    const pageId = document.body.id;
    if (document.getElementById('clock')) {
        startClock();
        renderWellness();
        renderWelcomeMessage();
    }
    if (document.getElementById('activityList')) {
        renderActivities();
    }
    if (document.getElementById('breakfastList')) {
        renderMeals();
    }
    if (document.getElementById('weeklyActivities')) {
        renderInsights();
    }
});

/**
 * Checks if the user's last visit was on a different day.
 * If so, it clears the daily tracking data to start fresh.
 */
function checkAndResetForNewDay() {
    const today = new Date().toISOString().split('T')[0]; // Gets date as "YYYY-MM-DD"
    const lastVisitDate = localStorage.getItem('lastVisitDate');

    if (lastVisitDate !== today) {
        console.log("New day detected! Resetting daily stats.");
        // Clear only the daily tracking data, not everything
        localStorage.removeItem('wellnessData');
        localStorage.removeItem('activities');
        localStorage.removeItem('meals');
        
        // Set the new visit date to today
        localStorage.setItem('lastVisitDate', today);
    }
}

/**
 * Loads data from localStorage. If daily data is not present (e.g., first visit or after a daily reset),
 * it returns a fresh, zeroed-out state.
 */
function loadData() {
    const savedWellness = localStorage.getItem('wellnessData');
    const savedActivities = localStorage.getItem('activities');
    const savedMeals = localStorage.getItem('meals');
    
    // Default data represents a fresh, new day
    const defaultWellness = { steps: 0, caloriesBurned: 0, waterIntake: 0, caloriesConsumed: 0 };
    const defaultActivities = [];
    const defaultMeals = { breakfast: [], lunch: [], dinner: [] };

    return {
        wellnessData: savedWellness ? JSON.parse(savedWellness) : defaultWellness,
        activities: savedActivities ? JSON.parse(savedActivities) : defaultActivities,
        meals: savedMeals ? JSON.parse(savedMeals) : defaultMeals,
    };
}

/**
 * Saves the current application state to localStorage and updates the visit date.
 */
function saveData() {
    localStorage.setItem('wellnessData', JSON.stringify(appData.wellnessData));
    localStorage.setItem('activities', JSON.stringify(appData.activities));
    localStorage.setItem('meals', JSON.stringify(appData.meals));
    localStorage.setItem('lastVisitDate', new Date().toISOString().split('T')[0]); // Keep today's date fresh
}

// --- Overview Page ---

function renderWelcomeMessage() {
    const dateEl = document.getElementById("currentDate");
    if (dateEl) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', options);
    }
}

function startClock() {
    const clockEl = document.getElementById("clock");
    if (!clockEl) return;
    setInterval(() => { clockEl.textContent = new Date().toLocaleTimeString('en-US'); }, 1000);
}

function renderWellness() {
    const { wellnessData } = appData;
    const goals = { steps: 10000, caloriesBurned: 800, waterIntake: 3 };
    document.getElementById("stepsCircle").style.setProperty("--percent", (wellnessData.steps / goals.steps) * 100);
    document.getElementById("stepsVal").innerHTML = `${wellnessData.steps.toLocaleString()}<br>Steps`;
    document.getElementById("caloriesCircle").style.setProperty("--percent", (wellnessData.caloriesBurned / goals.caloriesBurned) * 100);
    document.getElementById("caloriesVal").innerHTML = `${wellnessData.caloriesBurned}<br>Burned`;
    document.getElementById("waterCircle").style.setProperty("--percent", (wellnessData.waterIntake / goals.waterIntake) * 100);
    document.getElementById("waterVal").innerHTML = `${wellnessData.waterIntake.toFixed(2)} L<br>Water`;
}

function addWater(liters) {
    appData.wellnessData.waterIntake += liters;
    saveData();
    renderWellness();
}

// --- Activity Page ---

function renderActivities(filter = "All") {
    const list = document.getElementById("activityList");
    list.innerHTML = "";
    const filteredActivities = appData.activities.filter(a => filter === "All" || a.time === filter);
    if (filteredActivities.length === 0) {
        list.innerHTML = `<li class="list-item">No activities logged for today.</li>`;
        return;
    }
    filteredActivities.forEach(a => {
        const originalIndex = appData.activities.findIndex(original => original === a);
        const li = document.createElement("li");
        li.className = "list-item";
        let activityText = `<span>${a.time} - <strong>${a.name}</strong> (${a.duration} min, ${a.calories} cal`;
        if (a.steps > 0) activityText += `, ${a.steps.toLocaleString()} steps`;
        activityText += `)</span>`;
        li.innerHTML = activityText;
        const btn = document.createElement("button");
        btn.textContent = "Delete";
        btn.onclick = () => deleteActivity(originalIndex);
        li.appendChild(btn);
        list.appendChild(li);
    });
}

function addActivity() {
    const name = document.getElementById("activityName").value;
    const duration = Number(document.getElementById("activityDuration").value);
    const calories = Number(document.getElementById("activityCalories").value);
    const steps = Number(document.getElementById("activitySteps").value) || 0;
    const time = document.getElementById("activityTime").value;

    if (!name || duration <= 0 || calories <= 0) {
        showModal("Please enter valid activity data (Name, Duration, Calories).");
        return;
    }
    
    appData.activities.push({ name, duration, calories, time, steps });
    appData.wellnessData.caloriesBurned += calories;
    appData.wellnessData.steps += steps;
    saveData();

    document.getElementById("activityName").value = "";
    document.getElementById("activityDuration").value = "";
    document.getElementById("activityCalories").value = "";
    document.getElementById("activitySteps").value = "";

    renderActivities();
    showModal("Activity Added Successfully!");
}

function deleteActivity(index) {
    const activityToDelete = appData.activities[index];
    appData.wellnessData.caloriesBurned -= activityToDelete.calories;
    appData.wellnessData.steps -= activityToDelete.steps || 0;
    appData.activities.splice(index, 1);
    saveData();
    renderActivities(document.querySelector('#activityFilter').value);
    showModal("Activity deleted.");
}

// --- Meal Planner Page ---

function renderMeals() {
    ["breakfast", "lunch", "dinner"].forEach(mealType => {
        const container = document.getElementById(`${mealType}List`);
        container.innerHTML = "";
        appData.meals[mealType].forEach((item, idx) => {
            const div = document.createElement("div");
            div.className = "list-item";
            div.innerHTML = `<span><strong>${item.name}</strong> (${item.calories} cal)</span>`;
            const btn = document.createElement("button");
            btn.textContent = "Remove";
            btn.onclick = () => {
                appData.wellnessData.caloriesConsumed -= appData.meals[mealType][idx].calories;
                appData.meals[mealType].splice(idx, 1);
                saveData();
                renderMeals();
            };
            div.appendChild(btn);
            container.appendChild(div);
        });
    });
    updateTotalCalories();
}

function updateTotalCalories() {
    // This function now correctly recalculates the total from the array and updates the appData object.
    // It is called after any change to the meals list to ensure data consistency.
    const total = Object.values(appData.meals).flat().reduce((sum, item) => sum + item.calories, 0);
    appData.wellnessData.caloriesConsumed = total;
    document.getElementById("totalCalories").textContent = `Total Today: ${total} Calories`;
}

function addMeal(mealType) {
    const nameInput = document.getElementById(`${mealType}Name`);
    const calInput = document.getElementById(`${mealType}Calories`);
    const calories = Number(calInput.value);

    if (!nameInput.value || calories <= 0) {
        showModal("Please enter valid meal data.");
        return;
    }
    appData.meals[mealType].push({ name: nameInput.value, calories: calories });
    appData.wellnessData.caloriesConsumed += calories;
    saveData();
    
    nameInput.value = ""; 
    calInput.value = "";
    
    renderMeals();
    showModal("Meal added!");
}

// --- Insights Page & Data Management ---

function renderInsights() {
    const { activities } = appData;
    const activityBarContainer = document.getElementById("weeklyActivities");
    const calorieBarContainer = document.getElementById("weeklyCalories");
    activityBarContainer.innerHTML = activities.length > 0 ? "" : "<p>No activity data for today's charts.</p>";
    calorieBarContainer.innerHTML = activities.length > 0 ? "" : "<p>No calorie data for today's charts.</p>";

    activities.forEach(a => {
        const actBar = document.createElement("div");
        actBar.className = 'bar';
        actBar.style.height = `${Math.min(a.duration * 3, 250)}px`;
        actBar.setAttribute('data-tooltip', `${a.name}: ${a.duration} min`);
        activityBarContainer.appendChild(actBar);

        const calBar = document.createElement("div");
        calBar.className = 'bar';
        calBar.style.height = `${Math.min(a.calories / 2, 250)}px`;
        calBar.setAttribute('data-tooltip', `${a.name}: ${a.calories} cal`);
        calorieBarContainer.appendChild(calBar);
    });
}

/**
 * Manually clears today's data to start a new day, without waiting for midnight.
 */
function startNewDay() {
    if (confirm("Are you sure you want to end this day and start a new one? All of today's logs will be cleared.")) {
        // Directly remove the daily data items from localStorage.
        localStorage.removeItem('wellnessData');
        localStorage.removeItem('activities');
        localStorage.removeItem('meals');
        // Reload the page to apply the reset and show a fresh dashboard.
        window.location.href = 'index.html'; 
    }
}

/**
 * Wipes ALL data from localStorage, including the daily reset marker.
 */
function resetDashboard() {
    if (confirm("Are you sure you want to reset ALL data? This will clear everything permanently and cannot be undone.")) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}

function downloadSummary() {
    let summaryContent = `FitTrack Pro Summary - ${new Date().toLocaleDateString()}\n`;
    summaryContent += "========================================\n\n";
    summaryContent += "--- WELLNESS OVERVIEW ---\n";
    summaryContent += `Steps Taken: ${appData.wellnessData.steps.toLocaleString()}\n`;
    summaryContent += `Calories Burned: ${appData.wellnessData.caloriesBurned}\n`;
    summaryContent += `Calories Consumed: ${appData.wellnessData.caloriesConsumed}\n`;
    summaryContent += `Water Intake: ${appData.wellnessData.waterIntake.toFixed(2)} L\n\n`;

    summaryContent += "--- LOGGED ACTIVITIES ---\n";
    if (appData.activities.length === 0) {
        summaryContent += "(No activities logged for today)\n";
    } else {
        appData.activities.forEach(a => {
            let activityLine = `- ${a.time}: ${a.name} (${a.duration} mins, ${a.calories} cals`;
            if (a.steps > 0) activityLine += `, ${a.steps.toLocaleString()} steps`;
            activityLine += `)\n`;
            summaryContent += activityLine;
        });
    }
    summaryContent += "\n";

    summaryContent += "--- MEAL PLANNER ---\n";
    for (const mealType in appData.meals) {
        summaryContent += `  - ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}:\n`;
        if (appData.meals[mealType].length === 0) {
            summaryContent += `    (No items logged)\n`;
        } else {
            appData.meals[mealType].forEach(meal => {
                summaryContent += `    - ${meal.name} (${meal.calories} calories)\n`;
            });
        }
    }
    const blob = new Blob([summaryContent], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'FitTrack_Summary.txt';
    document.body.appendChild(a); 
    a.click(); 
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    showModal("Summary downloaded!");
}

// --- Shared Modal ---

function showModal(message) {
    const overlay = document.getElementById("modalOverlay");
    const modal = overlay.querySelector(".modal");
    document.getElementById("modalMessage").textContent = message;
    overlay.style.display = "flex";
    setTimeout(() => {
        overlay.style.opacity = "1";
        modal.style.transform = "translateY(0)";
    }, 10);
}

function closeModal() {
    const overlay = document.getElementById("modalOverlay");
    const modal = overlay.querySelector(".modal");
    overlay.style.opacity = "0";
    modal.style.transform = "translateY(-50px)";
    setTimeout(() => { overlay.style.display = "none"; }, 300);
}