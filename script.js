let ships = [];
let remainingShips = 0;
let gameActive = true;
let equations = [];
let score = 1000;
const shipValues = {5: 200, 4: 150, 3: 100, 2: 50};

function generateValidEquation() {
    let equation, solution;
    do {
        const temp = generateEquation();
        equation = temp.equation;
        solution = temp.solution;
    } while(solution < 0 || solution >= 12); // Garante soluções entre 0-11
    return { equation, solution };
}

function generateEquation() {
    const operations = ['+', '-', '*'];
    const op = operations[Math.random() < 0.3 ? 2 : Math.floor(Math.random() * 2)];
    let a, b, solution;
    
    // Garante soluções entre 1-12 (linhas) e A-L (colunas)
    const maxSolution = 12;
    
    if(op === '+') {
        solution = Math.floor(Math.random() * maxSolution) + 1;
        a = Math.floor(Math.random() * solution);
        b = solution - a;
    }
    else if(op === '-') {
        solution = Math.floor(Math.random() * maxSolution) + 1;
        a = solution + Math.floor(Math.random() * (maxSolution - solution + 1));
        b = a - solution;
    }
    else {
        do {
            solution = Math.floor(Math.random() * maxSolution) + 1;
            a = Math.floor(Math.random() * 4) + 1;
            b = Math.floor(solution / a);
        } while(a * b !== solution);
    }
    
    return {
        equation: `${a} ${op} ${b} = ?`,
        solution: solution
    };
}

function createEquationsDisplay() {
    const container = document.getElementById('equations');
    container.innerHTML = '<h3>Equações dos Navios:</h3>';
    
    equations.forEach((eq, index) => {
        const startRow = eq.row;
        const endRow = eq.direction === 'vertical' ? startRow + eq.length - 1 : startRow;
        const startCol = String.fromCharCode(65 + eq.col);
        const endCol = eq.direction === 'horizontal' ? String.fromCharCode(65 + eq.col + eq.length - 1) : startCol;

        const group = document.createElement('div');
        group.className = 'equation-group';
        group.innerHTML = `
            <div class="equation">Navio ${index + 1} (${eq.length} casas)</div>
            <div class="equation">Linha: ${eq.rowEquation}</div>
            <div class="equation">Coluna: ${eq.colEquation}</div>
            <div class="solution">Direção: ${eq.direction === 'horizontal' ? 'Horizontal' : 'Vertical'}</div>
        `;
        container.appendChild(group);
    });
}

function createGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    grid.appendChild(document.createElement('div')); 
    for (let j = 0; j < 12; j++) {
        const colHeader = document.createElement('div');
        colHeader.className = 'header-cell';
        colHeader.textContent = String.fromCharCode(65 + j);
        grid.appendChild(colHeader);
    }

    for (let i = 0; i < 12; i++) {
        const rowHeader = document.createElement('div');
        rowHeader.className = 'header-cell';
        rowHeader.textContent = i + 1;
        grid.appendChild(rowHeader);

        for (let j = 0; j < 12; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            grid.appendChild(cell);
        }
    }
}

function placeShips() {
    ships = [];
    equations = [];
    const shipLengths = [5, 4, 3, 3, 2];
    
    shipLengths.forEach(length => {
        let placed = false;
        
        while(!placed) {
            const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            const rowEq = generateEquation();
            const colEq = generateEquation();
            
            // Convertendo para índices 0-based
            const row = rowEq.solution - 1;
            const col = colEq.solution - 1;
            
            if(row >= 0 && row < 12 && col >= 0 && col < 12 && 
               canPlaceShip(row, col, length, direction)) {
                placeShip(row, col, length, direction);
                placed = true;
                remainingShips += length;
                equations.push({
                    row: row,
                    col: col,
                    length: length,
                    direction: direction,
                    rowEquation: rowEq.equation,
                    colEquation: colEq.equation
                });
            }
        }
    });
}

function canPlaceShip(startRow, startCol, length, direction) {
    if (direction === 'horizontal' && startCol + length > 12) return false;
    if (direction === 'vertical' && startRow + length > 12) return false;

    for (let i = 0; i < length; i++) {
        const currentRow = direction === 'vertical' ? startRow + i : startRow;
        const currentCol = direction === 'horizontal' ? startCol + i : startCol;

        if (ships.some(ship => ship.row === currentRow && ship.col === currentCol)) return false;

        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                const adjRow = currentRow + r;
                const adjCol = currentCol + c;
                if (adjRow >= 0 && adjRow < 12 && adjCol >= 0 && adjCol < 12) {
                    if (ships.some(ship => ship.row === adjRow && ship.col === adjCol)) return false;
                }
            }
        }
    }
    return true;
}

function placeShip(startRow, startCol, length, direction) {
    for (let i = 0; i < length; i++) {
        ships.push({
            row: direction === 'vertical' ? startRow + i : startRow,
            col: direction === 'horizontal' ? startCol + i : startCol,
            length: length
        });
    }
}

function handleCellClick(e) {
    if(!gameActive) return;
    
    const cell = e.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    if(cell.classList.contains('hit') || cell.classList.contains('miss')) return;
    
    const hitShip = ships.find(ship => ship.row === row && ship.col === col);
    
    if(hitShip) {
        cell.classList.add('hit');
        remainingShips--;
        updateScore(150);
        document.getElementById('message').textContent = 'Acertou! +150 pontos';
        
                // Revela todo o navio quando totalmente destruído
        if(isShipDestroyed(hitShip)) {
            revealShip(hitShip);
        }
    } else {
        cell.classList.add('miss');
        updateScore(-100);
        document.getElementById('message').textContent = 'Errou! -100 pontos';
    }
    
    checkGameOver();
}

function revealShip(ship) {
      // Mostra todas as células do navio
    const shipCells = getShipCells(ship);
    shipCells.forEach(cell => {
        const element = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
        if(!element.classList.contains('hit')) {
            element.classList.add('ship');
        }
    });
}

function getShipCells(ship) {
    // Retorna todas as células do navio
    const cells = [];
    for(let i = 0; i < ship.length; i++) {
        cells.push({
            row: ship.direction === 'vertical' ? ship.row + i : ship.row,
            col: ship.direction === 'horizontal' ? ship.col + i : ship.col
        });
    }
    return cells;
}

function checkGameOver() {
    if (remainingShips === 0) {
        gameActive = false;
        document.getElementById('message').textContent = 'Você venceu! Parabéns!';
    }
}

function updateScore(points) {
    score = Math.max(0, score + points);
    document.getElementById('score').textContent = `Pontuação: ${score}`;

    if (score === 0) {
        gameActive = false;
        document.getElementById('message').textContent = 'Game Over! Reiniciando...';
        setTimeout(initGame, 2000);
    }
}

function initGame() {
    ships = [];
    remainingShips = 0;
    gameActive = true;
    score = 1000;
    document.getElementById('message').textContent = 'Bom jogo! Resolva as equações!';
    document.getElementById('score').textContent = 'Pontuação: 1000';
    createGrid();
    placeShips();
    createEquationsDisplay();
}

initGame();
