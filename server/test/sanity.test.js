describe("Sanity test", function(){

    beforeEach(function(){
        injectIntoScope(this, ["HTTPService"])
    })

    it("HTTPService should exist", function(){
        expect(this.HTTPService).toBeTruthy()
    })

})
