import json
from flask import Flask, jsonify
from google.cloud import bigquery

# Caminho para o arquivo de credenciais JSON
CREDENTIALS_FILE = "tok-de-amor-f747fd60ce0d.json"

# Inicializa o cliente do BigQuery usando a chave de serviço
with open(CREDENTIALS_FILE) as f:
    credentials_info = json.load(f)

client = bigquery.Client.from_service_account_info(credentials_info)

# Define a consulta SQL para buscar os dados da tabela
query = """
    SELECT * FROM `tok-de-amor.PessoasAssistidas.PessoasAssistidasTable`
"""

# Executa a consulta
query_job = client.query(query)
results = query_job.result()

# Converte os resultados em uma lista de dicionários
data = [dict(row.items()) for row in results]

# Cria a aplicação Flask
app = Flask(__name__)

@app.route('/api/pessoas-assistidas', methods=['GET'])
def get_pessoas_assistidas():
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
