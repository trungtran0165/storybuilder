let storyData = {};
let storyPath = []; // Add this at the top with other variables
let storyHistory = [];
let choiceCounter = 0;
let highestChoiceNumber = 0;

function addNewChoice() {
    highestChoiceNumber++;
    const choicesContainer = document.getElementById('choices-container');

    const choiceSection = document.createElement('div');
    choiceSection.className = 'choice-section';
    choiceSection.id = `choice-section-${highestChoiceNumber}`;

    choiceSection.innerHTML = `
        <div class="form-group">
            <label>Choice ${highestChoiceNumber}:</label>
            <input type="text" id="choice${highestChoiceNumber}" placeholder="Enter choice option" />
            <textarea id="choice${highestChoiceNumber}Story" rows="3" placeholder="What happens when they choose this..."></textarea>
            
            <div class="sub-choices" id="subchoices-${highestChoiceNumber}">
                <div class="sub-choice-group" id="subchoice-group-${highestChoiceNumber}_1">
                    <label>Sub-choice 1:</label>
                    <input type="text" id="choice${highestChoiceNumber}_1" placeholder="First sub-choice" />
                    <textarea id="choice${highestChoiceNumber}_1Story" rows="2" placeholder="Outcome for first sub-choice..."></textarea>
                    <button onclick="addSubChoice(${highestChoiceNumber}, 1)" class="choice-btn add-subchoice-btn">
                        + Add Sub-Choice
                    </button>
                </div>
                
                <div class="sub-choice-group" id="subchoice-group-${highestChoiceNumber}_2">
                    <label>Sub-choice 2:</label>
                    <input type="text" id="choice${highestChoiceNumber}_2" placeholder="Second sub-choice" />
                    <textarea id="choice${highestChoiceNumber}_2Story" rows="2" placeholder="Outcome for second sub-choice..."></textarea>
                    <button onclick="addSubChoice(${highestChoiceNumber}, 2)" class="choice-btn add-subchoice-btn">
                        + Add Sub-Choice
                    </button>
                </div>
            </div>
            <button onclick="removeChoice(${highestChoiceNumber})" class="choice-btn remove-choice">
                Remove Choice ${highestChoiceNumber}
            </button>
        </div>
    `;

    choicesContainer.appendChild(choiceSection);
}

function addSubChoice(choiceNumber, parentSubChoice) {
    const subChoicesContainer = document.getElementById(`subchoice-group-${choiceNumber}_${parentSubChoice}`);
    const subChoiceCount = subChoicesContainer.getElementsByClassName('nested-subchoice').length + 1;
    const subChoiceId = `${choiceNumber}_${parentSubChoice}_${subChoiceCount}`;

    const subChoiceDiv = document.createElement('div');
    subChoiceDiv.className = 'nested-subchoice';
    subChoiceDiv.id = `nested-subchoice-${subChoiceId}`;

    subChoiceDiv.innerHTML = `
        <label>Sub-choice ${subChoiceCount}:</label>
        <input type="text" id="choice${subChoiceId}" placeholder="Enter sub-choice option" />
        <textarea id="choice${subChoiceId}Story" rows="2" placeholder="Outcome for this sub-choice..."></textarea>
        <button onclick="addSubChoice('${subChoiceId}')" class="choice-btn add-subchoice-btn">
            + Add Sub-Choice
        </button>
        <button onclick="removeSubChoice('${subChoiceId}')" class="choice-btn remove-choice">
            Remove
        </button>
    `;

    subChoicesContainer.appendChild(subChoiceDiv);
}

function removeSubChoice(subChoiceId) {
    const subChoiceElement = document.getElementById(`nested-subchoice-${subChoiceId}`);
    if (subChoiceElement) {
        subChoiceElement.remove();
    }
}

function removeChoice(id) {
    const choiceSection = document.getElementById(`choice-section-${id}`);
    choiceSection.remove();

    // Update the numbering of remaining choices
    const choiceSections = document.getElementsByClassName('choice-section');
    Array.from(choiceSections).forEach((section, index) => {
        const newNumber = index + 1;

        // Update section ID
        section.id = `choice-section-${newNumber}`;

        // Update label
        const label = section.querySelector('label');
        label.textContent = `Choice ${newNumber}:`;

        // Update input and textarea IDs
        const input = section.querySelector(`input[id^="choice"]`);
        const textarea = section.querySelector(`textarea[id^="choice"][id$="Story"]`);
        input.id = `choice${newNumber}`;
        textarea.id = `choice${newNumber}Story`;

        // Update sub-choices IDs
        const subChoice1 = section.querySelector(`input[id$="_1"]`);
        const subChoice1Story = section.querySelector(`textarea[id$="_1Story"]`);
        const subChoice2 = section.querySelector(`input[id$="_2"]`);
        const subChoice2Story = section.querySelector(`textarea[id$="_2Story"]`);

        if (subChoice1) subChoice1.id = `choice${newNumber}_1`;
        if (subChoice1Story) subChoice1Story.id = `choice${newNumber}_1Story`;
        if (subChoice2) subChoice2.id = `choice${newNumber}_2`;
        if (subChoice2Story) subChoice2Story.id = `choice${newNumber}_2Story`;

        // Update remove button
        const removeBtn = section.querySelector('.remove-choice');
        removeBtn.setAttribute('onclick', `removeChoice(${newNumber})`);
        removeBtn.textContent = `Remove Choice ${newNumber}`;
    });

    // Reset highest choice number to match current maximum
    highestChoiceNumber = choiceSections.length;
}

function createStory() {
    const initialStory = document.getElementById('initialStory').value;
    if (!initialStory) {
        alert('Please fill in the initial story');
        return;
    }

    // Initialize story data
    storyData = {
        start: {
            text: initialStory,
            choices: []
        }
    };

    // Get all choice sections
    const choiceSections = document.getElementsByClassName('choice-section');

    // Process each choice
    for (let i = 1; i <= choiceSections.length; i++) {
        const choiceText = document.getElementById(`choice${i}`)?.value;
        const choiceStory = document.getElementById(`choice${i}Story`)?.value;

        if (choiceText && choiceStory) {
            // Add main choice
            storyData.start.choices.push({
                text: choiceText,
                next: `branch${i}`
            });

            // Add branch for this choice
            storyData[`branch${i}`] = {
                text: choiceStory,
                choices: []
            };

            // Add sub-choices
            const subChoice1Text = document.getElementById(`choice${i}_1`)?.value;
            const subChoice1Story = document.getElementById(`choice${i}_1Story`)?.value;
            const subChoice2Text = document.getElementById(`choice${i}_2`)?.value;
            const subChoice2Story = document.getElementById(`choice${i}_2Story`)?.value;

            if (subChoice1Text && subChoice1Story) {
                storyData[`branch${i}`].choices.push({
                    text: subChoice1Text,
                    next: `branch${i}_1`
                });
                storyData[`branch${i}_1`] = {
                    text: subChoice1Story,
                    choices: []
                };
            }

            if (subChoice2Text && subChoice2Story) {
                storyData[`branch${i}`].choices.push({
                    text: subChoice2Text,
                    next: `branch${i}_2`
                });
                storyData[`branch${i}_2`] = {
                    text: subChoice2Story,
                    choices: []
                };
            }
        }
    }

    // Save and display story
    localStorage.setItem('userStory', JSON.stringify(storyData));
    document.getElementById('storyForm').classList.add('hidden');
    document.getElementById('storyDisplay').classList.remove('hidden');
    currentState = 'start';
    updateStory();
}

let currentState = 'start';

function updateStory() {
    const currentNode = storyData[currentState];
    document.getElementById('storyText').textContent = currentNode.text;

    // Add current node to story path
    storyPath.push({
        text: currentNode.text,
        choice: currentNode.choices.length ? null : 'Ending'
    });

    // Update back button visibility
    const backButton = document.getElementById('backButton');
    backButton.style.display = storyHistory.length ? 'block' : 'none';

    const choicesContainer = document.getElementById('choicesContainer');
    choicesContainer.innerHTML = '';

    // If no more choices, show the complete story
    if (currentNode.choices.length === 0) {
        showStorySummary();
        return;
    }

    currentNode.choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = choice.text;
        button.onclick = () => {
            storyHistory.push(currentState); // Save current state before moving
            storyPath[storyPath.length - 1].choice = choice.text;
            currentState = choice.next;
            updateStory();
        };
        choicesContainer.appendChild(button);
    });
}

function showStorySummary() {
    document.getElementById('storyDisplay').classList.add('hidden');
    document.getElementById('storySummary').classList.remove('hidden');

    const summaryContent = document.getElementById('summaryContent');
    summaryContent.innerHTML = '';

    // Create read aloud button
    const readButton = document.createElement('button');
    readButton.className = 'choice-btn';
    readButton.innerHTML = '🔊 Read Story';
    readButton.style.backgroundColor = '#28a745';
    readButton.onclick = readStorySummary;
    summaryContent.appendChild(readButton);

    storyPath.forEach((node, index) => {
        const storyNode = document.createElement('div');
        storyNode.className = 'story-node';

        const textPart = document.createElement('p');
        textPart.className = 'story-text';
        textPart.textContent = node.text;
        storyNode.appendChild(textPart);

        if (node.choice) {
            const choicePart = document.createElement('p');
            choicePart.className = 'choice-made';
            choicePart.textContent = `➤ ${node.choice}`;
            storyNode.appendChild(choicePart);
        }

        summaryContent.appendChild(storyNode);
    });
}

// Add this new function for text-to-speech
function readStorySummary() {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Build the complete story text with only story content
    let storyText = '';
    storyPath.forEach((node) => {
        // Only add the story text, skip choices
        storyText += node.text + '. ';
    });

    // Create and configure speech utterance
    const utterance = new SpeechSynthesisUtterance(storyText);
    utterance.rate = 1.0;  // Speech rate
    utterance.pitch = 1.0; // Speech pitch
    utterance.volume = 1.0; // Speech volume

    // Start speaking
    window.speechSynthesis.speak(utterance);
}

// Add new function for going back
function goBack() {
    if (storyHistory.length > 0) {
        currentState = storyHistory.pop();
        storyPath.pop(); // Remove the last choice from path
        updateStory();
    }
}

// Update restartStory function to clear history
function restartStory() {
    storyPath = [];
    storyHistory = [];
    currentState = 'start';
    document.getElementById('storySummary').classList.add('hidden');
    document.getElementById('storyForm').classList.remove('hidden');
}

// Add new function to clear the form
function clearForm() {
    // Clear initial story
    document.getElementById('initialStory').value = '';
    
    // Clear all choice sections
    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';
    
    // Reset counters
    highestChoiceNumber = 0;
    choiceCounter = 0;
    
    // Clear story data
    storyData = {};
    storyPath = [];
    storyHistory = [];
}

// Load saved story if exists
window.onload = function () {
    const savedStory = localStorage.getItem('userStory');
    if (savedStory) {
        storyData = JSON.parse(savedStory);
        document.getElementById('storyForm').classList.add('hidden');
        document.getElementById('storyDisplay').classList.remove('hidden');
        currentState = 'start';
        updateStory();
    }
};