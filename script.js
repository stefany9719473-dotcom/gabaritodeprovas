// Visualização da Imagem
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

// Função para calcular a pontuação individual por matéria
function calcularResultado() {
  const totalMaterias = 5;
  let relatorioHtml = '';
  let pontuacaoTotalGeral = 0;

  for (let i = 1; i <= totalMaterias; i++) {
    const gabaritoRaw = document.getElementById(`gabarito_m${i}`).value;
    const alunoRaw = document.getElementById(`aluno_m${i}`).value;

    // Converte a string separada por vírgula em array e remove espaços
    const gabarito = gabaritoRaw.split(',').map(item => item.trim().toUpperCase());
    const aluno = alunoRaw.split(',').map(item => item.trim().toUpperCase());

    let pontosMateria = 0;
    const totalQuestoes = gabarito.length;

    // Compara resposta por resposta (1 ponto por questão)
    for (let j = 0; j < totalQuestoes; j++) {
      if (aluno[j] && aluno[j] === gabarito[j]) {
        pontosMateria += 1;
      }
    }

    pontuacaoTotalGeral += pontosMateria;

    relatorioHtml += `
      <div class="resultado-item">
        <span><strong>Matéria ${i}:</strong> ${pontosMateria} / ${totalQuestoes} pontos</span>
      </div>
    `;
  }

  relatorioHtml += `
    <div class="resultado-total">
      Pontuação Total Geral: ${pontuacaoTotalGeral} pontos
    </div>
  `;

  const resultadoCard = document.getElementById('resultadoCard');
  const resultadoConteudo = document.getElementById('resultadoConteudo');
  
  resultadoConteudo.innerHTML = relatorioHtml;
  resultadoCard.style.display = 'block';
}
