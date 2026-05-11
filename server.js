const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

// Libera acesso de qualquer origem (CORS)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

// Dados iniciais em memória
let jogos = [
  { id: 1, nome: "The Legend of Zelda", tipo: "Aventura", nota: 10, review: "Um clássico absoluto." },
  { id: 2, nome: "FIFA 23", tipo: "Esporte", nota: 7, review: "Bom para jogar com amigos." },
];

let proximoId = 3;

// ================================
// GET / (página inicial)
// ================================
app.get("/", (req, res) => {
  return res.status(200).json({
    nome: "Games API",
    descricao: "API de biblioteca pessoal de jogos e avaliações",
    versao: "1.0.0",
    endpoints: [
      { metodo: "POST",   rota: "/login"       },
      { metodo: "GET",    rota: "/jogos"        },
      { metodo: "GET",    rota: "/jogos/:id"    },
      { metodo: "POST",   rota: "/jogos"        },
      { metodo: "PUT",    rota: "/jogos/:id"    },
      { metodo: "DELETE", rota: "/jogos/:id"    },
    ],
  });
});

// ================================
// POST /login
// ================================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "usuario@esoft.com" && password === "Abc123") {
    return res.status(200).json({ token: uuidv4() });
  }

  return res.status(401).json({ mensagem: "Credenciais inválidas." });
});

// ================================
// GET /jogos
// ================================
app.get("/jogos", (req, res) => {
  return res.status(200).json(jogos);
});

// ================================
// GET /jogos/:id
// ================================
app.get("/jogos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const jogo = jogos.find((j) => j.id === id);

  if (!jogo) {
    return res.status(404).json({ mensagem: "Jogo não encontrado." });
  }

  return res.status(200).json(jogo);
});

// ================================
// POST /jogos
// ================================
app.post("/jogos", (req, res) => {
  const { nome, tipo, nota, review } = req.body;

  if (!nome || !tipo || nota === undefined || nota === null || !review) {
    return res.status(400).json({
      mensagem: "Todos os campos são obrigatórios: nome, tipo, nota, review.",
    });
  }

  const novoJogo = { id: proximoId++, nome, tipo, nota, review };
  jogos.push(novoJogo);

  return res.status(201).json(novoJogo);
});

// ================================
// PUT /jogos/:id
// ================================
app.put("/jogos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, tipo, nota, review } = req.body;

  if (!nome || !tipo || nota === undefined || nota === null || !review) {
    return res.status(400).json({
      mensagem: "Todos os campos são obrigatórios: nome, tipo, nota, review.",
    });
  }

  const index = jogos.findIndex((j) => j.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: "Jogo não encontrado." });
  }

  jogos[index] = { id, nome, tipo, nota, review };

  return res.status(200).json(jogos[index]);
});

// ================================
// DELETE /jogos/:id
// ================================
app.delete("/jogos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = jogos.findIndex((j) => j.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: "Jogo não encontrado." });
  }

  jogos.splice(index, 1);

  return res.status(204).send();
});

// ================================
// Iniciar servidor
// ================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
