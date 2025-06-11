const Joi = require('joi')

const usuariosSchema = Joi.object({
  usuarios: Joi.array().items({
    nome: Joi.string(),
    email: Joi.string(), 
    emailinvalido: Joi.string(),
    password: Joi.string(),
    administrador: Joi.string(),
    _id: Joi.string()
  }),
  quantidade: Joi.number()
})

export default usuariosSchema;
