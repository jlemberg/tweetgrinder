(function(t){
    var plugin = function() {

        var swears;
        var regexp;
        var swearCount;

        /**
         * Called before any data is fed to the plugin
         */
        this.before = function(c) {
            swears = ['fuck', 'shit', 'damn', 'dammit'];
            regexp = new RegExp( '(' + swears.join('|') + ')' );
            regexp.ignoreCase = true;
            swearCount = 0;
        }

        /**
         * Receives one line of data at a time
         */
        this.during = function(line, c) {
            if(line[c.text].search(regexp) !== -1) {
                swearCount ++;
            }
        }

        /**
         * Called after all data has been fed to the plugin
         */
        this.after = function(c) {
            t.log(swearCount + ' tweets contain swear words (checking for "'+swears.join('", "')+'")');
        }
    }

    plugin.prototype = t.pluginPrototype;
    t.hookPlugin(new plugin());
})(tweetgrinder)