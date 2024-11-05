const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Importa o pacote CORS

const app = express();
const port = 3000;

app.use(cors()); // Permite requisições de outros domínios
app.use(express.json()); // Permite o uso de JSON no corpo da requisição

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'cafeteria',
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Endpoint para obter todos os produtos
app.get('/produtos', (req, res) => {
  db.query('SELECT * FROM produtos', (err, results) => {
    if (err) {
      console.error('Erro ao buscar produtos:', err);
      res.status(500).json({ error: 'Erro ao buscar produtos' });
      return;
    }
    res.json(results);
  });
});

// Endpoint para salvar uma nova comanda
app.post('/comandas', (req, res) => {
  const { numero } = req.body;
  const query = 'INSERT INTO comandas (numero) VALUES (?)';

  db.query(query, [numero], (err, result) => {
    if (err) {
      console.error('Erro ao salvar comanda:', err);
      res.status(500).json({ error: 'Erro ao salvar comanda' });
      return;
    }
    res.status(201).json({ message: 'Comanda salva com sucesso', comandaId: result.insertId });
  });
});

// Endpoint para salvar um novo pedido associado a uma comanda
app.post('/pedidos', (req, res) => {
  const { comanda, produtoId } = req.body;
  const query = 'INSERT INTO pedidos (comanda_id, produto_id) VALUES (?, ?)';

  db.query(query, [comanda, produtoId], (err, result) => {
    if (err) {
      console.error('Erro ao salvar pedido:', err);
      res.status(500).json({ error: 'Erro ao salvar pedido' });
      return;
    }
    res.status(201).json({ message: 'Pedido salvo com sucesso', pedidoId: result.insertId });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
