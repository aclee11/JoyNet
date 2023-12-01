document.addEventListener('DOMContentLoaded', fetchData);

const objectDivs = [];

async function fetchData() {
  try {
    // Fetch the CSV file
    const response = await fetch('hm125.csv');
    const text = await response.text();

    // Split the CSV text into rows
    let rows = text.split('\n').map(row => row.split(','));

    // Shuffle the rows
    rows = shuffle(rows);

    // Randomly select rows
    const sampledRows = rows.slice(0, 3); // Change the number to the desired number of rows
    const numColumns = 6;

    // Shuffle the column indices
    const shuffledColumns = shuffle(Array.from({ length: numColumns }, (_, index) => index));

    // Display the sampled rows as objects
    const windowWidth = window.innerWidth;
    const columnWidth = windowWidth / numColumns;

    sampledRows.forEach((row, rowIndex) => {
      const objectDiv = createObjectDiv(row);
      const columnIndex = shuffledColumns[rowIndex];
      positionObjectDiv(objectDiv, columnIndex, columnWidth);
      objectDivs.push(objectDiv);
      document.body.appendChild(objectDiv);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function createObjectDiv(row) {
  const objectDiv = document.createElement('div');
  const cleanedRow = row.map(cell => cell.replace(/["\[\]\r]/g, ''));
  objectDiv.textContent = cleanedRow.join(', ');
  return objectDiv;
}

function positionObjectDiv(objectDiv, columnIndex, columnWidth) {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  const padding = 10; // Adjust the padding as needed

  // Constraints for top position
  const maxTop = windowHeight - objectDiv.offsetHeight - padding * 2 - 100;
  const randomTop = Math.random() * maxTop + padding;

  // Constraints for left position and width
  const maxLeft = windowWidth - columnWidth;
  const randomLeft = columnIndex * columnWidth;
  const maxWidth = columnWidth - padding * 2;

  objectDiv.style.position = 'absolute';
  objectDiv.style.top = `${randomTop}px`;
  objectDiv.style.left = `${Math.min(randomLeft, maxLeft)}px`; // Ensure left doesn't go beyond maxLeft
  objectDiv.style.width = `${Math.min(maxWidth, columnWidth - padding * 2)}px`; // Ensure width doesn't exceed maxWidth
  objectDiv.style.padding = `${padding}px`;
}



function shuffle(array) {
  // Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getSample(array, size) {
  const sample = [];
  const copy = array.slice(0);

  for (let i = 0; i < size; i++) {
    const index = Math.floor(Math.random() * copy.length);
    sample.push(copy.splice(index, 1)[0]);
  }

  return sample;
}

function createObjectDiv(row) {
  const objectDiv = document.createElement('div');
  objectDiv.classList.add('object-div'); // Add the CSS class
  const cleanedRow = row.map(cell => cell.replace(/["\[\]\r]/g, ''));
  objectDiv.textContent = cleanedRow.join(', ');
  return objectDiv;
}

