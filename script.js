const nomesDisciplinas = [
  "Língua Portuguesa", "Matemática", "Raciocínio Lógico", "Informática",
  "Direito Constitucional", "Direito Administrativo", "Conhecimentos Gerais",
  "Atualidades", "Legislação Específica", "Física", "Química", "Biologia"
];

// Monta a interface das 12 matérias
document.addEventListener("DOMContentLoaded", function() {
  const grid = document.getElementById("disciplinasGrid");
  let htmlContent = "";

  for (let i = 1; i <= 12; i++) {
    const qInicio = (i - 1) * 5 + 1;
    const qFim = i * 5;

    htmlContent += `
      <div class="disciplina-box">
        <h3>Matéria ${i}: ${nomesDisciplinas[i - 1]} (Q${qInicio}-Q${qFim})</h3>
        <div class="q-group">
          <label>Gabarito Oficial:</label>
          <input type="text" id="gabarito_m${i}" value="A,B,C,D,E">
        </div>
        <div class="q-group">
          <label>Extraído do Cartão (Aluno):</label>
          <input type="text" id="aluno_m${i}" placeholder="Aguardando leitura...">
        </div>
      </div>
    `;
  }

  grid.innerHTML = htmlContent;
});

// Exibe a imagem selecionada
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
  }
});

// Processamento por OCR (Tesseract.js)
async function processarFotoECorrigir() {
  const imageInput = document.getElementById('imageInput');
  const statusOCR = document.getElementById('statusOCR');

  if (!imageInput.files[0]) {
    alert("Por favor, selecione ou tire uma foto do cartão-resposta primeiro.");
    return;
  }

  statusOCR.style.display = 'block';
  statusOCR.innerText = "Lendo imagem e identificando letras (A, B, C, D, E)...";

  try {
    // Executa a leitura OCR da imagem
    const result = await Tesseract.recognize(
      imageInput.files[0],
      'por',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            statusOCR.innerText = `Processando imagem: ${Math.round(m.progress * 100)}%`;
          }
        }
      }
    );

    const textoExtraido = result.data.text;
    
    // Filtra apenas as letras das alternativas (A, B, C, D, E)
    const respostasEncontradas = textoExtraido
      .toUpperCase()
      .replace(/[^ABCDE]/g, '')
      .split('');

    statusOCR.innerText = `Leitura concluída! ${respostasEncontradas.length} respostas identificadas.`;

    // Preenche os campos das 12 disciplinas com as respostas extraídas (5 por matéria)
    for (let i = 1; i <= 12; i++) {
      const inicio = (i - 1) * 5;
      const blocoMateria = respostasEncontradas.slice(inicio, inicio + 5);
      
      const inputAluno = document.getElementById(`aluno_m${i}`);
      inputAluno.value = blocoMateria.join(', ');
    }

    // Calcula os pontos automaticamente após preencher
    calcularResultadoFinal();

  } catch (error) {
    console.error(error);
    statusOCR.innerText = "Erro ao processar imagem. Tente uma foto mais nítida.";
  }
}

// Somatória das 12 disciplinas
function calcularResultadoFinal() {
  let pontuacaoTotal = 0;
  const totalQuestoes = 60;
  
  let tabelaHtml = `
    <table class="tabela-resultados">
      <thead>
        <tr>
          <th>Disciplina</th>
          <th>Faixa</th>
          <th>Acertos / Total</th>
          <th>Aproveitamento</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let i = 1; i <= 12; i++) {
    const gabaritoRaw = document.getElementById(`gabarito_m${i}`).value;
    const alunoRaw = document.getElementById(`aluno_m${i}`).value;

    const gabarito = gabaritoRaw.split(',').map(x => x.trim().toUpperCase());
    const aluno = alunoRaw.split(',').map(x => x.trim().toUpperCase());

    let acertosMateria = 0;
    const qInicio = (i - 1) * 5 + 1;
    const qFim = i * 5;

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
  const percentualGeral = ((pontuacaoTotal / totalQuestoes) * 100).toFixed(1);

  document.getElementById('resumoGeral').innerHTML = `
    Pontuação Final: ${pontuacaoTotal} de ${totalQuestoes} pontos (${percentualGeral}% de aproveitamento)
  `;
  document.getElementById('detalhesDisciplinas').innerHTML = tabelaHtml;
  document.getElementById('resultadoCard').style.display = 'block';
}
