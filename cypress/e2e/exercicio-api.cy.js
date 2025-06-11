/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'
//npx serverest@latest ou npm start(para abrir o serverest)
//npx cypress open (para abrir o cypress)

describe('Testes da Funcionalidade Usuários', () => {
    let token;

    before(() => {
        cy.token('Levy@eu.com.br', '123').then(tkn => { token = tkn });
    });

    it('Deve listar usuários cadastrados e validar o contrato manualmente', () => {
        cy.request({
            method: 'GET',
            url: 'usuarios'
        }).then((response) => {
            //expect(response.body.produtos[9].nome).to.equal('Produto EBAC 436746')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('usuarios')
            //expect(response.duration).to.be.lessThan(20)
        })
          cy.request('usuarios').then(response => {
            return contrato.validateAsync(response.body)
        })
    });//OK

    it('Deve cadastrar um usuário com sucesso', () => {
        let usuarios = `usuarios EBAC ${Math.floor(Math.random() * 100000000)}`
        cy.request({
            method: 'POST',
            url: 'usuarios',
            body: {
                "nome": usuarios,
                "email": `teste${Date.now()}@test.com`,
                "password": "teste",
                "administrador": 'false'
            },
            headers: { authorization: token }
        }).then((response) => {
          expect(response.body).to.have.property('_id')
            expect(response.status).to.equal(201)
            //expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        }) 
    });//OK

    it('Deve validar um usuário com email inválido', () => {
        cy.cadastrarUsuarios(token, 'Usuario123', 'emailinvallido', "password", 'administrador')
            .then((response) => {
            expect(response.status).to.equal(400);
            cy.log('Corpo Completo da Resposta da API:', JSON.stringify(response.body));
            const expectedMessage = 'email deve ser um email válido';
            expect(response.body.email).to.equal(expectedMessage);
        });
    });//OK

    it('Deve editar um usuário previamente cadastrado', () => {
        let usuarios = `Usuarios EBAC ${Math.floor(Math.random() * 100000000)}`
        cy.cadastrarUsuarios(token, usuarios, 1, "Descrição do usuario novo", 180)
        .then(response => {
            let id = response.body._id

            cy.request({
                method: 'PUT', 
                url: `usuarios/${id}`,
                headers: {authorization: token}, 
                body: 
                {
                    "nome": usuarios,
                    "email": `teste${Date.now()}@test.com`,
                    "password": "usuario editado",
                    "administrador": 'false'
                  }
            }).then(response => {
                expect(response.body.message).to.equal('Cadastro realizado com sucesso')
            })
        })
    });//OK

    it('Deve deletar um usuário previamente cadastrado', () => {
    it('Deve deletar um usuario previamente cadastrado', () => {
        let usuario = `Usuario EBAC ${Math.floor(Math.random() * 100000000)}`
        cy.cadastrarUsuario(token, usuario, 250, "Descrição do novo Usuario", 180)
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `usuarios/${id}`,
                headers: {authorization: token}
            }).then(response =>{
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
            })
        })
    });
    });//OK

});
