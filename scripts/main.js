document.addEventListener('DOMContentLoaded', function () {
  const objectDivs = [];
  
  //listening for and logging user input
  const userInput = document.getElementById('inputField');
  userInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      const userText = userInput.value.trim();

      console.log('User input:', userText);

      if (userText !== '') {
        const userDiv = document.createElement('div');
        userDiv.textContent = userText;
        userDiv.classList.add('userDiv');
        document.body.appendChild(userDiv);
        userInput.value = ''; // Clear the input field
        fetchData(); // retrieve CSV results
      }
    }
  });

  // CSV processing function
  async function fetchData() {
    try {
      // Fetch the CSV file (hm125 has been cleaned to remove rows with >125 characters)
      const response = await fetch('hm125.csv');
      const text = await response.text();

      // Split the CSV text into rows and shuffle the rows to get a random assortment
      let rows = text.split('\n').map(row => row.split(','));
      rows = shuffle(rows);

      // Filter out empty rows
      rows = rows.filter(row => row.some(cell => cell.trim() !== ''));

      // Randomly select 3 rows and distribute them randomly across 6 columns
      const sampledRows = rows.slice(0, 3);
      const numColumns = 6;
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

      // Style changes upon hitting Enter
      // Hide input container
      const inputContainer = document.querySelector('.inputContainer');
      inputContainer.style.display = 'none';

      // Change background color
      const body = document.querySelector('body');
      body.style.backgroundColor = '#FFFA8D';

      // Change footer text color
      const footerText = document.getElementById('footerText');
      footerText.style.color = 'black';

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Add CSS class ("object-div") and create object div elements
  function createObjectDiv(row) {
    const objectDiv = document.createElement('div');
    objectDiv.classList.add('object-div');
    const cleanedRow = row.map(cell => cell.replace(/["\[\]\r]/g, ''));
    objectDiv.textContent = cleanedRow.join(', ');
    return objectDiv;
  }

  // Placing the object divs in random spots within a fixed window
  function positionObjectDiv(objectDiv, columnIndex, columnWidth) {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const padding = 10;

    // Constrain positioning from top and left
    const maxTop = windowHeight - objectDiv.offsetHeight - padding * 2 - 100;
    const randomTop = Math.random() * maxTop + padding;

    const maxLeft = windowWidth - columnWidth;
    const randomLeft = columnIndex * columnWidth;
    const maxWidth = columnWidth - padding * 2;

    objectDiv.style.position = 'absolute';
    objectDiv.style.top = `${randomTop}px`;
    objectDiv.style.left = `${Math.min(randomLeft, maxLeft)}px`; // Ensure left doesn't go beyond maxLeft
    objectDiv.style.width = `${Math.min(maxWidth, columnWidth - padding * 2)}px`; // Ensure width doesn't exceed maxWidth
    objectDiv.style.padding = `${padding}px`;
  }

  // Defining shuffle function using Fisher-Yates shuffle algorithm
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
});
