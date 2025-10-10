
const assessmentAreas = [
    'Physical skills',
    'Psychosocial status',
    'Cognitive function',
    'Intellectual function',
    'Behaviour',
    'Sensory preferences',
    'Communication',
    'Walking and moving',
    'Indoor mobility',
    'Outdoor mobility',
    'Stairs/steps',
    'Transport',
    'Chair transfers and seating needs',
    'Bed transfers and mobility',
    'Toilet transfers and toileting',
    'Bathing transfers, bathing and grooming',
    'Dressing',
    'Nutrition, feeding and swallowing',
    'Sleeping and night needs',
    'Managing medical and basic needs',
    'Cooking and preparing food',
    'Shopping',
    'Cleaning and maintaining the home',
    'Paying bills and life administration',
    'Social relationships',
    'Vocational roles',
    'Hobbies and community integration'
];

let customSubsectionCounter = 0;
let autoSaveTimeout;

// Auto-resize textareas
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

// Initialize all textareas for auto-resize
function initTextareas() {
    const textareas = document.getElementsByTagName('textarea');
    for (let i = 0; i < textareas.length; i++) {
        const ta = textareas[i];
        ta.addEventListener('input', function () {
            autoResizeTextarea(this);
        });
        autoResizeTextarea(ta);
    }
}

// Make title editable
function makeEditable(element, id, isRecommendation = false) {
    element.contentEditable = true;
    element.classList.add('editable');

    element.addEventListener('click', function () {
        this.classList.add('editing');
    });

    element.addEventListener('blur', function () {
        this.classList.remove('editing');
        autoSave();
    });

    element.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.blur();
        }
    });
}

// Initialize assessment subsections
function initializeAssessmentSubsections() {
    const container = document.getElementById('assessmentSubsections');
    assessmentAreas.forEach((area, index) => {
        container.appendChild(createAssessmentSubsection(area, `area${index}`));
    });
    setTimeout(initTextareas, 100);
}

function createAssessmentSubsection(title, id) {
    const subsection = document.createElement('div');
    subsection.className = 'subsection no-print';
    subsection.id = id;
    subsection.innerHTML = `
                <div class="subsection-header">
                    <h3 class="subsection-title" id="${id}_title">${title}</h3>
                    <div class="subsection-controls no-print">
                        <button class="icon-btn" onclick="toggleSubsection('${id}')" title="Show Guidance">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <button class="icon-btn" onclick="toggleHideSection('${id}')" title="Hide in Print">
                            <i class="fas fa-eye-slash"></i>
                        </button>
                         <button class="icon-btn" onclick="toggleSupervisorComment('${id}')" title="Supervisor comment">
                                <i class="fas fa-comment"></i>
                            </button>
                        <button class="icon-btn"  onclick="toggleGuidance('${id}')" title="Show Guidance">
                            <i class="fas fa-lightbulb"></i>
                        </button>
                        ${id.startsWith('custom') ? `<button class="icon-btn" onclick="deleteCustomSection('${id}')" title="Delete section"><i class="fas fa-trash"></i></button>` : ''}
                    </div>
                </div>
                <div class="subsection-content" style="display: none;">
                    <div class="guidance-field" id="${id}_guidance" style="display: none;">
                        <label><i class="fas fa-lightbulb"></i> Guidance</label>
                        <textarea id="${id}_guidance_text" onchange="autoSave()" placeholder="Enter guidance text to help complete this section...">Complete guidance text will be added here. This field helps assessors understand what information should be included in this section.</textarea>
                    </div>
                    <div class="field-group">
                        <textarea id="${id}_comment" onchange="autoSave()" placeholder="Enter assessment notes..."></textarea>
                    </div>
                    <div class="checkbox-container no-print">
                        <input type="checkbox" id="${id}_recommend" onchange="toggleRecommendation('${id}', '${title}')">
                        <label for="${id}_recommend">Add to recommendations</label>
                    </div>
                    <div class="rating-scales">
                        <div class="rating-item">
                            <label>FIM Scale (1-7)</label>
                            <input type="number" id="${id}_fim" min="1" max="7" onchange="autoSave(); updateFundingTable()">
                        </div>
                        <div class="rating-item">
                            <label>COPM Performance</label>
                            <input type="number" id="${id}_copm_perf" min="1" max="10" onchange="autoSave(); updateFundingTable()">
                        </div>
                        <div class="rating-item">
                            <label>COPM Satisfaction</label>
                            <input type="number" id="${id}_copm_sat" min="1" max="10" onchange="autoSave(); updateFundingTable()">
                        </div>
                    </div>
                    <div class="supervisor-comment" id="${id}_supervisor" style="display: none;">
                        <label>Supervisor Comment</label>
                        <textarea id="${id}_supervisor_text" onchange="autoSave()" placeholder="Enter supervisor comments..."></textarea>
                    </div>
                </div>
            `;

    setTimeout(() => {
        const titleElement = document.getElementById(`${id}_title`);
        if (titleElement) {
            makeEditable(titleElement, id);
        }
        initTextareas();
    }, 100);

    return subsection;
}
function toggleSubsection(id) {
    const subsection = document.getElementById(id);

    const subsectionControls = document.querySelector(` #${id} .subsection-controls`);
    const subsectionContent = document.querySelector(`#${id} .subsection-content`);
    const isVisible = subsectionContent.style.display === 'none';
    if (isVisible) {
        subsection.classList.remove('no-print'); // show in print when visible
    } else {
        subsection.classList.add('no-print'); // hide in print when collapsed
    }

    subsectionContent.style.display = isVisible ? 'block' : 'none';
    const toggleBtn = subsectionControls.querySelector('.fa-chevron-down');
    toggleBtn.style.transform = isVisible ? 'rotate(180deg)' : 'rotate(0deg)';








    setTimeout(initTextareas, 100);
    autoSave();


}
function addCustomSubsection() {
    const title = prompt('Enter custom section title:');
    if (title) {
        const id = `custom${customSubsectionCounter++}`;
        const container = document.getElementById('assessmentSubsections');
        container.appendChild(createAssessmentSubsection(title, id));
        autoSave();
    }
}

function deleteCustomSection(id) {
    if (confirm('Delete this section?')) {
        document.getElementById(id).remove();
        autoSave();
    }
}

function toggleHideSection(id) {
    const section = document.getElementById(id);
    section.classList.toggle('hidden-section');
    autoSave();
}

function toggleSupervisorComment(id) {
    const comment = document.getElementById(`${id}_supervisor`);
    comment.style.display = comment.style.display === 'none' ? 'block' : 'none';
    setTimeout(initTextareas, 100);
}

function toggleGuidance(id) {
    const guidance = document.getElementById(`${id}_guidance`);
    guidance.style.display = guidance.style.display === 'none' ? 'block' : 'none';
    setTimeout(initTextareas, 100);
}

function toggleRecommendation(id, title) {
    const checkbox = document.getElementById(`${id}_recommend`);
    const recSection = document.getElementById('recommendationsSection');

    if (checkbox.checked) {
        const recDiv = document.createElement('div');
        recDiv.className = 'recommendation-entry';
        recDiv.id = `rec_${id}`;
        recDiv.innerHTML = `
                    <h4 id="rec_${id}_title">${title}</h4>
                    <div class="field-group">
                        <label>Goal</label>
                        <textarea id="${id}_rec_goal" onchange="autoSave()"></textarea>
                    </div>
                    <div class="two-column">
                        <div class="field-group">
                            <label>Effective and Beneficial</label>
                            <textarea id="${id}_rec_effective" onchange="autoSave()"></textarea>
                        </div>
                        <div class="field-group">
                            <label>Related to Disability</label>
                            <textarea id="${id}_rec_disability" onchange="autoSave()"></textarea>
                        </div>
                        <div class="field-group">
                            <label>Related to Goals</label>
                            <textarea id="${id}_rec_goals" onchange="autoSave()"></textarea>
                        </div>
                        <div class="field-group">
                            <label>Value for Money</label>
                            <textarea id="${id}_rec_value" onchange="autoSave()"></textarea>
                        </div>
                    </div>
                    <div class="field-group">
                        <label><strong>Funding</strong></label>
                        <div id="${id}_funding_lines"></div>
                        <div class="add-remove-btns no-print">
                            <button class="small-btn" onclick="addFundingLine('${id}')">
                                <i class="fas fa-plus"></i> Add Funding Line
                            </button>
                        </div>
                    </div>
                `;
        recSection.appendChild(recDiv);

        setTimeout(() => {
            const recTitle = document.getElementById(`rec_${id}_title`);
            if (recTitle) {
                makeEditable(recTitle, `rec_${id}`, true);
            }
            initTextareas();
        }, 100);
    } else {
        const recDiv = document.getElementById(`rec_${id}`);
        if (recDiv) recDiv.remove();
    }
    autoSave();
}

function addFundingLine(id) {
    const container = document.getElementById(`${id}_funding_lines`);
    const lineId = `${id}_funding_${Date.now()}`;
    const line = document.createElement('div');
    line.className = 'funding-line';
    line.id = lineId;
    line.innerHTML = `
                <input type="text" placeholder="Funding Area" onchange="autoSave()">
                <input type="text" placeholder="Funding Type" onchange="autoSave()">
                <input type="text" placeholder="Hours/Budget" onchange="autoSave()">
                <button class="small-btn delete no-print" onclick="document.getElementById('${lineId}').remove(); autoSave()">
                    <i class="fas fa-trash"></i>
                </button>
            `;
    container.appendChild(line);
    autoSave();
}

function addAdvocateLine() {
    const container = document.getElementById('advocatesContainer');
    const lineId = `advocate_${Date.now()}`;
    const line = document.createElement('div');
    line.className = 'dynamic-line';
    line.id = lineId;
    line.innerHTML = `
                <div class="field-group">
                    <label>Contact Person Name</label>
                    <input type="text" onchange="autoSave()">
                </div>
                <div class="field-group">
                    <label>Relationship</label>
                    <input type="text" onchange="autoSave()">
                </div>
                <button class="small-btn delete no-print" onclick="document.getElementById('${lineId}').remove(); autoSave()">
                    <i class="fas fa-trash"></i>
                </button>
            `;
    container.appendChild(line);
    autoSave();
}

function addSignOffLine() {
    const container = document.getElementById('signOffSection');
    const lineId = `signoff_${Date.now()}`;
    const line = document.createElement('div');
    line.className = 'subsection';
    line.id = lineId;
    line.innerHTML = `
                <div class="two-column">
                    <div class="field-group">
                        <label>Name</label>
                        <input type="text" onchange="autoSave(); updateCoverPage()">
                    </div>
                    <div class="field-group">
                        <label>AHPRA/SPA Number</label>
                        <input type="text" onchange="autoSave()">
                    </div>
                    <div class="field-group">
                        <label>Profession</label>
                        <input type="text" onchange="autoSave()">
                    </div>
                    <div class="field-group">
                        <label>Date</label>
                        <input type="date" onchange="autoSave(); updateCoverPage()">
                    </div>
                </div>
                <button class="small-btn delete no-print" onclick="document.getElementById('${lineId}').remove(); autoSave(); updateCoverPage()">
                    <i class="fas fa-trash"></i> Remove
                </button>
            `;
    container.appendChild(line);
    autoSave();
}

function toggleStandardisedAssessment() {
    const checkbox = document.getElementById('standardisedAssessmentToggle');
    const section = document.getElementById('standardisedAssessmentSection');
    const parent = checkbox.closest('.section');
    // Show or hide the section
    section.style.display = checkbox.checked ? 'block' : 'none';

    // Add/remove the "no-print" class from parent
    if (parent) {
        if (checkbox.checked) {
            parent.classList.remove('no-print');
        } else {
            parent.classList.add('no-print');
        }
    }

    setTimeout(initTextareas, 100);
    autoSave();
}

function updateFundingTable() {
    const tableBody = document.getElementById('fundingTableBody');
    tableBody.innerHTML = '';

    assessmentAreas.forEach((area, index) => {
        const id = `area${index}`;
        const titleElement = document.getElementById(`${id}_title`);
        const displayTitle = titleElement ? titleElement.textContent : area;
        const fim = document.getElementById(`${id}_fim`)?.value;
        const perf = document.getElementById(`${id}_copm_perf`)?.value;
        const sat = document.getElementById(`${id}_copm_sat`)?.value;

        if (fim || perf || sat) {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td><strong>${displayTitle}</strong></td>
                        <td class="${fim ? 'score-cell' : 'empty-score'}">${fim || '-'}</td>
                        <td class="${perf ? 'score-cell' : 'empty-score'}">${perf || '-'}</td>
                        <td class="${sat ? 'score-cell' : 'empty-score'}">${sat || '-'}</td>
                    `;
            tableBody.appendChild(row);
        }
    });

    document.querySelectorAll('[id^="custom"]').forEach(section => {
        const id = section.id;
        if (section.classList.contains('subsection')) {
            const titleElement = section.querySelector('.subsection-title');
            const title = titleElement?.textContent;
            const fim = document.getElementById(`${id}_fim`)?.value;
            const perf = document.getElementById(`${id}_copm_perf`)?.value;
            const sat = document.getElementById(`${id}_copm_sat`)?.value;

            if (fim || perf || sat) {
                const row = document.createElement('tr');
                row.innerHTML = `
                            <td><strong>${title}</strong></td>
                            <td class="${fim ? 'score-cell' : 'empty-score'}">${fim || '-'}</td>
                            <td class="${perf ? 'score-cell' : 'empty-score'}">${perf || '-'}</td>
                            <td class="${sat ? 'score-cell' : 'empty-score'}">${sat || '-'}</td>
                        `;
                tableBody.appendChild(row);
            }
        }
    });

    if (tableBody.children.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td colspan="4" style="text-align: center; padding: 30px; color: #999;">
                        No assessment scores entered yet
                    </td>
                `;
        tableBody.appendChild(row);
    }
}

function updateCoverPage() {
    const clientName = document.getElementById('clientName')?.value || '_________________';
    document.getElementById('coverClientName').textContent = clientName;
    document.getElementById('footerClientName').textContent = clientName;

    const signOffSection = document.getElementById('signOffSection');
    const dates = [];
    signOffSection.querySelectorAll('input[type="date"]').forEach(input => {
        if (input.value) dates.push(new Date(input.value));
    });

    let reportDate;
    if (dates.length > 0) {
        const latestDate = new Date(Math.max(...dates));
        reportDate = latestDate.toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } else {
        // Use current date if no sign-off dates exist
        const currentDate = new Date();
        reportDate = currentDate.toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    document.getElementById('coverReportDate').textContent = reportDate;
}

function autoSave() {
    const indicator = document.getElementById('autoSaveIndicator');
    const text = document.getElementById('autoSaveText');

    indicator.className = 'auto-save-indicator saving';
    text.textContent = 'Saving...';

    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        const data = collectAllData();
        localStorage.setItem('ndis_fca_data', JSON.stringify(data));

        indicator.className = 'auto-save-indicator saved';
        text.textContent = 'Saved';

        setTimeout(() => {
            indicator.className = 'auto-save-indicator';
            text.textContent = 'Auto-save enabled';
        }, 2000);
    }, 1000);
}



function collectAllData() {
    const data = {
        clientInfo: {},
        advocates: {},
        ndisInfo: {},
        assessmentDetails: {},
        context: {},
        assessmentAreas: [],
        customSections: [],
        summary: {},
        signOff: [],
        recommendations: []
    };

    // Collect all input fields
    document.querySelectorAll('input, textarea, select').forEach(el => {
        if (el.id && el.value) {
            data.clientInfo[el.id] = el.value;
        }
    });

    // Collect assessment areas with ratings
    assessmentAreas.forEach((area, index) => {
        const id = `area${index}`;
        const areaData = {
            id: id,
            title: area,
            comment: document.getElementById(`${id}_comment`)?.value || '',
            fim: document.getElementById(`${id}_fim`)?.value || '',
            copmPerf: document.getElementById(`${id}_copm_perf`)?.value || '',
            copmSat: document.getElementById(`${id}_copm_sat`)?.value || '',
            supervisorComment: document.getElementById(`${id}_supervisor_text`)?.value || '',
            hidden: document.getElementById(id)?.classList.contains('hidden-section'),
            hasRecommendation: document.getElementById(`${id}_recommend`)?.checked || false
        };

        if (areaData.hasRecommendation) {
            areaData.recommendation = {
                goal: document.getElementById(`${id}_rec_goal`)?.value || '',
                effective: document.getElementById(`${id}_rec_effective`)?.value || '',
                disability: document.getElementById(`${id}_rec_disability`)?.value || '',
                goals: document.getElementById(`${id}_rec_goals`)?.value || '',
                value: document.getElementById(`${id}_rec_value`)?.value || ''
            };
        }

        data.assessmentAreas.push(areaData);
    });

    // Collect custom sections
    document.querySelectorAll('[id^="custom"]').forEach(section => {
        const id = section.id;
        if (section.classList.contains('subsection')) {
            const title = section.querySelector('.subsection-title')?.textContent;
            data.customSections.push({
                id: id,
                title: title,
                comment: document.getElementById(`${id}_comment`)?.value || '',
                fim: document.getElementById(`${id}_fim`)?.value || '',
                copmPerf: document.getElementById(`${id}_copm_perf`)?.value || '',
                copmSat: document.getElementById(`${id}_copm_sat`)?.value || ''
            });
        }
    });

    return data;
}



function loadData() {
    const saved = localStorage.getItem('ndis_fca_data');
    if (saved) {
        try {
            const data = JSON.parse(saved);

            // Restore all input fields
            Object.keys(data.clientInfo).forEach(key => {
                const el = document.getElementById(key);
                if (el) el.value = data.clientInfo[key];
            });

            // Restore assessment areas
            if (data.assessmentAreas) {
                data.assessmentAreas.forEach(area => {
                    const commentEl = document.getElementById(`${area.id}_comment`);
                    const fimEl = document.getElementById(`${area.id}_fim`);
                    const perfEl = document.getElementById(`${area.id}_copm_perf`);
                    const satEl = document.getElementById(`${area.id}_copm_sat`);
                    const supervisorEl = document.getElementById(`${area.id}_supervisor_text`);
                    const recCheckbox = document.getElementById(`${area.id}_recommend`);

                    if (commentEl) commentEl.value = area.comment;
                    if (fimEl) fimEl.value = area.fim;
                    if (perfEl) perfEl.value = area.copmPerf;
                    if (satEl) satEl.value = area.copmSat;
                    if (supervisorEl) supervisorEl.value = area.supervisorComment;

                    if (area.hidden) {
                        document.getElementById(area.id)?.classList.add('hidden-section');
                    }

                    if (area.hasRecommendation && recCheckbox) {
                        recCheckbox.checked = true;
                        toggleRecommendation(area.id, area.title);

                        if (area.recommendation) {
                            setTimeout(() => {
                                document.getElementById(`${area.id}_rec_goal`).value = area.recommendation.goal;
                                document.getElementById(`${area.id}_rec_effective`).value = area.recommendation.effective;
                                document.getElementById(`${area.id}_rec_disability`).value = area.recommendation.disability;
                                document.getElementById(`${area.id}_rec_goals`).value = area.recommendation.goals;
                                document.getElementById(`${area.id}_rec_value`).value = area.recommendation.value;
                            }, 100);
                        }
                    }
                });
            }

            updateCharts();
        } catch (e) {
            console.error('Error loading data:', e);
        }
    }
}



function saveData() {
    const data = collectAllData();
    window.formData = data;
    alert('Data saved successfully!');
}



function clearAll() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        window.formData = null;
        location.reload();
    }
}

function exportJSON() {
    const data = collectAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NDIS_FCA_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importJSON(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result);
                window.formData = data;
                alert('Data imported successfully! Reloading page...');
                location.reload();
            } catch (error) {
                alert('Error importing file. Please make sure it is a valid JSON file.');
            }
        };
        reader.readAsText(file);
    }
}

function printToPDF() {
    updateCoverPage();
    window.print();
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    initializeAssessmentSubsections();
    addAdvocateLine();
    addSignOffLine();
    loadData();
    updateFundingTable();

    const clientNameInput = document.getElementById('clientName');
    if (clientNameInput) {
        clientNameInput.addEventListener('input', updateCoverPage);
    }
});
