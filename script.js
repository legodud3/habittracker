// JavaScript code for generating calendar and handling month/year change
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const habitTrackStorageKey = "habitTrack";
let habitTrack = JSON.parse(localStorage.getItem(habitTrackStorageKey)) || {};

// New user authentication and goal setting code
document.addEventListener('DOMContentLoaded', function() {
  const auth = firebase.auth();

  // Check for user session
  auth.onAuthStateChanged((user) => {
      if (user) {
          // User is signed in
          showUserUI(user);
      }
      // If no user is signed in, the default UI remains as is
  });

  // Bind sign-in button event
  document.getElementById('sign-in-btn').addEventListener('click', () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
              // Signed in successfully
              showUserUI(userCredential.user);
          })
          .catch((error) => {
              alert('Sign in failed: ' + error.message);
          });
  });

  // Bind sign-out button event
  document.getElementById('sign-out-btn').addEventListener('click', () => {
      auth.signOut(); // Will trigger the onAuthStateChanged event
  });

  // Bind goal submit button event
  document.getElementById('submit-goal-btn').addEventListener('click', () => {
      const user = auth.currentUser;
      if (user) {
          const goal = document.getElementById('goal').value;
          const startDate = document.getElementById('start-date').value;
          const endDate = document.getElementById('end-date').value;
          const allowedBreaks = parseInt(document.getElementById('allowed-breaks').value, 10);
          // Save goal in Firebase under user's node
          firebase.database().ref('users/' + user.uid + '/goal').set({
              goal, startDate, endDate, allowedBreaks
          }).then(() => alert('Goal saved!'));
      }
  });

  function showUserUI(user) {
      document.getElementById('auth-container').style.display = 'none';
      document.getElementById('sign-out-btn').style.display = 'block';
      document.getElementById('goal-setting').style.display = 'block';
      // Load the habit tracker for the signed-in user
      const habitTracker = generateCalendar(); 
      document.getElementById('habit-tracker').appendChild(habitTracker);
      // Load user's saved goal, if any
      firebase.database().ref('users/' + user.uid + '/goal').once('value')
          .then((snapshot) => {
              if (snapshot.exists()) {
                  const goalData = snapshot.val();
                  document.getElementById('goal').value = goalData.goal || '';
                  document.getElementById('start-date').value = goalData.startDate || '';
                  document.getElementById('end-date').value = goalData.endDate || '';
                  document.getElementById('allowed-breaks').value = goalData.allowedBreaks || 0;
              }
          });
  }
});

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
    updateBreaksStats();
};

function updateBreaksStats() {
    const year = parseInt(document.getElementById('year').value, 10);
    const month = parseInt(document.getElementById('month').value, 10);
    
    // Calculate monthly and yearly breaks
    let monthlyBreaks = 0;
    let yearlyBreaks = 0;
    Object.keys(habitTrack).forEach(dateKey => {
        const [y, m] = dateKey.split('-').map(d => parseInt(d, 10));
        if (habitTrack[dateKey] === 'fail') {
            if (y === year) {
                yearlyBreaks += 1;
                if (m === month + 1) { // month in dateKey is 1-indexed
                    monthlyBreaks += 1;
                }
            }
        }
    });
    
    document.getElementById('monthly-breaks').textContent = `Monthly rule breaks: ${monthlyBreaks}`;
    document.getElementById('yearly-breaks').textContent = `Yearly rule breaks: ${yearlyBreaks}`;
}

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
    calendar.innerHTML = "";  // Clear existing calendar
    generateDayNames();  // Create the header rows
    
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
    updateBreaksStats();
}

function onDateClick(e) {
    const cell = e.target.closest('.date-cell');
    const year = document.getElementById('year').value;
    const month = String(parseInt(document.getElementById('month').value) + 1).padStart(2, '0');
    const day = cell.getAttribute('data-day').padStart(2, '0');
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

    updateBreaksStats();  // Update the breaks stats right after the click
}