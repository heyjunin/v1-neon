/**
 * Exemplos de uso das funções de data
 * Este arquivo demonstra como usar as funções utilitárias de data em diferentes cenários
 */

import {
    areDatesEqual,
    formatDate,
    formatRelativeDate,
    isValidDate,
    toISOString
} from './date';

// Exemplo 1: Formatação básica de data
export function exemploFormatacaoBasica() {
  const data = "2024-01-15T10:30:00Z";
  
  // Formatação simples (dd/mm/yyyy)
  const dataFormatada = formatDate(data);
  console.log(dataFormatada); // "15/01/2024"
  
  // Formatação com hora
  const dataComHora = formatDate(data, { includeTime: true });
  console.log(dataComHora); // "15/01/2024 10:30"
  
  // Formatação com fallback personalizado
  const dataInvalida = formatDate(null, { fallback: "Data não informada" });
  console.log(dataInvalida); // "Data não informada"
}

// Exemplo 2: Formatação relativa
export function exemploFormatacaoRelativa() {
  const agora = new Date();
  const umaHoraAtras = new Date(agora.getTime() - 60 * 60 * 1000);
  const ontem = new Date(agora.getTime() - 24 * 60 * 60 * 1000);
  
  console.log(formatRelativeDate(umaHoraAtras)); // "há 1 hora"
  console.log(formatRelativeDate(ontem)); // "ontem"
  console.log(formatRelativeDate(null)); // "Data não disponível"
}

// Exemplo 3: Validação de datas
export function exemploValidacao() {
  const datas = [
    "2024-01-15T10:30:00Z",
    "data-invalida",
    null,
    undefined,
    new Date()
  ];
  
  datas.forEach(data => {
    console.log(`${data} é válida: ${isValidDate(data)}`);
  });
}

// Exemplo 4: Comparação de datas
export function exemploComparacao() {
  const data1 = "2024-01-15T10:30:00Z";
  const data2 = "2024-01-15T10:30:00Z";
  const data3 = "2024-01-16T10:30:00Z";
  
  console.log(areDatesEqual(data1, data2)); // true
  console.log(areDatesEqual(data1, data3)); // false
  console.log(areDatesEqual(null, null)); // true
  console.log(areDatesEqual(data1, null)); // false
}

// Exemplo 5: Uso em componentes React
export function exemploComponenteReact() {
  // Simulação de dados de um post
  const post = {
    id: "1",
    title: "Meu Post",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T14:20:00Z"
  };
  
  // Verificar se o post foi atualizado
  const foiAtualizado = !areDatesEqual(post.createdAt, post.updatedAt);
  
  // Formatar datas para exibição
  const dataCriacao = formatDate(post.createdAt, { includeTime: true });
  const dataAtualizacao = formatDate(post.updatedAt, { includeTime: true });
  const tempoRelativo = formatRelativeDate(post.updatedAt);
  
  return {
    foiAtualizado,
    dataCriacao,
    dataAtualizacao,
    tempoRelativo
  };
}

// Exemplo 6: Uso em formulários
export function exemploFormulario() {
  // Simulação de dados de formulário
  const formData = {
    dataInicio: "2024-01-15",
    dataFim: "2024-01-20",
    dataEvento: null
  };
  
  // Validar datas antes de enviar
  const validacoes = {
    dataInicio: isValidDate(formData.dataInicio),
    dataFim: isValidDate(formData.dataFim),
    dataEvento: isValidDate(formData.dataEvento)
  };
  
  // Converter para ISO se necessário
  const dadosParaEnvio = {
    dataInicio: toISOString(formData.dataInicio),
    dataFim: toISOString(formData.dataFim),
    dataEvento: toISOString(formData.dataEvento)
  };
  
  return { validacoes, dadosParaEnvio };
}

// Exemplo 7: Uso em listas e tabelas
export function exemploLista() {
  const posts = [
    { id: "1", title: "Post 1", createdAt: "2024-01-15T10:30:00Z" },
    { id: "2", title: "Post 2", createdAt: "2024-01-16T14:20:00Z" },
    { id: "3", title: "Post 3", createdAt: null }
  ];
  
  // Formatar datas para exibição em lista
  const postsFormatados = posts.map(post => ({
    ...post,
    dataFormatada: formatDate(post.createdAt, { includeTime: true }),
    tempoRelativo: formatRelativeDate(post.createdAt)
  }));
  
  return postsFormatados;
}

// Exemplo 8: Uso com diferentes locales
export function exemploLocales() {
  const data = "2024-01-15T10:30:00Z";
  
  // Português brasileiro (padrão)
  const ptBR = formatDate(data, { locale: "pt-BR", includeTime: true });
  
  // Inglês americano
  const enUS = formatDate(data, { locale: "en-US", includeTime: true });
  
  // Francês
  const frFR = formatDate(data, { locale: "fr-FR", includeTime: true });
  
  return { ptBR, enUS, frFR };
}
