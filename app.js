
let usuarioLogado = '';

async function login(){

  const email =
    document.getElementById('loginUsuario').value;

  const senha =
    document.getElementById('loginSenha').value;

  try{

    const credencial =
      await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );

    usuarioLogado =
      credencial.user.uid;

    localStorage.setItem(
      "usuarioLogado",
      usuarioLogado
    );

    document.getElementById(
      'painel'
    ).style.display = 'block';

    document.getElementById(
      'loginSistema'
    ).style.display = 'none';

    carregarPerfil();

    alert("Login realizado!");

   }catch(err){

    console.error(err);

    alert(err.message);

  }

}

let grupoAtual = 0;
let gruposLista = [];

async function cadastrar(){

  const nome =
    document.getElementById('nome').value;

  const cpf =
    document.getElementById('cpf').value;

  const empresa =
    document.getElementById('empresa').value;

  const filial =
    document.getElementById('filial').value;

  const email =
    document.getElementById('email').value;

  const senha =
    document.getElementById('senha').value;

  const termo =
    document.getElementById('termo').checked;

  if(!termo){
    alert('Aceite o regulamento');
    return;
  }

  try{

    const credencial =
      await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

    await setDoc(
      doc(
        db,
        "usuarios",
        credencial.user.uid
      ),
      {
        nome,
        cpf,
        empresa,
        filial,
        email,
        pontos:0,
        admin:false,
        dataCadastro:
          new Date().toISOString()
      }
    );

    alert(
      "Cadastro realizado com sucesso!"
    );

  }catch(err){

    console.error(err);

    alert(err.message);

  }

}

catch(err){

esconderLoading();

console.error(err);

alert(
'Erro ao cadastrar'
);

}

}

let grupoAtual = 0;
let gruposLista = [];
async function carregarJogos(){

try{

```
const resposta =
  await fetch(
    `/api/jogos?usuario=${encodeURIComponent(usuarioLogado)}`
  );

const jogos =
  await resposta.json();

console.log(jogos);

if(!jogos || jogos.length === 0){

  document.getElementById('listaJogos').innerHTML =
    '<p>Nenhum jogo encontrado</p>';

  return;

}

const grupos = {};

jogos.forEach(jogo => {

  const data =
    jogo.dataHora
      .split(' ')[0];

  if(!grupos[data]){

    grupos[data] = [];

  }

  grupos[data].push(jogo);

});

Object.keys(grupos).forEach(data => {

  grupos[data].sort((a,b) => {

    const horaA =
      new Date(
        a.dataHora
          .split('/')
          .reverse()
          .join('-')
          .replace(' ','T')
      );

    const horaB =
      new Date(
        b.dataHora
          .split('/')
          .reverse()
          .join('-')
          .replace(' ','T')
      );

    return horaA - horaB;

  });

});

gruposLista =
  Object.keys(grupos)

    .sort((a,b) => {

      const pa =
        a.split('/').reverse().join('');

      const pb =
        b.split('/').reverse().join('');

      return pa.localeCompare(pb);

    })

    .map(nome => ({

      nome,
      jogos: grupos[nome]

    }));

renderGrupo();
```

}catch(erro){

```
console.error(erro);

document.getElementById('listaJogos').innerHTML =
  '<p>Erro ao carregar jogos</p>';
```

}

}
function renderGrupo(){

  const grupo =
    gruposLista[grupoAtual];

  let preenchidos = 0;
  let total = 0;

  gruposLista.forEach(g => {

    g.jogos.forEach(jogo => {

      total++;

      if(
        jogo.palpiteA !== '' &&
        jogo.palpiteA != null &&
        jogo.palpiteB !== '' &&
        jogo.palpiteB != null
      ){
        preenchidos++;
      }

    });

  });

  const percentual =
    total > 0
      ? Math.round((preenchidos / total) * 100)
      : 0;

  let html = `

    <div class="card">

      <div style="
        margin-bottom:25px;
      ">

        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:10px;
          color:#fff;
          font-weight:bold;
          font-size:16px;
        ">

          <span>
            📊 Progresso dos Palpites
          </span>

          <span>
            ${percentual}%
          </span>

        </div>

        <div style="
          height:18px;
          background:rgba(255,255,255,.20);
          border-radius:20px;
          overflow:hidden;
          box-shadow:inset 0 2px 5px rgba(0,0,0,.25);
        ">

          <div style="
            width:${percentual}%;
            height:100%;
            background:linear-gradient(
              90deg,
              #00a651,
              #19d36b
            );
            transition:.3s;
          ">
          </div>

        </div>

      </div>

      <div style="
        display:flex;
        gap:15px;
        margin-bottom:25px;
        flex-wrap:wrap;
      ">

        <div style="
          background:#00a651;
          color:#fff;
          padding:12px 20px;
          border-radius:12px;
          font-weight:bold;
          box-shadow:0 4px 12px rgba(0,0,0,.25);
        ">
          ✅ ${preenchidos} realizados
        </div>

        <div style="
          background:#ff9800;
          color:#fff;
          padding:12px 20px;
          border-radius:12px;
          font-weight:bold;
          box-shadow:0 4px 12px rgba(0,0,0,.25);
        ">
          ⚠️ ${total - preenchidos} pendentes
        </div>

        <div style="
          background:#002244;
          color:#fff;
          padding:12px 20px;
          border-radius:12px;
          font-weight:bold;
          box-shadow:0 4px 12px rgba(0,0,0,.25);
        ">
          ⚽ ${total} jogos
        </div>

      </div>

      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:25px;
      ">

        <button
          onclick="grupoAnterior()"
          ${grupoAtual == 0 ? 'disabled' : ''}
        >
          ⬅ Anterior
        </button>

<h2 style="
  color:#ffffff;
  margin:0;
  font-weight:900;
  text-shadow:0 2px 8px rgba(0,0,0,.6);
">
  🗓️ Jogos de ${grupo.nome}
</h2>

<button
  onclick="proximoGrupo()"
>
  ${
    grupoAtual ==
    gruposLista.length - 1
      ? '⭐ Extras'
      : 'Próximo ➡'
  }
</button>

      </div>

      <div class="jogos-grid">

  `;

  grupo.jogos.forEach(jogo => {

    html += `

      <div class="jogo">

        <h3>
          ${jogo.timeA} x ${jogo.timeB}
        </h3>

        <p class="info-jogo">
          ${jogo.fase} - Grupo ${jogo.grupo}
        </p>

        <p class="info-jogo">
          🕒 ${jogo.dataHora.split(' ')[1].substring(0,5)}
        </p>

        ${
          jogo.bloqueado
          ?
          `
            <p style="
              color:red;
              font-weight:bold;
              margin-top:10px;
            ">
              🔒 Palpites encerrados
            </p>
          `
          :
          ''
        }

        <div class="inputs-jogo">

          <input
            type="number"
            min="0"
            max="99"
            inputmode="numeric"
            pattern="[0-9]*"

            id="a_${jogo.id}"

            value="${jogo.palpiteA ?? ''}"

            placeholder="${jogo.timeA}"

            ${jogo.bloqueado ? 'disabled' : ''}

            oninput="
              this.value =
              this.value.replace(/[^0-9]/g,'');

              if(this.value < 0){
                this.value = 0;
              }

              if(this.value > 99){
                this.value = 99;
              }

              salvarAutomatico('${jogo.id}');
            "
          >

          <span class="versus">
            X
          </span>

          <input
            type="number"
            min="0"
            max="99"
            inputmode="numeric"
            pattern="[0-9]*"

            id="b_${jogo.id}"

            value="${jogo.palpiteB ?? ''}"

            placeholder="${jogo.timeB}"

            ${jogo.bloqueado ? 'disabled' : ''}

            oninput="
              this.value =
              this.value.replace(/[^0-9]/g,'');

              if(this.value < 0){
                this.value = 0;
              }

              if(this.value > 99){
                this.value = 99;
              }

              salvarAutomatico('${jogo.id}');
            "
          >

        </div>

        <div style="
          margin-top:15px;
          display:flex;
          align-items:center;
          gap:15px;
        ">

          <span
            id="status_${jogo.id}"
            style="
              color:#00a651;
              font-weight:bold;
            "
          ></span>

        </div>

      </div>

    `;

  });

  html += `

      </div>

    </div>

  `;

  document.getElementById('listaJogos')
    .innerHTML = html;

}
function proximoGrupo(){

if(grupoAtual < gruposLista.length - 1){

```
grupoAtual++;
renderGrupo();
```

} else {

```
abrirAba('extras');
```

}

}

function grupoAnterior(){

if(grupoAtual > 0){

```
grupoAtual--;
renderGrupo();
```

}

}

let timerPalpite = {};

function salvarAutomatico(idJogo){

clearTimeout(
timerPalpite[idJogo]
);

timerPalpite[idJogo] = setTimeout(() => {

```
salvarPalpite(idJogo);
```

}, 300);

}

async function salvarPalpite(idJogo){

const palpiteA =
document.getElementById(`a_${idJogo}`).value;

const palpiteB =
document.getElementById(`b_${idJogo}`).value;

gruposLista.forEach(g => {

```
g.jogos.forEach(j => {

  if(String(j.id) === String(idJogo)){

    j.palpiteA = palpiteA;
    j.palpiteB = palpiteB;

  }

});
```

});

if(
palpiteA === '' ||
palpiteB === ''
){
return;
}

const obj = {

```
usuario: usuarioLogado,

idJogo: idJogo,

palpiteA: palpiteA,

palpiteB: palpiteB
```

};

try{

```
const resposta =
  await fetch('/api/palpite', {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(obj)

  });

const res =
  await resposta.json();

if(!res.sucesso){
  throw new Error(
    res.mensagem || 'Erro ao salvar'
  );
}

const status =
  document.getElementById(`status_${idJogo}`);

if(status){

  status.innerHTML =
    '💾 Salvo automaticamente';

  setTimeout(() => {

    status.innerHTML = '';

  }, 2000);

}
```

}catch(erro){

```
console.error(erro);

const status =
  document.getElementById(`status_${idJogo}`);

if(status){

  status.innerHTML =
    '❌ Erro ao salvar';

  setTimeout(() => {

    status.innerHTML = '';

  }, 3000);

}
```

}

}
async function carregarRanking(){

try{

```
const resposta =
  await fetch('/api/ranking');

const ranking =
  await resposta.json();

let html = '';

if(!ranking || ranking.length === 0){

  html =
    '<div>Nenhum ranking disponível</div>';

} else {

  const primeiro = ranking[0];
  const segundo  = ranking[1];
  const terceiro = ranking[2];
  const quarto   = ranking[3];
  const quinto   = ranking[4];

  html += `
```

<div class="top5-fifa">

${primeiro ? `

  <div class="ranking-card rk1">
    <div class="ranking-selo">Shark 2026</div>
    <div class="ranking-img">🏆</div>
    <div class="ranking-posicao">1º Lugar</div>
    <p>
      ${primeiro.usuario}
      <br>
      <strong>${primeiro.pontos} pts</strong>
    </p>
  </div>
  ` : ''}

${segundo ? `

  <div class="ranking-card rk2">
    <div class="ranking-selo">Shark 2026</div>
    <div class="ranking-img">🥈</div>
    <div class="ranking-posicao">2º Lugar</div>
    <p>
      ${segundo.usuario}
      <br>
      <strong>${segundo.pontos} pts</strong>
    </p>
  </div>
  ` : ''}

${terceiro ? `

  <div class="ranking-card rk3">
    <div class="ranking-selo">Shark 2026</div>
    <div class="ranking-img">🥉</div>
    <div class="ranking-posicao">3º Lugar</div>
    <p>
      ${terceiro.usuario}
      <br>
      <strong>${terceiro.pontos} pts</strong>
    </p>
  </div>
  ` : ''}

${quarto ? `

  <div class="ranking-card rk4">
    <div class="ranking-selo">Shark 2026</div>
    <div class="ranking-img">🏅</div>
    <div class="ranking-posicao">4º Lugar</div>
    <p>
      ${quarto.usuario}
      <br>
      <strong>${quarto.pontos} pts</strong>
    </p>
  </div>
  ` : ''}

${quinto ? `

  <div class="ranking-card rk5">
    <div class="ranking-selo">Shark 2026</div>
    <div class="ranking-img">🎖️</div>
    <div class="ranking-posicao">5º Lugar</div>
    <p>
      ${quinto.usuario}
      <br>
      <strong>${quinto.pontos} pts</strong>
    </p>
  </div>
  ` : ''}

</div>

`;

```
  html += `
    <div style="
      background:#fff;
      border-radius:12px;
      overflow:hidden;
      color:#222;
    ">
  `;

  for(
    let i = 5;
    i < Math.min(ranking.length,25);
    i++
  ){

    const item = ranking[i];

    html += `
      <div style="
        display:flex;
        justify-content:space-between;
        padding:12px 15px;
        border-bottom:1px solid #eee;
      ">
        <div>
          🏅 ${item.posicao}º - ${item.usuario}
        </div>

        <div>
          ${item.pontos} pts
        </div>
      </div>
    `;

  }

  html += '</div>';

}

document.getElementById(
  'rankingTop5'
).innerHTML = html;
```

}catch(erro){

```
console.error(erro);

document.getElementById(
  'rankingTop5'
).innerHTML =
  '<div>Erro ao carregar ranking</div>';
```

}

}
async function carregarPerfil(){

try{

```
const resposta =
  await fetch(
    `/api/perfil?usuario=${encodeURIComponent(usuarioLogado)}`
  );

const dados =
  await resposta.json();

document.getElementById(
  'perfilDados'
).innerHTML = `

  <div style="
    background:linear-gradient(
      135deg,
      rgba(0,34,68,.95),
      rgba(0,166,81,.95)
    );
    border-radius:20px;
    padding:25px;
    margin-bottom:25px;
    color:#fff;
    box-shadow:0 10px 30px rgba(0,0,0,.25);
  ">

    <div style="
      display:flex;
      align-items:center;
      gap:20px;
      flex-wrap:wrap;
    ">

      <div style="
        width:90px;
        height:90px;
        border-radius:50%;
        background:#fff;
        color:#002244;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:45px;
      ">
        👤
      </div>

      <div>

        <h2 style="
          margin:0;
          color:#fff;
        ">
          ${dados.nome}
        </h2>

        <div style="
          margin-top:8px;
          opacity:.95;
        ">
          🏢 ${dados.empresa}
        </div>

        <div style="
          margin-top:5px;
          opacity:.95;
        ">
          🏬 ${dados.filial}
        </div>

        <div style="
          margin-top:5px;
          opacity:.95;
        ">
          ✉️ ${dados.email}
        </div>

      </div>

    </div>

  </div>

  <div style="
    display:grid;
    grid-template-columns:
      repeat(auto-fit,minmax(220px,1fr));
    gap:20px;
  ">

    <div class="card" style="text-align:center;">
      <div style="font-size:55px;">🏆</div>

      <h2 style="
        color:#FFD700;
        margin:10px 0;
        font-size:38px;
        font-weight:900;
      ">
        ${dados.posicao}º
      </h2>

      <span>Ranking Geral</span>
    </div>

    <div class="card" style="text-align:center;">
      <div style="font-size:55px;">⭐</div>

      <h2 style="
        color:#FFD700;
        margin:10px 0;
        font-size:38px;
        font-weight:900;
      ">
        ${dados.pontos}
      </h2>

      <span>Pontos</span>
    </div>

    <div class="card" style="text-align:center;">
      <div style="font-size:55px;">🎯</div>

      <h2 style="
        color:#FFD700;
        margin:10px 0;
        font-size:38px;
        font-weight:900;
      ">
        ${dados.exatos}
      </h2>

      <span>Exatos</span>
    </div>

    <div class="card" style="text-align:center;">
      <div style="font-size:55px;">🏢</div>

      <h2 style="
        color:#FFD700;
        margin:10px 0;
        font-size:24px;
        font-weight:900;
      ">
        ${dados.empresa}
      </h2>

      <span>Empresa</span>
    </div>

  </div>

`;
```

}catch(erro){

```
console.error(erro);

document.getElementById(
  'perfilDados'
).innerHTML = `
  <div class="card">
    Erro ao carregar perfil
  </div>
`;
```

}

}
async function carregarRankingCompleto(){

try{

```
const resposta =
  await fetch(
    `/api/ranking-completo?usuario=${encodeURIComponent(usuarioLogado)}`
  );

const ranking =
  await resposta.json();

let html = '';

html += `

  <div style="
    overflow:auto;
    margin-top:20px;
  ">

  <table style="
    width:100%;
    border-collapse:collapse;
    background:#fff;
    color:#222;
    table-layout:fixed;
  ">

    <thead>

      <tr style="
        background:#002244;
        color:#fff;
      ">

        <th style="
          padding:12px;
          width:80px;
          text-align:center;
        ">
          #
        </th>

        <th style="
          padding:12px;
          text-align:left;
        ">
          Nome
        </th>

        <th style="
          padding:12px;
          width:100px;
          text-align:center;
        ">
          Pts
        </th>

        <th style="
          padding:12px;
          width:120px;
          text-align:center;
        ">
          Exatos
        </th>

        <th style="
          padding:12px;
          width:140px;
          text-align:center;
        ">
          Vencedores
        </th>

      </tr>

    </thead>

    <tbody>

`;

for(let i = 0; i < ranking.length; i++){

  const item = ranking[i];

  let destaque = '';

  if(item.logado){

    destaque = `
      background:#dff7e8;
      font-weight:bold;
    `;

  }

  html += `

    <tr style="
      border-bottom:1px solid #ddd;
      ${destaque}
    ">

      <td style="
        padding:12px;
        font-weight:bold;
        text-align:center;
      ">

        ${
          item.posicao == 1 ? '🥇 1º' :
          item.posicao == 2 ? '🥈 2º' :
          item.posicao == 3 ? '🥉 3º' :
          item.posicao + 'º'
        }

      </td>

      <td style="
        padding:12px;
        text-align:left;
        word-break:break-word;
      ">
        ${item.usuario}
      </td>

      <td style="
        padding:12px;
        text-align:center;
      ">
        ${item.pontos}
      </td>

      <td style="
        padding:12px;
        text-align:center;
      ">
        ${item.exatos}
      </td>

      <td style="
        padding:12px;
        text-align:center;
      ">
        ${item.vencedores}
      </td>

    </tr>

  `;

}

html += `
    </tbody>
  </table>
</div>
`;

document.getElementById(
  'rankingCompleto'
).innerHTML = html;
```

}catch(err){

```
console.error(err);

document.getElementById(
  'rankingCompleto'
).innerHTML =
  '<p>Erro ao carregar ranking</p>';
```

}

}

function mostrarLoading(){

document.getElementById('loading').style.display =
'flex';

}

function esconderLoading(){

document.getElementById('loading').style.display =
'none';

}

async function verificarAdmin(){

try{

```
const resposta =
  await fetch(
    `/api/admin?usuario=${encodeURIComponent(usuarioLogado)}`
  );

const dados =
  await resposta.json();

if(dados.admin){

  document.getElementById('menuAdmin')
    .style.display = 'block';

}
```

}catch(err){

```
console.error(err);
```

}

}

async function recalcularRanking(){

mostrarLoading();

try{

```
await fetch('/api/recalcular-ranking', {
  method:'POST'
});

esconderLoading();

carregarRanking();
carregarRankingCompleto();
carregarPerfil();

alert('Ranking atualizado');
```

}catch(err){

```
esconderLoading();

console.error(err);

alert('Erro ao recalcular ranking');
```

}

}

async function carregarAdminJogos(){

try{

```
const resposta =
  await fetch('/api/admin-jogos');

const jogos =
  await resposta.json();

let html = '';

for(let i = 0; i < jogos.length; i++){

  const jogo = jogos[i];

  html += `

    <div class="jogo">

      <h3>
        ${jogo.timeA} x ${jogo.timeB}
      </h3>

      <p>
        ${jogo.fase} - Grupo ${jogo.grupo}
      </p>

      <p>
        ${jogo.dataHora}
      </p>

      <div class="inputs-jogo">

        <input
          type="number"
          id="ra_${jogo.id}"
          value="${jogo.resultadoA ?? ''}"
          placeholder="${jogo.timeA}"
        >

        <span class="versus">
          X
        </span>

        <input
          type="number"
          id="rb_${jogo.id}"
          value="${jogo.resultadoB ?? ''}"
          placeholder="${jogo.timeB}"
        >

      </div>

      <button
        onclick="salvarResultado('${jogo.id}')"
      >
        💾 Salvar Resultado
      </button>

    </div>

  `;

}

document.getElementById(
  'adminJogos'
).innerHTML = html;
```

}catch(err){

```
console.error(err);
```

}

}

async function salvarResultado(idJogo){

mostrarLoading();

const obj = {

```
idJogo: idJogo,

resultadoA:
  document.getElementById(`ra_${idJogo}`).value,

resultadoB:
  document.getElementById(`rb_${idJogo}`).value
```

};

try{

```
const resposta =
  await fetch('/api/resultado', {

    method:'POST',

    headers:{
      'Content-Type':'application/json'
    },

    body: JSON.stringify(obj)

  });

const res =
  await resposta.json();

esconderLoading();

if(!res.sucesso){

  throw new Error(
    res.mensagem
  );

}

carregarRanking();
carregarRankingCompleto();
carregarPerfil();

alert('Resultado salvo');
```

}catch(err){

```
esconderLoading();

console.error(err);

alert('Erro ao salvar resultado');
```

}

}

async function salvarExtras(){

const obj = {

```
usuario: usuarioLogado,

campeao:
  document.getElementById('extraCampeao').value,

vice:
  document.getElementById('extraVice').value,

artilheiro:
  document.getElementById('extraArtilheiro').value,

golsBrasil:
  document.getElementById('extraGolsBrasil').value,

faseBrasil:
  document.getElementById('extraFaseBrasil').value
```

};

if(!obj.campeao){
alert('Selecione o Campeão');
return;
}

if(!obj.vice){
alert('Selecione o Vice Campeão');
return;
}

if(!obj.faseBrasil){
alert('Selecione até onde o Brasil chega');
return;
}

try{

```
const resposta =
  await fetch('/api/extras', {

    method:'POST',

    headers:{
      'Content-Type':'application/json'
    },

    body: JSON.stringify(obj)

  });

const res =
  await resposta.json();

if(!res.sucesso){

  throw new Error(
    res.mensagem
  );

}

alert(
  'Palpites extras salvos'
);
```

}catch(err){

```
console.error(err);

alert(
  'Erro ao salvar palpites extras'
);
```

}

}
async function carregarExtras(){

try{

```
const resposta =
  await fetch(
    `/api/extras?usuario=${encodeURIComponent(usuarioLogado)}`
  );

const extra =
  await resposta.json();

document.getElementById('extraCampeao').value =
  extra.campeao || '';

document.getElementById('extraVice').value =
  extra.vice || '';

document.getElementById('extraArtilheiro').value =
  extra.artilheiro || '';

document.getElementById('extraGolsBrasil').value =
  extra.golsBrasil || '';

document.getElementById('extraFaseBrasil').value =
  extra.faseBrasil || '';
```

}catch(err){

```
console.error(err);
```

}

}

async function carregarClassificacao(){

try{

```
const resposta =
  await fetch('/api/classificacao');

const tabela =
  await resposta.json();

let html = '';

const grupos = {};

tabela.forEach(item => {

  if(!grupos[item.grupo]){

    grupos[item.grupo] = [];

  }

  grupos[item.grupo].push(item);

});

Object.keys(grupos).forEach(grupo => {

  html += `
    <div class="card" style="margin-bottom:30px;">
      <h2 style="
        color:#ffffff;
        font-size:34px;
        font-weight:900;
        margin-bottom:20px;
      ">
        🏆 Grupo ${grupo}
      </h2>
  `;

  // mantém o restante do HTML exatamente igual
  // ao seu código atual

});

document.getElementById(
  'classificacaoTabela'
).innerHTML = html;
```

}catch(err){

```
console.error(err);

document.getElementById(
  'classificacaoTabela'
).innerHTML =
  '<p>Erro ao carregar classificação</p>';
```

}

}

async function carregarMataMata(){

try{

```
const resposta =
  await fetch('/api/mata-mata');

const jogos =
  await resposta.json();

const fases = {};

jogos.forEach(jogo => {

  if(!fases[jogo.fase]){

    fases[jogo.fase] = [];

  }

  fases[jogo.fase].push(jogo);

});

let html = `
  <div class="chaveamento-fifa">
`;

const estrutura = [

  {
    nome:'Oitavas de Final',
    classe:'oitavas'
  },

  {
    nome:'Quartas de Final',
    classe:'quartas'
  },

  {
    nome:'Semifinal',
    classe:'semi'
  },

  {
    nome:'Final',
    classe:'final'
  }

];

estrutura.forEach(fase => {

  if(!fases[fase.nome]) return;

  html += `
    <div class="coluna-fase ${fase.classe}">
      <div class="titulo-fase">
        🏆 ${fase.nome}
      </div>
  `;

  fases[fase.nome].forEach(jogo => {

    html += `
      <div class="partida-fifa">

        <div class="time-fifa">
          ${jogo.timeA}
        </div>

        <div class="time-fifa">
          ${jogo.timeB}
        </div>

      </div>
    `;

  });

  html += `
    </div>
  `;

});

html += `
  </div>
`;

document.getElementById(
  'mataMataTabela'
).innerHTML = html;

carregarPalpitesMata();
```

}catch(err){

```
console.error(err);

document.getElementById(
  'mataMataTabela'
).innerHTML =
  '<p>Erro ao carregar chaveamento</p>';
```

}

}
async function carregarAdminMataMata(){

try{

```
const resposta =
  await fetch('/api/mata-mata');

const jogos =
  await resposta.json();

let html = '';

jogos.forEach(jogo => {

  html += `

    <div class="jogo">

      <h3>
        ${jogo.fase} - Jogo ${jogo.jogo}
      </h3>

      <p>
        ${jogo.timeA}
        vs
        ${jogo.timeB}
      </p>

      <select id="v_${jogo.jogo}">

        <option value="">
          Selecionar vencedor
        </option>

        <option value="${jogo.timeA}">
          ${jogo.timeA}
        </option>

        <option value="${jogo.timeB}">
          ${jogo.timeB}
        </option>

      </select>

      <button onclick="salvarVencedor(${jogo.jogo})">
        💾 Salvar
      </button>

    </div>

  `;

});

document.getElementById(
  'adminMataMata'
).innerHTML = html;
```

}catch(err){

```
console.error(err);
```

}

}

async function salvarVencedor(jogo){

const vencedor =
document.getElementById(`v_${jogo}`).value;

if(!vencedor){

```
alert('Selecione o vencedor');
return;
```

}

try{

```
const resposta =
  await fetch('/api/vencedor-mata', {

    method:'POST',

    headers:{
      'Content-Type':'application/json'
    },

    body: JSON.stringify({

      jogo,
      vencedor

    })

  });

const res =
  await resposta.json();

if(!res.sucesso){

  throw new Error(
    res.mensagem
  );

}

carregarMataMata();

carregarAdminMataMata();

alert('Vencedor salvo');
```

}catch(err){

```
console.error(err);

alert(
  'Erro ao salvar vencedor'
);
```

}

}

let tvPagina = 0;

function iniciarAutoRefresh(){

setInterval(() => {

```
const abaRanking =
  document.getElementById('abaRanking');

if(
  abaRanking &&
  abaRanking.style.display != 'none'
){

  carregarRanking();
  carregarRankingCompleto();

}

const abaClassificacao =
  document.getElementById('abaClassificacao');

if(
  abaClassificacao &&
  abaClassificacao.style.display != 'none'
){

  carregarClassificacao();

}

const abaMata =
  document.getElementById('abaMata');

if(
  abaMata &&
  abaMata.style.display != 'none'
){

  carregarMataMata();

}
```

}, 30000);

}

async function carregarRankingFilial(){

try{

```
const resposta =
  await fetch('/api/ranking-filial');

const lista =
  await resposta.json();

let html = `
  <div style="overflow:auto;">
  <table style="
    width:100%;
    border-collapse:collapse;
    background:#fff;
    color:#222;
    table-layout:fixed;
  ">
`;

lista.forEach(item => {

  html += `

    <tr style="
      border-bottom:1px solid #ddd;
    ">

      <td style="
        padding:12px;
        text-align:center;
        font-weight:bold;
      ">
        ${item.posicao}
      </td>

      <td style="
        padding:12px;
        text-align:left;
      ">
        ${item.filial}
      </td>

      <td style="
        padding:12px;
        text-align:center;
      ">
        ${item.pontos}
      </td>

      <td style="
        padding:12px;
        text-align:center;
      ">
        ${item.participantes}
      </td>

    </tr>

  `;

});

document.getElementById(
  'rankingFilialTabela'
).innerHTML = html;
```

}catch(err){

```
console.error(err);
```

}

}

window.onload = function(){

verificarSessao();

carregarEmpresas();

};
function sair(){

localStorage.removeItem(
'usuarioLogado'
);

location.reload();

}

async function carregarPalpitesMata(){

try{

```
const resposta =
  await fetch(
    `/api/palpites-mata?usuario=${encodeURIComponent(usuarioLogado)}`
  );

const jogos =
  await resposta.json();

let html = '';

let faseAtual = '';

jogos.forEach(jogo => {

  if(faseAtual !== jogo.fase){

    if(faseAtual !== ''){

      html += `
        </div>
      `;

    }

    faseAtual = jogo.fase;

    html += `

      <h2 style="
        margin-top:30px;
        color:#002244;
        border-bottom:3px solid #00a651;
        padding-bottom:10px;
      ">

        🏆 ${jogo.fase}

      </h2>

      <div class="grade-mata">

    `;

  }

  html += `

    <div class="mata-palpite">

      <div class="confronto-titulo">

        <div class="time-confronto">

          <div class="bandeira-time">
            ${bandeiraPais(jogo.timeA)}
          </div>

          <div class="nome-time">
            ${jogo.timeA}
          </div>

        </div>

        <div class="vs-mata">
          VS
        </div>

        <div class="time-confronto">

          <div class="bandeira-time">
            ${bandeiraPais(jogo.timeB)}
          </div>

          <div class="nome-time">
            ${jogo.timeB}
          </div>

        </div>

      </div>

      <div class="escolha-vencedor">

        <button
          data-jogo="${jogo.fase}_${jogo.jogo}"
          data-time="${jogo.timeA}"
          class="btn-time ${
            jogo.meuPalpite == jogo.timeA
            ? 'selecionado'
            : ''
          }"
          onclick="
            salvarPalpiteMata(
              '${jogo.fase}_${jogo.jogo}',
              '${jogo.timeA}'
            )
          "
        >

          🏆 ${jogo.timeA}

        </button>

        <button
          data-jogo="${jogo.fase}_${jogo.jogo}"
          data-time="${jogo.timeB}"
          class="btn-time ${
            jogo.meuPalpite == jogo.timeB
            ? 'selecionado'
            : ''
          }"
          onclick="
            salvarPalpiteMata(
              '${jogo.fase}_${jogo.jogo}',
              '${jogo.timeB}'
            )
          "
        >

          🏆 ${jogo.timeB}

        </button>

      </div>

    </div>

  `;

});

html += `
  </div>
`;

document.getElementById(
  'palpitesMata'
).innerHTML = html;
```

}catch(err){

```
console.error(err);
```

}

}

async function salvarPalpiteMata(
jogo,
vencedor
){

document
.querySelectorAll(
`[data-jogo="${jogo}"]`
)
.forEach(btn =>
btn.classList.remove('selecionado')
);

const selecionado =
document.querySelector(
`[data-jogo="${jogo}"][data-time="${vencedor}"]`
);

if(selecionado){

```
selecionado.classList.add(
  'selecionado'
);
```

}

try{

```
await fetch(
  '/api/palpite-mata',
  {

    method:'POST',

    headers:{
      'Content-Type':
        'application/json'
    },

    body: JSON.stringify({

      usuario: usuarioLogado,

      jogo,

      vencedor

    })

  }
);
```

}catch(err){

```
console.error(err);
```

}

}
async function carregarRankingEmpresa(){

try{

```
const resposta =
  await fetch('/api/ranking-empresa');

const lista =
  await resposta.json();

let html = `

  <div style="overflow:auto;">

  <table style="
    width:100%;
    border-collapse:collapse;
    background:#fff;
    color:#222;
    table-layout:fixed;
  ">

    <thead>

      <tr style="
        background:#002244;
        color:#fff;
      ">

        <th style="
          padding:12px;
          width:80px;
          text-align:center;
        ">
          #
        </th>

        <th style="
          padding:12px;
          text-align:left;
        ">
          Empresa
        </th>

        <th style="
          padding:12px;
          width:100px;
          text-align:center;
        ">
          Pts
        </th>

        <th style="
          padding:12px;
          width:140px;
          text-align:center;
        ">
          Participantes
        </th>

      </tr>

    </thead>

    <tbody>

`;

lista.forEach(item => {

  html += `

    <tr style="
      border-bottom:1px solid #ddd;
    ">

      <td style="
        padding:12px;
        text-align:center;
        font-weight:bold;
      ">
        ${item.posicao}
      </td>

      <td style="
        padding:12px;
        text-align:left;
        word-break:break-word;
      ">
        ${item.empresa}
      </td>

      <td style="
        padding:12px;
        text-align:center;
      ">
        ${item.pontos}
      </td>

      <td style="
        padding:12px;
        text-align:center;
      ">
        ${item.participantes}
      </td>

    </tr>

  `;

});

html += `
    </tbody>
  </table>
  </div>
`;

document.getElementById(
  'rankingEmpresaTabela'
).innerHTML = html;
```

}catch(err){

```
console.error(err);

document.getElementById(
  'rankingEmpresaTabela'
).innerHTML =
  '<p>Erro ao carregar ranking</p>';
```

}

}
async function carregarEmpresas(){

try{

```
const resposta =
  await fetch('/api/empresas-filiais');

const dados =
  await resposta.json();

empresasFiliais = dados;

const empresa =
  document.getElementById('empresa');

empresa.innerHTML =
  '<option value="">Selecione a Empresa</option>';

Object.keys(dados)

  .sort((a,b) =>
    a.localeCompare(
      b,
      'pt-BR',
      { sensitivity:'base' }
    )
  )

  .forEach(nome => {

    empresa.innerHTML +=
      `<option value="${nome}">${nome}</option>`;

  });
```

}catch(err){

```
console.error(err);
```

}

}

async function carregarPaisesExtras(){

try{

```
const resposta =
  await fetch('/api/paises');

const paises =
  await resposta.json();

let campeao =
  '<option value="">Selecione o Campeão</option>';

let vice =
  '<option value="">Selecione o Vice Campeão</option>';

paises.forEach(pais => {

  campeao += `
    <option value="${pais}">
      ${pais}
    </option>
  `;

  vice += `
    <option value="${pais}">
      ${pais}
    </option>
  `;

});

document.getElementById(
  'extraCampeao'
).innerHTML = campeao;

document.getElementById(
  'extraVice'
).innerHTML = vice;
```

}catch(err){

```
console.error(err);
```

}

}
async function carregarEstatisticas(){

try{

```
const resposta =
  await fetch('/api/estatisticas');

const stats =
  await resposta.json();

const html = `

  <div style="
    display:grid;
    grid-template-columns:
      repeat(auto-fit,minmax(250px,1fr));
    gap:20px;
  ">

    <div class="card">
      <h3>👥 Participantes</h3>
      <div style="
        font-size:40px;
        font-weight:bold;
      ">
        ${stats.participantes || 0}
      </div>
    </div>

    <div class="card">
      <h3>⚽ Palpites</h3>
      <div style="
        font-size:40px;
        font-weight:bold;
      ">
        ${stats.totalPalpites || 0}
      </div>
    </div>

    <div class="card">
      <h3>🎯 Rei dos Exatos</h3>
      <div style="
        font-size:28px;
        font-weight:bold;
      ">
        ${stats.liderExatos || '-'}
      </div>
    </div>

    <div class="card">
      <h3>🏆 Campeão Mais Apostado</h3>
      <div style="
        font-size:28px;
        font-weight:bold;
      ">
        ${stats.campeaoMaisApostado || '-'}
      </div>
    </div>

  </div>

`;

document.getElementById(
  'estatisticasPainel'
).innerHTML = html;
```

}catch(err){

```
console.error(err);

document.getElementById(
  'estatisticasPainel'
).innerHTML =
  '<p>Erro ao carregar estatísticas</p>';
```

}

}


function toggleSenha(idCampo, botao){

  const campo =
    document.getElementById(idCampo);

  if(campo.type === 'password'){

    campo.type = 'text';

    botao.innerHTML = '🙈';

  } else {

    campo.type = 'password';

    botao.innerHTML = '👁';

  }

}

function verificarSessao(){

  /* HOME PRIMEIRO */

  document.getElementById(
    'homeInicial'
  ).style.display = 'flex';

  document.getElementById(
    'topoSistema'
  ).style.display = 'none';

  document.getElementById(
    'sistemaCompleto'
  ).style.display = 'none';

}

function formatarCPF(campo){

  let valor =
    campo.value.replace(/\D/g,'');

  if(valor.length > 11){

    valor = valor.slice(0,11);

  }

  valor = valor.replace(
    /(\d{3})(\d)/,
    '$1.$2'
  );

  valor = valor.replace(
    /(\d{3})(\d)/,
    '$1.$2'
  );

  valor = valor.replace(
    /(\d{3})(\d{1,2})$/,
    '$1-$2'
  );

  campo.value = valor;

}

function validarCPF(cpf){

  cpf = cpf.replace(/\D/g,'');

  if(cpf.length !== 11){

    return false;

  }

  if(/^(\d)\1+$/.test(cpf)){

    return false;

  }

  let soma = 0;

  for(let i = 0; i < 9; i++){

    soma +=
      parseInt(cpf.charAt(i))
      * (10 - i);

  }

  let resto =
    (soma * 10) % 11;

  if(resto == 10 || resto == 11){

    resto = 0;

  }

  if(resto != parseInt(cpf.charAt(9))){

    return false;

  }

  soma = 0;

  for(let i = 0; i < 10; i++){

    soma +=
      parseInt(cpf.charAt(i))
      * (11 - i);

  }

  resto =
    (soma * 10) % 11;

  if(resto == 10 || resto == 11){

    resto = 0;

  }

  if(resto != parseInt(cpf.charAt(10))){

    return false;

  }

  return true;

}
function abrirSistema(){

  document.getElementById(
    'homeInicial'
  ).style.display = 'none';

  document.getElementById(
    'topoSistema'
  ).style.display = 'block';

  document.getElementById(
    'sistemaCompleto'
  ).style.display = 'block';

  document.getElementById(
    'loginSistema'
  ).style.display = 'grid';

}
function abrirLogin(){

  document.getElementById('homeInicial')
    .style.display = 'none';

  document.getElementById('topoSistema')
    .style.display = 'block';

  document.getElementById('sistemaCompleto')
    .style.display = 'block';

  document.getElementById('loginSistema')
    .style.display = 'grid';

  document.getElementById('login')
    .style.display = 'block';

  document.getElementById('cadastro')
    .style.display = 'none';

}
function abrirCadastro(){

  document.getElementById('homeInicial')
    .style.display = 'none';

  document.getElementById('topoSistema')
    .style.display = 'block';

  document.getElementById('sistemaCompleto')
    .style.display = 'block';

  document.getElementById('loginSistema')
    .style.display = 'grid';

  document.getElementById('login')
    .style.display = 'none';

  document.getElementById('cadastro')
    .style.display = 'block';

}
function carregarFiliais(){

  const empresa =
    document.getElementById('empresa').value;

  const filial =
    document.getElementById('filial');

  filial.innerHTML =
    '<option value="">Selecione a Filial</option>';

  if(!empresa){
    return;
  }

  empresasFiliais[empresa]

    .sort((a,b) =>
      a.localeCompare(
        b,
        'pt-BR',
        { sensitivity:'base' }
      )
    )

    .forEach(item => {

      filial.innerHTML +=
        `<option value="${item}">${item}</option>`;

    });

}

