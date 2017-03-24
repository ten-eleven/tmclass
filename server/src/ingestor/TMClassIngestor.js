module.exports = function(HTTPService, path, Promise, co, dataFolder, fsPromise){

    return new class TMCassIngestor {

        get(page){
            let url = `http://tmclass.tmdn.org/ec2/search/ajaxSearch?text=&page=${page}&size=100&niceClass=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45&isadvancedsearch=true&sourceLang=&targetLang=&language=en&totalResults=79057&langResults=79057&orderBySource=0&sortBy=relevance&order=&searchMode=WORDSPREFIX&officeList=EM&showOnlyMasterOrRep=false&incClassmarks=&showNonTaxonomyTermsOnly=false&harmonised=true&_=1488811105135`
            return HTTPService.get(url)
        }

        downloadPage(page){
            return this.get(page).then((response)=> {
                console.log(`saving page ${page}`)
                return fsPromise.writeFileAsync(path.join(
                    dataFolder, `${page}.html`
                ), response.text)
            })
        }

        * downloadPages(){
            return Promise.map(_.range(1,792), (item)=>{
                return this.downloadPage(item)
            }, {concurrency:10})
        }
    }
}
