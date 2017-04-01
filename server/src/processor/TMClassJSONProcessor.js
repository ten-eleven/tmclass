module.exports = function(fsPromise, path, dataFolder, _){
  return new class TMClassJSONProcessor {


    * process(){
      let data = yield fsPromise.readFileAsync(path.join(dataFolder, "terms.json"))
      data = JSON.parse(data.toString())
      data = data.map((item)=> {
        item.fullTerm = item.fullTerm || item.term
        let expansionRegex = /\(([^\)])+\)/g
        let tagRegex = /\[([^\]])+\]/g
        let prefix = ""
        let tags = []
        let workingTerm = item.fullTerm
        if(expansionRegex.test(workingTerm)) {
          // console.log
          let matches = workingTerm.match(expansionRegex)
          matches.forEach((match)=> {
            match = /\(([^\)]+)\)/.exec(match)[1]
            if(/\-$/.test(match)){
              prefix = match.replace(/-$/, "")
            } else {
              tags.push(match)
            }
          })
        }
        if(tagRegex.test(workingTerm)){
          let matches = workingTerm.match(tagRegex)
          matches.forEach((match)=> {
            match = /\[([^\]]+)\]/.exec(match)[1]
            tags.push(match)
          })
        }
        // workingTerm = workingTerm.replace(/\([^\)]+\-\)/g, "")
        // workingTerm =  _.trim(workingTerm).replace(/\s+/g, " ")
        item.term = workingTerm
        item.finalTerm = workingTerm
        item.tags = tags
        if(tags.length > 0 && prefix) {
          console.log(item)
        }
        return item
      })
      // console.log(data)
      yield fsPromise.writeFileAsync(path.join(dataFolder, "terms.json"), JSON.stringify(data, null, 2))
    }
  }
}
