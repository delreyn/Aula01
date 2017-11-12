/********* VARIAVEIS *********/


// 0: Tela Inicial 
// 1: Tela d Jogo
// 2: Tela de Game-over 

var gameScreen = 0;

var gravidade = 0.3;
var artrito = 0.00001;
var friccao = 0.1;

var intevItem = 10000; 
var ultIntev = 0;
var tamIten = 10;
var itenX = -20;
var itenY = 0;


var bolX, bolY;
var corBol;
var tamBol = 20;
var vertBolVel = 0;
var horizBolVel = 0;

// Pontos e vida (etapa 4)
var pontos = 0;
var saudeMax = 100;
var saude = 100;
var saudeMenos = 1;
var barraSaudeLarg = 60;

//definições de racket 
var corRacket;
var racketLargur = 100;
var racketAltur = 10;

//Paredes

var velParede = 4;
var inteParede = 1000; //Intevalo entre paredes
var ultTemp = 0;
var altMin = 200;
var altMax = 300;
var lagParede = 80;
var corParede;
var paredes = []; 

//objetos

//intObj = 25000;
var jaFoi = [0,0,0,0];

/********* BLOCO SETUP  *********/

function setup() {
  createCanvas(500, 500);
  
  // Defini coordenadas iniciais para a bola
  bolX=width/4;
  bolY=height/5;
  
  smooth();

  corBol = color(0);
  corRacket = color(0);
  corParede = color(44, 62, 80);
  
}


/********* BLOCO DRAW *********/

function draw() {
  // Mostra o conteudo da tela
  if (gameScreen == 0) {
    initScreen();
  } else if (gameScreen == 1) {
    gameplayScreen();
  } else if (gameScreen == 2) {
    gameOverScreen();
  }
}


/********* CONTEUDOS DE TELA *********/

function initScreen() {
  background(236, 240, 241);
  textAlign(CENTER);
  fill(52, 73, 94);
  textSize(70);
  text("Flappy Pong", width/2, height/2);
  textSize(15); 
  text("Clique para Jogar", width/2, height-30);
}
function gameplayScreen() {
  background(236, 240, 241);
  desBol();
  desRacket();
  aplGravidade();
  manterEmTela();
  desBarraSaud();
  mostraPonto();
  aplVelHoriz();
  verQuicaRacket();
  maisParede();
  paredeHandler();
  novoNivel();
  verifItem();
  geraItem();
  
}
function gameOverScreen() {
  background(44, 62, 80);
  textAlign(CENTER);
  fill(236, 240, 241);
  textSize(12);
  text("Seus pontos:", width/2, height/2 - 120);
  textSize(130);
  text(pontos, width/2, height/2);
  textSize(15);
  text("Click para recomeçar", width/2, height-30);
}


/********* INPUTS *********/

function mousePressed() {
  // Se estiver na tela inicial qnd clicar mouse, iniciar jogo
  if (gameScreen==0) { 
    startGame();
  }
  if (gameScreen==2) {
    restart();
  }
}


/********* OUTRAS FUNÇÕES *********/

// INICIA AS VARIAVEIS PARA O JOGO
function startGame() {
  gameScreen=1;
}
function gameOver() {
  gameScreen=2;
}

function restart() {
  pontos = 0;
  saude = saudeMax;
  bolX=width/4;
  bolY=height/5;
  ultTemp = 0;
  paredes = [];
  gameScreen = 1;
  corParede = color(44, 62, 80);
  velParede = 4;
  
}

//Desenha a bola
function desBol() {
  fill(corBol);
  ellipse(bolX, bolY, tamBol, tamBol);
}

//Desenha racket
function desRacket() {
  fill(corRacket);
  rectMode(CENTER);
  rect(mouseX, mouseY, racketLargur, racketAltur, 5);
}

//gera valores para parede e armazena em uma string
function maisParede() {
  if (millis()- ultTemp > inteParede) {
    var randHeight = round(random(altMin, altMax));
    var randY = round(random(0, height-randHeight));
    // {gapparedeX, gapparedeY, gapparedeLargura, gapparedeAltura, pontos}
    var randparede = [width, randY, lagParede, randHeight, 0]; 
    paredes.push(randparede);
    ultTemp = millis();
  }
}
function paredeHandler() {
  for (var i = 0; i < paredes.length; i++) {
    paredeRemover(i);
    paredeMover(i);
    desParede(i);
    colisao(i);
	//watchWallCollision(i);
   
  }
}

//Desenha a parede
function desParede(index) {
  var parede = paredes[index];
  // pega os valores da parede 
  var paredeX = parede[0];
  var paredeY = parede[1];
  var paredeLargura = parede[2];
  var gapParedeAltura = parede[3];
  // dsenha paredes
  rectMode(CORNER);
  noStroke();
  strokeCap(ROUND);
  fill(corParede);
  rect(paredeX, 0, paredeLargura, paredeY, 0, 0, 15, 15);
  rect(paredeX, paredeY+gapParedeAltura, paredeLargura, height-(paredeY+gapParedeAltura), 15, 15, 0, 0);
}

function paredeMover(index) {
  var parede = paredes[index];
  parede[0] -= velParede;
}

function paredeRemover(index) {
  var parede = paredes[index];
  if (parede[0]+parede[2] <= 0) {
    paredes.splice(index, 1);
  }
}

function geraItem(){
	if(itenX<=width && (itenX+(tamIten/2)) > 0){
		fill(138,0,103);
        ellipse(itenX, itenY, tamIten, tamIten);
		itenX -= velParede;
		/*if ((dist(bolX,bolY,itenX,itenY)) <= ((tamBol/2)+(tamIten/2) || ((itenX+(tamIten/2) > mouseX-(racketLargur/2)) && (itenX-(tamIten/2) < mouseX+(racketLargur/2))) {
			if (dist(itenX, itenY, itenX, mouseY)<=(tamBol/2)){
			vida+=10;
			itenX=0;
		}*/
	}
	else if((itenX+(tamIten/2)) < 0){
		itenY = round(random(15, height-50));
	} 
	}

function verifItem() {
	if ((millis() - ultIntev) > intevItem ){
		itenX = width;
		ultIntev = millis();
	}
}
//Colisao

function colisao(index) {
  var parede = paredes[index];
  // Carrega as definições de parede   
  var gapParedeX = parede[0];
  var gapParedeY = parede[1];
  var gapParedeLargura = parede[2];
  var gapParedeAltura = parede[3];
  var paredePontos = parede[4];
  var paredeTopX = gapParedeX;
  var paredeTopY = 0;
  var paredeTopLargura = gapParedeLargura;
  var paredeTopAltura = gapParedeY;
  var paredeBaixoX = gapParedeX;
  var paredeBaixoY = gapParedeY+gapParedeAltura;
  var paredeBaixoLargura = gapParedeLargura;
  var paredeBaixoAltura = height - (gapParedeY+gapParedeAltura);

  if (
    ( bolX+(tamBol/2)>paredeTopX) &&
    ( bolX-(tamBol/2)<paredeTopX+paredeTopLargura) &&
    ( bolY+(tamBol/2)>paredeTopY) &&
    ( bolY-(tamBol/2)<paredeTopY+paredeTopAltura)
    ) {
    menosSaud();
  }
  if (
    ( bolX+( tamBol/2)>paredeBaixoX) &&
    ( bolX-( tamBol/2)<paredeBaixoX+paredeBaixoLargura) &&
    ( bolY+( tamBol/2)>paredeBaixoY) &&
    ( bolY-( tamBol/2)<paredeBaixoY+paredeBaixoAltura)
    ) {
   menosSaud();
  }

  if ( bolX > gapParedeX+(gapParedeLargura/2) && paredePontos==0) {
    paredePontos=1;
    parede[4]=1; // impedir q seja marcado pontos + de 1 vez
    maisPonto();
  }
} 

function desBarraSaud() {
  noStroke();
  fill(189, 195, 199);
  rectMode(CORNER);
  rect(bolX-(barraSaudeLarg/2), bolY - 30, barraSaudeLarg, 5);
  if (saude > 60) {
    fill(46, 204, 113);
  } else if (saude > 30) {
    fill(230, 126, 34);
  } else {
    fill(231, 76, 60);
  }
  rectMode(CORNER);
  rect(bolX-(barraSaudeLarg/2), bolY - 30, barraSaudeLarg*(saude/saudeMax), 5);
}

function menosSaud() {
  //saude -= saudeMenos;
  if (saude <= 0) {
    gameOver();
  }
}

function maisPonto() {
  pontos++;
}
function mostraPonto() {
  textAlign(CENTER);
  fill(0);
  textSize(30); 
  text(pontos, height/2, 50);
}


function verQuicaRacket() {
  var emcima = mouseY - pmouseY;
  if ((bolX+(tamBol/2) > mouseX-(racketLargur/2)) && (bolX-(tamBol/2) < mouseX+(racketLargur/2))) {
    if (dist(bolX, bolY, bolX, mouseY)<=(tamBol/2)+abs(emcima)) {
      fazerQuicarChao(mouseY);
      horizBolVel = (bolX - mouseX)/10;
      // racket se movendo para cima
      if (emcima<0) {
        bolY+=(emcima/2);
        vertBolVel+=(emcima/2);
      }
    }
  }
}

function novoNivel() {
	if (pontos > 10 && pontos < 20 && jaFoi[0]==0){
	corParede = color(6, 189, 24);
	velParede++;
	//saude += 50;
	jaFoi[0]=1;
	}
	if ( pontos > 20 && pontos < 30 && jaFoi[1]==0){
	corParede = color(227, 5, 142);
	velParede++;
	//saude += 50;
	jaFoi[1]=1;
	}
	if ( pontos > 30 && pontos < 40 && jaFoi[2]==0){
	corParede = color(207, 230, 0);
	velParede++;
	//saude += 50;
	jaFoi[2]=1;
	}
	if ( pontos > 40 && pontos < 50 && jaFoi[3]==0){
	corParede = color(237, 0, 4);
	velParede++;
	//saude += 50;
	jaFoi[3]=1;
	}
	
}

//Aplica gravidade
function aplGravidade() {
  vertBolVel += gravidade;
  bolY += vertBolVel;
  vertBolVel -= (vertBolVel*artrito);
}
function aplVelHoriz() {
  bolX += horizBolVel;
  horizBolVel -= (horizBolVel*artrito);
}
// bola cai e bate no chao 
function fazerQuicarChao(superfi) {
  bolY = superfi - (tamBol/2);
  vertBolVel*=-1;
  vertBolVel -= (vertBolVel*friccao);
}
// bola sobe e bate no teto
function fazerQuicarTeto(superfi) {
  bolY = superfi + (tamBol/2);
  vertBolVel*=-1;
  vertBolVel -= (vertBolVel*friccao);
}
// bola bate no lado esquerdo
function fazerQuicarEsq(superfi) {
  bolX = superfi + (tamBol/2);
  horizBolVel*=-1;
  horizBolVel -= (horizBolVel*friccao);
}
// Bola Bate no lado direito
function fazerQuicarDir(superfi) {
  bolX = superfi - (tamBol/2);
  horizBolVel*=-1;
  horizBolVel -= (horizBolVel * friccao);
}
// manter a bola na tela
function manterEmTela() {
  // bola bate no chao
  if (bolY+(tamBol/2) > height) { 
    fazerQuicarChao(height);
  }
  // ball hits ceiling
  if (bolY-(tamBol/2) < 0) {
    fazerQuicarTeto(0);
  }
  // ball hits left of the screen
  if (bolX-(tamBol/2) < 0) {
    fazerQuicarEsq(0);
  }
  // ball hits right of the screen
  if (bolX+(tamBol/2) > width) {
    fazerQuicarDir(width);
  }
}

