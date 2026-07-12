import debounce from "./debounce/debounce.js";
export class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.activeClass = "active";
    this.distance = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
    };
  }

  //Aplica o efeito de transição entre os slides
  transition(active) {
    this.slide.style.transition = active ? "transform .3s" : "";
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
    let movetype;
    if (event.type === "mousedown") {
      event.preventDefault();
      this.distance.startX = event.clientX;
      movetype = "mousemove";
    } else {
      this.distance.startX = event.changedTouches[0].clientX;
      movetype = "touchmove";
    }
    this.wrapper.addEventListener(movetype, this.onMove);
    this.transition(false);
  }

  //Ativa o método ao evento de mover o mouse
  onMove(event) {
    const pointerPosition =
      event.type === "mousemove"
        ? event.clientX
        : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  //Desativa os métodos de click e mousemove
  onEnd(event) {
    const movetype = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.wrapper.removeEventListener(movetype, this.onMove);
    this.distance.finalPosition = this.distance.movePosition;
    this.transition(true);
    this.changeSlideOnEnd();
  }

  //Muda para o slide anterior ou para o próximo
  changeSlideOnEnd() {
    if (this.distance.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (
      this.distance.movement < -120 &&
      this.index.previous !== undefined
    ) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.current);
    }
  }
  //Adiciona o evento para cada slide
  addEventSlide() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }

  //Calcula a posição do slide em relação ao centro da tela
  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  //Slide Settings
  slidesSettings() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return { position, element };
    });
  }

  //Identifica qual o slide anterior e o próximo
  slidesIndexNav(index) {
    const lastItem = this.slideArray.length - 1;
    this.index = {
      previous: index ? index - 1 : undefined,
      current: index,
      next: index === lastItem ? undefined : index + 1,
    };
  }

  //Altera o slide de acordo com o index
  changeSlide(index) {
    const currentSlide = this.slideArray[index];
    this.moveSlide(currentSlide.position);
    this.slidesIndexNav(index);
    this.distance.finalPosition = currentSlide.position;
    this.changeActiveClass();
  }

  //Aplica a classe "active" ao slide atual
  changeActiveClass() {
    this.slideArray.forEach((item) => {
      item.element.classList.remove(this.activeClass);
    });
    this.slideArray[this.index.current].element.classList.add(this.activeClass);
  }

  //Ativa o slide anterior
  activePrevSlide() {
    if (this.index.previous !== undefined) {
      this.changeSlide(this.index.previous);
    }
  }

  //Ativa o próximo slide
  activeNextSlide() {
    if (this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    }
  }

  //Atualiza de acordo com o redimensionamento da tela
  onResize() {
    setTimeout(() => {
      this.slidesSettings();
      this.changeSlide(this.index.current);
    }, 1000);
  }

  //Adiciona o evento ao resize
  addResizeEvent() {
    window.addEventListener("resize", this.onResize);
  }

  //Aplica o bind a todos os eventos selecionados
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 200);
    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
  }

  //Inicia o evento
  init() {
    this.bindEvents();
    this.addEventSlide();
    this.transition(true);
    this.slidesSettings();
    this.changeSlide(0);
    this.addResizeEvent();
    return this;
  }
}

export class SlideNav extends Slide {
  addArrow(previous, next) {
    this.prevElement = document.querySelector(previous);
    this.nextElement = document.querySelector(next);
    this.addArrowEvents();
  }

  addArrowEvents() {
    this.prevElement.addEventListener("click", this.activePrevSlide);
    this.nextElement.addEventListener("click", this.activeNextSlide);
  }
}
