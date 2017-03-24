"use strict";

require('jasmine-co').install()

let injector = require("./injector")
let SpecReporter = require('jasmine-spec-reporter').SpecReporter

jasmine.getEnv().addReporter(new SpecReporter({}))

global.injector = injector

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000000

process.setMaxListeners(0)
process.stdout.setMaxListeners(0)

global.injectIntoScope = (scope, deps, mocks) => {
    let ioc = injector()
    _.each(mocks || {}, (v,k)=>{
        ioc.addDependency(k,v,true)
    })

    let instances = ioc.injectAndReturn(deps)
    _.assign(scope, instances)
}
