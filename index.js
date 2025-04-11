const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuração da aplicação
const app = express();
const port = process.env.PORT || 3339;

// Middleware para processar JSON
app.use(bodyParser.json());

// Configurar o transporte SMTP
const transporter = nodemailer.createTransport({
  host: 'email-smtp.sa-east-1.amazonaws.com',
  port: 587,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.AWS_ACCESS_KEY,
    pass: process.env.AWS_SECRET_KEY
  },
  tls: {
    rejectUnauthorized: true // Apenas para desenvolvimento
  }
});

// Rota para enviar email
app.post('/api/send-email', async (req, res) => {
  try {
    
    
    /*   const to= "fabiano.canedo@energisa.com.br"
      const subject= "Email teste via API"
      const body= "Conteúdo do email aqui" */
    
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ 
        success: false, 
        message: 'Os campos "to", "subject" e "body" são obrigatórios' 
      });
    }

    // Enviar o email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: Array.isArray(to) ? to.join(',') : to,
      subject: subject,
      text: body
    });
    
    console.log('Email enviado com sucesso:', info.messageId);
    
    return res.status(200).json({
      success: true,
      message: 'Email enviado com sucesso',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao enviar email',
      error: error.message
    });
  }
});

// Rota básica para verificar se a API está funcionando
app.get('/', (req, res) => {
  res.send('API de envio de emails está funcionando!');
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

