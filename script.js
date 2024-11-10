function generateMatrixInputs() {
    const dimension = document.getElementById('dimension').value;

    if (dimension < 1) {
        alert("Please enter a valid positive number.");
        return;
    }

    const matrix = document.getElementById('matrixInputContainer');
    matrix.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = "matrix-row";

        for (let j = 0; j < dimension; j++) {
            const input = document.createElement('input');
            input.type = "number";
            input.className = "matrix-input";
            input.placeholder = 'Enter your number';
            input.id = `cell-${i}-${j}`;
            rowDiv.appendChild(input);
        }
        matrix.appendChild(rowDiv);
    }

    document.getElementById('showMatrixBtn').style.display = 'inline';
}

function displayMatrix() {
    document.getElementById('line').style.display = 'inline';
    const dimension = document.getElementById('dimension').value;
    const matrixContainer = document.getElementById('matrixContainer');
    matrixContainer.innerHTML = '';

    const table = document.createElement('table');

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            const cellValue = document.getElementById(`cell-${i}-${j}`).value || 0;
            cell.textContent = cellValue;
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    matrixContainer.appendChild(table);

    document.getElementById('showMatrixBtn').style.display = 'none';
    document.getElementById('Decompose').style.display = 'inline';
}



function createMatrixTable(matrix) {
    const table = document.createElement('table');
    for (let i = 0; i < matrix.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < matrix[i].length; j++) {
            const cell = document.createElement('td');
            cell.textContent = matrix[i][j].toFixed(2);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    return table;
}
