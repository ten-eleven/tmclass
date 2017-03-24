module.exports = function(fsPromise, dataFolder, path, jsdom, Promise){

    return new class TMClassProcessor {

        read(page){
            return fsPromise.readFileAsync(path.join(
                dataFolder, "html", `${page}.html`
            ))
        }

        process(page){
            return this.read(page).then(function(result){
                return new Promise((resolve, reject)=> {
                    jsdom.env({
                        html:result.toString(),
                        scripts: ["http://code.jquery.com/jquery.js"],
                        done:function(err, window){
                            if(err){
                                return reject(err)
                            }
                            let $ = window.$
                            let items = []
                            $("tbody > tr").each(function(){
                                let children = $(this).children()
                                let data = {}
                                data.uri = children.eq(0).attr("id")
                                let matches = data.uri.match(/(\w+)\/(\d+)\/(\d+)/)
                                data.id = matches[3]
                                data.lang = matches[1]
                                data.classNumber = children.eq(1).text()
                                data.term = children.eq(2).find("a").text()
                                data.harm = {}
                                data.harm.id = children.eq(4).find('a').attr('title')
                                data.harm.title = data.id + " - " + data.term
                                data.harm.conceptLink = children.eq(4).find('a').attr('href').split(";")[0  ]
                                items.push(data)
                            })
                            resolve(items)
                        }
                    })
                })
                // jsdom.env(result.toString(), [
                //     "http://code.jquery.com/jquery.js"
                // ], function(err, window){
                //     console.log(window.body)
                // })
            })

        }

        writeAllPages(){
            return Promise.map(_.range(1,792), (page)=>{
                return this.process(page).then((result)=> {
                    console.log('writing page ', page)
                    return fsPromise.writeFileAsync(path.join(
                        dataFolder, "json", `${page}.json`
                    ), JSON.stringify(result, null, 2))
                })
            }, {concurrency:5})
        }


    }

}
