// JavaScript code for generating calendar and handling month/year change
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const habitTrackStorageKey = "habitTrack";
let habitTrack = JSON.parse(localStorage.getItem(habitTrackStorageKey)) || {};

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
        generateCalendar(parseInt(this.value), parseInt(document.getElementById('year').value));
    };

    document.getElementById('year').onchange = function() {
        generateCalendar(parseInt(document.getElementById('month').value), parseInt(this.value));
    };

    generateDayNames();
    generateCalendar(currentMonth, currentYear);
};

function generateDayNames() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
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
    // Clear existing calendar cells but keep the day names
    calendar.querySelectorAll('.date-cell').forEach(cell => cell.remove());

    generateDayNames(); // Regenerate day names for the new month

    for (let i = 0; i < firstDay; i++) {
        let cell = document.createElement('div');
        calendar.appendChild(cell);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const cell = document.createElement('div');
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        cell.className = 'date-cell';
        cell.setAttribute('data-day', i);
        cell.textContent = i;
        
        const statusSpan = document.createElement('span');
        statusSpan.className = 'status';
        
        if (habitTrack[dateKey] === 'success') {
            statusSpan.textContent = '✓';
            statusSpan.classList.add('success');
        } else if (habitTrack[dateKey] === 'fail') {
            statusSpan.textContent = 'fail';
            statusSpan.classList.add('fail');
        }
        
        cell.appendChild(statusSpan);
        cell.addEventListener('click', onDateClick);
        calendar.appendChild(cell);
    }
}

function onDateClick(e) {
    const cell = e.target.classList.contains('date-cell') ? e.target : e.target.closest('.date-cell');
    const day = cell.getAttribute('data-day').padStart(2, '0');
    const year = document.getElementById('year').value;
    const month = String(parseInt(document.getElementById('month').value) + 1).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    let statusSpan = cell.querySelector('.status');
    
    if (!habitTrack[dateKey]) {
        habitTrack[dateKey] = 'success';
        statusSpan.textContent = '✓';
        statusSpan.className = 'status success';
    } else if (habitTrack[dateKey] === 'success') {
        habitTrack[dateKey] = 'fail';
        statusSpan.textContent = 'fail';
        statusSpan.className = 'status fail';
    } else {
        delete habitTrack[dateKey];
        statusSpan.textContent = '';
        statusSpan.className = 'status';
    }

    localStorage.setItem(habitTrackStorageKey, JSON.stringify(habitTrack));
}