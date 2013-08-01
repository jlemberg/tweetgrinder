(function(t){
    var plugin = function() {

        this.name = 'Word times'

        /**
         * Plugin configuration
         */
        this.config = {
            word : {
                type : 'text',
                value : 'foo',
                label : 'text to search for'
            }
        };

        var results = [];

        this.before = function(c) {
            console.log(this.config.word.value);
        }

        /**
         * Receives one line of data at a time
         */
        this.during = function(line, c) {
            if(line[c.text].indexOf(this.config.word.value) != -1) {
                results.push(line[c.text]);
            }
        }

        /**
         * Called after all data has been fed to the plugin
         */
        this.after = function(c) {
            for(var i= 0, j=results.length; i<j; i++) {
                t.log(results[i]);
            }
        }
    }

    plugin.prototype = t.pluginPrototype;
    t.hookPlugin(new plugin());
})(tweetgrinder)