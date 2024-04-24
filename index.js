const express = require('express');
const uuid = require('uuid');
const cors = require('cors');

const port = 3001;
const app = express();
app.use(express.json());
app.use(cors())


/*
    - Query params => meusite.com/users?nome=pitter&age=34 // FILTROS
    - Route params => /users/2    // BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECÍFICO
    - Request Body => { "name":"Pitter", "age": 34}

    - GET          => Buscar informações no back-end
    - POST         => Criar informação no back-end
    - PUT / PATCH  => Alterar/Atualizar informação no back-end
    - DELETE       => Deletar informação no back-end  
    
    - Middleware   => INTERCEPTADOR - Tem o poder de parar ou alterar dados da requisição
*/


const users = []

//>>>>>>>>>>>>>>MIDDLEWARE<<<<<<<<<<<<<<<<<<<

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)

    if(index < 0){
        return response.status(404).json({ error: "User not found"})
    }

    request.userIndex = index
    request.userId = id

    next()
}



//>>>>>>>>>>>>>>>>>GET<<<<<<<<<<<<<<<<<<<<<<<
app.get('/users', (request, response) => {

    return response.json(users)
})



//>>>>>>>>>>>>>>>>>POST<<<<<<<<<<<<<<<<<<<<<<
app.post('/users', (request, response) => {

    const {name, age} = request.body
    
    const user = { id:uuid.v4(), name, age}
    users.push(user)

    return response.status(201).json(user)
})



//>>>>>>>>>>>>>>>>>PUT<<<<<<<<<<<<<<<<<<<<<<<

app.put('/users/:id', checkUserId, (request, response) => {

    
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    const updatedUser = { id, name, age}

    users[index] = updatedUser

    return response.json(updatedUser)
})



//>>>>>>>>>>>>>>>DELETE<<<<<<<<<<<<<<<<<<<<

app.delete('/users/:id', checkUserId, (request, response) => {
    
    const index = request.userIndex

    users.splice(index,1)
    
    return response.status(204).json()
})




app.listen(port, () =>{
    console.log(`🛜  Server started on port ${port}`)
})