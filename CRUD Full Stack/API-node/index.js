import express from 'express';
import { db } from './db.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.get('/', (req, res) => {
    const q = 'SELECT * FROM clientes';

    db.query(q, (err, data) => {

        if(err) {
            return res.json(err)
        }

        return res.status(200).json(data)
    })
} )

app.get('/:id', (req, res) => {
    const id = req.params.id;
    
    db.query('SELECT * FROM clientes WHERE id = ?', [id], (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        res.status(404).json({ message: 'Cliente não encontrado' });
      } else {
        res.status(200).json(results[0]);
      }
    });
  });
  

app.post('/', (req, res) => {
    const q =
    "INSERT INTO clientes(`nome`, `email`, `telefone`) VALUES(?)";

    const values = [
        req.body.nome,
        req.body.email,
        req.body.telefone,
    ];
    
    db.query(q, [values], (err) => {
    if (err) return res.json(err);

    return res.status(200).json("Cliente cadastrado com sucesso.");
    });
})

app.put('/:id', (req, res) => {
    const q = "UPDATE clientes SET `nome` = ?, `email` = ?, `telefone` = ? WHERE `id` = ?";

    const values = [
        req.body.nome,
        req.body.email,
        req.body.telefone,
    ];

    db.query(q, [...values, req.params.id], (err) => {
        if(err) return res.json(err);
        return res.status(200).json('Cliente atualizado com sucesso!');
    });
})

app.delete('/:id', (req, res) => {
    const q = "DELETE FROM clientes WHERE `id` = ? ";

    db.query(q, [req.params.id], (err) => {
        if(err) return res.json(err);

        return res.status(200).json('Cliente deletado com sucesso!');
    });

})

app.listen(4000);