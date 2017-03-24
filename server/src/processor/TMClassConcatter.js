module.exports = function(dataFolder, Promise, fsPromise, path){
    return new class TMClassConcatter {

        concatAll(){
            return Promise.map(_.range(1, 792), (page)=> {
                console.log('reading page ', page)
                return fsPromise.readFileAsync(path.join(
                    dataFolder, "json", `${page}.json`
                )).then((result)=> {
                    return JSON.parse(result.toString())
                })
            }).then((results)=> {
                return _.chain(results).flatten().value()
            })
        }
    }
}
