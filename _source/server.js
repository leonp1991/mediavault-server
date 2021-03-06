import fs from 'fs'
import https from 'https'
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'

import whitelist from './middleware/whitelist'
import authentication from './middleware/authentication'
import restful from './routes/restful'
import account from './routes/account'
import endpoints from './endpoints'

let [ server, port, api, data ] = [ express(), 3000, express.Router(), express.Router() ]

/* parse request body */
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())

/* support cors */
server.use(cors(whitelist))

/* all request must be authenticated */
server.use(authentication)

/* connect to mongodb and start server */
mongoose.connect('mongodb://localhost:27017/api')

/* on db connect */
mongoose.connection.once('open', () => {
  for (let endpoint of endpoints) {
    restful(api, endpoint)
  }

  server.use('/api', api)
  server.use('/account', account(data))
  server.listen(port)
  console.log(`listening to port: ${port}`)
})
