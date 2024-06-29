let folded = false;
let shrink = false;
let userInput = "";
let inputActive = true;
let envelopeWidth, envelopeHeight;
let envelopeX, envelopeY;
let mailboxDisplayed = false;
let envelopeFalling = false;
let playwriteFont; // Zmienna do przechowywania fontu PlaywriteNL
let tinyFont; // Zmienna do przechowywania fontu Tiny5
let placeholderVisible = true; // Zmienna do zarządzania widocznością placeholdera

// Kolory
const colors = {
  background: '#F5D7E3', // Używamy tego koloru jako tło
  border: '#F4A5AE', // Kolor obrysu koperty
  envelope: '#AA7DCE', // Kolor koperty i klapy
  flap: '#AA7DCE',
  mailbox: '#F4A5AE',
  text: '#A8577E'
};

function preload() {
  playwriteFont = loadFont('PlaywriteNL.ttf'); // Załaduj font PlaywriteNL
  tinyFont = loadFont('Tiny5.ttf'); // Załaduj font Tiny5
}

function setup() {
  createCanvas(1920, 1080);
  drawPaper();
}

function draw() {
  if (!folded) {
    drawPaperWithText();
  } else if (shrink) {
    shrinkEnvelope();
  } else if (mailboxDisplayed) {
    background(colors.background); // Wyczyszczenie tła, aby uniknąć powielania
    drawMailboxSlot();
    if (envelopeFalling) {
      fallIntoMailbox();
    } else {
      drawEnvelopeAsCursor();
    }
  }
}

function drawPaper() {
  background(colors.background); // Białe tło, jak kartka papieru

  // Ustawienia ramki
  let frameThickness = 20;
  let frameColor = color(colors.border); // Kolor ramki

  // Nowy rozmiar kartki
  let paperWidth = width / 2;
  let paperHeight = height / 1.5;
  let paperX = width / 2 - paperWidth / 2;
  let paperY = height / 2 - paperHeight / 2;

  // Narysuj ramkę
  noFill();
  stroke(frameColor);
  strokeWeight(frameThickness);
  rect(paperX, paperY, paperWidth, paperHeight);

  // Dodatkowe detale, aby ramka wyglądała bardziej jak papier
  noStroke();
  fill(255);
  rect(paperX + frameThickness / 2, paperY + frameThickness / 2, paperWidth - frameThickness, paperHeight - frameThickness);

  // Dodaj napis "I confess:"
  fill(colors.text);
  textFont(playwriteFont);
  textSize(32);
  textAlign(LEFT, TOP);
  text("I confess:", paperX + frameThickness, paperY + frameThickness);
}

function mousePressed() {
  if (!folded) {
    foldToEnvelope();
    folded = true;
  } else if (!shrink && !mailboxDisplayed) {
    shrink = true;
  } else if (mailboxDisplayed && !envelopeFalling) {
    envelopeFalling = true;
  }
}

function foldToEnvelope() {
  background(colors.background); // Białe tło

  let frameThickness = 20;
  let frameColor = color(colors.border); // Kolor ramki

  // Proporcje koperty (5:3)
  const envelopeRatio = 5 / 3;

  // Nowy rozmiar koperty, dostosowany do proporcji kartki
  envelopeWidth = width / 2;
  envelopeHeight = envelopeWidth / envelopeRatio;
  envelopeX = width / 2;
  envelopeY = height / 2;

  drawEnvelope(envelopeX, envelopeY, envelopeWidth, envelopeHeight, frameThickness, frameColor);
}

function shrinkEnvelope() {
  background(colors.background); // Białe tło

  let frameThickness = 20;
  let frameColor = color(colors.border); // Kolor ramki

  if (envelopeWidth > width / 8) {
    envelopeWidth *= 0.95;
    envelopeHeight = envelopeWidth / (5 / 3); // Zachowanie proporcji 5:3
    envelopeX = width / 2;
    envelopeY = height / 2;
  } else {
    shrink = false;
    mailboxDisplayed = true;
    return;
  }

  drawEnvelope(envelopeX, envelopeY, envelopeWidth, envelopeHeight, frameThickness, frameColor);
}

function drawEnvelope(x, y, w, h, frameThickness, frameColor) {
  // Rysowanie koperty
  fill(colors.envelope);
  stroke(frameColor);
  strokeWeight(2);
  beginShape();
  vertex(x - w / 2, y - h / 2);
  vertex(x + w / 2, y - h / 2);
  vertex(x + w / 2, y + h / 2);
  vertex(x - w / 2, y + h / 2);
  endShape(CLOSE);

  // Rysowanie klapy koperty
  fill(colors.flap);
  stroke(frameColor);
  strokeWeight(2);
  beginShape();
  vertex(x - w / 2, y - h / 2);
  vertex(x, y);
  vertex(x + w / 2, y - h / 2);
  endShape(CLOSE);
}

function drawEnvelopeAsCursor() {
  // Rysowanie koperty w miejscu kursora
  let cursorX = mouseX;
  let cursorY = mouseY;
  let frameThickness = 20;
  let frameColor = color(colors.border);

  drawEnvelope(cursorX, cursorY, envelopeWidth, envelopeHeight, frameThickness, frameColor);
}

function drawMailboxSlot() {
  // Rysowanie skrzynki na środku ekranu
  let frameThickness = 20;

  // Rysowanie prostokąta przypominającego wejście do skrzynki na listy
  fill(colors.mailbox);
  noStroke();
  rect(width / 2 - envelopeWidth / 2, height / 2 - 10, envelopeWidth, 20);

  // Dodaj napis "send your secret here"
  fill(colors.text);
  textFont(tinyFont);
  textSize(40); // Powiększony rozmiar tekstu
  textAlign(CENTER, BOTTOM);
  text("send your secret here", width / 2, height / 2 - 80);

  // Dodaj strzałkę wskazującą na skrzynkę
  stroke(colors.text);
  strokeWeight(5);
  fill(colors.text);
  let arrowX = width / 2;
  let arrowY = height / 2 - 50;
  let arrowSize = 20;
  line(arrowX, arrowY, arrowX, arrowY - arrowSize);
  line(arrowX, arrowY, arrowX - arrowSize / 2, arrowY - arrowSize / 2);
  line(arrowX, arrowY, arrowX + arrowSize / 2, arrowY - arrowSize / 2);
}

function drawPaperWithText() {
  drawPaper();

  // Rysowanie tekstu na kartce
  fill(colors.text);
  noStroke();
  textSize(24);
  textAlign(CENTER, CENTER);
  text(userInput, width / 2, height / 2);

  // Rysowanie placeholdera "write here"
  if (placeholderVisible && userInput === "") {
    fill(150); // Jasny kolor
    textFont(tinyFont);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("write here", width / 2, height / 2 + 40);
  } else {
    // Rysowanie napisu "click to close"
    fill(colors.background);
    textFont(tinyFont);
    textSize(24);
    textAlign(CENTER, BOTTOM);
    text("click to close", width / 2, height / 2 + 240);
  }
}

function keyPressed() {
  if (inputActive && !folded) {
    if (keyCode === BACKSPACE) {
      userInput = userInput.substring(0, userInput.length - 1);
    } else if (keyCode === ENTER) {
      inputActive = false; // Wyłącz wprowadzanie tekstu po naciśnięciu ENTER
    } else if (!keyIsDown(ALT) && !keyIsDown(CONTROL) && !keyIsDown(COMMAND) && !keyIsDown(OPTION)) { // Ignoruj specjalne klawisze
      // Ignoruj klawisze funkcyjne
      if (keyCode !== SHIFT && keyCode !== LEFT_ARROW && keyCode !== RIGHT_ARROW && keyCode !== UP_ARROW && keyCode !== DOWN_ARROW) {
        userInput += key;
        placeholderVisible = false; // Ukryj placeholder po rozpoczęciu pisania
      }
    }
    drawPaperWithText();
  }
}

function keyTyped() {
  // Funkcja, która obsługuje wpisywanie znaków, w tym polskich liter i dużych liter z użyciem Shift
  if (inputActive && !folded) {
    userInput += key;
    placeholderVisible = false; // Ukryj placeholder po rozpoczęciu pisania
    drawPaperWithText();
    return false; // Zatrzymuje domyślną akcję, aby uniknąć podwójnego wpisywania
  }
}

function fallIntoMailbox() {
  let frameThickness = 20;
  let frameColor = color(colors.border); // Kolor ramki

  if (envelopeWidth > 0.1 && envelopeHeight > 0.1) {
    envelopeWidth *= 0.9;
    envelopeHeight = envelopeWidth / (5 / 3); // Zachowanie proporcji 5:3
    envelopeX = width / 2;
    envelopeY = height / 2;
  } else {
    envelopeFalling = false; // Stop animation when envelope is almost invisible
    setTimeout(() => {
      window.location.href = "https://domciaioliwcia.github.io/Secret-page/"; // Redirection to the next page
    }, 500); // Delay to ensure the final state is drawn
  }

  drawEnvelope(envelopeX, envelopeY, envelopeWidth, envelopeHeight, frameThickness, frameColor);
}
