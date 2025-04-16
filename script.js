document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const coursesContainer = document.getElementById('courses-container');
    const addCourseBtn = document.getElementById('add-course-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsSection = document.getElementById('results-section');
    const gpaResult = document.getElementById('gpa-result');
    const coursesSummary = document.getElementById('courses-summary');
    
    // Track the number of courses
    let courseCount = 0;
    
    // Grade to GPA conversion object
    const gradeToGPA = {
        'A': 4,
        'B': 3,
        'C': 2,
        'D': 1,
        'F': 0
    };
    
    // Initialize with 3 course rows
    for (let i = 0; i < 3; i++) {
        addCourseRow();
    }
    
    // Event listeners
    addCourseBtn.addEventListener('click', addCourseRow);
    calculateBtn.addEventListener('click', calculateGPA);
    
    /**
     * Creates and adds a new course row to the form
     */
    function addCourseRow() {
        courseCount++;
        
        // Create row container
        const courseRow = document.createElement('div');
        courseRow.className = 'course-row';
        courseRow.dataset.id = courseCount;
        
        // Create course name input
        const courseNameGroup = document.createElement('div');
        courseNameGroup.className = 'input-group';
        
        const courseNameLabel = document.createElement('label');
        courseNameLabel.textContent = `Course ${courseCount} Name:`;
        courseNameLabel.setAttribute('for', `course-name-${courseCount}`);
        
        const courseNameInput = document.createElement('input');
        courseNameInput.type = 'text';
        courseNameInput.id = `course-name-${courseCount}`;
        courseNameInput.name = `course-name-${courseCount}`;
        courseNameInput.placeholder = 'e.g. Introduction to Programming';
        courseNameInput.required = true;
        
        courseNameGroup.appendChild(courseNameLabel);
        courseNameGroup.appendChild(courseNameInput);
        
        // Create grade select dropdown
        const gradeGroup = document.createElement('div');
        gradeGroup.className = 'input-group';
        
        const gradeLabel = document.createElement('label');
        gradeLabel.textContent = `Course ${courseCount} Grade:`;
        gradeLabel.setAttribute('for', `course-grade-${courseCount}`);
        
        const gradeSelect = document.createElement('select');
        gradeSelect.id = `course-grade-${courseCount}`;
        gradeSelect.name = `course-grade-${courseCount}`;
        gradeSelect.required = true;
        
        // Add default empty option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Grade';
        defaultOption.selected = true;
        defaultOption.disabled = true;
        gradeSelect.appendChild(defaultOption);
        
        // Add grade options
        for (const grade in gradeToGPA) {
            const option = document.createElement('option');
            option.value = grade;
            option.textContent = grade;
            gradeSelect.appendChild(option);
        }
        
        gradeGroup.appendChild(gradeLabel);
        gradeGroup.appendChild(gradeSelect);
        
        // Add delete button (except for the first 3 rows)
        if (courseCount > 3) {
            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '×';
            deleteBtn.title = 'Remove course';
            deleteBtn.addEventListener('click', function() {
                coursesContainer.removeChild(courseRow);
            });
            
            courseRow.appendChild(courseNameGroup);
            courseRow.appendChild(gradeGroup);
            courseRow.appendChild(deleteBtn);
        } else {
            courseRow.appendChild(courseNameGroup);
            courseRow.appendChild(gradeGroup);
        }
        
        // Add the new row to the container
        coursesContainer.appendChild(courseRow);
    }
    
    /**
     * Calculates the GPA based on entered courses and grades
     */
    function calculateGPA() {
        // Get all course rows
        const courseRows = document.querySelectorAll('.course-row');
        let totalPoints = 0;
        let courseNames = [];
        let courseCount = 0;
        let isValid = true;
        
        // Validate and collect data from each course row
        courseRows.forEach(row => {
            const courseName = row.querySelector('input[type="text"]').value.trim();
            const gradeSelect = row.querySelector('select');
            const grade = gradeSelect.value;
            
            // Skip empty rows
            if (!courseName && !grade) {
                return;
            }
            
            // Validate inputs
            if (!courseName || !grade) {
                isValid = false;
                if (!courseName) {
                    row.querySelector('input[type="text"]').classList.add('error');
                }
                if (!grade) {
                    gradeSelect.classList.add('error');
                }
                return;
            }
            
            // Remove error classes if present
            row.querySelector('input[type="text"]').classList.remove('error');
            gradeSelect.classList.remove('error');
            
            // Add to calculations
            totalPoints += gradeToGPA[grade];
            courseNames.push(`${courseName} (${grade})`);
            courseCount++;
        });
        
        // If validation failed, show alert and return
        if (!isValid) {
            alert('Please fill out all course details (name and grade) before calculating GPA.');
            return;
        }
        
        // If no courses entered, show alert
        if (courseCount === 0) {
            alert('Please enter at least one course to calculate GPA.');
            return;
        }
        
        // Calculate GPA
        const gpa = totalPoints / courseCount;
        
        // Display results
        gpaResult.textContent = gpa.toFixed(2);
        coursesSummary.textContent = `Based on ${courseCount} courses: ${courseNames.join(', ')}`;
        resultsSection.classList.remove('hidden');
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
});
