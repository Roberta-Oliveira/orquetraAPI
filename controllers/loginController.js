const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { UserModel } = require("../models/usuarios");

class LoginController {
  /*
    {
        "email": ''
        "senha": "(senha-normal)"
    }
    */
  /* code 150 .. 159 */
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;

      const userExiste = await UserModel.findOne({ email: email });
      if (!userExiste) {
        return res.status(401).json({
          error: true,
          code: 150,
          message: "Erro: Usuário não encontrado!",
        });
      }

      if (!(await bcrypt.compare(senha, userExiste.senha))) {
        return res.status(401).json({
          error: true,
          code: 151,
          message: "Erro: Senha inválida!",
        });
      }


      return res.json({
        user: {
          _id: userExiste._id,
          nome: userExiste.nome,
          email,
        },
        token: jwt.sign(
          { id: userExiste._id, role: userExiste._role },
          process.env.SECRET,
          { expiresIn: process.env.EXPIRES_IN }
        ),
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new LoginController();
