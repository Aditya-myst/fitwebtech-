# FitTrack Pro 🏃‍♂️🍽️💧

> A simple, client-side personal wellness dashboard to track your daily fitness, meals, and wellness goals. All data is saved directly in your browser.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


## ✨ About The Project

FitTrack Pro is a lightweight, easy-to-use web application for tracking your daily health metrics. It was built with simplicity in mind, requiring no backend, database, or user accounts. All of your personal data is stored locally in your web browser's `localStorage`, ensuring your information stays private and is instantly available.

The dashboard automatically resets at midnight, giving you a fresh start every day.

## 🚀 Features

*   **📈 Overview Dashboard:** At-a-glance view of your daily progress with dynamic circular progress bars for:
    *   Steps Taken
    *   Calories Burned
    *   Water Intake
*   **👟 Activity Tracking:**
    *   Log activities like running, walking, and yoga.
    *   Record duration, calories burned, and steps for each activity.
    *   Filter activities by time of day (Morning, Afternoon, Evening).
*   **🥗 Meal Planner:**
    *   Log your breakfast, lunch, and dinner items with calorie counts.
    *   Automatically calculates the total calories consumed for the day.
*   **📊 Insights & Data Management:**
    *   Simple bar charts visualizing activity duration and calories burned.
    *   Download a `.txt` summary of your entire day's data.
    *   Manually start a new day, clearing all of today's entries.
    *   Option to completely reset all stored data.
*   **💾 Automatic Data Persistence:** Your daily progress is saved in the browser, so you can close the tab and come back later.
*   **☀️ Automatic Daily Reset:** The application detects when a new day has started and automatically clears the previous day's data.

## 🛠️ Built With

This project is built with fundamental web technologies and contains no external frameworks, keeping it fast and lightweight.

*   **HTML5:** For the structure and content.
*   **CSS3:** For styling, layout (Flexbox), and animations, including custom properties (CSS Variables) for the progress rings.
*   **Vanilla JavaScript (ES6+):** For all application logic, DOM manipulation, and interaction with `localStorage`.

## ⚙️ Getting Started

### For Users

There is no installation needed! Simply visit the live demo link to start using the application.


## 📖 Usage

1.  **Overview Page:** Start here to see your daily summary. Click the quick-add buttons to log your water intake.
2.  **Activity Page:** Navigate to the "Activity" tab to log a new workout. Fill in the details and click "Add Activity". You can delete entries or filter your list.
3.  **Meals Page:** Go to the "Meals" tab to record your food intake for breakfast, lunch, and dinner. The total calories will update automatically.
4.  **Insights Page:** Visit the "Insights" tab to view simple charts of your day's activities and to manage your data using the "Download Summary" or "Reset" buttons.
5.  All data is saved as you enter it. The next day, you'll be greeted with a fresh, empty dashboard.

## 📄 License

This project is distributed under the MIT License. See `LICENSE` for more information.

---

Project by **[Aditya kumar jha ]** 
