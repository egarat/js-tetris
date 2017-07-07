const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

// checks for collision of the tetris element
function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for(let y = 0; y < m.length; y++) {
    for(let x = 0; x < m[y].length; x++) {
      // if the tetris element reaches the end of the arena or there is already an element, return true
      if(m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function createMatrix(w, h) {
  const matrix = [];
  while(h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

// create tetris elements
function createPiece(type) {
  if(type === 'T') {
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0]
    ];
  } else if (type === 'O') {
      return [
        [1, 1],
        [1, 1]
      ];
  } else if (type === 'L') {
      return [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
      ];
  } else if (type === 'J') {
      return [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
      ];
  } else if (type === 'I') {
      return [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
      ];
  } else if (type === 'S') {
      return [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
      ];
  } else if (type === 'Z') {
      return [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
      ];
  }
}

// renders the current situation of the canvas
function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // draw current state of the game
  drawMatrix(arena, {x: 0, y: 0})
  // draw 'falling' tetris element
  drawMatrix(player.matrix, player.pos);
}

// draws the tetris elements and its current position on the canvas
function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = 'red';
        context.fillRect(x + offset.x,
                         y + offset.y,
                         1, 1);
        }
    });
  });
}

// merges the situation of the game in a 2d array
function merge(arena, player) {
  player.matrix.forEach((row, y) => {
      row.forEach((value, x)  => {
        if(value !== 0) {
          arena[y + player.pos.y][x + player.pos.x] = value;
        }
      });
  });
}

// drops the tetris element
function playerDrop() {
  player.pos.y++;
  if(collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
  }
  dropCounter = 0;
}

// hinders the tetris element from leaving the canvas on the sides
function playerMove(direction) {
  player.pos.x += direction;
  if(collide(arena, player)) {
    player.pos.x -= direction;
  }
}

function playerReset() {
  const pieces = 'ILJOTSZ';
  player.matrix = createPiece(pieces[Math.floor(pieces.length * Math.random())]);
  player.pos.y = 0;
  player.pos.x = (Math.floor(arena[0].length / 2)) -
                 (Math.floor(player.matrix[0].length / 2));
}

// function to handle the rotation
function playerRotate(direction) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, direction);
  while(collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if(offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

// function to rotate the tetris element
function rotate(matrix, direction) {
  for(let y = 0; y < matrix.length; y++) {
    for(let x = 0; x < y; x++) {
      [
        matrix[x][y],
        matrix[y][x]
      ] = [
        matrix[y][x],
        matrix[x][y]
      ];
    }
  }

  if(direction > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}

let dropCounter = 0;
let dropInterval = 1000; // each second the tetris element falls down

let lastTime = 0;
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  
  dropCounter += deltaTime;
  if(dropCounter > dropInterval) {
    playerDrop();
  }

  draw();
  requestAnimationFrame(update);
}

const arena = createMatrix(12, 20);

const player = {
  pos: {x: 5, y: 5},
  matrix: createPiece('T'),
}

document.addEventListener('keydown', event => {
  if(event.keyCode === 37) {
      playerMove(-1);
  } else if(event.keyCode === 39) {
      playerMove(1);
  } else if(event.keyCode === 40) {
      playerDrop();
  } else if(event.keyCode === 81) {
    playerRotate(-1);
  } else if(event.keyCode === 87) {
    playerRotate(1);
  }
});

update();