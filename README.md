Habit Tracker - "Goal: No Sugar Except Fruit"

Description:
This habit tracker is a simple web app designed to help users track their daily adherence to a specific goal: avoiding sugar except for fruit. Each day, users can interact with a calendar to mark their success or failure in following the goal. The app provides visual feedback in the form of green ticks for successful days and red "fail" text for unsuccessful ones. Users can also view the total number of rule breaks for the selected month and year.

How to Use:
1. Select a month and a year from the dropdown menus to view the corresponding calendar.
2. Click on a day cell in the calendar to toggle the status:
   - First click: Marks the day as successful with a green tick.
   - Second click: Marks the day as unsuccessful with red "fail" text.
   - Third click: Clears the status for the day.
3. The total number of rule breaks for the current month and year is displayed at the top of the calendar.

Features:
- Dynamic calendar generation based on month and year selection.
- Status toggling with visual feedback for each day.
- Local Storage of the user's data for persistence between sessions (in the current browser).
- Summary statistics for monthly and yearly adherence.

Codebase Details:
- The project is structured with separate HTML, CSS, and JavaScript files.
- "index.html": The main markup file that structures the web app, including dropdowns for month and year, and the calendar grid where user interactions happen.
- "styles.css": The stylesheet that provides styling to the web app, making it visually appealing and user-friendly.
- "script.js": Contains the bulk of the logic. It manages date selections, dynamic calendar rendering, user interactions (clicks), and Local Storage for data persistence.

Repository Structure:
- index.html
- styles.css
- script.js
- README.txt (this file)

Getting Started:
To run the habit tracker:
1. Clone the codebase from the repository or download the files to your local machine.
2. Open the 'index.html' file in a web browser to use the habit tracker.

Future Extensions _(Optional)_: 
- Implement Firebase or another backend solution to sync data across devices.
- Set up user authentication to allow multiple unique users to track their habits.

Note: The app currently uses Local Storage, which means the data is saved locally on the user's device. To access the data across devices, a backend setup is recommended. Follow the instructions in the "script.js" file comments to use Firebase as a potential backend solution.

For detailed instructions on setting up Firebase and migrating from Local Storage, refer to the Firebase documentation: https://firebase.google.com/docs/web/setup