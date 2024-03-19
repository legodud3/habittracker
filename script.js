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
        generateCalendar(this.value, document.getElementById('year').value);
    };

    document.getElementById('year').onchange = function() {
        generateCalendar(document.getElementById('month').value, this.value);
    };
    
    generateDayNames();
    generateCalendar(currentMonth, currentYear);
};

function generateDayNames() {
    const calendar = document.getElementById('calendar');
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
    calendar.innerHTML = "";
    
    generateDayNames();

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
}

function onDateClick(e) {
    const cell = e.target.tagName.toLowerCase() === 'div' ? e.target : e.target.parentNode;
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const day = cell.getAttribute('data-day');
    const dateKey = `${year}-${month}-${day}`;
    
    if (!habitTrack[dateKey]) {
        habitTrack[dateKey] = 'success';
    } else if (habitTrack[dateKey] === 'success') {
        habitTrack[dateKey] = 'fail';
    } else {
        delete habitTrack[dateKey];
    }
    
    localStorage.setItem(habitTrackStorageKey, JSON.stringify(habitTrack));
    generateCalendar(month, year);
}