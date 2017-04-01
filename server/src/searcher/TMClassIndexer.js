module.exports = function(fsPromise, dataFolder, path,  elasticsearch){
  return new class TMClassIndexer {

    constructor(){
      this.client = new elasticsearch.Client({
        host: 'localhost:9200',
        log: 'info'
      });
    }

    * index(){
      let data = yield fsPromise.readFileAsync(path.join(dataFolder, "terms.json"))
      this.data = JSON.parse(data.toString())
      this.dataIndex = _.keyBy(this.data, "id")

      let multiField = {
        "type" : "text",
        "analyzer": "std_english" ,
        "fields": {
          "raw": {
            "analyzer":"lower_keyword",
            "type":  "string"
          }
        }
      }

      try {yield this.client.indices.delete({index:"classes"})} catch(e){}
      yield this.client.indices.create({
        index:"classes",
        body:{
          "settings" : {
            "number_of_shards" : 1,
            "analysis": {
              "analyzer": {
                "std_english": {
                  "type":      "custom",
                  "stopwords": "_english_",
                  "tokenizer": "standard",
                  "filter":["standard", "lowercase", "my_stemmer", "porter_stem"]
                },
                "lower_keyword":{
                   "tokenizer":"keyword",
                   "filter":"lowercase"
                }

              },
              "filter" : {
                  "my_stemmer" : {
                      "type" : "stemmer",
                      "name" : "english"
                  }
              }
            }
          },
          "mappings" : {
              "class" : {
                  "properties" : {
                      "classNumber":{type:"keyword"},
                      "term" : multiField,
                      "fullTerm" : multiField,
                      "finalTerm" : multiField,
                      "tags" : multiField
                  }
              }
          }
        }


      })
      let commands = []
      this.data.forEach((item)=> {
          commands.push({ index:  { _index: 'classes', _type: 'class', _id: item.id } })
          commands.push(item)
      })
      yield this.client.bulk({body:commands})
    }

    * searchExact(query){
      let results = yield this.client.search({
        index:"classes",
        body:{
          "query": {
            "term": {
              "finalTerm.raw": query.toLowerCase()
            }
          },
          "size":"2"
        }
      })

      // console.log(results)
      return results
    }

    * search(query, classNumbers=[]){
      let terms = classNumbers.map((classNumber)=> {
        return {"term":{
          "classNumber":{
            "value":classNumber,
            "boost":1.3
          }
        }}
      })
      let results = yield this.client.search({
        index:"classes",
        body:{
          "query": {
            "bool":{
              "should":[
                {"match": {
                  "finalTerm": query
                }}
              ].concat(terms)
            }

          },
          "size":"20"
        }
      })


      // console.log(results)
      return results
    }

    * searchSuggestions(query){
      let results = yield this.client.search({
        index:"classes",
        body:{
          "suggest" : {
            "my-suggestion" : {
              "text" : query,
              "term" : {
                "field" : "finalTerm.raw",
                "max_edits":2
              }
            }
          }
        }
      })


      // console.log(results)
      return results
    }
  }
}
