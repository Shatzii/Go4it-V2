/**
 * ShatziiOS Course Builder
 *
 * This script handles the drag-and-drop functionality and other interactions
 * for the course builder, allowing educators to visually construct courses
 * tailored for neurodivergent learners.
 */

// Initialize the course builder when the document is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  const courseBuilder = (function () {
    // Data structure to store the course state
    let courseData = {
      title: '',
      modules: [],
    };

    // DOM element references
    const elements = {
      courseTitle: document.getElementById('course-title'),
      moduleContainer: document.getElementById('course-modules'),
      addModuleButton: document.getElementById('add-module-button'),
      previewButton: document.getElementById('preview-button'),
      saveButton: document.getElementById('save-button'),
      componentItems: document.querySelectorAll('.component-item'),
      editModal: document.getElementById('edit-modal'),
      modalTitle: document.getElementById('modal-title'),
      modalClose: document.getElementById('modal-close'),
      modalCancel: document.getElementById('modal-cancel'),
      modalSave: document.getElementById('modal-save'),
      itemEditForm: document.getElementById('item-edit-form'),
      additionalFields: document.getElementById('additional-fields'),
    };

    // Track the currently edited item
    let currentEditItem = null;

    /**
     * Initialize the course builder
     */
    function init() {
      // Create a default module if none exists
      if (elements.moduleContainer.children.length === 0) {
        addModule();
      }

      // Set up event listeners
      setupEventListeners();

      // Apply translations if i18n is available
      if (window.ShatziiI18n) {
        window.ShatziiI18n.applyTranslations();
      }

      console.log('Course Builder initialized');
    }

    /**
     * Set up all event listeners for the course builder
     */
    function setupEventListeners() {
      // Course title input
      if (elements.courseTitle) {
        elements.courseTitle.addEventListener('input', function () {
          courseData.title = this.value;
        });
      }

      // Add module button
      if (elements.addModuleButton) {
        elements.addModuleButton.addEventListener('click', addModule);
      }

      // Preview button
      if (elements.previewButton) {
        elements.previewButton.addEventListener('click', previewCourse);
      }

      // Save button
      if (elements.saveButton) {
        elements.saveButton.addEventListener('click', saveCourse);
      }

      // Component drag start events
      elements.componentItems.forEach((item) => {
        item.addEventListener('dragstart', handleComponentDragStart);
        item.addEventListener('dragend', handleDragEnd);
      });

      // Modal close button
      elements.modalClose.addEventListener('click', closeModal);
      elements.modalCancel.addEventListener('click', closeModal);
      elements.modalSave.addEventListener('click', saveItemChanges);

      // Setup delegated events for dynamically created elements
      setupDelegatedEvents();
    }

    /**
     * Set up delegated event listeners for dynamically created elements
     */
    function setupDelegatedEvents() {
      // Module container delegated events
      elements.moduleContainer.addEventListener('click', function (e) {
        const target = e.target;

        // Find the closest ancestor with the specified class
        const toggleButton = target.closest('.toggle-module');
        const moveUpButton = target.closest('.move-module-up');
        const moveDownButton = target.closest('.move-module-down');
        const deleteModuleButton = target.closest('.delete-module');
        const editItemButton = target.closest('.edit-item');
        const deleteItemButton = target.closest('.delete-item');

        if (toggleButton) {
          toggleModule(toggleButton);
        } else if (moveUpButton) {
          moveModuleUp(moveUpButton);
        } else if (moveDownButton) {
          moveModuleDown(moveDownButton);
        } else if (deleteModuleButton) {
          deleteModule(deleteModuleButton);
        } else if (editItemButton) {
          editItem(editItemButton);
        } else if (deleteItemButton) {
          deleteItem(deleteItemButton);
        }
      });

      // Handle drag events on module container
      elements.moduleContainer.addEventListener('dragstart', handleModuleDragStart);
      elements.moduleContainer.addEventListener('dragend', handleDragEnd);
      elements.moduleContainer.addEventListener('dragover', handleDragOver);
      elements.moduleContainer.addEventListener('dragenter', handleDragEnter);
      elements.moduleContainer.addEventListener('dragleave', handleDragLeave);
      elements.moduleContainer.addEventListener('drop', handleDrop);
    }

    /**
     * Create a new module and add it to the course
     */
    function addModule() {
      const moduleId = 'module-' + (courseData.modules.length + 1);
      const moduleNumber = courseData.modules.length + 1;

      // Create module data
      const moduleData = {
        id: moduleId,
        title: `Module ${moduleNumber}: New Module`,
        items: [],
      };

      // Add to course data
      courseData.modules.push(moduleData);

      // Create module element
      const moduleElement = document.createElement('div');
      moduleElement.className = 'course-module';
      moduleElement.id = moduleId;
      moduleElement.setAttribute('data-module-id', moduleId);

      moduleElement.innerHTML = `
        <div class="module-header">
          <h3 contenteditable="true">${moduleData.title}</h3>
          <div class="module-actions">
            <button type="button" title="Expand/Collapse" class="toggle-module">
              <i class="fas fa-chevron-up"></i>
            </button>
            <button type="button" title="Move Up" class="move-module-up">
              <i class="fas fa-arrow-up"></i>
            </button>
            <button type="button" title="Move Down" class="move-module-down">
              <i class="fas fa-arrow-down"></i>
            </button>
            <button type="button" title="Delete Module" class="delete-module">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="module-content">
          <div class="module-items" id="${moduleId}-items">
            <!-- Module items will be added here -->
          </div>
        </div>
      `;

      // Add content editable listener to module title
      const moduleTitle = moduleElement.querySelector('h3[contenteditable]');
      moduleTitle.addEventListener('blur', function () {
        // Update module title in data
        const moduleIndex = courseData.modules.findIndex((m) => m.id === moduleId);
        if (moduleIndex !== -1) {
          courseData.modules[moduleIndex].title = this.textContent;
        }
      });

      // Make module and its items draggable
      moduleElement.setAttribute('draggable', 'true');

      // Add to DOM before the add module button
      elements.moduleContainer.insertBefore(moduleElement, elements.addModuleButton);

      // Update module button visibility
      updateModuleButtonStates();

      return moduleElement;
    }

    /**
     * Toggle module expansion (show/hide content)
     */
    function toggleModule(button) {
      const moduleElement = button.closest('.course-module');
      const moduleContent = moduleElement.querySelector('.module-content');
      const icon = button.querySelector('i');

      if (moduleContent.style.display === 'none') {
        moduleContent.style.display = '';
        icon.className = 'fas fa-chevron-up';
      } else {
        moduleContent.style.display = 'none';
        icon.className = 'fas fa-chevron-down';
      }
    }

    /**
     * Move a module up in the order
     */
    function moveModuleUp(button) {
      const moduleElement = button.closest('.course-module');
      const previousModule = moduleElement.previousElementSibling;

      if (previousModule && previousModule.classList.contains('course-module')) {
        // Move the DOM element
        elements.moduleContainer.insertBefore(moduleElement, previousModule);

        // Update the data order
        reorderModulesInData();

        // Update module button visibility
        updateModuleButtonStates();
      }
    }

    /**
     * Move a module down in the order
     */
    function moveModuleDown(button) {
      const moduleElement = button.closest('.course-module');
      const nextModule = moduleElement.nextElementSibling;

      if (nextModule && nextModule.classList.contains('course-module')) {
        // Get the module after the next module
        const moduleAfterNext = nextModule.nextElementSibling;

        // Move the DOM element
        if (moduleAfterNext) {
          elements.moduleContainer.insertBefore(moduleElement, moduleAfterNext);
        } else {
          elements.moduleContainer.appendChild(moduleElement);
        }

        // Update the data order
        reorderModulesInData();

        // Update module button visibility
        updateModuleButtonStates();
      }
    }

    /**
     * Delete a module
     */
    function deleteModule(button) {
      if (!confirm('Are you sure you want to delete this module? This cannot be undone.')) {
        return;
      }

      const moduleElement = button.closest('.course-module');
      const moduleId = moduleElement.id;

      // Remove from DOM
      moduleElement.remove();

      // Remove from data
      const moduleIndex = courseData.modules.findIndex((m) => m.id === moduleId);
      if (moduleIndex !== -1) {
        courseData.modules.splice(moduleIndex, 1);
      }

      // Update module button visibility
      updateModuleButtonStates();
    }

    /**
     * Update the enabled/disabled state of module movement buttons
     */
    function updateModuleButtonStates() {
      const modules = elements.moduleContainer.querySelectorAll('.course-module');

      modules.forEach((module, index) => {
        const upButton = module.querySelector('.move-module-up');
        const downButton = module.querySelector('.move-module-down');

        // First module can't move up
        if (upButton) {
          upButton.disabled = index === 0;
        }

        // Last module can't move down
        if (downButton) {
          downButton.disabled = index === modules.length - 1;
        }
      });
    }

    /**
     * Reorder modules in the course data to match DOM order
     */
    function reorderModulesInData() {
      const moduleElements = elements.moduleContainer.querySelectorAll('.course-module');
      const newModulesOrder = [];

      moduleElements.forEach((moduleElement) => {
        const moduleId = moduleElement.id;
        const module = courseData.modules.find((m) => m.id === moduleId);
        if (module) {
          newModulesOrder.push(module);
        }
      });

      courseData.modules = newModulesOrder;
    }

    /**
     * Handle the start of dragging a component from the panel
     */
    function handleComponentDragStart(e) {
      this.classList.add('dragging');

      // Store component type in dataTransfer
      const componentType = this.getAttribute('data-component-type');
      e.dataTransfer.setData('application/componentType', componentType);
      e.dataTransfer.setData('application/source', 'componentPanel');

      // Set drag image to the component
      e.dataTransfer.setDragImage(this, 0, 0);

      // Apply custom styling to drag operation
      e.dataTransfer.effectAllowed = 'copy';
    }

    /**
     * Handle the start of dragging modules or items within the course
     */
    function handleModuleDragStart(e) {
      const target = e.target;

      // Check if dragging a module
      if (target.classList.contains('course-module')) {
        // Only allow dragging by the header
        if (!e.target.closest('.module-header')) {
          e.preventDefault();
          return;
        }

        target.classList.add('dragging');
        e.dataTransfer.setData('application/moduleId', target.id);
        e.dataTransfer.setData('application/source', 'moduleContainer');
      }

      // Check if dragging a module item
      else if (target.classList.contains('module-item')) {
        target.classList.add('dragging');
        e.dataTransfer.setData('application/itemId', target.getAttribute('data-item-id'));
        e.dataTransfer.setData('application/itemType', target.getAttribute('data-item-type'));
        e.dataTransfer.setData('application/source', 'moduleItem');
      }
    }

    /**
     * Handle the end of any drag operation
     */
    function handleDragEnd(e) {
      // Remove dragging class from all possible elements
      document.querySelectorAll('.dragging').forEach((el) => {
        el.classList.remove('dragging');
      });

      // Remove any dropzones
      document.querySelectorAll('.dropzone').forEach((el) => {
        el.remove();
      });
    }

    /**
     * Handle elements being dragged over a potential drop target
     */
    function handleDragOver(e) {
      // Prevent default to allow drop
      e.preventDefault();

      // Set drop effect based on source
      const source = e.dataTransfer.getData('application/source');
      e.dataTransfer.dropEffect = source === 'componentPanel' ? 'copy' : 'move';
    }

    /**
     * Handle elements entering a potential drop target
     */
    function handleDragEnter(e) {
      e.preventDefault();

      const target = e.target;

      // Check what's being dragged
      const source = e.dataTransfer.getData('application/source');

      // If a component is being dragged into a module-items container
      if (source === 'componentPanel' && target.classList.contains('module-items')) {
        showDropzoneIn(target);
      }

      // If a module is being dragged
      else if (source === 'moduleContainer' && target.classList.contains('course-module')) {
        showDropzoneBefore(target);
      }

      // If a module item is being dragged
      else if (source === 'moduleItem') {
        if (target.classList.contains('module-item')) {
          showDropzoneBefore(target);
        } else if (target.classList.contains('module-items')) {
          showDropzoneIn(target);
        }
      }
    }

    /**
     * Handle elements leaving a potential drop target
     */
    function handleDragLeave(e) {
      // Don't remove dropzone yet, as we might be hovering over a child element
      // Dropzones will be removed in handleDragEnd
    }

    /**
     * Handle dropping elements at a drop target
     */
    function handleDrop(e) {
      e.preventDefault();

      // Get drop target
      const dropTarget = e.target;

      // Get the source of the drag operation
      const source = e.dataTransfer.getData('application/source');

      // Handle dropping a component from the panel
      if (source === 'componentPanel') {
        const componentType = e.dataTransfer.getData('application/componentType');

        // Find the closest module-items container
        const moduleItemsContainer = dropTarget.closest('.module-items');
        if (moduleItemsContainer) {
          const moduleId = moduleItemsContainer.id.replace('-items', '');
          addComponentToModule(componentType, moduleId, moduleItemsContainer);
        }
      }

      // Handle dropping a module
      else if (source === 'moduleContainer') {
        const moduleId = e.dataTransfer.getData('application/moduleId');
        const moduleElement = document.getElementById(moduleId);

        if (moduleElement) {
          const targetModule = dropTarget.closest('.course-module');

          if (targetModule && targetModule !== moduleElement) {
            // Insert before the target module
            elements.moduleContainer.insertBefore(moduleElement, targetModule);

            // Update the data order
            reorderModulesInData();

            // Update module button visibility
            updateModuleButtonStates();
          }
        }
      }

      // Handle dropping a module item
      else if (source === 'moduleItem') {
        const itemId = e.dataTransfer.getData('application/itemId');
        const itemType = e.dataTransfer.getData('application/itemType');
        const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);

        if (itemElement) {
          // Find the drop target
          const targetItem = dropTarget.closest('.module-item');
          const targetContainer = dropTarget.closest('.module-items');

          if (targetItem && targetItem !== itemElement) {
            // Move before another item
            targetItem.parentNode.insertBefore(itemElement, targetItem);
            updateItemsOrder();
          } else if (targetContainer && !targetItem) {
            // Move to end of a container
            targetContainer.appendChild(itemElement);
            updateItemsOrder();
          }
        }
      }

      // Clean up
      handleDragEnd(e);
    }

    /**
     * Show a dropzone before the specified element
     */
    function showDropzoneBefore(element) {
      // Remove any existing dropzones
      document.querySelectorAll('.dropzone').forEach((el) => {
        el.remove();
      });

      // Create a new dropzone
      const dropzone = document.createElement('div');
      dropzone.className = 'dropzone';
      dropzone.textContent = 'Drop Here';

      // Insert before the element
      element.parentNode.insertBefore(dropzone, element);
    }

    /**
     * Show a dropzone inside a container
     */
    function showDropzoneIn(container) {
      // Remove any existing dropzones
      container.querySelectorAll('.dropzone').forEach((el) => {
        el.remove();
      });

      // Create a new dropzone
      const dropzone = document.createElement('div');
      dropzone.className = 'dropzone';
      dropzone.textContent = 'Drop Here';

      // Append to the container
      container.appendChild(dropzone);
    }

    /**
     * Add a component to a module
     */
    function addComponentToModule(componentType, moduleId, containerElement) {
      // Find the module in our data
      const moduleIndex = courseData.modules.findIndex((m) => m.id === moduleId);
      if (moduleIndex === -1) return;

      // Create a new item ID
      const itemId = `item-${Date.now()}`;

      // Get default title and description based on component type
      const { title, description } = getDefaultContentForType(componentType);

      // Create the item in our data
      const newItem = {
        id: itemId,
        type: componentType,
        title: title,
        description: description,
        content: '',
        settings: {},
      };

      // Add to module data
      courseData.modules[moduleIndex].items.push(newItem);

      // Create the DOM element
      const itemElement = document.createElement('div');
      itemElement.className = 'module-item';
      itemElement.setAttribute('draggable', 'true');
      itemElement.setAttribute('data-item-id', itemId);
      itemElement.setAttribute('data-item-type', componentType);

      // Set the content
      itemElement.innerHTML = `
        <div class="module-item-icon">
          <i class="${getIconForComponentType(componentType)}"></i>
        </div>
        <div class="module-item-content">
          <div class="module-item-title">${title}</div>
          <div class="module-item-description">${description}</div>
        </div>
        <div class="module-item-actions">
          <button type="button" title="Edit Item" class="edit-item">
            <i class="fas fa-edit"></i>
          </button>
          <button type="button" title="Delete Item" class="delete-item">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;

      // Add to DOM
      containerElement.appendChild(itemElement);

      // Open the editor for the new item
      editItem(itemElement.querySelector('.edit-item'));
    }

    /**
     * Get default content for a component type
     */
    function getDefaultContentForType(type) {
      const defaults = {
        text: {
          title: 'Text Content',
          description: 'Add paragraphs, headings, and formatted text',
        },
        image: {
          title: 'Image',
          description: 'Upload or embed an image',
        },
        video: {
          title: 'Video',
          description: 'Upload or embed a video',
        },
        audio: {
          title: 'Audio',
          description: 'Upload or embed audio content',
        },
        quiz: {
          title: 'Quiz',
          description: 'Create a quiz with various question types',
        },
        assignment: {
          title: 'Assignment',
          description: 'Create an assignment for students',
        },
        discussion: {
          title: 'Discussion',
          description: 'Create a discussion topic for students',
        },
        poll: {
          title: 'Poll',
          description: 'Create a poll for student feedback',
        },
        visualization: {
          title: 'Visualization',
          description: 'Add charts, diagrams, or other visualizations',
        },
        flashcards: {
          title: 'Flashcards',
          description: 'Create flashcards for review and practice',
        },
        mindmap: {
          title: 'Mind Map',
          description: 'Create a visual mind map of concepts',
        },
        timeline: {
          title: 'Timeline',
          description: 'Create a visual timeline of events',
        },
        summary: {
          title: 'Key Points',
          description: 'Summarize key concepts and takeaways',
        },
        glossary: {
          title: 'Glossary',
          description: 'Define key terms used in the course',
        },
        break: {
          title: 'Break Time',
          description: 'Scheduled break or pause in content',
        },
        alternative: {
          title: 'Alternative Format',
          description: 'Provide content in multiple formats for accessibility',
        },
      };

      return defaults[type] || { title: 'New Item', description: 'Add a description' };
    }

    /**
     * Get icon class for a component type
     */
    function getIconForComponentType(type) {
      const icons = {
        text: 'fas fa-align-left',
        image: 'fas fa-image',
        video: 'fas fa-video',
        audio: 'fas fa-volume-up',
        quiz: 'fas fa-question-circle',
        assignment: 'fas fa-tasks',
        discussion: 'fas fa-comments',
        poll: 'fas fa-poll',
        visualization: 'fas fa-chart-bar',
        flashcards: 'fas fa-clone',
        mindmap: 'fas fa-project-diagram',
        timeline: 'fas fa-stream',
        summary: 'fas fa-list',
        glossary: 'fas fa-book',
        break: 'fas fa-coffee',
        alternative: 'fas fa-universal-access',
      };

      return icons[type] || 'fas fa-file';
    }

    /**
     * Edit an item
     */
    function editItem(button) {
      const itemElement = button.closest('.module-item');
      const itemId = itemElement.getAttribute('data-item-id');
      const itemType = itemElement.getAttribute('data-item-type');

      // Find the item in our data
      let item = null;
      let moduleIndex = -1;
      let itemIndex = -1;

      for (let i = 0; i < courseData.modules.length; i++) {
        const module = courseData.modules[i];
        const index = module.items.findIndex((item) => item.id === itemId);

        if (index !== -1) {
          item = module.items[index];
          moduleIndex = i;
          itemIndex = index;
          break;
        }
      }

      if (!item) return;

      // Store reference to the current item being edited
      currentEditItem = {
        element: itemElement,
        item: item,
        moduleIndex: moduleIndex,
        itemIndex: itemIndex,
      };

      // Set modal title based on component type
      elements.modalTitle.textContent = `Edit ${item.title} (${itemType})`;

      // Populate form fields
      document.getElementById('item-title').value = item.title;
      document.getElementById('item-description').value = item.description;
      document.getElementById('item-content').value = item.content || '';

      // Add type-specific fields
      addTypeSpecificFields(itemType, item.settings);

      // Show the modal
      elements.editModal.classList.add('active');
    }

    /**
     * Add type-specific fields to the edit form
     */
    function addTypeSpecificFields(type, settings) {
      // Clear existing fields
      elements.additionalFields.innerHTML = '';

      // Add fields based on type
      switch (type) {
        case 'image':
          elements.additionalFields.innerHTML = `
            <div class="form-group">
              <label for="item-image-url">Image URL</label>
              <input type="text" id="item-image-url" value="${settings.url || ''}">
            </div>
            <div class="form-group">
              <label for="item-image-alt">Alt Text (for accessibility)</label>
              <input type="text" id="item-image-alt" value="${settings.alt || ''}">
            </div>
          `;
          break;

        case 'video':
          elements.additionalFields.innerHTML = `
            <div class="form-group">
              <label for="item-video-url">Video URL</label>
              <input type="text" id="item-video-url" value="${settings.url || ''}">
            </div>
            <div class="form-group">
              <label for="item-video-captions">Enable Captions</label>
              <input type="checkbox" id="item-video-captions" ${settings.captions ? 'checked' : ''}>
            </div>
          `;
          break;

        case 'audio':
          elements.additionalFields.innerHTML = `
            <div class="form-group">
              <label for="item-audio-url">Audio URL</label>
              <input type="text" id="item-audio-url" value="${settings.url || ''}">
            </div>
            <div class="form-group">
              <label for="item-audio-transcript">Provide Transcript</label>
              <input type="checkbox" id="item-audio-transcript" ${settings.transcript ? 'checked' : ''}>
            </div>
          `;
          break;

        case 'quiz':
          elements.additionalFields.innerHTML = `
            <div class="form-group">
              <label for="item-quiz-type">Quiz Type</label>
              <select id="item-quiz-type">
                <option value="multiple-choice" ${settings.quizType === 'multiple-choice' ? 'selected' : ''}>Multiple Choice</option>
                <option value="true-false" ${settings.quizType === 'true-false' ? 'selected' : ''}>True/False</option>
                <option value="matching" ${settings.quizType === 'matching' ? 'selected' : ''}>Matching</option>
                <option value="short-answer" ${settings.quizType === 'short-answer' ? 'selected' : ''}>Short Answer</option>
              </select>
            </div>
            <div class="form-group">
              <label for="item-quiz-attempts">Number of Attempts Allowed</label>
              <input type="number" id="item-quiz-attempts" min="1" value="${settings.attempts || 1}">
            </div>
          `;
          break;

        // Add more cases for other component types as needed
      }
    }

    /**
     * Save changes to the edited item
     */
    function saveItemChanges() {
      if (!currentEditItem) return;

      // Get values from form
      const title = document.getElementById('item-title').value;
      const description = document.getElementById('item-description').value;
      const content = document.getElementById('item-content').value;

      // Update the item data
      currentEditItem.item.title = title;
      currentEditItem.item.description = description;
      currentEditItem.item.content = content;

      // Get type-specific settings
      const type = currentEditItem.item.type;
      const settings = {};

      switch (type) {
        case 'image':
          settings.url = document.getElementById('item-image-url').value;
          settings.alt = document.getElementById('item-image-alt').value;
          break;

        case 'video':
          settings.url = document.getElementById('item-video-url').value;
          settings.captions = document.getElementById('item-video-captions').checked;
          break;

        case 'audio':
          settings.url = document.getElementById('item-audio-url').value;
          settings.transcript = document.getElementById('item-audio-transcript').checked;
          break;

        case 'quiz':
          settings.quizType = document.getElementById('item-quiz-type').value;
          settings.attempts = document.getElementById('item-quiz-attempts').value;
          break;

        // Add more cases for other component types as needed
      }

      // Update settings
      currentEditItem.item.settings = settings;

      // Update the DOM element
      const titleElement = currentEditItem.element.querySelector('.module-item-title');
      const descriptionElement = currentEditItem.element.querySelector('.module-item-description');

      if (titleElement) titleElement.textContent = title;
      if (descriptionElement) descriptionElement.textContent = description;

      // Close the modal
      closeModal();
    }

    /**
     * Delete an item
     */
    function deleteItem(button) {
      if (!confirm('Are you sure you want to delete this item? This cannot be undone.')) {
        return;
      }

      const itemElement = button.closest('.module-item');
      const itemId = itemElement.getAttribute('data-item-id');

      // Remove from DOM
      itemElement.remove();

      // Remove from data
      for (let i = 0; i < courseData.modules.length; i++) {
        const module = courseData.modules[i];
        const index = module.items.findIndex((item) => item.id === itemId);

        if (index !== -1) {
          module.items.splice(index, 1);
          break;
        }
      }
    }

    /**
     * Update the order of items in the data to match the DOM
     */
    function updateItemsOrder() {
      // For each module, get the items in the DOM and update the data
      courseData.modules.forEach((module) => {
        const moduleItemsContainer = document.getElementById(`${module.id}-items`);

        if (moduleItemsContainer) {
          const itemElements = moduleItemsContainer.querySelectorAll('.module-item');
          const newItemsOrder = [];

          itemElements.forEach((itemElement) => {
            const itemId = itemElement.getAttribute('data-item-id');
            const item = module.items.find((i) => i.id === itemId);

            if (item) {
              newItemsOrder.push(item);
            }
          });

          module.items = newItemsOrder;
        }
      });
    }

    /**
     * Close the edit modal
     */
    function closeModal() {
      elements.editModal.classList.remove('active');
      currentEditItem = null;
    }

    /**
     * Preview the course
     */
    function previewCourse() {
      console.log('Preview Course:', courseData);
      alert('Course preview feature coming soon!');

      // In a real implementation, this would open a preview window or navigate to a preview page
    }

    /**
     * Save the course
     */
    function saveCourse() {
      // Ensure course title is set
      courseData.title = elements.courseTitle.value;

      // Get accessibility settings
      courseData.accessibility = {
        dyslexiaSupport: document.getElementById('dyslexia-support').checked,
        adhdSupport: document.getElementById('adhd-support').checked,
        autismSupport: document.getElementById('autism-support').checked,
        textToSpeech: document.getElementById('text-to-speech').checked,
        visualSupports: document.getElementById('visual-supports').checked,
        multipleFormats: document.getElementById('multiple-formats').checked,
        simplifiedLanguage: document.getElementById('simplified-language').checked,
        progressTracking: document.getElementById('progress-tracking').checked,
      };

      console.log('Save Course:', courseData);

      // In a real implementation, this would send the course data to the server
      // For now, we'll just show a success message
      alert('Course saved successfully!');

      // Optionally, store in localStorage for demonstration purposes
      localStorage.setItem('savedCourse', JSON.stringify(courseData));
    }

    /**
     * Load a course from saved data
     */
    function loadCourse(savedData) {
      // Reset the builder
      elements.courseTitle.value = '';
      elements.moduleContainer.innerHTML = '';
      courseData = { title: '', modules: [] };

      // Set course title
      elements.courseTitle.value = savedData.title;
      courseData.title = savedData.title;

      // Create modules
      savedData.modules.forEach((moduleData) => {
        // Add module to data
        courseData.modules.push({ ...moduleData });

        // Create module element
        const moduleElement = document.createElement('div');
        moduleElement.className = 'course-module';
        moduleElement.id = moduleData.id;
        moduleElement.setAttribute('data-module-id', moduleData.id);

        moduleElement.innerHTML = `
          <div class="module-header">
            <h3 contenteditable="true">${moduleData.title}</h3>
            <div class="module-actions">
              <button type="button" title="Expand/Collapse" class="toggle-module">
                <i class="fas fa-chevron-up"></i>
              </button>
              <button type="button" title="Move Up" class="move-module-up">
                <i class="fas fa-arrow-up"></i>
              </button>
              <button type="button" title="Move Down" class="move-module-down">
                <i class="fas fa-arrow-down"></i>
              </button>
              <button type="button" title="Delete Module" class="delete-module">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="module-content">
            <div class="module-items" id="${moduleData.id}-items">
              <!-- Module items will be added here -->
            </div>
          </div>
        `;

        // Add content editable listener to module title
        const moduleTitle = moduleElement.querySelector('h3[contenteditable]');
        moduleTitle.addEventListener('blur', function () {
          // Update module title in data
          const moduleIndex = courseData.modules.findIndex((m) => m.id === moduleData.id);
          if (moduleIndex !== -1) {
            courseData.modules[moduleIndex].title = this.textContent;
          }
        });

        // Make module draggable
        moduleElement.setAttribute('draggable', 'true');

        // Add to DOM
        elements.moduleContainer.insertBefore(moduleElement, elements.addModuleButton);

        // Add items to module
        const moduleItemsContainer = moduleElement.querySelector('.module-items');

        moduleData.items.forEach((itemData) => {
          // Create item element
          const itemElement = document.createElement('div');
          itemElement.className = 'module-item';
          itemElement.setAttribute('draggable', 'true');
          itemElement.setAttribute('data-item-id', itemData.id);
          itemElement.setAttribute('data-item-type', itemData.type);

          // Set content
          itemElement.innerHTML = `
            <div class="module-item-icon">
              <i class="${getIconForComponentType(itemData.type)}"></i>
            </div>
            <div class="module-item-content">
              <div class="module-item-title">${itemData.title}</div>
              <div class="module-item-description">${itemData.description}</div>
            </div>
            <div class="module-item-actions">
              <button type="button" title="Edit Item" class="edit-item">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" title="Delete Item" class="delete-item">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;

          // Add to DOM
          moduleItemsContainer.appendChild(itemElement);
        });
      });

      // Set accessibility settings
      if (savedData.accessibility) {
        document.getElementById('dyslexia-support').checked =
          savedData.accessibility.dyslexiaSupport;
        document.getElementById('adhd-support').checked = savedData.accessibility.adhdSupport;
        document.getElementById('autism-support').checked = savedData.accessibility.autismSupport;
        document.getElementById('text-to-speech').checked = savedData.accessibility.textToSpeech;
        document.getElementById('visual-supports').checked = savedData.accessibility.visualSupports;
        document.getElementById('multiple-formats').checked =
          savedData.accessibility.multipleFormats;
        document.getElementById('simplified-language').checked =
          savedData.accessibility.simplifiedLanguage;
        document.getElementById('progress-tracking').checked =
          savedData.accessibility.progressTracking;
      }

      // Update module button visibility
      updateModuleButtonStates();
    }

    // Check for previously saved course (for demonstration)
    function checkForSavedCourse() {
      const savedCourse = localStorage.getItem('savedCourse');
      if (savedCourse) {
        try {
          const savedData = JSON.parse(savedCourse);

          if (confirm('A previously saved course was found. Would you like to load it?')) {
            loadCourse(savedData);
            return true;
          }
        } catch (error) {
          console.error('Error parsing saved course:', error);
        }
      }

      return false;
    }

    // Initialize the builder
    init();

    // Check for saved course
    if (!checkForSavedCourse()) {
      // If no saved course or user declined, create a default module
      if (courseData.modules.length === 0) {
        addModule();
      }
    }

    // Return public methods (if any needed for external access)
    return {
      saveCourse,
      previewCourse,
    };
  })();
});
