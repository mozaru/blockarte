class Input {
  constructor() {
    this.esquerda = false;
    this.direita = false;

    this.#setupTeclado();
    this.#setupMobile();
  }

  #setupTeclado() {
    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') this.esquerda = true;
      if (e.key === 'ArrowRight') this.direita = true;
    });

    window.addEventListener('keyup', e => {
      if (e.key === 'ArrowLeft') this.esquerda = false;
      if (e.key === 'ArrowRight') this.direita = false;
    });
  }

  #setupMobile() {
    const leftBtn = document.getElementById('btn-left');
    const rightBtn = document.getElementById('btn-right');

    const toggle = (btn, prop, val) => {
      btn.addEventListener('touchstart', e => {
        e.preventDefault();
        this[prop] = val;
      }, { passive: false });

      btn.addEventListener('touchend', e => {
        e.preventDefault();
        this[prop] = false;
      }, { passive: false });
    };

    toggle(leftBtn, 'esquerda', true);
    toggle(rightBtn, 'direita', true);

    // Detectar se é mobile e mostrar controles
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      document.getElementById('mobile-controls').style.display = 'flex';
    }
  }

  update() {
    // Aqui poderíamos adicionar debounce ou controles extras no futuro
  }
}
