
/**
 * Integração com BigQuery via Google Apps Script
 * Funções: cadastrar assistido, registrar visita, consultar histórico
 */

// Configurações do projeto
const PROJECT_ID = 'SEU_PROJECT_ID';
const DATASET_ID = 'SEU_DATASET_ID';
const TABLE_ASSISTIDOS = 'PessoasAssistidas';
const TABLE_VISITAS = 'RegistroVisitas';

/**
 * Cadastra um assistido no BigQuery
 */
function cadastrarAssistido(cpf, nome, genero, cidade, estado, tipo) {
  const query = `
    INSERT INTO \`${PROJECT_ID}.${DATASET_ID}.${TABLE_ASSISTIDOS}\`
    (CPF, NomeCompleto, Genero, Cidade, Estado, Tipo)
    VALUES ('${cpf}', '${nome}', '${genero}', '${cidade}', '${estado}', '${tipo}')
  `;
  return executarQuery(query);
}

/**
 * Registra uma visita no BigQuery
 */
function registrarVisita(cpf, dataVisita, motivo) {
  const query = `
    INSERT INTO \`${PROJECT_ID}.${DATASET_ID}.${TABLE_VISITAS}\`
    (CPF, DataVisita, MotivoVisita)
    VALUES ('${cpf}', '${dataVisita}', '${motivo}')
  `;
  return executarQuery(query);
}

/**
 * Consulta histórico de visitas por CPF
 */
function consultarHistoricoVisitas(cpf) {
  const query = `
    SELECT DataVisita, MotivoVisita
    FROM \`${PROJECT_ID}.${DATASET_ID}.${TABLE_VISITAS}\`
    WHERE CPF = '${cpf}'
    ORDER BY DataVisita DESC
  `;
  return executarQuery(query);
}

/**
 * Executa uma query no BigQuery
 */
function executarQuery(query) {
  const request = {
    query: query,
    useLegacySql: false
  };
  const queryResults = BigQuery.Jobs.query(request, PROJECT_ID);
  const rows = queryResults.rows || [];
  const result = rows.map(row => {
    const obj = {};
    row.f.forEach((field, index) => {
      obj[`col${index}`] = field.v;
    });
    return obj;
  });
  return result;
}
