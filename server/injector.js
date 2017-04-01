"use strict"

let spur = require("spur-ioc")
let spurWeb = require("spur-web")
let spurCommon = require("spur-common")
let registerConfig = require("spur-common/registerConfig")
let promisifyAll = require("es6-promisify-all")
let path = require("path")

module.exports = function () {

    let ioc = spur.create("tmclass")
    registerConfig(ioc, __dirname + "/config")
    ioc.merge(spurCommon())
    ioc.merge(spurWeb())

    global._ = require('lodash')

    ioc.registerDependencies({
        "promisifyAll" : promisifyAll,
        "co" : require("co"),
        "dataFolder":path.join( __dirname, "../data" ),
        "jsdom":require("jsdom"),
        "json2csv":require("json2csv"),
        "elasticsearch":require("elasticsearch")
    })

    ioc.registerFolders(__dirname, [
        "src"
    ])

    return ioc
}
