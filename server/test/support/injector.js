"use strict"

let spur = require("spur-ioc")
let tmclassInjector = require("../../injector")

module.exports = function() {

    let ioc = spur.create("test-tmclass")

    ioc.merge(tmclassInjector())

    ioc.registerDependencies({
    })
    
    ioc.registerFolders(__dirname, [
        "helpers"
    ])

    return ioc
}
