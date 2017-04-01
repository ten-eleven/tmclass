let injector = require("./injector")

injector().inject(function(WebServer){
  WebServer.start()
})
