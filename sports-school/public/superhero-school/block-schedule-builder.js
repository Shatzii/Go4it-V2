/**
 * Block Schedule Builder for Neurodivergent Superhero School
 *
 * This script handles the creation, visualization, and management of block schedules
 * optimized for students with dyslexia and ADHD. It provides visual scheduling tools
 * with neurodivergent-friendly features.
 */

// Store the block schedule data
let scheduleData = {
  // Days of the week
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],

  // Blocks (periods) in each day
  blocks: [
    { id: 'block1', name: 'Block 1', startTime: '08:00', endTime: '09:30' },
    { id: 'block2', name: 'Block 2', startTime: '09:45', endTime: '11:15' },
    { id: 'block3', name: 'Block 3', startTime: '11:30', endTime: '13:00' },
    { id: 'block4', name: 'Lunch', startTime: '13:00', endTime: '13:45' },
    { id: 'block5', name: 'Block 4', startTime: '13:45', endTime: '15:15' },
    { id: 'block6', name: 'Block 5', startTime: '15:30', endTime: '17:00' },
  ],

  // Class assignments (which class is in which block on which day)
  assignments: {},

  // Classes list
  classes: [],

  // Schedule metadata
  metadata: {
    schoolName: 'Neurodivergent Superhero School',
    gradeLevel: '',
    studentName: '',
    term: '',
    year: new Date().getFullYear().toString(),
    lastUpdated: new Date().toISOString(),
  },
};

// Color palette for classes (WCAG 2.1 AA compliant)
const CLASS_COLORS = [
  { bg: '#3498db', text: '#ffffff' }, // Blue
  { bg: '#2ecc71', text: '#ffffff' }, // Green
  { bg: '#9b59b6', text: '#ffffff' }, // Purple
  { bg: '#e67e22', text: '#ffffff' }, // Orange
  { bg: '#16a085', text: '#ffffff' }, // Teal
  { bg: '#8e44ad', text: '#ffffff' }, // Deep Purple
  { bg: '#27ae60', text: '#ffffff' }, // Emerald
  { bg: '#d35400', text: '#ffffff' }, // Dark Orange
  { bg: '#2980b9', text: '#ffffff' }, // Dark Blue
  { bg: '#c0392b', text: '#ffffff' }, // Dark Red
];

// Keep track of which color to assign to the next class
let nextColorIndex = 0;

/**
 * Initialize the block schedule builder
 */
function initScheduleBuilder() {
  loadSavedSchedule();
  renderScheduleGrid();
  renderClassList();
  setupEventListeners();
}

/**
 * Load saved schedule data from localStorage
 */
function loadSavedSchedule() {
  try {
    const savedData = localStorage.getItem('blockScheduleData');
    if (savedData) {
      scheduleData = JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading saved schedule:', error);
    showNotification('Error loading saved schedule. Using default schedule.', 'error');
  }
}

/**
 * Save schedule data to localStorage
 */
function saveSchedule() {
  try {
    scheduleData.metadata.lastUpdated = new Date().toISOString();
    localStorage.setItem('blockScheduleData', JSON.stringify(scheduleData));
    showNotification('Schedule saved successfully', 'success');
  } catch (error) {
    console.error('Error saving schedule:', error);
    showNotification('Error saving schedule. Please try again.', 'error');
  }
}

/**
 * Render the schedule grid
 */
function renderScheduleGrid() {
  const scheduleGrid = document.getElementById('schedule-grid');

  if (!scheduleGrid) return;

  // Create table structure
  let tableHTML = `
    <table class="schedule-table">
      <thead>
        <tr>
          <th class="time-header">Time</th>
  `;

  // Add days as column headers
  scheduleData.days.forEach((day) => {
    tableHTML += `<th>${day}</th>`;
  });

  tableHTML += `
        </tr>
      </thead>
      <tbody>
  `;

  // Add rows for each block
  scheduleData.blocks.forEach((block) => {
    tableHTML += `
      <tr>
        <td class="time-slot">
          <div class="block-name">${block.name}</div>
          <div class="block-time">${formatTime(block.startTime)} - ${formatTime(block.endTime)}</div>
        </td>
    `;

    // Add cells for each day
    scheduleData.days.forEach((day) => {
      const cellId = `${day}-${block.id}`;
      const assignment = scheduleData.assignments[cellId];

      let cellContent = '';
      let classColor = '';

      if (assignment) {
        const classObj = scheduleData.classes.find((c) => c.id === assignment.classId);
        if (classObj) {
          cellContent = `
            <div class="class-name">${classObj.name}</div>
            <div class="class-details">
              <span class="class-teacher">${classObj.teacher || ''}</span>
              ${classObj.room ? `<span class="class-room">Room ${classObj.room}</span>` : ''}
            </div>
          `;
          classColor = classObj.color;
        }
      }

      tableHTML += `
        <td class="schedule-cell${assignment ? ' has-class' : ''}" 
            id="${cellId}" 
            data-day="${day}" 
            data-block="${block.id}"
            ${classColor ? `style="background-color: ${classColor.bg}; color: ${classColor.text};"` : ''}>
          ${cellContent}
        </td>
      `;
    });

    tableHTML += '</tr>';
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  scheduleGrid.innerHTML = tableHTML;

  // Add event listeners to cells
  document.querySelectorAll('.schedule-cell').forEach((cell) => {
    cell.addEventListener('click', () => {
      showAssignClassModal(cell.dataset.day, cell.dataset.block);
    });
  });

  // Update schedule metadata display
  updateMetadataDisplay();
}

/**
 * Render the class list
 */
function renderClassList() {
  const classList = document.getElementById('class-list');

  if (!classList) return;

  if (scheduleData.classes.length === 0) {
    classList.innerHTML = `
      <div class="empty-state">
        <p>No classes added yet.</p>
        <button id="add-first-class" class="btn btn-primary">Add Your First Class</button>
      </div>
    `;

    // Add event listener to the "Add Your First Class" button
    const addFirstClassBtn = document.getElementById('add-first-class');
    if (addFirstClassBtn) {
      addFirstClassBtn.addEventListener('click', showAddClassModal);
    }

    return;
  }

  let html = '<ul class="class-list">';

  scheduleData.classes.forEach((classObj) => {
    html += `
      <li class="class-item" style="border-left-color: ${classObj.color.bg};">
        <div class="class-item-content">
          <div class="class-item-name">${classObj.name}</div>
          <div class="class-item-details">
            ${classObj.teacher ? `<span class="class-item-teacher">Teacher: ${classObj.teacher}</span>` : ''}
            ${classObj.room ? `<span class="class-item-room">Room: ${classObj.room}</span>` : ''}
          </div>
        </div>
        <div class="class-item-actions">
          <button class="btn-icon edit-class" data-id="${classObj.id}" title="Edit class"><span class="icon">✏️</span></button>
          <button class="btn-icon delete-class" data-id="${classObj.id}" title="Delete class"><span class="icon">🗑️</span></button>
        </div>
      </li>
    `;
  });

  html += '</ul>';

  classList.innerHTML = html;

  // Add event listeners to edit and delete buttons
  document.querySelectorAll('.edit-class').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const classId = btn.dataset.id;
      showEditClassModal(classId);
    });
  });

  document.querySelectorAll('.delete-class').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const classId = btn.dataset.id;
      deleteClass(classId);
    });
  });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Add class button
  const addClassBtn = document.getElementById('add-class-btn');
  if (addClassBtn) {
    addClassBtn.addEventListener('click', showAddClassModal);
  }

  // Save schedule button
  const saveScheduleBtn = document.getElementById('save-schedule-btn');
  if (saveScheduleBtn) {
    saveScheduleBtn.addEventListener('click', saveSchedule);
  }

  // Print schedule button
  const printScheduleBtn = document.getElementById('print-schedule-btn');
  if (printScheduleBtn) {
    printScheduleBtn.addEventListener('click', printSchedule);
  }

  // Clear schedule button
  const clearScheduleBtn = document.getElementById('clear-schedule-btn');
  if (clearScheduleBtn) {
    clearScheduleBtn.addEventListener('click', confirmClearSchedule);
  }

  // Load demo schedule
  const loadDemoBtn = document.getElementById('load-demo-btn');
  if (loadDemoBtn) {
    loadDemoBtn.addEventListener('click', loadDemoSchedule);
  }

  // Edit metadata button
  const editMetadataBtn = document.getElementById('edit-metadata-btn');
  if (editMetadataBtn) {
    editMetadataBtn.addEventListener('click', showEditMetadataModal);
  }

  // Close modal buttons
  document.querySelectorAll('.close-modal').forEach((btn) => {
    btn.addEventListener('click', closeAllModals);
  });

  // Class form submission
  const classForm = document.getElementById('class-form');
  if (classForm) {
    classForm.addEventListener('submit', handleClassFormSubmit);
  }

  // Assignment form submission
  const assignmentForm = document.getElementById('assignment-form');
  if (assignmentForm) {
    assignmentForm.addEventListener('submit', handleAssignmentFormSubmit);
  }

  // Metadata form submission
  const metadataForm = document.getElementById('metadata-form');
  if (metadataForm) {
    metadataForm.addEventListener('submit', handleMetadataFormSubmit);
  }

  // Voice guidance buttons
  document.querySelectorAll('.voice-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      if (window.accessibilityVoice) {
        window.accessibilityVoice.speak(this.dataset.voiceText || this.title);
      }
    });
  });
}

/**
 * Format time from 24h to 12h format
 * @param {string} time24h - Time in 24h format (HH:MM)
 * @returns {string} Time in 12h format
 */
function formatTime(time24h) {
  const [hours, minutes] = time24h.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minutes} ${period}`;
}

/**
 * Show the add class modal
 */
function showAddClassModal() {
  const modal = document.getElementById('class-modal');
  const form = document.getElementById('class-form');
  const title = document.getElementById('class-modal-title');

  // Reset form
  form.reset();
  document.getElementById('class-id').value = '';
  title.textContent = 'Add New Class';

  // Show modal
  modal.classList.add('active');

  // Focus the class name input
  document.getElementById('class-name').focus();

  // Announce for screen readers
  if (window.accessibilityVoice) {
    window.accessibilityVoice.announce('Add new class form opened');
  }
}

/**
 * Show the edit class modal
 * @param {string} classId - The ID of the class to edit
 */
function showEditClassModal(classId) {
  const classObj = scheduleData.classes.find((c) => c.id === classId);

  if (!classObj) return;

  const modal = document.getElementById('class-modal');
  const form = document.getElementById('class-form');
  const title = document.getElementById('class-modal-title');

  // Set form values
  document.getElementById('class-id').value = classObj.id;
  document.getElementById('class-name').value = classObj.name;
  document.getElementById('class-teacher').value = classObj.teacher || '';
  document.getElementById('class-room').value = classObj.room || '';
  document.getElementById('class-notes').value = classObj.notes || '';

  title.textContent = 'Edit Class';

  // Show modal
  modal.classList.add('active');

  // Focus the class name input
  document.getElementById('class-name').focus();

  // Announce for screen readers
  if (window.accessibilityVoice) {
    window.accessibilityVoice.announce(`Editing class ${classObj.name}`);
  }
}

/**
 * Show the assign class modal
 * @param {string} day - The day of the cell
 * @param {string} blockId - The block ID of the cell
 */
function showAssignClassModal(day, blockId) {
  const cellId = `${day}-${blockId}`;
  const currentAssignment = scheduleData.assignments[cellId];
  const block = scheduleData.blocks.find((b) => b.id === blockId);

  const modal = document.getElementById('assignment-modal');
  const form = document.getElementById('assignment-form');
  const title = document.getElementById('assignment-modal-title');
  const classSelect = document.getElementById('assignment-class');

  // Set form values
  document.getElementById('assignment-cell-id').value = cellId;
  document.getElementById('assignment-day').value = day;
  document.getElementById('assignment-block').value = blockId;

  // Update title
  title.textContent = `Assign Class to ${day}, ${block.name}`;

  // Populate class dropdown
  classSelect.innerHTML = '<option value="">Select a class</option>';

  scheduleData.classes.forEach((classObj) => {
    const option = document.createElement('option');
    option.value = classObj.id;
    option.textContent = classObj.name;
    if (currentAssignment && currentAssignment.classId === classObj.id) {
      option.selected = true;
    }
    classSelect.appendChild(option);
  });

  // Set remove button visibility
  const removeBtn = document.getElementById('remove-assignment-btn');
  if (currentAssignment) {
    removeBtn.style.display = 'block';
  } else {
    removeBtn.style.display = 'none';
  }

  // Show modal
  modal.classList.add('active');

  // Announce for screen readers
  if (window.accessibilityVoice) {
    window.accessibilityVoice.announce(`Assign class to ${day}, ${block.name}`);
  }
}

/**
 * Show the edit metadata modal
 */
function showEditMetadataModal() {
  const modal = document.getElementById('metadata-modal');
  const form = document.getElementById('metadata-form');

  // Set form values
  document.getElementById('school-name').value = scheduleData.metadata.schoolName || '';
  document.getElementById('student-name').value = scheduleData.metadata.studentName || '';
  document.getElementById('grade-level').value = scheduleData.metadata.gradeLevel || '';
  document.getElementById('term').value = scheduleData.metadata.term || '';
  document.getElementById('year').value =
    scheduleData.metadata.year || new Date().getFullYear().toString();

  // Show modal
  modal.classList.add('active');

  // Focus the first input
  document.getElementById('school-name').focus();

  // Announce for screen readers
  if (window.accessibilityVoice) {
    window.accessibilityVoice.announce('Edit schedule information form opened');
  }
}

/**
 * Close all modal dialogs
 */
function closeAllModals() {
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.classList.remove('active');
  });
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
function generateId() {
  return 'id_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

/**
 * Handle class form submission
 * @param {Event} e - The submit event
 */
function handleClassFormSubmit(e) {
  e.preventDefault();

  const classId = document.getElementById('class-id').value;
  const className = document.getElementById('class-name').value.trim();
  const teacher = document.getElementById('class-teacher').value.trim();
  const room = document.getElementById('class-room').value.trim();
  const notes = document.getElementById('class-notes').value.trim();

  if (!className) {
    showNotification('Please enter a class name', 'error');
    return;
  }

  // Determine if we're adding or editing
  if (classId) {
    // Find and update existing class
    const index = scheduleData.classes.findIndex((c) => c.id === classId);
    if (index !== -1) {
      scheduleData.classes[index].name = className;
      scheduleData.classes[index].teacher = teacher;
      scheduleData.classes[index].room = room;
      scheduleData.classes[index].notes = notes;

      showNotification('Class updated successfully', 'success');
    }
  } else {
    // Add new class
    const newClass = {
      id: generateId(),
      name: className,
      teacher: teacher,
      room: room,
      notes: notes,
      color: CLASS_COLORS[nextColorIndex],
    };

    // Update next color index for future classes
    nextColorIndex = (nextColorIndex + 1) % CLASS_COLORS.length;

    scheduleData.classes.push(newClass);
    showNotification('Class added successfully', 'success');
  }

  // Save, update display, and close modals
  saveSchedule();
  renderClassList();
  renderScheduleGrid();
  closeAllModals();

  // Announce for screen readers
  if (window.accessibilityVoice) {
    window.accessibilityVoice.announce('Class saved successfully');
  }
}

/**
 * Handle assignment form submission
 * @param {Event} e - The submit event
 */
function handleAssignmentFormSubmit(e) {
  e.preventDefault();

  const cellId = document.getElementById('assignment-cell-id').value;
  const classId = document.getElementById('assignment-class').value;

  if (classId) {
    // Create or update assignment
    scheduleData.assignments[cellId] = {
      classId: classId,
      assignedAt: new Date().toISOString(),
    };

    showNotification('Class assigned successfully', 'success');
  } else {
    // Remove assignment if no class is selected
    delete scheduleData.assignments[cellId];
    showNotification('Assignment removed', 'info');
  }

  // Save, update display, and close modals
  saveSchedule();
  renderScheduleGrid();
  closeAllModals();

  // Announce for screen readers
  if (window.accessibilityVoice) {
    window.accessibilityVoice.announce(
      classId ? 'Class assigned successfully' : 'Assignment removed',
    );
  }
}

/**
 * Handle remove assignment button click
 */
function removeAssignment() {
  const cellId = document.getElementById('assignment-cell-id').value;

  // Remove assignment
  delete scheduleData.assignments[cellId];

  // Save, update display, and close modals
  saveSchedule();
  renderScheduleGrid();
  closeAllModals();

  showNotification('Assignment removed', 'info');

  // Announce for screen readers
  if (window.accessibilityVoice) {
    window.accessibilityVoice.announce('Assignment removed');
  }
}

/**
 * Handle metadata form submission
 * @param {Event} e - The submit event
 */
function handleMetadataFormSubmit(e) {
  e.preventDefault();

  scheduleData.metadata.schoolName = document.getElementById('school-name').value.trim();
  scheduleData.metadata.studentName = document.getElementById('student-name').value.trim();
  scheduleData.metadata.gradeLevel = document.getElementById('grade-level').value.trim();
  scheduleData.metadata.term = document.getElementById('term').value.trim();
  scheduleData.metadata.year = document.getElementById('year').value.trim();

  // Save, update display, and close modals
  saveSchedule();
  updateMetadataDisplay();
  closeAllModals();

  showNotification('Schedule information updated', 'success');

  // Announce for screen readers
  if (window.accessibilityVoice) {
    window.accessibilityVoice.announce('Schedule information updated successfully');
  }
}

/**
 * Update schedule metadata display
 */
function updateMetadataDisplay() {
  const studentNameEl = document.getElementById('display-student-name');
  const gradeLevelEl = document.getElementById('display-grade-level');
  const termEl = document.getElementById('display-term');

  if (studentNameEl) {
    studentNameEl.textContent = scheduleData.metadata.studentName || 'Not set';
  }

  if (gradeLevelEl) {
    gradeLevelEl.textContent = scheduleData.metadata.gradeLevel || 'Not set';
  }

  if (termEl) {
    const termText = scheduleData.metadata.term
      ? `${scheduleData.metadata.term} ${scheduleData.metadata.year}`
      : 'Not set';
    termEl.textContent = termText;
  }
}

/**
 * Delete a class
 * @param {string} classId - The ID of the class to delete
 */
function deleteClass(classId) {
  if (
    !confirm(
      'Are you sure you want to remove this class? This will also remove it from all scheduled blocks.',
    )
  ) {
    return;
  }

  // Find and remove the class
  const index = scheduleData.classes.findIndex((c) => c.id === classId);
  if (index !== -1) {
    scheduleData.classes.splice(index, 1);

    // Remove all assignments for this class
    Object.keys(scheduleData.assignments).forEach((cellId) => {
      if (scheduleData.assignments[cellId].classId === classId) {
        delete scheduleData.assignments[cellId];
      }
    });

    // Save and update display
    saveSchedule();
    renderClassList();
    renderScheduleGrid();

    showNotification('Class removed successfully', 'success');

    // Announce for screen readers
    if (window.accessibilityVoice) {
      window.accessibilityVoice.announce('Class removed successfully');
    }
  }
}

/**
 * Confirm and clear the entire schedule
 */
function confirmClearSchedule() {
  if (
    confirm(
      'Are you sure you want to clear the entire schedule? This will remove all classes and assignments.',
    )
  ) {
    // Reset schedule data but keep the blocks structure
    scheduleData.classes = [];
    scheduleData.assignments = {};
    nextColorIndex = 0;

    // Save and update display
    saveSchedule();
    renderClassList();
    renderScheduleGrid();

    showNotification('Schedule cleared successfully', 'success');

    // Announce for screen readers
    if (window.accessibilityVoice) {
      window.accessibilityVoice.announce('Schedule cleared successfully');
    }
  }
}

/**
 * Load demo schedule with sample classes and assignments
 */
function loadDemoSchedule() {
  if (!confirm('This will replace your current schedule with a demo schedule. Continue?')) {
    return;
  }

  // Reset color index
  nextColorIndex = 0;

  // Create demo classes
  scheduleData.classes = [
    {
      id: 'demo_math',
      name: 'Algebra I',
      teacher: 'Mr. Johnson',
      room: '101',
      notes: 'Bring graphing calculator',
      color: CLASS_COLORS[nextColorIndex++],
    },
    {
      id: 'demo_english',
      name: 'English Literature',
      teacher: 'Ms. Williams',
      room: '203',
      notes: 'Current book: To Kill a Mockingbird',
      color: CLASS_COLORS[nextColorIndex++],
    },
    {
      id: 'demo_science',
      name: 'Biology',
      teacher: 'Dr. Martinez',
      room: '306',
      notes: 'Lab on Tuesdays',
      color: CLASS_COLORS[nextColorIndex++],
    },
    {
      id: 'demo_history',
      name: 'World History',
      teacher: 'Mrs. Thompson',
      room: '204',
      notes: '',
      color: CLASS_COLORS[nextColorIndex++],
    },
    {
      id: 'demo_art',
      name: 'Visual Arts',
      teacher: 'Mr. Lee',
      room: '302',
      notes: 'Bring sketchbook',
      color: CLASS_COLORS[nextColorIndex++],
    },
    {
      id: 'demo_pe',
      name: 'Physical Education',
      teacher: 'Coach Wilson',
      room: 'Gym',
      notes: 'Gym clothes required',
      color: CLASS_COLORS[nextColorIndex++],
    },
    {
      id: 'demo_music',
      name: 'Music',
      teacher: 'Ms. Garcia',
      room: '401',
      notes: '',
      color: CLASS_COLORS[nextColorIndex++],
    },
    {
      id: 'demo_tech',
      name: 'Computer Science',
      teacher: 'Dr. Chen',
      room: '105',
      notes: '',
      color: CLASS_COLORS[nextColorIndex++],
    },
  ];

  // Create demo assignments (A/B schedule)
  scheduleData.assignments = {
    // Monday (A Day)
    'Monday-block1': { classId: 'demo_math', assignedAt: new Date().toISOString() },
    'Monday-block2': { classId: 'demo_english', assignedAt: new Date().toISOString() },
    'Monday-block3': { classId: 'demo_science', assignedAt: new Date().toISOString() },
    'Monday-block5': { classId: 'demo_history', assignedAt: new Date().toISOString() },

    // Tuesday (B Day)
    'Tuesday-block1': { classId: 'demo_art', assignedAt: new Date().toISOString() },
    'Tuesday-block2': { classId: 'demo_pe', assignedAt: new Date().toISOString() },
    'Tuesday-block3': { classId: 'demo_music', assignedAt: new Date().toISOString() },
    'Tuesday-block5': { classId: 'demo_tech', assignedAt: new Date().toISOString() },

    // Wednesday (A Day)
    'Wednesday-block1': { classId: 'demo_math', assignedAt: new Date().toISOString() },
    'Wednesday-block2': { classId: 'demo_english', assignedAt: new Date().toISOString() },
    'Wednesday-block3': { classId: 'demo_science', assignedAt: new Date().toISOString() },
    'Wednesday-block5': { classId: 'demo_history', assignedAt: new Date().toISOString() },

    // Thursday (B Day)
    'Thursday-block1': { classId: 'demo_art', assignedAt: new Date().toISOString() },
    'Thursday-block2': { classId: 'demo_pe', assignedAt: new Date().toISOString() },
    'Thursday-block3': { classId: 'demo_music', assignedAt: new Date().toISOString() },
    'Thursday-block5': { classId: 'demo_tech', assignedAt: new Date().toISOString() },

    // Friday (Mixed)
    'Friday-block1': { classId: 'demo_math', assignedAt: new Date().toISOString() },
    'Friday-block2': { classId: 'demo_art', assignedAt: new Date().toISOString() },
    'Friday-block3': { classId: 'demo_science', assignedAt: new Date().toISOString() },
    'Friday-block5': { classId: 'demo_tech', assignedAt: new Date().toISOString() },
  };

  // Set demo metadata
  scheduleData.metadata = {
    schoolName: 'Neurodivergent Superhero School',
    studentName: 'Alex Johnson',
    gradeLevel: '9th Grade',
    term: 'Fall',
    year: new Date().getFullYear().toString(),
    lastUpdated: new Date().toISOString(),
  };

  // Save and update display
  saveSchedule();
  renderClassList();
  renderScheduleGrid();

  showNotification('Demo schedule loaded successfully', 'success');
}

/**
 * Print the schedule
 */
function printSchedule() {
  // Create print window content
  let printContent = `
    <html>
      <head>
        <title>Block Schedule</title>
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
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .metadata {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            padding: 10px;
            background-color: #f9f9f9;
          }
          .metadata-item {
            margin: 5px 10px;
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
            padding: 10px;
            text-align: center;
          }
          th {
            background-color: #f2f2f2;
          }
          .time-slot {
            text-align: left;
            font-weight: bold;
            width: 15%;
          }
          .block-time {
            font-size: 0.9em;
            color: #666;
          }
          .class-name {
            font-weight: bold;
            margin-bottom: 5px;
          }
          .class-details {
            font-size: 0.8em;
            color: #666;
          }
          .class-teacher, .class-room {
            display: block;
          }
          .class-list {
            margin-top: 30px;
          }
          .class-list h2 {
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .classes-container {
            display: flex;
            flex-wrap: wrap;
          }
          .class-item {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
            margin: 5px;
            width: 250px;
            background-color: #f9f9f9;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 0.9em;
            color: #666;
          }
          @media print {
            body {
              padding: 0;
              background-color: white;
            }
            .no-print {
              display: none;
            }
            table {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Block Schedule</h1>
          <h2>${scheduleData.metadata.schoolName}</h2>
        </div>
        
        <div class="metadata">
          <div class="metadata-item">
            <strong>Student:</strong> ${scheduleData.metadata.studentName || 'Not specified'}
          </div>
          <div class="metadata-item">
            <strong>Grade Level:</strong> ${scheduleData.metadata.gradeLevel || 'Not specified'}
          </div>
          <div class="metadata-item">
            <strong>Term:</strong> ${scheduleData.metadata.term || ''} ${scheduleData.metadata.year || ''}
          </div>
          <div class="metadata-item">
            <strong>Last Updated:</strong> ${new Date(scheduleData.metadata.lastUpdated).toLocaleDateString()}
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Time</th>
  `;

  // Add days as column headers
  scheduleData.days.forEach((day) => {
    printContent += `<th>${day}</th>`;
  });

  printContent += `
            </tr>
          </thead>
          <tbody>
  `;

  // Add rows for each block
  scheduleData.blocks.forEach((block) => {
    printContent += `
      <tr>
        <td class="time-slot">
          <div class="block-name">${block.name}</div>
          <div class="block-time">${formatTime(block.startTime)} - ${formatTime(block.endTime)}</div>
        </td>
    `;

    // Add cells for each day
    scheduleData.days.forEach((day) => {
      const cellId = `${day}-${block.id}`;
      const assignment = scheduleData.assignments[cellId];

      let cellContent = '';
      let cellStyle = '';

      if (assignment) {
        const classObj = scheduleData.classes.find((c) => c.id === assignment.classId);
        if (classObj) {
          cellContent = `
            <div class="class-name">${classObj.name}</div>
            <div class="class-details">
              ${classObj.teacher ? `<span class="class-teacher">${classObj.teacher}</span>` : ''}
              ${classObj.room ? `<span class="class-room">Room ${classObj.room}</span>` : ''}
            </div>
          `;

          // Create a lighter version of the color for printing
          const colorRgb = hexToRgb(classObj.color.bg);
          if (colorRgb) {
            const lightColor = `rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, 0.2)`;
            cellStyle = `background-color: ${lightColor};`;
          }
        }
      }

      printContent += `
        <td style="${cellStyle}">
          ${cellContent}
        </td>
      `;
    });

    printContent += '</tr>';
  });

  printContent += `
          </tbody>
        </table>
        
        <div class="class-list">
          <h2>Classes</h2>
          <div class="classes-container">
  `;

  // Add class list
  scheduleData.classes.forEach((classObj) => {
    printContent += `
      <div class="class-item">
        <div class="class-name">${classObj.name}</div>
        <div class="class-details">
          ${classObj.teacher ? `<strong>Teacher:</strong> ${classObj.teacher}<br>` : ''}
          ${classObj.room ? `<strong>Room:</strong> ${classObj.room}<br>` : ''}
          ${classObj.notes ? `<strong>Notes:</strong> ${classObj.notes}` : ''}
        </div>
      </div>
    `;
  });

  printContent += `
          </div>
        </div>
        
        <div class="footer">
          <p>Printed on ${new Date().toLocaleDateString()} from ShotziOS Education Platform</p>
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
  printWindow.onload = function () {
    printWindow.print();
  };
}

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color code
 * @returns {Object|null} RGB object or null if invalid
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
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

// Initialize schedule builder when the page loads
document.addEventListener('DOMContentLoaded', initScheduleBuilder);
