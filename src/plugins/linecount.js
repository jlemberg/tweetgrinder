(function(t){
    var plugin = function() {

        var lineCount = 0;

        this.global = function(data, c) {
            lineCount = data.length;
        }

        this.after = function() {
            t.log('Line count: ' + lineCount);
        }
    }

    plugin.prototype = t.pluginPrototype;
    t.hookPlugin(new plugin());
})(tweetgrinder)