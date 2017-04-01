let path = require("path")
describe("TMClassIngestor", function(){
    beforeEach(function(){
        injectIntoScope(this, [
            "TMClassIngestor", "TMClassProcessor", "fsPromise", "TMClassIndexer",
            "TMClassConcatter", "TMClassCSVGenerator", "TMClassJSONProcessor"
        ])
    })

    fit("should load result", function * (){
      // yield this.TMClassJSONProcessor.process()
      // yield this.TMClassIndexer.index()
      // console.log(this.TMClassIndexer.searchIndex)
      // let results = this.TMClassIndexer.search('marzipans and marzipan substitutes')
      // console.log(results)

      // let description = `Telecommunications; providing multiple-user access to a global computer network; electronic transmission of data and documents concerning personal and professional information via computer terminals; Internet services; electronic communication services; communication services; interactive telecommunications services; telecommunication of information (including web pages); communication by computer terminals; electronic mail; message sending; providing access to a wide range of general interest information via a global computer network; communication by online blogs and review websites; online platform services; information, advisory and consultancy services in respect of the above.`
      // description = description.replace(/\.$/, "")
      // let segments = description.split(";").map(_.trim)
      // let fullResults = []
      // for (let segment of segments){
      //   let results = yield this.TMClassIndexer.search(segment)
      //   results = _.map(results.hits.hits, (hit)=> {
      //     return `${hit._source.finalTerm} [${hit._source.classNumber}]`
      //   })
      //   fullResults.push({
      //     description:segment,
      //     results:results
      //   })
      // }
      // console.log(description)
      // console.log("\n")
      // fullResults.forEach((result)=> {
      //   console.log("\n")
      //   console.log(result.description)
      //   result.results.forEach((item)=> {
      //     console.log(`\t${item}`)
      //   })
      // })
        // let result = yield this.TMClassCSVGenerator.generate()
        // let result = yield this.TMClassConcatter.concatAll()
        // console.log(result)
        // result = _.chain(result)
        //     .sortBy('term')
        //     .value()
        // //
        // yield this.fsPromise.writeFileAsync(path.join(
        //     __dirname, "../../../data/terms.csv"
        // ), result)
        // let response = yield this.TMClassIngestor.get()
        // console.log(response.text)
        // yield this.TMClassIngestor.downloadPages()
    })
})
