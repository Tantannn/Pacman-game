const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const scoreId = document.querySelector("#score");
canvas.width = innerWidth;
canvas.height = innerHeight;

const map = [
  ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "7", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
  ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
  ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "+", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
  ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
  ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "5", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", "p", "|"],
  ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
];

class Boundary {
  static width = 40;
  static height = 40;
  constructor({ position }) {
    this.position = position;
    this.width = 40;
    this.height = 40;
  }
  draw() {
    c.fillStyle = "blue";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Player {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 16;
  }
  draw() {
    c.beginPath();
    c.fillStyle = "yellow";
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fill();
    c.closePath();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Pellet {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 4;
  }
  draw() {
    c.beginPath();
    c.fillStyle = "white";
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fill();
    c.closePath();
  }
}

class Enemy {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.prevCollisions = [];
  }
  draw() {
    c.beginPath();
    c.fillStyle = "red";
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fill();
    c.closePath();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

const boundaries = [];
const player = new Player({
  position: {
    x: Boundary.width + Boundary.width / 2,
    y: Boundary.height + Boundary.height / 2,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});

const pellets = [];

const enemy = new Enemy({
  position: {
    x: Boundary.width * 9 + Boundary.width / 2,
    y: Boundary.height * 11 + Boundary.height / 2,
  },
  velocity: {
    x: -5,
    y: 0,
  },
});

function createImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case "-":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeHorizontal.png"),
          })
        );
        break;
      case "|":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeVertical.png"),
          })
        );
        break;
      case "1":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner1.png"),
          })
        );
        break;
      case "2":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner2.png"),
          })
        );
        break;
      case "3":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner3.png"),
          })
        );
        break;
      case "4":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner4.png"),
          })
        );
        break;
      case "b":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/block.png"),
          })
        );
        break;
      case "[":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/capLeft.png"),
          })
        );
        break;
      case "]":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/capRight.png"),
          })
        );
        break;
      case "_":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/capBottom.png"),
          })
        );
        break;
      case "^":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/capTop.png"),
          })
        );
        break;
      case "+":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/pipeCross.png"),
          })
        );
        break;
      case "5":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            color: "blue",
            image: createImage("./img/pipeConnectorTop.png"),
          })
        );
        break;
      case "6":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            color: "blue",
            image: createImage("./img/pipeConnectorRight.png"),
          })
        );
        break;
      case "7":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            color: "blue",
            image: createImage("./img/pipeConnectorBottom.png"),
          })
        );
        break;
      case "8":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/pipeConnectorLeft.png"),
          })
        );
        break;
      case ".":
        pellets.push(
          new Pellet({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2,
            },
          })
        );
        break;
    }
  });
});

let score = 0;
let lastKey = "";
const keys = {
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};
addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
  }
});
addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
});

function easyMovement({ circle, rectangle }) {
  // const padding: Boundary.width / 2 - circle.radius
  return (
    circle.position.y - circle.radius + circle.velocity.y <=
      rectangle.position.y + rectangle.height &&
    circle.position.x - circle.radius + circle.velocity.x <=
      rectangle.position.x + rectangle.width &&
    circle.position.x + circle.radius + circle.velocity.x >=
      rectangle.position.x &&
    circle.position.y + circle.radius + circle.velocity.y >=
      rectangle.position.y
  );
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  if (keys.w.pressed === true && lastKey === "w") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        easyMovement({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: -5,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = -5;
      }
    }
  } else if (keys.s.pressed === true && lastKey === "s") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        easyMovement({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: 5,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = 5;
      }
    }
  } else if (keys.a.pressed === true && lastKey === "a") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        easyMovement({
          circle: {
            ...player,
            velocity: {
              x: -5,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = -5;
      }
    }
  } else if (keys.d.pressed === true && lastKey === "d") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        easyMovement({
          circle: {
            ...player,
            velocity: {
              x: 5,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = 5;
      }
    }
  }

  boundaries.forEach((boundary) => {
    boundary.draw();
    if (easyMovement({ circle: player, rectangle: boundary })) {
      player.velocity.y = 0;
      player.velocity.x = 0;
    }
  });

  pellets.forEach((pellet, i) => {
    pellet.draw();
    if (
      Math.hypot(
        pellet.position.x - player.position.x,
        pellet.position.y - player.position.y
      ) <
      pellet.radius + player.radius
    ) {
      pellets.splice(i, 1);
      score += 10;
      scoreId.innerHTML = score;
      if (score === 710) {
        scoreId.innerHTML = `You are Victorious!`;
      }
    }
  });

  player.update();
  enemy.update();

  const collisions = [];
  boundaries.forEach((boundary) => {
    if (
      !collisions.includes("right") &&
      easyMovement({
        circle: {
          ...enemy,
          velocity: {
            x: 5,
            y: 0,
          },
        },
        rectangle: boundary,
      })
    ) {
      collisions.push("right");
    }
    else if (
      !collisions.includes("left") &&
      easyMovement({
        circle: {
          ...enemy,
          velocity: {
            x: -5,
            y: 0,
          },
        },
        rectangle: boundary,
      })
    ) {
      collisions.push("left");
    }
    else if (
      !collisions.includes("up") &&
      easyMovement({
        circle: {
          ...enemy,
          velocity: {
            x: 0,
            y: -5,
          },
        },
        rectangle: boundary,
      })
    ) {
      collisions.push("up");
    }
    else if (
      !collisions.includes("down") &&
      easyMovement({
        circle: {
          ...enemy,
          velocity: {
            x: 0,
            y: 5,
          },
        },
        rectangle: boundary,
      })
    ) {
      collisions.push("down");
    }
  });
  if (collisions.length > enemy.prevCollisions.length) {
    enemy.prevCollisions = collisions;
  }
  if (JSON.stringify(collisions) !== JSON.stringify(enemy.prevCollisions)) {
    if (enemy.velocity.x > 0) enemy.prevCollisions.push("right");
    else if (enemy.velocity.x < 0) enemy.prevCollisions.push("left");
    else if (enemy.velocity.y < 0) enemy.prevCollisions.push("up");
    else if (enemy.velocity.y > 0) enemy.prevCollisions.push("down");
    const pathways = enemy.prevCollisions.filter((collision) => {
      return !collisions.includes(collision);
    });
    const direction = pathways[Math.floor(Math.random() * pathways.length)];
    console.log(direction)
    switch (direction) {
      case "down":
        enemy.velocity.x = 5;
        enemy.velocity.y = 0;
        break;
      case "up":
        enemy.velocity.x = -5;
        enemy.velocity.y = 0;
        break;
      case "right":
        enemy.velocity.x = 0;
        enemy.velocity.y = 5;
        break;
      case "left":
        enemy.velocity.x = 0;
        enemy.velocity.y = -5;
        break;
    }
    enemy.prevCollisions = [];
  }
}
animate();
