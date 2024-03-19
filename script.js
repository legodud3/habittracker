const monthSelect = document.getElementById('month-select');
const yearSelect = document.getElementById('year-select');
const calendarContainer = document.querySelector('.calendar-container');

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Function to populate month and year options
function populateOptions() {
  for (let i = 2020; i <= new Date().getFullYear(); i++) {
    yearSelect.innerHTML += `<option value="<span class="math-inline">\{i\}"\></span>{i}</option>`;
  }
  months.forEach(month => {
    monthSelect.innerHTML += `<option value="<span class="math-inline">\{month\}"\></span>{month}</option>`;
  });
}

// Function to generate the calendar grid
function generateCalendar(selectedMonth, selectedYear) {
  calendarContainer.innerHTML = ''; // Clear previous calendar

  const date = new Date(selectedYear, months.indexOf(selectedMonth));
  const firstDay = date.getDay(); // Day of week for the first day

  // Add weekdays as headers
  daysInWeek.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.classList.add('date-box');
    dayElement.textContent = day;
    calendarContainer.appendChild(dayElement);
  });

  // Add empty boxes before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    const emptyBox = document.createElement('div');
    emptyBox.classList.add('date-box');
    calendarContainer.appendChild(emptyBox);
  }

  const daysInMonth = new Date(selectedYear, months.indexOf(
