export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
  }

  //Ativa o método ao evento de clique
  onStart(event) {
    event.preventDefault();
    console.log("clicou");
    this.wrapper.addEventListener("mousemove", this.onMove);
  }

  //Ativa o método ao evento de mover o mouse
  onMove(event) {
    console.log("moveu");
  }

  //Desativa os métodos de click e mousemove
  onEnd(event) {
    console.log("acabou");
    this.wrapper.removeEventListener("mousemove", this.onMove);
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
