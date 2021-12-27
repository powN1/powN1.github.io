export class Missile {
  constructor(x,y, container) {
    this.x = x;
    this.y = y;
    this.container = container;
    this.element = document.createElement('div');
    this.intervalID = null;
  }
  init() {
    this.element.classList.add('container__missile');
    this.container.appendChild(this.element);
    this.element.style.left = `${this.x - (this.element.offsetWidth / 2) - 2.5}px`;
    this.element.style.top = `${this.y - this.element.offsetHeight}px`;
    this.intervalID = setInterval(() => {
      this.element.style.top = `${this.element.offsetTop - 3}px`
    }, 10)
  }
  remove() {
    this.element.remove();
    clearInterval(this.intervalID);
  }
}