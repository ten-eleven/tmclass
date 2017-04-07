
let bodyParser = require('body-parser')
let cors = require('cors')

module.exports = function(BaseWebServer, TMClassSearcher, co, path, express){


  return new class WebServer extends BaseWebServer {

    registerDefaultMiddleware(){
      super.registerDefaultMiddleware()
      this.app.use(cors())
      this.app.use(bodyParser.json())
      this.app.post('/search', function(req, res){
        res.jsonAsync(co(function * (){
          console.log(req.body)
          return yield TMClassSearcher.search(req.body.query || '')
        }))
      })
      this.app.use('/', express.static(path.join(__dirname, "../../../client/build")))

    }
  }
}
