(function(){
    tweetgrinder.hookPlugin({
        invokeGlobal : function(lines, c) {
            tweetgrinder.log("Line count: " + lines.length);
        },
        invokeLine : function(line, c) {

        }
    });
})()