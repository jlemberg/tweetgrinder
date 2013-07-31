(function(t){
    var plugin = function() {

        var swears;
        var regexp;
        var swearCount;

        /**
         * Called before any data is fed to the plugin
         */
        this.before = function(c) {
            swears = "anal anus arse ass ballsack balls bastard bitch biatch bloody blowjob bollock bollok boner boob bugger bum butt buttplug clitoris cock coon crap cunt damn dick dildo dyke fag feck fellate fellatio felching fuck fudgepacker flange Goddamn hell homo jerk jizz knobend labia muff nigger nigga omg penis piss poop prick pube pussy queer scrotum sex shit slut smegma spunk tit tosser turd twat vagina wank whore wtf".split(' ');
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
            t.log(swearCount + ' tweets contain bad words according to http://www.bannedwordlist.com/');
        }
    }

    plugin.prototype = t.pluginPrototype;
    t.hookPlugin(new plugin());
})(tweetgrinder)