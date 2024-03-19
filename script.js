// JavaScript code for generating calendar and handling month/year change
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const habitTrackStorageKey = "habitTrack";
let habitTrack = JSON.parse(localStorage.getItem(habitTrackStorageKey)) || {};

function updateBreaksStats() {
    const year = parseInt(document.getElementById('year').value, 10);
    const month = parseInt(document.getElementById('month').value, 10);
    let monthlyBreaks = 0;
    let yearlyBreaks = 0;

    Object.keys(habitTrack).forEach(date => {
        const [trackYear, trackMonth] = date.split('-').map(Number);
        if (habitTrack[date] === 'fail') {
            if (trackYear === year) {
                yearlyBreaks++;
                if (trackMonth === month) {
                    monthlyBreaks++;
                }
            }
        }
    });

    document.getElementById('monthly-breaks').textContent = `Monthly rule breaks: ${monthlyBreaks}`;
    document.getElementById('yearly-breaks').textContent = `Yearly rule breaks: ${yearlyBreaks}`;
}

window.onload = function() {
    let date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();

    monthNames.forEach((month, index) => {
        let option = document.createElement('option');
        option.value = index;
        option.text = month;
        option.selected = index === currentMonth;
        document.getElementById('month').appendChild(option);
    });

    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = i;
        option.selected = i === currentYear;
        document.getElementById('year').appendChild(option);
    }

    document.getElementById('month').onchange = function() {
        generateCalendar(this.value, document.getElementById('year').value);
    };

    document.getElementById('year').onchange = function() {
        generateCalendar(document.getElementById('month').value, this.value);
    };
    
    generateDayNames();
    generateCalendar(currentMonth, currentYear);
    updateBreaksStats(); // Initial update for stats
};

function generateDayNames() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = ''; // Clear any existing day names
    dayNames.forEach(dayName => {
        const dayCell = document.createElement('div');
        dayCell.textContent = dayName;
        dayCell.className = 'day-name';
        calendar.appendChild(dayCell);
    });
}

function generateCalendar(month, year) {
    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let calendar = document.getElementById('calendar');
    // Clear existing calendar cells, but keep day names
    calendar.querySelectorAll('.date-cell').forEach(cell => cell.remove());

    generateDayNames(); // Regenerate day names for the new month

    for (let i = 0; i < firstDay; i++) {
        let cell = document.createElement('div');
        calendar.appendChild(cell);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const cell = document.createElement('div');
        const dateKey = `${year}-${month}-${i}`;
        
        cell.className = 'date-cell';
        cell.setAttribute('data-day', i);
        cell.textContent = i;
        cell.addEventListener('click', onDateClick);
        
        if (habitTrack[dateKey] === 'success') {
            const tick = document.createElement('span');
            tick.className = 'status success';
            tick.textContent = '✓';
            cell.appendChild(tick);
        } else if (habitTrack[dateKey] === 'fail') {
            const fail = document.createElement('span');
            fail.className = 'status fail';
            fail.textContent = 'fail';
            cell.appendChild(fail);
        }
        
        calendar.appendChild(cell);
    }

    updateBreaksStats(); // Update statistics whenever the calendar is generated
}

function onDateClick(e) {
  const cell = e.target.classList.contains('date-cell') ? e.target : e.target.closest('.date-cell');
  const day = cell.getAttribute('data-day');
  const year = document.getElementById('year').value;
  const month = String(parseInt(document.getElementById('month').value)+1).padStart(2, '0'); // Ensure month is 2 digits
  const dateKey = `${year}-${month}-${day.padStart(2, '0')}`;
  
  if (!habitTrack[dateKey]) {
      habitTrack[dateKey] = 'success';
      cell.innerHTML = `<span class="status success">✓</span>${day}`;
  } else if (habitTrack[dateKey] === 'success') {
      habitTrack[dateKey] = 'fail';
      cell.innerHTML = `<span class="status fail">fail</span>${day}`;
  } else {
      delete habitTrack[dateKey];
      cell.innerHTML = day;
  }
  
  localStorage.setItem(habitTrackStorageKey, JSON.stringify(habitTrack));
}