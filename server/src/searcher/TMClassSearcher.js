module.exports = function(TMClassIndexer){
  return new class TMClassSearcher {



    * search(description){

      description = description.replace(/\.\s?$/, "")
      let segments = _.flatten(_.map(description.split(";"), (segment)=> {
        return segment.split(/,\s?/g)
      })).map(_.trim)
      let fullResults = []
      let potentialClasses = {}
      for (let segment of segments){
        let results = []
        let exactResults = yield TMClassIndexer.searchExact(segment)
        let exact = exactResults.hits.hits[0]
        if(exact){
          // results.push({
          //   type:"exact",
          //   data:exact._source
          // })
          potentialClasses[exact._source.classNumber] = true
          fullResults.push({
            description:segment,
            results:[],
            type:'exact',
            classNumber:exact._source.classNumber
          })
        } else {
          fullResults.push({
            description:segment,
            results:results
          })
        }

      }

      potentialClasses = _.keys(potentialClasses)

      for (let result of fullResults){
        if(!result.type){
            let suggestedClasses = {}
            let suggestedResults = yield TMClassIndexer.search(result.description, potentialClasses)
            suggestedResults.hits.hits.forEach((item)=> {
              suggestedClasses[item._source.classNumber] = true
              result.results.push({
                type:"partial",
                data:item._source
              })
            })
            if(suggestedResults.hits.total > 0){
              result.type = 'partial'
              result.classNumber = result.results[0].data.classNumber + "?"

            }

            let spellingSuggestions = yield TMClassIndexer.searchSuggestions(result.description)
            let options = spellingSuggestions.suggest['my-suggestion'][0].options
            if(options.length > 0){
              let spellingResults = []
              for(let item of _.take(options, 2)) {
                let exactResults = yield TMClassIndexer.searchExact(item.text)
                let exact = exactResults.hits.hits[0]
                spellingResults.push({
                  type:"spelling",
                  data:exact._source
                })
              }
              let spellingClasses = _.keys(suggestedClasses).concat(potentialClasses)
              if(spellingResults){
                spellingResults = spellingResults.sort((a, b)=> {
                  return spellingClasses.indexOf(a.data.classNumber) < spellingClasses.indexOf(b.data.classNumber)
                })
                result.results = spellingResults.concat(result.results)
                result.classNumber = spellingResults[0].data.classNumber + "?"
                result.type = 'spelling'
              }
            }


        }
      }
        // if(!exact){
        //   let spellingSuggestions = yield TMClassIndexer.searchSuggestions(segment)
        //   let options = spellingSuggestions.suggest['my-suggestion'][0].options
        //   if(options.length > 0){
        //     for(let item of _.take(options, 2)) {
        //       let exactResults = yield TMClassIndexer.searchExact(item.text)
        //       let exact = exactResults.hits.hits[0]
        //       results.push({
        //         type:"spelling",
        //         data:exact._source
        //       })
        //     }
        //   }
        // }
        // if(!exact){
        //   let suggestedResults = yield TMClassIndexer.search(segment)
        //   suggestedResults.hits.hits.forEach((item)=> {
        //     results.push({
        //       type:exact ? "additional" : "partial",
        //       data:item._source
        //     })
        //   })
        // }



      return fullResults
    }
  }
}
