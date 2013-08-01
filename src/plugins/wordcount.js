(function(t){
    var plugin = function() {

        this.name = 'Word count';

        var words;

        this.before = function(){
            words = 0;
        }

        this.during = function(line, c){
            words += line[c.text].split(' ').length;
        }

        this.after = function() {
            t.log('Words: ' + words);
        }
    }

    plugin.prototype = t.pluginPrototype;
    t.hookPlugin(new plugin());
})(tweetgrinder)