class CriaturaBase {
  constructor(quantidade = 10000) {
    this.ehBoss = quantidade>25000;
    this.pontosOrigem = new Float32Array(quantidade * 2);
    this.pontos = new Float32Array(quantidade * 2).fill(0);
    this.hit = new Float32Array(quantidade).fill(0);
    this.quantidade = quantidade;

    for (let i = 0; i < quantidade; i++) {
      this.pontosOrigem[i * 2] = i;
      this.pontosOrigem[i * 2 + 1] = i / 235;
    }
  }

  update(t) {
    // Deve ser sobrescrito
  }

  bounce(x, width) {
    let m = ((x % (width * 2)) + (width * 2)) % (width * 2);
    return m < width ? m : (2 * width - m);
  }

  checarColisoes(bola) {
    let acertos = 0;
    for (let i = 0; i < this.quantidade; i++) {
      if (this.hit[i]) continue;
      const dx = this.pontos[i * 2] - bola.x;
      const dy = this.pontos[i * 2 + 1] - bola.y;
      if (dx * dx + dy * dy < bola.raio * bola.raio) {
        this.hit[i] = 1;
        bola.dy *= -1;
        acertos++;
      }
    }
    return acertos;
  }

   desenhar(ctx) {
    const agrupados = new Map();

    for (let i = 0; i < this.quantidade; i++) {
      const x = Math.round(this.pontos[i * 2]);
      const y = Math.round(this.pontos[i * 2 + 1]);
      const hit = this.hit[i] ? 1 : 0;
      const key = `${x},${y}`;

      if (!agrupados.has(key)) {
        agrupados.set(key, { x, y, cont: 0, hit: 0 });
      }

      const item = agrupados.get(key);
      item.cont += 1;
      item.hit += hit; // contar quantos são "atingidos"
    }

    for (let { x, y, cont, hit } of agrupados.values()) {
      const alfa = hit/cont;
      const baseColor = [(128*alfa+255*(1-alfa)), 0*alfa+255*(1-alfa), 0];
      const alpha = Math.min(1, 0.1 * cont); // controla opacidade máxima
      ctx.fillStyle = `rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // let cont = 0;
    // let ultimo = this.quantidade-1;
    //  for (let i = 0; i < this.quantidade; i++) {
    //    //if (this.hit[i]) continue;
    //    //const color = this.hit[i] ? "#80000020" : "#FFFF0020";
    //    const baseColor = this.hit[i] ? [128, 0, 0] : [255, 255, 0];
    //    if (i!=ultimo && Math.abs(this.pontos[i * 2]-this.pontos[(i+1) * 2])<=1 && Math.abs(this.pontos[i * 2 + 1]-this.pontos[(i+1) * 2 + 1])<=1)
    //    {
    //       cont++;
    //       continue;
    //    }
    //    cont++;
    //    ctx.beginPath();
    //    ctx.arc(this.pontos[i * 2], this.pontos[i * 2 + 1], 1, 0, Math.PI * 2);
    //    const alpha = Math.min(1, 0.1 * cont); 
    //    const color = `rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},${alpha})`;
    //    ctx.fillStyle = color;
    //    ctx.fill();
    //    cont = 0;
    //  }
   }

//   desenhar(ctx) {
//     ctx.fillStyle = "#80000020";
//     ctx.beginPath();
//     for (let i = 0; i < this.quantidade; i++) {
//       if (!this.hit[i]) continue;
//       ctx.moveTo(this.pontos[i * 2], this.pontos[i * 2 + 1]);
//       ctx.arc(this.pontos[i * 2], this.pontos[i * 2 + 1], 1, 0, Math.PI * 2);
//     }
//     ctx.fill();
  
//     ctx.fillStyle = "#FFFF0020";
//     ctx.beginPath();
//     for (let i = 0; i < this.quantidade; i++) {
//       if (this.hit[i]) continue;
//       ctx.moveTo(this.pontos[i * 2], this.pontos[i * 2 + 1]);
//       ctx.arc(this.pontos[i * 2], this.pontos[i * 2 + 1], 1, 0, Math.PI * 2);
//     }
//     ctx.fill();
//   }
}

class Criatura10000PTS_1 extends CriaturaBase {
  constructor(quantidade = 10000) {
    super(quantidade);
    for (let i = 0; i < quantidade; i++) {
      this.pontosOrigem[i * 2] = i;
      this.pontosOrigem[i * 2 + 1] = i / 41;
    }
  }
  static getBioName() {
    return "Sinustaris Radialis";
  }

  static getDescription() {
    return `
      <p>
        <strong>Sinustaris Radialis</strong> é uma criatura com simetria circular quase perfeita, formada por ondas senoidais combinadas com padrões rotacionais. 
        Seu corpo pulsa com precisão matemática, como se respondesse a um relógio interno alienígena. 
        A movimentação das suas camadas internas simula ciclos de contração e expansão harmônicos.
      </p>
    `;
  }

  static getFormula() {
    return `<pre>
  a = (x, y, d = mag(
      k = 5 * cos(x / 19) * cos(y / 30), 
      e = y / 8 - 12
    ) ** 2 / 59 + 2) => point(
      (q = 4 * sin(atan2(k, e) * 9) 
          + 9 * sin(d - t) 
          - k / d * (9 + sin(d * 9 - t * 16) * 3)
      ) 
      + 50 * cos(c = d * d / 7 - t) + 200,
      q * sin(c) + d * 45 - 9
  )
  </pre>`;
  }

  update(t) {
    const PI = Math.PI;
    t = t * PI / 5;

    for (let i = 0; i < this.quantidade; i++) {
      const x = this.pontosOrigem[i * 2];
      const y = this.pontosOrigem[i * 2 + 1];

      const k = 5 * Math.cos(x / 19) * Math.cos(y / 30);
      const e = y / 8 - 12;
      const mag = Math.sqrt(k * k + e * e);
      const d = (mag * mag) / 59 + 2;

      const angle = Math.atan2(k, e);
      const q = 4 * Math.sin(angle * 9) +
                9 * Math.sin(d - t) -
                (k / d) * (9 + Math.sin(d * 9 - t * 16) * 3);

      const c = d * d / 7 - t;
      const yp = q + 50 * Math.cos(c) + 200;
      const xp = 400 - (q * Math.sin(c) + d * 45 - 9);

      this.pontos[i * 2] = this.bounce(xp + t*20.0,400);
      this.pontos[i * 2 + 1] = yp;
    }
  }
}

class Criatura10000PTS_2 extends CriaturaBase {
  constructor(quantidade = 10000) {
    super(quantidade);
    for (let i = 0; i < quantidade; i++) {
      this.pontosOrigem[i * 2] = i;            // x = np.arange(count)
      this.pontosOrigem[i * 2 + 1] = i / 235;  // y = x / 235.0
    }
  }
static getBioName() {
  return "Cosmoramus Segmentalis";
}

static getDescription() {
  return `
    <p>
      <strong>Cosmoramus Segmentalis</strong> apresenta um corpo formado por dobras intercaladas de energia ondulatória. 
      Suas estruturas se estendem de forma vertical, oscilando suavemente ao ritmo de interações entre senoides e cossenoides. 
      Parece viva, como se respirasse por meio de contrações coordenadas que percorrem seu corpo segmentado.
    </p>
  `;
}

static getFormula() {
  return `<pre>
a = (x, y, d = mag(
    k = (4 + cos(y)) * cos(x / 4),
    e = y / 8 - 20
  )) => point(
    (q = sin(k * 3) 
        + sin(y / 19 + 9) * k * (6 + sin(e * 14 - d))
    ) * cos(d / 8 + t / 4)
    + 50 * cos(c = d - t) + 200,
    q * sin(c) + d * 7 * sin(c / 4) + 200
)
</pre>`;
}

  update(frame) {
    const t = frame * Math.PI / 4;

    for (let i = 0; i < this.quantidade; i++) {
      const x = this.pontosOrigem[i * 2];
      const y = this.pontosOrigem[i * 2 + 1];

      const k = (4.0 + Math.cos(y)) * Math.cos(x / 4.0);
      const e = y / 8.0 - 20.0;
      const d = Math.sqrt(k * k + e * e);

      const q =
        Math.sin(k * 3.0) +
        Math.sin(y / 19.0 + 9.0) * k * (6.0 + Math.sin(e * 14.0 - d));

      const c = d - t;

      const yp = q * Math.cos(d / 8.0 + t / 4.0) + 50.0 * Math.cos(c) + 200;
      const xp = q * Math.sin(c) + d * 7.0 * Math.sin(c / 4.0) + 200;

      this.pontos[i * 2] = xp;
      this.pontos[i * 2 + 1] = yp;
    }
  }
}

class Criatura10000PTS_3 extends CriaturaBase {
  constructor(quantidade = 10000) {
    super(quantidade);
    for (let i = 0; i < quantidade; i++) {
      this.pontosOrigem[i * 2] = i;            // x = np.arange(count)
      this.pontosOrigem[i * 2 + 1] = i / 235;  // y = x / 235.0
    }
  }
static getBioName() {
  return "Sinuvora Turbulenta";
}

static getDescription() {
  return `
    <p>
      <strong>Sinuvora Turbulenta</strong> é uma entidade pulsante, moldada por distúrbios senoidais contínuos e imprevisíveis. 
      Seu corpo parece estar em estado de constante fluxo, ondulando como se fosse feito de ondas empilhadas e distorcidas pelo tempo. 
      A criatura manifesta comportamentos orbitais e internos que desafiam simetrias convencionais.
    </p>
  `;
}

static getFormula() {
  return `<pre>
a = (x, y, d = mag(
    k = (4 + sin(y * 2 - t) * 3) * cos(x / 29),
    e = y / 8 - 13
  )) => point(
    (q = 3 * sin(k * 2) 
        + 0.3 / k 
        + sin(y / 25) * k * (9 + 4 * sin(e * 9 - d * 3 + t * 2))
    ) + 30 * cos(c = d - t) + 200,
    q * sin(c) + d * 39 - 220
)
</pre>`;
}

  update(frame) {
    const t = frame * Math.PI / 4;

    for (let i = 0; i < this.quantidade; i++) {
      const x = this.pontosOrigem[i * 2];
      const y = this.pontosOrigem[i * 2 + 1];

      const k = (4 + Math.sin(y * 2 - t) * 3) * Math.cos(x / 29.0);
      const e = y / 8.0 - 13;
      const d = Math.sqrt(k * k + e * e);

      const q =
        3 * Math.sin(k * 2) +
        (0.3 / k) +
        Math.sin(y / 25.0) * k * (9 + 4 * Math.sin(e * 9 - d * 3 + t * 2));

      const c = d - t;

      const yp = q + 30 * Math.cos(c) + 200;
      const xp = 400 - (q * Math.sin(c) + d * 39 - 220);

      this.pontos[i * 2] = this.bounce(xp + t*20.0,400);
      this.pontos[i * 2 + 1] = yp;
    }
  }
}


class Criatura10000PTS_4 extends CriaturaBase {
  constructor(quantidade = 10000) {
    super(quantidade);
    for (let i = 0; i < quantidade; i++) {
      this.pontosOrigem[i * 2] = i;            // x = np.arange(count)
      this.pontosOrigem[i * 2 + 1] = i / 235;  // y = x / 235.0
    }
  }
static getBioName() {
  return "Atantheris Helicoida";
}

static getDescription() {
  return `
    <p>
      <strong>Atantheris Helicoida</strong> gira como um turbilhão microscópico, com movimentos controlados por simetrias angulares complexas. 
      Seu corpo é sustentado por padrões helicoidais que oscilam em intensidade e direção ao longo do tempo. 
      Ela parece responder à rotação de seu próprio campo vetorial, como se cada parte girasse em torno de um núcleo interno matemático.
    </p>
  `;
}

static getFormula() {
  return `<pre>
a = (x, y, d = mag(
    k = 4 * cos(x / 29),
    e = y / 7 - 13
  )) => point(
    (q = 3 * sin(atan2(k, e) * 19) 
        + sin(y / 19) * k * (9 + 2 * sin(e * 9 - d * 3 + t / 4))
    ) + 60 * cos(c = d - t / 8) + 200,
    q * sin(c) + d * 39 - 195
)
</pre>`;
}

  update(frame) {
    const t = frame * Math.PI*2;

    for (let i = 0; i < this.quantidade; i++) {
      const x = this.pontosOrigem[i * 2];
      const y = this.pontosOrigem[i * 2 + 1];

      const k = 4 * Math.cos(x / 29.0);
      const e = y / 7.0 - 13.0;
      const d = Math.sqrt(k * k + e * e);

      const angle = Math.atan2(k, e);  // equivalente ao np.arctan2(k, e)

      const q =
        3 * Math.sin(angle * 19) +
        Math.sin(y / 19.0) * k * (9 + 2 * Math.sin(e * 9 - d * 3 + t / 4.0));

      const c = d - t / 8.0;

      const yp = q + 60 * Math.cos(c) + 200;
      const xp = 400 - (q * Math.sin(c) + d * 39 - 195);

      this.pontos[i * 2] = this.bounce(xp + t*5.0,400);
      this.pontos[i * 2 + 1] = yp;
    }
  }
}


class Criatura10000PTS_5 extends CriaturaBase {
  constructor(quantidade = 10000) {
    super(quantidade);
    for (let i = 0; i < quantidade; i++) {
      this.pontosOrigem[i * 2] = i % 200;       // x = np.arange(count) % 200.0
      this.pontosOrigem[i * 2 + 1] = i / 43.0;  // y = np.arange(count) / 43.0
    }
  }
static getBioName() {
  return "Cosmoflux Toridalis";
}

static getDescription() {
  return `
    <p>
      <strong>Cosmoflux Toridalis</strong> se manifesta como uma dança fluida de forças cossenoidais girando em torno de um eixo invisível. 
      Com apêndices que vibram de forma pulsante e um corpo que curva e expande em ciclos, 
      ela parece responder a campos gravitacionais oscilantes que se dobram sobre si mesmos.
    </p>
  `;
}

static getFormula() {
  return `<pre>
a = (x, y, d = mag(
    k = 5 * cos(x / 14) * cos(y / 30),
    e = y / 8 - 13
  ) ** 2 / 59 + 4) => point(
    (q = 60 - 3 * sin(atan2(k, e) * e)
        + k * (3 + 4 / d * sin(d * d - t * 2))
    ) * sin(c = d / 2 + e / 99 - t / 18) + 200,
    (q + d * 9) * cos(c) + 200
)
</pre>`;
}

  update(frame) {
    const t = frame * Math.PI*4;

    for (let i = 0; i < this.quantidade; i++) {
      const x = this.pontosOrigem[i * 2];
      const y = this.pontosOrigem[i * 2 + 1];

      const k = 5 * Math.cos(x / 14.0) * Math.cos(y / 30.0);
      const e = y / 8.0 - 13.0;
      const mag = Math.sqrt(k * k + e * e);
      const d = (mag * mag) / 59.0 + 4.0;

      const angle = Math.atan2(k, e);

      const q = 
        60
        - 3 * Math.sin(angle * e)
        + k * (3 + 4 / d * Math.sin(d * d - t * 2));

      const c = d / 2 + e / 99.0 - t / 18.0;

      const yp = q * Math.sin(c) + 200;
      const xp = (q + d * 9) * Math.cos(c) + 200;

      this.pontos[i * 2] = xp;
      this.pontos[i * 2 + 1] = yp-80;
    }
  }
}

class Criatura10000PTS_6 extends CriaturaBase {
  constructor(quantidade = 10000) {
    super(quantidade);
    for (let i = 0; i < quantidade; i++) {
      this.pontosOrigem[i * 2] = i % 200;       // x = np.arange(count) % 200.0
      this.pontosOrigem[i * 2 + 1] = i / 55.0;  // y = np.arange(count) / 55.0
    }
  }
static getBioName() {
  return "Oscillaris Luminor";
}

static getDescription() {
  return `
    <p>
      <strong>Oscillaris Luminor</strong> parece flutuar entre planos dimensionais, com pulsos suaves que ondulam de forma hipnótica. 
      Seus movimentos respondem ao tempo como se seguissem uma sinfonia de frequências invisíveis. 
      É uma criatura de simetria calma e graça oscilante, evocando a estética de uma entidade bioluminescente.
    </p>
  `;
}

static getFormula() {
  return `<pre>
a = (x, y, d = mag(
    k = 9 * cos(x / 8),
    e = y / 8 - 12.5
  ) ** 2 / 99 + sin(t) / 6 + 0.5) => point(
    (q = 99 
         - e * sin(atan2(k, e) * 7) / d 
         + k * (3 + cos(d * d - t) * 2)
    ) * sin(c = d / 2 + e / 69 - t / 16) + 200,
    (q + 19 * d) * cos(c) + 200
)
</pre>`;
}

  update(frame) {
    const t = frame * Math.PI*2;

    for (let i = 0; i < this.quantidade; i++) {
      const x = this.pontosOrigem[i * 2];
      const y = this.pontosOrigem[i * 2 + 1];

      const k = 9 * Math.cos(x / 8.0);
      const e = y / 8.0 - 12.5;
      const mag = Math.sqrt(k * k + e * e);
      const d = (mag * mag) / 99.0 + Math.sin(t) / 6.0 + 0.5;

      const angle = Math.atan2(k, e);

      const q =
        99.0
        - (e * Math.sin(angle * 7.0)) / d
        + k * (3.0 + 2.0 * Math.cos(d * d - t));

      const c = d / 2.0 + e / 69.0 - t / 16.0;

      const xp = (q + 19 * d) * Math.cos(c) + 200;
      const yp = q * Math.sin(c) + 200;

      this.pontos[i * 2] = xp;
      this.pontos[i * 2 + 1] = yp;
    }
  }
}

class Criatura10000PTS_7 extends CriaturaBase {
  constructor(quantidade = 10000) {
    super(quantidade);
    for (let i = 0; i < quantidade; i++) {
      this.pontosOrigem[i * 2] = i % 200;       // x = np.arange(count) % 200.0
      this.pontosOrigem[i * 2 + 1] = i / 50.0;  // y = np.arange(count) / 50.0
    }
  }
static getBioName() {
  return "Spiralius Vorticae";
}

static getDescription() {
  return `
    <p>
      <strong>Spiralius Vorticae</strong> é uma criatura com morfologia espiralada e comportamento centrífugo. 
      Seus membros se torcem em torno de um eixo invisível, criando vórtices vivos que giram em sintonia com o tempo. 
      A estrutura interna pulsa com distorções senoidais e curvas logarítmicas, como se fosse feita de vento matemático.
    </p>
  `;
}

static getFormula() {
  return `<pre>
a = (x, y, d = mag(
    k = 11 * cos(x / 8),
    e = y / 8 - 12.5
  ) ** 3 / 1499 
    + cos(e / 4 + t * 2) / 5 + 1
) => point(
  (q = 99 
       - e * sin(e) / d 
       + k * (3 + sin(d * d - t * 2))
  ) * sin(c = d / 2 + e / 99 - t / 8) + 200,
  (q + 19 * d) * cos(c) + 200
)
</pre>`;
}

  update(frame) {
    const t = frame * Math.PI;

    for (let i = 0; i < this.quantidade; i++) {
      const x = this.pontosOrigem[i * 2];
      const y = this.pontosOrigem[i * 2 + 1];

      const k = 11.0 * Math.cos(x / 8.0);
      const e = y / 8.0 - 12.5;
      const mag = Math.sqrt(k * k + e * e);
      const d = Math.pow(mag, 3) / 1499.0 + Math.cos(e / 4.0 + t * 2.0) / 5.0 + 1.0;

      const q =
        99.0
        - (e * Math.sin(e)) / d
        + k * (3.0 + Math.sin(d * d - t * 2.0));

      const c = d / 2.0 + e / 99.0 - t / 8.0;

      const xp = (q + 19.0 * d) * Math.cos(c) + 200;
      const yp = q * Math.sin(c) + 200;

      this.pontos[i * 2] = xp;
      this.pontos[i * 2 + 1] = yp;
    }
  }
}

class Criatura10000PTS_8 extends CriaturaBase {
  constructor(quantidade = 10000) {
    super(quantidade);
    for (let i = 0; i < quantidade; i++) {
      this.pontosOrigem[i * 2] = i;
      this.pontosOrigem[i * 2 + 1] = i / 235;
    }
  }
static getBioName() {
  return "Lamellaris Ondulata";
}

static getDescription() {
  return `
    <p>
      <strong>Lamellaris Ondulata</strong> se apresenta como uma entidade envolta em camadas ondulantes de energia. 
      Suas dobras laterais reagem de forma ritmada ao tempo, como véus flutuando em um mar hiperdimensional. 
      A criatura parece respirar pelas superfícies, absorvendo e liberando padrões harmônicos a cada pulso temporal.
    </p>
  `;
}

static getFormula() {
  return `<pre>
a = (x, y, d = mag(
    k = (4 + sin(x / 11 + t * 8)) * cos(x / 14),
    e = y / 8 - 19
  ) + sin(y / 9 + t * 2)) => point(
    (q = 2 * sin(k * 2) 
         + sin(y / 17) * k * (9 + 2 * sin(y - d * 3))
    ) + 50 * cos(c = d * d / 49 - t) + 200,
    q * sin(c) + d * 39 - 440
)
</pre>`;
}

  update(t) {
    for (let i = 0; i < this.quantidade; i++) {
      const x = this.pontosOrigem[i * 2];
      const y = this.pontosOrigem[i * 2 + 1];
      const k = (4 + Math.sin(x / 11 + 8 * t)) * Math.cos(x / 14);
      const e = y / 8 - 19;
      const d = Math.sqrt(k * k + e * e) + Math.sin(y / 9 + 2 * t);
      const q = 2 * Math.sin(2 * k) + Math.sin(y / 17) * k * (9 + 2 * Math.sin(y - 3 * d));
      const c = d * d / 49 - t;
      //const xp = q * Math.sin(c) + d * 39 - 440) + t*20.0, 400);
      //const yp = 400 - (q + 50 * Math.cos(c) + 280);
      //const xp = this.bounce(400 - (q * Math.sin(c) + d * 39 - 440) + t*20.0, 400);

      const xp = 400 - (q * Math.sin(c) + d * 39 - 440);
      const yp = q + 50 * Math.cos(c) + 200;

      this.pontos[i * 2] = this.bounce(xp + t*20.0,400);
      this.pontos[i * 2 + 1] = yp-40; 
    }
  }
}


class Criatura10000PTS_9 extends CriaturaBase {
  constructor(quantidade = 10000) {
    super(quantidade);
    for (let i = 0; i < quantidade; i++) {
      this.pontosOrigem[i * 2] = i;            // x = np.arange(count)
      this.pontosOrigem[i * 2 + 1] = i / 235;  // y = x / 235.0
    }
  }
static getBioName() {
  return "Tremulon Fractalix";
}

static getDescription() {
  return `
    <p>
      <strong>Tremulon Fractalix</strong> é uma criatura de oscilação nervosa e beleza fraturada. 
      Suas formas ondulam em padrões quase fractais, alternando entre simetria e caos rítmico. 
      A criatura responde a impulsos externos com microvibrações estruturais que fazem sua geometria parecer viva, mutante.
    </p>
  `;
}

static getFormula() {
  return `<pre>
a = (x, y, d = mag(
    k = (4 + cos(x / 9 - t)) * cos(x / 30),
    e = y / 7 - 13
  ) + sin(y / 99 + t / 2) - 4) => point(
    (q = 3 * sin(k * 2) 
         + sin(y / 29) * k * (9 + 2 * sin(cos(e) * 9 - d * 4 + t))
    ) + 40 * cos(c = d - t) + 200,
    q * sin(c) + d * 35
)
</pre>`;
}

  update(frame) {
    const t = frame * Math.PI;

    for (let i = 0; i < this.quantidade; i++) {
      const x = this.pontosOrigem[i * 2];
      const y = this.pontosOrigem[i * 2 + 1];

      const k = (4.0 + Math.cos(x / 9.0 - t)) * Math.cos(x / 30.0);
      const e = y / 7.0 - 13.0;
      const mag = Math.sqrt(k * k + e * e);
      const d = mag + Math.sin(y / 99.0 + t / 2.0) - 4.0;

      const q =
        3.0 * Math.sin(k * 2.0) +
        Math.sin(y / 29.0) * k * (9.0 + 2.0 * Math.sin(Math.cos(e) * 9.0 - d * 4.0 + t));

      const c = d - t;

      const yp = q + 40.0 * Math.cos(c) + 200.0;
      const xp = 400 - (q * Math.sin(c) + d * 35.0);

      this.pontos[i * 2] = this.bounce(xp + t*20.0,400);
      this.pontos[i * 2 + 1] = yp-40;
    }
  }
}


class Criatura40000PTS_1 extends CriaturaBase {
  constructor(quantidade = 40000) {
    super(quantidade);
    for (let i = 0; i < quantidade; i++) {
      this.pontosOrigem[i * 2] = i % 200;       // x = np.arange(count) % 200.0
      this.pontosOrigem[i * 2 + 1] = i / 200.0; // y = np.arange(count) / 200.0
    }
  }
static getBioName() {
  return "Graviton Abyssalis";
}

static getDescription() {
  return `
    <p>
      <strong>Graviton Abyssalis</strong> é uma entidade de alta densidade matemática, que curva o espaço ao seu redor com pulsações geométricas. 
      Sua estrutura é instável e intensamente modulada, como se orbitasse um centro invisível de gravidade fractal. 
      Cada ponto do seu corpo parece afetar o espaço-tempo vetorialmente, gerando ondas que se propagam em múltiplas dimensões.
    </p>
  `;
}

static getFormula() {
  return `<pre>
a = (x, y, d = 5 * cos(
    o = mag(
      k = x / 8 - 12.5,
      e = y / 8 - 12.5
    ) / 12 * cos(sin(k / 2) * cos(e / 2))
  )) => point(
    (x + d * k * (sin(d * 2 + t) + sin(y * o * o) / 9)) / 1.5 + 133,
    (y / 3 - d * 40 + 19 * cos(d + t)) * 1.5 + 300
)
</pre>`;
}

  update(frame) {
    const t = frame * Math.PI;

    for (let i = 0; i < this.quantidade; i++) {
      const x = this.pontosOrigem[i * 2];
      const y = this.pontosOrigem[i * 2 + 1];

      const k = x / 8.0 - 12.5;
      const e = y / 8.0 - 12.5;
      const o = Math.sqrt(k * k + e * e) / 12.0 * Math.cos(Math.sin(k / 2.0) * Math.cos(e / 2.0));
      const d = 5.0 * Math.cos(o);

      const q1 = Math.sin(d * 2 + t);
      const q2 = Math.sin(y * o * o) / 9.0;

      const yp = (x + d * k * (q1 + q2)) / 1.5 + 133.0;
      const xp = 400 - ((y / 3.0 - d * 40.0 + 19.0 * Math.cos(d + t)) * 1.5 + 300.0);

      this.pontos[i * 2] = this.bounce(xp + t*20.0,400);
      this.pontos[i * 2 + 1] = yp-40;
    }
  }
}
