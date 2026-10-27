// Nomes padrão para as 12 disciplinas
const nomesDisciplinas = [
  "Língua Portuguesa", "Matemática", "Raciocínio Lógico", "Informática",
  "Direito Constitucional", "Direito Administrativo", "Conhecimentos Gerais",
  "Atualidades", "Legislação Específica", "Física", "Química", "Biologia"
];

// Monta a interface das 12 matérias ao carregar a página
document.addEventListener("DOMContentLoaded", function() {
  const grid = document.getElementById("disciplinasGrid");
  let htmlContent = "";

  for (let i = 1; i <= 12; i++) {
    const qInicio = (i - 1) * 5 + 1;
    const qFim = i * 5;
    const nomeMateria = nomesDisciplinas[i - 1];

    htmlContent += `
      <div class="disciplina-box">
        <h3>Matéria ${i}: ${nomeMateria} (Q${qInicio} a Q${qFim})</h3>
        <div class="q-group">
          <label for="gabarito_m${i}">Gabarito Oficial (5 respostas):</label>
          <input type="text" id="gabarito_m${i}" placeholder="Ex: A,B,C,D,E" value="A,B,C,D,E">
        </div>
        <div class="q-group">
          <label for="aluno_m${i}">Respostas do Candidato:</label>
          <input type="text" id="aluno_m${i}" placeholder="Ex: A,B,C,D,E">
        </div>
      </div>
    `;
  }

  grid.innerHTML = htmlContent;
});

// Pré-visualização da Imagem do Cartão Resposta
document.getElementById('imageInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('imagePreview');
  
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = '';
    preview.style.display = 'none';
  }
});

// Processamento de Correção Rigoroso
function corrigirProva() {
  const totalDisciplinas = 12;
  let pontuacaoTotal = 0;
  let maxPontosPossiveis = 60;
  let tabelaHtml = `
    <table class="tabela-resultados">
      <thead>
        <tr>
          <th>Disciplina</th>
          <th>Faixa de Questões</th>
          <th>Acertos / Total</th>
          <th>Aproveitamento</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let i = 1; i <= totalDisciplinas; i++) {
    const gabaritoRaw = document.getElementById(`gabarito_m${i}`).value;
    const alunoRaw = document.getElementById(`aluno_m${i}`).value;

    const gabarito = gabaritoRaw.split(',').map(item => item.trim().toUpperCase());
    const aluno = alunoRaw.split(',').map(item => item.trim().toUpperCase());

    let acertosMateria = 0;
    const qInicio = (i - 1) * 5 + 1;
    const qFim = i * 5;

    // Comparação de cada uma das 5 questões da disciplina
    for (let j = 0; j < 5; j++) {
      if (aluno[j] && aluno[j] === gabarito[j]) {
        acertosMateria += 1;
      }
    }

    pontuacaoTotal += acertosMateria;
    const porcentagem = ((acertosMateria / 5) * 100).toFixed(0);

    tabelaHtml += `
      <tr>
        <td><strong>${nomesDisciplinas[i - 1]}</strong></td>
        <td>Q${qInicio} a Q${qFim}</td>
        <td><span class="${acertosMateria >= 3 ? 'status-acerto' : 'status-erro'}">${acertosMateria} / 5</span></td>
        <td>${porcentagem}%</td>
      </tr>
    `;
  }

  tabelaHtml += `</tbody></table>`;

  const percentualGeral = ((pontuacaoTotal / maxPontosPossiveis) * 100).toFixed(1);

  document.getElementById('resumoGeral').innerHTML = `
    Pontuação Final: ${pontuacaoTotal} de ${maxPontosPossiveis} pontos (${percentualGeral}% de aproveitamento)
  `;
  document.getElementById('detalhesDisciplinas').innerHTML = tabelaHtml;
  document.getElementById('resultadoCard').style.display = 'block';
}
