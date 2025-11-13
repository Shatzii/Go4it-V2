/**
 * GPA Calculator for Neurodivergent Superhero School
 * 
 * This script handles the GPA calculation, grade tracking, and academic performance
 * visualization for students with learning differences.
 */

// GPA Scale - can be adjusted for different grading systems
const GPA_SCALE = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'D-': 0.7,
  'F': 0.0
};

// Track course data across different semesters
let courses = {
  'semester1': [],
  'semester2': [],
  'summer': []
};

// Store historical GPA data for charts
let gpaHistory = [];

// Current active semester
let activeSemester = 'semester1';

/**
 * Initialize the GPA calculator
 */
function initGPACalculator() {
  loadSavedData();
  setupEventListeners();
  updateDisplay();
}

/**
 * Load saved GPA data from localStorage
 */
function loadSavedData() {
  try {
    const savedCourses = localStorage.getItem('gpa_courses');
    if (savedCourses) {
      courses = JSON.parse(savedCourses);
    }
    
    const savedHistory = localStorage.getItem('gpa_history');
    if (savedHistory) {
      gpaHistory = JSON.parse(savedHistory);
    }
    
    const savedSemester = localStorage.getItem('active_semester');
    if (savedSemester) {
      activeSemester = savedSemester;
    }
  } catch (error) {
    console.error('Error loading saved GPA data:', error);
    
    // Reset data if there's an error
    courses = { 'semester1': [], 'semester2': [], 'summer': [] };
    gpaHistory = [];
    activeSemester = 'semester1';
  }
}

/**
 * Save current data to localStorage
 */
function saveData() {
  try {
    localStorage.setItem('gpa_courses', JSON.stringify(courses));
    localStorage.setItem('gpa_history', JSON.stringify(gpaHistory));
    localStorage.setItem('active_semester', activeSemester);
  } catch (error) {
    console.error('Error saving GPA data:', error);
    showNotification('Error saving data. Please try again.', 'error');
  }
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
  // Add course button
  document.getElementById('add-course-btn').addEventListener('click', function() {
    showAddCourseModal();
  });
  
  // Semester tabs
  document.querySelectorAll('.semester-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      activeSemester = this.dataset.semester;
      updateActiveSemesterTab();
      updateCourseList();
      saveData();
    });
  });
  
  // Save course form
  document.getElementById('course-form').addEventListener('submit', function(e) {
    e.preventDefault();
    saveCourse();
  });
  
  // Close modal buttons
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', function() {
      closeAllModals();
    });
  });
  
  // Export data button
  document.getElementById('export-data-btn').addEventListener('click', exportGPAData);
  
  // Print report button
  document.getElementById('print-report-btn').addEventListener('click', printGPAReport);
  
  // GPA goal setting
  document.getElementById('set-gpa-goal-btn').addEventListener('click', setGPAGoal);
  
  // Reset demo data
  document.getElementById('reset-demo-btn').addEventListener('click', resetDemoData);
  
  // Voice guidance buttons
  document.querySelectorAll('.voice-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (window.accessibilityVoice) {
        window.accessibilityVoice.speak(this.dataset.voiceText || this.title);
      }
    });
  });
}

/**
 * Update the active semester tab UI
 */
function updateActiveSemesterTab() {
  document.querySelectorAll('.semester-tab').forEach(tab => {
    if (tab.dataset.semester === activeSemester) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  // Update semester name display
  const semesterNames = {
    'semester1': 'Semester 1',
    'semester2': 'Semester 2',
    'summer': 'Summer'
  };
  
  document.getElementById('active-semester-name').textContent = semesterNames[activeSemester];
}

/**
 * Show the add course modal
 * @param {Object|null} existingCourse - Existing course data for editing, or null for a new course
 */
function showAddCourseModal(existingCourse = null) {
  const modal = document.getElementById('add-course-modal');
  const form = document.getElementById('course-form');
  const title = document.getElementById('modal-title');
  
  // Reset form
  form.reset();
  
  if (existingCourse) {
    // Fill form with existing course data for editing
    document.getElementById('course-id').value = existingCourse.id;
    document.getElementById('course-name').value = existingCourse.name;
    document.getElementById('course-credits').value = existingCourse.credits;
    document.getElementById('course-grade').value = existingCourse.grade;
    document.getElementById('course-is-honors').checked = existingCourse.isHonors;
    document.getElementById('course-is-ap').checked = existingCourse.isAP;
    
    title.textContent = 'Edit Course';
  } else {
    // Clear form for new course
    document.getElementById('course-id').value = '';
    title.textContent = 'Add New Course';
  }
  
  // Show the modal
  modal.classList.add('active');
  document.getElementById('course-name').focus();
  
  // Announce for screen readers
  if (window.accessibilityVoice) {
    if (existingCourse) {
      window.accessibilityVoice.announce('Editing course ' + existingCourse.name);
    } else {
      window.accessibilityVoice.announce('Add new course form opened');
    }
  }
}

/**
 * Close all modal dialogs
 */
function closeAllModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('active');
  });
}

/**
 * Save course data from the form
 */
function saveCourse() {
  const courseId = document.getElementById('course-id').value;
  const courseName = document.getElementById('course-name').value.trim();
  const credits = parseFloat(document.getElementById('course-credits').value) || 0;
  const grade = document.getElementById('course-grade').value;
  const isHonors = document.getElementById('course-is-honors').checked;
  const isAP = document.getElementById('course-is-ap').checked;
  
  if (!courseName) {
    showNotification('Please enter a course name', 'error');
    return;
  }
  
  if (credits <= 0) {
    showNotification('Please enter valid credit hours', 'error');
    return;
  }
  
  if (!grade) {
    showNotification('Please select a grade', 'error');
    return;
  }
  
  const course = {
    id: courseId || generateId(),
    name: courseName,
    credits: credits,
    grade: grade,
    isHonors: isHonors,
    isAP: isAP,
    dateAdded: new Date().toISOString()
  };
  
  // Determine if we're adding or editing
  if (courseId) {
    // Find and replace existing course
    const index = courses[activeSemester].findIndex(c => c.id === courseId);
    if (index !== -1) {
      courses[activeSemester][index] = course;
      showNotification('Course updated successfully', 'success');
    }
  } else {
    // Add new course
    courses[activeSemester].push(course);
    showNotification('Course added successfully', 'success');
  }
  
  // Save, update display, and close modals
  saveData();
  updateDisplay();
  closeAllModals();
  
  // Announce for screen readers
  if (window.accessibilityVoice) {
    window.accessibilityVoice.announce('Course saved successfully');
  }
}

/**
 * Generate a unique ID for a course
 * @returns {string} Unique ID
 */
function generateId() {
  return 'course_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

/**
 * Delete a course by ID
 * @param {string} courseId - The ID of the course to delete
 */
function deleteCourse(courseId) {
  if (confirm('Are you sure you want to delete this course?')) {
    const index = courses[activeSemester].findIndex(c => c.id === courseId);
    
    if (index !== -1) {
      courses[activeSemester].splice(index, 1);
      saveData();
      updateDisplay();
      showNotification('Course deleted successfully', 'success');
      
      // Announce for screen readers
      if (window.accessibilityVoice) {
        window.accessibilityVoice.announce('Course deleted successfully');
      }
    }
  }
}

/**
 * Edit an existing course
 * @param {string} courseId - The ID of the course to edit
 */
function editCourse(courseId) {
  const course = courses[activeSemester].find(c => c.id === courseId);
  
  if (course) {
    showAddCourseModal(course);
  }
}

/**
 * Update the display with current data
 */
function updateDisplay() {
  updateCourseList();
  updateGPASummary();
  updateGPAChart();
  updateActiveSemesterTab();
}

/**
 * Update the course list display
 */
function updateCourseList() {
  const courseList = document.getElementById('course-list');
  const activeCourses = courses[activeSemester] || [];
  
  if (activeCourses.length === 0) {
    courseList.innerHTML = `
      <div class="empty-state">
        <p>No courses added yet for this semester.</p>
        <button class="btn btn-primary" id="add-first-course">Add Your First Course</button>
      </div>
    `;
    
    // Add event listener to the "Add Your First Course" button
    const addFirstCourseBtn = document.getElementById('add-first-course');
    if (addFirstCourseBtn) {
      addFirstCourseBtn.addEventListener('click', function() {
        showAddCourseModal();
      });
    }
    
    return;
  }
  
  let html = `
    <table class="course-table">
      <thead>
        <tr>
          <th>Course Name</th>
          <th>Credits</th>
          <th>Grade</th>
          <th>Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  activeCourses.forEach(course => {
    let courseType = 'Standard';
    if (course.isAP) courseType = 'AP';
    else if (course.isHonors) courseType = 'Honors';
    
    html += `
      <tr>
        <td>${course.name}</td>
        <td>${course.credits}</td>
        <td>${course.grade}</td>
        <td>${courseType}</td>
        <td>
          <button class="btn-icon edit-course" data-id="${course.id}" title="Edit course"><span class="icon">✏️</span></button>
          <button class="btn-icon delete-course" data-id="${course.id}" title="Delete course"><span class="icon">🗑️</span></button>
        </td>
      </tr>
    `;
  });
  
  html += `
      </tbody>
    </table>
  `;
  
  courseList.innerHTML = html;
  
  // Add event listeners to edit and delete buttons
  document.querySelectorAll('.edit-course').forEach(btn => {
    btn.addEventListener('click', function() {
      editCourse(this.dataset.id);
    });
  });
  
  document.querySelectorAll('.delete-course').forEach(btn => {
    btn.addEventListener('click', function() {
      deleteCourse(this.dataset.id);
    });
  });
}

/**
 * Calculate GPA for the current semester
 * @returns {Object} GPA information for the current semester
 */
function calculateSemesterGPA() {
  const activeCourses = courses[activeSemester] || [];
  
  if (activeCourses.length === 0) {
    return {
      gpa: 0,
      totalCredits: 0,
      totalPoints: 0,
      honorPoints: 0
    };
  }
  
  let totalCredits = 0;
  let totalPoints = 0;
  let honorPoints = 0;
  
  activeCourses.forEach(course => {
    const credits = parseFloat(course.credits) || 0;
    const gradeValue = GPA_SCALE[course.grade] || 0;
    
    // Add honor/AP points
    const extraPoints = course.isAP ? 1.0 : (course.isHonors ? 0.5 : 0);
    honorPoints += extraPoints * credits;
    
    totalCredits += credits;
    totalPoints += (gradeValue * credits);
  });
  
  const standardGPA = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
  const weightedGPA = totalCredits > 0 ? ((totalPoints + honorPoints) / totalCredits) : 0;
  
  return {
    standardGPA: standardGPA.toFixed(2),
    weightedGPA: weightedGPA.toFixed(2),
    totalCredits: totalCredits,
    totalPoints: totalPoints,
    honorPoints: honorPoints
  };
}

/**
 * Calculate cumulative GPA across all semesters
 * @returns {Object} Cumulative GPA information
 */
function calculateCumulativeGPA() {
  let totalCredits = 0;
  let totalPoints = 0;
  let honorPoints = 0;
  
  // Loop through all semesters
  Object.keys(courses).forEach(semester => {
    courses[semester].forEach(course => {
      const credits = parseFloat(course.credits) || 0;
      const gradeValue = GPA_SCALE[course.grade] || 0;
      
      // Add honor/AP points
      const extraPoints = course.isAP ? 1.0 : (course.isHonors ? 0.5 : 0);
      honorPoints += extraPoints * credits;
      
      totalCredits += credits;
      totalPoints += (gradeValue * credits);
    });
  });
  
  const standardGPA = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
  const weightedGPA = totalCredits > 0 ? ((totalPoints + honorPoints) / totalCredits) : 0;
  
  return {
    standardGPA: standardGPA.toFixed(2),
    weightedGPA: weightedGPA.toFixed(2),
    totalCredits: totalCredits,
    totalPoints: totalPoints,
    honorPoints: honorPoints
  };
}

/**
 * Update the GPA summary display
 */
function updateGPASummary() {
  const semesterGPA = calculateSemesterGPA();
  const cumulativeGPA = calculateCumulativeGPA();
  
  // Update semester GPA display
  document.getElementById('semester-standard-gpa').textContent = semesterGPA.standardGPA;
  document.getElementById('semester-weighted-gpa').textContent = semesterGPA.weightedGPA;
  document.getElementById('semester-credits').textContent = semesterGPA.totalCredits;
  
  // Update cumulative GPA display
  document.getElementById('cumulative-standard-gpa').textContent = cumulativeGPA.standardGPA;
  document.getElementById('cumulative-weighted-gpa').textContent = cumulativeGPA.weightedGPA;
  document.getElementById('cumulative-credits').textContent = cumulativeGPA.totalCredits;
  
  // Update GPA history for charts
  const currentDate = new Date().toISOString().split('T')[0];
  gpaHistory.push({
    date: currentDate,
    standardGPA: parseFloat(cumulativeGPA.standardGPA),
    weightedGPA: parseFloat(cumulativeGPA.weightedGPA)
  });
  
  // Keep only the last 10 data points
  if (gpaHistory.length > 10) {
    gpaHistory = gpaHistory.slice(gpaHistory.length - 10);
  }
  
  saveData();
}

/**
 * Update the GPA chart
 */
function updateGPAChart() {
  const chartContainer = document.getElementById('gpa-chart');
  
  if (gpaHistory.length < 2) {
    chartContainer.innerHTML = '<p class="chart-placeholder">Add more courses to see your GPA progress over time.</p>';
    return;
  }
  
  // Create a simple bar chart
  let html = `
    <div class="gpa-chart-container">
      <div class="chart-title">GPA Progress</div>
      <div class="chart-legend">
        <div class="legend-item">
          <div class="legend-color standard-gpa-color"></div>
          <div class="legend-text">Standard GPA</div>
        </div>
        <div class="legend-item">
          <div class="legend-color weighted-gpa-color"></div>
          <div class="legend-text">Weighted GPA</div>
        </div>
      </div>
      <div class="chart-body">
  `;
  
  // Get min and max values for the chart
  const allGPAs = gpaHistory.flatMap(h => [h.standardGPA, h.weightedGPA]);
  const maxGPA = Math.max(...allGPAs, 4.0);
  const minGPA = Math.max(0, Math.min(...allGPAs) - 0.5);
  
  // Draw bars for each entry
  gpaHistory.forEach((entry, index) => {
    const standardHeight = ((entry.standardGPA - minGPA) / (maxGPA - minGPA)) * 100;
    const weightedHeight = ((entry.weightedGPA - minGPA) / (maxGPA - minGPA)) * 100;
    const label = entry.date.split('-')[1] + '/' + entry.date.split('-')[2];
    
    html += `
      <div class="chart-column">
        <div class="chart-bars">
          <div class="chart-bar standard-gpa-bar" style="height: ${standardHeight}%;" title="Standard GPA: ${entry.standardGPA}"></div>
          <div class="chart-bar weighted-gpa-bar" style="height: ${weightedHeight}%;" title="Weighted GPA: ${entry.weightedGPA}"></div>
        </div>
        <div class="chart-label">${label}</div>
      </div>
    `;
  });
  
  html += `
      </div>
      <div class="chart-y-axis">
        <div class="y-axis-label" style="bottom: 0%;">0.0</div>
        <div class="y-axis-label" style="bottom: 25%;">1.0</div>
        <div class="y-axis-label" style="bottom: 50%;">2.0</div>
        <div class="y-axis-label" style="bottom: 75%;">3.0</div>
        <div class="y-axis-label" style="bottom: 100%;">4.0</div>
      </div>
    </div>
  `;
  
  chartContainer.innerHTML = html;
}

/**
 * Show a notification to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Show notification with animation
  setTimeout(() => {
    notification.classList.add('active');
  }, 10);
  
  // Auto-close after 5 seconds
  setTimeout(() => {
    closeNotification(notification);
  }, 5000);
  
  // Close button event
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    closeNotification(notification);
  });
  
  // Announce for screen readers
  if (window.accessibilityVoice) {
    window.accessibilityVoice.announce(message);
  }
}

/**
 * Close a notification
 * @param {HTMLElement} notification - The notification element to close
 */
function closeNotification(notification) {
  notification.classList.remove('active');
  
  // Remove from DOM after animation
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

/**
 * Export GPA data as JSON
 */
function exportGPAData() {
  const data = {
    courses: courses,
    gpaHistory: gpaHistory,
    exportDate: new Date().toISOString(),
    cumulativeGPA: calculateCumulativeGPA()
  };
  
  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gpa_data_export.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification('GPA data exported successfully', 'success');
}

/**
 * Print GPA report
 */
function printGPAReport() {
  const cumulativeGPA = calculateCumulativeGPA();
  const semesterGPA = calculateSemesterGPA();
  
  // Create print window content
  let printContent = `
    <html>
      <head>
        <title>GPA Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
          }
          h1, h2, h3 {
            color: #1e90ff;
          }
          .report-header {
            text-align: center;
            margin-bottom: 30px;
          }
          .section {
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          table, th, td {
            border: 1px solid #ddd;
          }
          th, td {
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .gpa-summary {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .gpa-card {
            flex: 1;
            margin: 0 10px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 0.9em;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>GPA Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()} for Neurodivergent Superhero School</p>
        </div>
        
        <div class="section">
          <h2>GPA Summary</h2>
          <div class="gpa-summary">
            <div class="gpa-card">
              <h3>Cumulative GPA</h3>
              <p><strong>Standard GPA:</strong> ${cumulativeGPA.standardGPA}</p>
              <p><strong>Weighted GPA:</strong> ${cumulativeGPA.weightedGPA}</p>
              <p><strong>Total Credits:</strong> ${cumulativeGPA.totalCredits}</p>
            </div>
            <div class="gpa-card">
              <h3>Current Semester GPA</h3>
              <p><strong>Standard GPA:</strong> ${semesterGPA.standardGPA}</p>
              <p><strong>Weighted GPA:</strong> ${semesterGPA.weightedGPA}</p>
              <p><strong>Semester Credits:</strong> ${semesterGPA.totalCredits}</p>
            </div>
          </div>
        </div>
  `;
  
  // Add courses for each semester
  Object.keys(courses).forEach(semester => {
    if (courses[semester].length > 0) {
      const semesterNames = {
        'semester1': 'Semester 1',
        'semester2': 'Semester 2',
        'summer': 'Summer'
      };
      
      printContent += `
        <div class="section">
          <h2>${semesterNames[semester]}</h2>
          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Credits</th>
                <th>Grade</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      courses[semester].forEach(course => {
        let courseType = 'Standard';
        if (course.isAP) courseType = 'AP';
        else if (course.isHonors) courseType = 'Honors';
        
        printContent += `
          <tr>
            <td>${course.name}</td>
            <td>${course.credits}</td>
            <td>${course.grade}</td>
            <td>${courseType}</td>
          </tr>
        `;
      });
      
      printContent += `
            </tbody>
          </table>
        </div>
      `;
    }
  });
  
  // Add footer
  printContent += `
        <div class="footer">
          <p>ShotziOS Education Platform - Academic Progress Report</p>
        </div>
      </body>
    </html>
  `;
  
  // Open print window
  const printWindow = window.open('', '_blank');
  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();
  
  // Print after window loads
  printWindow.onload = function() {
    printWindow.print();
  };
  
  showNotification('GPA report prepared for printing', 'success');
}

/**
 * Set GPA goal
 */
function setGPAGoal() {
  const goalGPA = prompt('Enter your GPA goal for this semester:', '3.5');
  
  if (goalGPA === null) return; // User canceled
  
  const gpaValue = parseFloat(goalGPA);
  
  if (isNaN(gpaValue) || gpaValue < 0 || gpaValue > 4.0) {
    showNotification('Please enter a valid GPA between 0.0 and 4.0', 'error');
    return;
  }
  
  localStorage.setItem('gpa_goal', gpaValue.toFixed(2));
  
  // Update goal display
  const goalElement = document.getElementById('gpa-goal');
  if (goalElement) {
    goalElement.textContent = gpaValue.toFixed(2);
  }
  
  // Show goal box if hidden
  const goalBox = document.getElementById('goal-box');
  if (goalBox) {
    goalBox.style.display = 'block';
  }
  
  showNotification(`GPA goal set to ${gpaValue.toFixed(2)}`, 'success');
  
  // Announce for screen readers
  if (window.accessibilityVoice) {
    window.accessibilityVoice.announce(`GPA goal set to ${gpaValue.toFixed(2)}`);
  }
}

/**
 * Reset demo data
 */
function resetDemoData() {
  if (confirm('This will reset all GPA data and load demo courses. Are you sure?')) {
    // Clear existing data
    courses = {
      'semester1': [],
      'semester2': [],
      'summer': []
    };
    
    // Add demo courses for semester 1
    courses.semester1 = [
      {
        id: 'demo_1',
        name: 'English Language Arts',
        credits: 4,
        grade: 'B+',
        isHonors: true,
        isAP: false,
        dateAdded: new Date().toISOString()
      },
      {
        id: 'demo_2',
        name: 'Algebra I',
        credits: 4,
        grade: 'A-',
        isHonors: false,
        isAP: false,
        dateAdded: new Date().toISOString()
      },
      {
        id: 'demo_3',
        name: 'Physical Science',
        credits: 3,
        grade: 'B',
        isHonors: false,
        isAP: false,
        dateAdded: new Date().toISOString()
      },
      {
        id: 'demo_4',
        name: 'World History',
        credits: 3,
        grade: 'A',
        isHonors: false,
        isAP: false,
        dateAdded: new Date().toISOString()
      }
    ];
    
    // Add demo courses for semester 2
    courses.semester2 = [
      {
        id: 'demo_5',
        name: 'English Literature',
        credits: 4,
        grade: 'A-',
        isHonors: true,
        isAP: false,
        dateAdded: new Date().toISOString()
      },
      {
        id: 'demo_6',
        name: 'Geometry',
        credits: 4,
        grade: 'B+',
        isHonors: false,
        isAP: false,
        dateAdded: new Date().toISOString()
      },
      {
        id: 'demo_7',
        name: 'Biology',
        credits: 3,
        grade: 'A',
        isHonors: false,
        isAP: false,
        dateAdded: new Date().toISOString()
      },
      {
        id: 'demo_8',
        name: 'U.S. History',
        credits: 3,
        grade: 'B+',
        isHonors: false,
        isAP: false,
        dateAdded: new Date().toISOString()
      }
    ];
    
    // Reset GPA history
    gpaHistory = [];
    
    // Set active semester to Semester 1
    activeSemester = 'semester1';
    
    // Save data and update display
    saveData();
    updateDisplay();
    
    showNotification('Demo data loaded successfully', 'success');
  }
}

// Initialize the GPA calculator when the page loads
document.addEventListener('DOMContentLoaded', initGPACalculator);