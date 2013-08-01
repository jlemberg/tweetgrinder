(function(t){
    var plugin = function() {

        this.name = 'Line count';

        var lineCount = 0;

        this.global = function(data, c) {
            lineCount = data.length;
        }

        this.after = function() {
            t.log('Tweet count: ' + lineCount);
        }
    }

    plugin.prototype = t.pluginPrototype;
    t.hookPlugin(new plugin());
})(tweetgrinder)