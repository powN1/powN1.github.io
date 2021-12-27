export class Enemy {
  constructor(container, enemyClass, explosionClass, enemiesInterval, lives = 1) {
    this.container = container;
    this.enemyClass = enemyClass;
    this.explosionClass = explosionClass;
    this.element = document.createElement('div');
    this.intervalID = null;
    this.enemiesInterval = enemiesInterval;
    this.lives = lives;
  }
  init() {
    this.#setEnemy();
    this.#updatePosition();
  }
  #setEnemy() {
    this.element.classList.add(this.enemyClass);
    this.container.appendChild(this.element);
    this.element.style.top = `0px`;
    this.element.style.left = `${this.#randomPosition()}px`;
  }
  #randomPosition() {
    return Math.floor(Math.random() * window.innerWidth - this.element.offsetWidth);
  }
  #updatePosition() {
    this.intervalID = setInterval(()=> this.#setNewPosition(), this.enemiesInterval)
  }
  #setNewPosition() {
    this.element.style.top = `${this.element.offsetTop + 1}px`
  }
  remove() {
    this.element.remove();
    clearInterval(this.intervalID);
  }
  explode() {
    const animationTime = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--explosion-animation-time'), 10);
    this.element.classList.remove(this.enemyClass);
    this.element.classList.add(this.explosionClass);
    clearInterval(this.intervalID);
    setTimeout(()=> this.remove(), animationTime);
  }
  hit() {
    this.lives--;
    if(!this.lives) {
      this.explode();
    }
  }
}