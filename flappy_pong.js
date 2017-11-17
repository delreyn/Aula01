

/********* VARIAVEIS *********/

// 0: Tela Inicial 
// 1: Tela d Jogo
// 2: Tela de Game-over 

var anima = false;
var fim = false;
var count =0;

var gameScreen = 0;

var gravidade = 0.3;
var artrito = 0.00001;
var friccao = 0.1;

var record = 0;

var intevItem = 10000; 
var ultIntev = 0;
var tamIten = 65;
var itenX = 900;
var itenY = 70;
var velIten = 6;
var maisSaude = 40;
var bonus = 4;

var bolX, bolY;
var corBol;
var tamBol = 20;
var vertBolVel = 0;
var horizBolVel = 0;

var dano;
var vida;
var lagImg = 20;
var altImg = 20;

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
var jaFoi = [0,0,0,0,0];

/********** Carrega Imagem *************/

function preload() {
  dano = loadImage("imagens/skull_sprite.png");
  vida = loadImage("imagens/heart.png")
}

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

//Tela principal do jogo.
function gameplayScreen() {
  background(236, 240, 241);
  desBol();
  desRacket();
  aplGravidade();
  manterEmTela();
  desBarraSaud();
  aplVelHoriz();
  verQuicaRacket();
  maisParede();
  paredeHandler();
  mostraPonto();
  novoNivel();
  verifItem();
  geraItem();
  mostraRecord();
  animaDano();

}

function gameOverScreen() {
  background(44, 62, 80);
  textAlign(CENTER);
  fill(236, 240, 241);
  textSize(15);
  text("Seus pontos:", width/2, height/2 - 120);
  textSize(130);
  text(pontos, width/2, height/2);
	textSize(12);
	text("Recorde:", width/2, height/2 + 90);
	textSize(25); 
	text(record, width/2, round(height/2) + 115);
  textSize(15);
  text("Click para recomeçar", width/2, height - 10);
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
  lagParede = 80;
  for(var i=0; i<6; i++){
	  jaFoi[i]=0;
  }
  inteParede = 1000;
  anima = false;
  ultIntev = 0;
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
	if(itenX<=width && (itenX+(tamIten)) > 0){
		image(vida,itenX,itenY,tamIten+40,tamIten);

		itenX -= velIten;
				if (((itenX+(tamIten/2) > mouseX-(racketLargur/2)) && (itenX-(tamIten/2) < mouseX+(racketLargur/2)))){
				  if(dist(itenX, itenY, itenX, mouseY)<=(tamIten/2)) {
					 
					 if(saude == saudeMax){
						 pontos += bonus;
						 
					 }
					else if ( (saude + maisSaude) > saudeMax){
						 saude = saudeMax;
					 }
					 else if (saude + maisSaude < saudeMax){
						 saude += maisSaude;
					 }
					 itenX=900;
					 }
		}   
	}
	else if((itenX+(tamIten)) < 0  || itenX>width){
		itenY = round(random(15, height-10));
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

  if ( bolX > gapParedeX+(gapParedeLargura/2) && paredePontos==0 && anima == false) {
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
  saude -= saudeMenos;
  if (saude <= 0) {
    anima = true;

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

function mostraRecord(){
	textAlign(CORNER);
	if(record === 0){
		
	}
	else {
		textSize(25);
		fill(205, 173, 0);
		text(record, 30, round(height/12) );
	}
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
	if (pontos > 20 && pontos < 30 && jaFoi[0]==0){
	corParede = color(6, 189, 24);
	velParede += 3;
	//saude += 50;
	jaFoi[0]=1;
	inteParede = round(inteParede*(4/5));
	lagParede -= 5;
	intevItem = 35000;
	}
	if ( pontos > 30 && pontos < 40 && jaFoi[1]==0){
	corParede = color(	1, 191, 134);
	velParede -= 3;
	//saude += 50;
	jaFoi[1]=1;
	inteParede = round(inteParede*(3/5));
	lagParede += 5;
	
	}
	if ( pontos > 40 && pontos < 50 && jaFoi[2]==0){
	corParede = color(79, 28, 0);
	velParede++;
	//saude += 50;
	jaFoi[2]=1;
	lagParede += 5;
	intevItem -= 2000;
	}
	if ( pontos > 50 && pontos < 60 && jaFoi[3]==0){
	corParede = color(255, 153, 0);
	velParede += 3;
	//saude += 50;
	jaFoi[3]=1;
	inteParede = round(inteParede*(3/5));
	lagParede += 15;
	}
	if ( pontos > 60 && pontos < 70 && jaFoi[4]==0){
	corParede = color(255, 89, 89);
	velParede += 2;
	//saude += 50;
	jaFoi[4]=1;
	//inteParede = round(inteParede*(3/5));
	lagParede += 5;
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
  if (bolY+(tamBol/2) > height /*&& !ativAnim*/ ) { 
    fazerQuicarChao(height);
  }
  // bola acerta topo
  if (bolY-(tamBol/2) < 0) {
    fazerQuicarTeto(0);
  }
  // bola acerta canto esquerdo da tela
  if (bolX-(tamBol/2) < 0) {
    fazerQuicarEsq(0);
  }
  // bola acerta canto esquerdo
  if (bolX+(tamBol/2) > width) {
    fazerQuicarDir(width);
  }
}

//gera a animacao da caveira quando o jogador morre.

function animaDano(){
	if (anima == true){
		
		if (count <250 ){
		imageMode(CENTER);
		lagImg +=  25; 
		altImg +=  25;
		image(dano,width/2,height/2,lagImg,altImg);
		count += 5;
	}
	
	if (count >= 250){
			
			lagImg = tamBol;
			altImg = tamBol;
			count =0;
			if ( pontos >= record){
				record = pontos;
	}
			gameOver();	
			
	}
	
	}
}

