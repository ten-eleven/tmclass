let path = require("path")
describe("TMClassIngestor", function(){
    beforeEach(function(){
        injectIntoScope(this, [
            "TMClassIngestor", "TMClassProcessor", "fsPromise",
            "TMClassConcatter", "TMClassCSVGenerator"
        ])
    })

    fit("should load result", function * (){
        let result = yield this.TMClassCSVGenerator.generate()
        // let result = yield this.TMClassConcatter.concatAll()
        console.log(result)
        // result = _.chain(result)
        //     .sortBy('term')
        //     .value()
        // //
        yield this.fsPromise.writeFileAsync(path.join(
            __dirname, "../../../data/terms.csv"
        ), result)
        // let response = yield this.TMClassIngestor.get()
        // console.log(response.text)
        // yield this.TMClassIngestor.downloadPages()
    })
})
