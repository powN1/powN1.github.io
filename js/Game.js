import {Spaceship} from './Spaceship.js';
import {Enemy} from './Enemy.js';

class Game {
  #htmlElements = {
    container: document.querySelector('[data-container]'),
    spaceship: document.querySelector('[data-spaceship]'),
    score: document.querySelector('[data-score]'),
    lives: document.querySelector('[data-lives]'), 
    modal: document.querySelector('[data-modal]'), 
    modalButton: document.querySelector('[data-modal-button]'), 
    modalText: document.querySelector('[data-modal-text]'), 
  }
  #ship = new Spaceship(this.#htmlElements.spaceship, this.#htmlElements.container);
  #checkPositionInterval = null;
  #createEnemyInterval = null;
  #enemies = [];
  #enemiesInterval = null;
  #lives = null;
  #score = null;
  constructor() {
  
  }
  init() {
    this.#ship.init();
    this.#newGame();
    this.#htmlElements.modalButton.addEventListener('click', () => this.#newGame());
  }
  checkElementsOutside() {
    this.#enemies.forEach((enemy, enemyIndex, enemyArr) => {
      const enemyPosition = {
        top: enemy.element.offsetTop,
        bottom: enemy.element.offsetTop + enemy.element.offsetHeight,
        left: enemy.element.offsetLeft,
        right: enemy.element.offsetLeft + enemy.element.offsetWidth,
      }
      if(enemyPosition.top > window.innerHeight) {
        enemyArr.slice(enemyIndex, 1);
        enemy.remove();
        this.#updateLives();
      }
      this.#ship.missiles.forEach((missile, missileIndex, missilesArr) => {
        const missilePosition = {
          top: missile.element.offsetTop,
          bottom: missile.element.offsetTop + missile.element.offsetHeight,
          left: missile.element.offsetLeft,
          right: missile.element.offsetLeft + missile.element.offsetWidth,
        }
        if(missilePosition.top < 0) {
          missilesArr.slice(missileIndex, 1);
          missile.remove();
        }
        if((missilePosition.top <= enemyPosition.bottom) && missilePosition.right >= enemyPosition.left && missilePosition.left <= enemyPosition.right) {
          enemy.hit();
          if(!enemy.lives) {
            enemyArr.slice(enemyIndex, 1);
            this.#updateScore();
          }
          missilesArr.slice(missileIndex, 1);
          missile.remove();
        }
      })
    })
  }
  #updateLives() {
    this.#lives--;
    this.#updateLivesText();
    this.#htmlElements.container.classList.add('hit');
    setTimeout(()=> this.#htmlElements.container.classList.remove('hit'), 100);
    if(!this.#lives) {
      this.#endGame();
    }
  }
  #updateScore() {
    this.#score++;
    if(!(this.#score % 5)) {
      this.#enemiesInterval--;
    }
    this.#updateScoreText();
  }
  #updateScoreText() {
    this.#htmlElements.score.textContent = `Score: ${this.#score}`;
  }
  #updateLivesText() {
    this.#htmlElements.lives.textContent = `Lives: ${this.#lives}`;
  }
  #createNewEnemy(...params) {
    const enemy = new Enemy(...params);
    enemy.init();
    this.#enemies.push(enemy);
  }
  #randomNewEnemy() {
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    randomNumber % 5 ? this.#createNewEnemy(this.#htmlElements.container, 'container__spaceship-enemy', 'container__explosion', this.#enemiesInterval) : this.#createNewEnemy(this.#htmlElements.container, 'container__spaceship-enemy--big','container__explosion--big', this.#enemiesInterval * 2, 3);
  }
  #endGame() {
    this.#htmlElements.modal.classList.remove('hide');
    this.#htmlElements.modalText.textContent = `You lose! Your score: ${this.#score}`;
    this.#enemies.forEach(enemy => enemy.remove());
    this.#enemies.length = 0;
    clearInterval(this.#createEnemyInterval);
    clearInterval(this.#checkPositionInterval);
  
  }
  #newGame() {
    this.#htmlElements.modal.classList.add('hide');
    this.#ship.element.style.left = '0px';
    this.#ship.setPosition();
    this.#lives = 3;
    this.#score = 0;
    this.#updateScoreText();
    this.#updateLivesText();
    this.#enemiesInterval = 30;
    this.#createEnemyInterval = setInterval(() => {
      this.#randomNewEnemy();
    }, 1000);
    this.#checkPositionInterval = setInterval(()=> {
      this.checkElementsOutside();
    }, 100);
  }
}

window.onload = function() {
  const game = new Game();
  game.init();
}