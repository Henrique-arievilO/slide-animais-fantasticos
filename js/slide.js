export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.distance = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
    };
  }

  //Método que move os slides
  moveSlide(distX) {
    this.distance.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  //Atualiza a posição do mouseMove em relação ao click
  updatePosition(clientX) {
    this.distance.movement = (this.distance.startX - clientX) * 1.6;
    return this.distance.finalPosition - this.distance.movement;
  }

  //Ativa o método ao evento de clique
  onStart(event) {
    event.preventDefault();
    this.distance.startX = event.clientX;
    this.wrapper.addEventListener("mousemove", this.onMove);
  }

  //Ativa o método ao evento de mover o mouse
  onMove(event) {
    const finalPosition = this.updatePosition(event.clientX);
    this.moveSlide(finalPosition);
  }

  //Desativa os métodos de click e mousemove
  onEnd(event) {
    this.wrapper.removeEventListener("mousemove", this.onMove);
    this.distance.finalPosition = this.distance.movePosition;
  }

  //Adiciona o evento para cada slide
  addEventSlide() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
  }

  //Aplica o bind a todos os eventos selecionados
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  //Inicia o evento
  init() {
    this.bindEvents();
    this.addEventSlide();
    return this;
  }
}
