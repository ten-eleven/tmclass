module.exports = function(dataFolder,fsPromise, path, json2csv){
    return new class TMClassConcatter {

        * generate(){
            let data = yield fsPromise.readFileAsync(path.join(dataFolder, "terms.json"))
            data = JSON.parse(data.toString())
            let fields = [
                {
                  label: 'id',
                  value: 'id'
                },{
                  label: 'Class',
                  value: 'classNumber'
                },{
                  label: 'Term',
                  value: 'term'
                },{
                  label: 'harmId',
                  value: 'harm.id'
                },
            ]
            return json2csv({data, fields})

        }
    }
}
