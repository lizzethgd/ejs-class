const express= require('express')
const PORT = process.env.PORT || 4000
const bodyParser = require('body-parser')
const fs = require('fs')
const os= require('os')
const {showDateTime} = require('./my_modules/my_modules.js')

const app = express()

//Middle ware
app.use((req, res, next)=>{
const user = os.hostname
const page = req.url
const date = showDateTime()
const content = `${user} access ${page} page on ${date}\n`

fs.appendFile('log.txt', content, err =>{
    if(err) throw err
    console.log('content has been saved')
})

next()
})

//Serving static files in express
app.use(express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

let students = [ 
    {_id: 1,
     firstName: 'Asab',
     lastName: 'Yeta',
     age: 250,
     country: 'Findland',
     skills: ['HTML','CSS','JS', 'Node']
    },
    {_id: 2,
     firstName: 'Atik',
     lastName: 'Rahma',
     age: 30,
     country: 'Findland',
     skills: ['HTML','CSS','React','Redux']
    },
    {_id: 3,
    firstName: 'Arthur',
     lastName: 'Pastochenko',
     age: 32,
     country: 'Findland',
     skills: ['HTML','CSS','React','Python']
    },
    {_id: 4,
    firstName: 'Bibek',
    lastName: 'Bibeko',
    age: 32,
    country: 'Findland',
    skills: ['HTML','CSS','React','Python']
    }
]

app.get('/', (req, res)=>{
    let pathname = __dirname + '/views/index.html'
    res.sendFile(pathname)
})

app.get('/about', (req, res)=>{
    let pathname = __dirname + '/views/about.html'
    res.sendFile(pathname)
})

app.get('/contact', (req, res)=>{
    let pathname = __dirname + '/views/contact.html'
    res.sendFile(pathname)
})

app.get('/text', (req, res)=>{
    //let pathname = __dirname + '/views/contact.html'
    res.send('SOME TEXT')
})

app.get('/students', (req, res)=>{
    //let pathname = __dirname + '/views/contact.html'
    res.send(students)
})

app.get('/students/:id', (req, res)=>{
    //let pathname = __dirname + '/views/contact.html'
    const id=req.params.id
    const student = students.find(
        st => st._id==id || st.firstName.toLowerCase()== id.toLowerCase())
    if (student){
        res.send(student)
    }else{
        res.send('Student with this Id does not exist')}
})

app.post('/students', (req, res)=>{
    const id = students.length + 1
    req.body._id= id
    students.push(req.body)
    console.log(req.body)
    res.send('A data has been created')
})

app.put('/students/:id', (req, res)=>{
    const id= +req.params.id
    const student = students.find(st => st._id==id)

    if (student){
    students = students.map(st => {
        if(st._id==id){
            req.body._id = id
            return req.body
        }
        return st
    })
    res.send('A data has been updated')
    }else{
    res.send('Student with this Id does not exist')}
   })

app.delete('/students/:id', (req, res)=>{
    const id= +req.params.id
    const student = students.find(st => st._id==id)

    if (student){
    students = students.filter(st => st._id != id)
    res.send('An student has been deleted')
}else{
    res.send('Student with this Id does not exist')}
})

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}...`)
})