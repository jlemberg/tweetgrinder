(function(t){
    var plugin = function() {

        this.name = 'Word times'

        this.useGraph = true;

        /**
         * Plugin configuration
         */
        this.config = {
            word : {
                type : 'text',
                value : '',
                label : 'text to search for'
            }
        };

        var times;

        this.before = function(c) {
            times = [];
            for(var i= 0; i<24; i++) {
                times[i] = 0;
            }
        }

        /**
         * Receives one line of data at a time
         */
        this.during = function(line, c) {
            if(line[c.text].indexOf(this.config.word.value) != -1) {
                times[parseInt(line[c.timestamp].match(/(\d\d):/)[1])] ++;
            }
        }

        /**
         * Called after all data has been fed to the plugin
         */
        this.after = function(c) {
            var labels = [];
            var dataSet = [];

            for(var i= 0, j=times.length; i<j; i++) {
                labels.push(i);
                dataSet.push(times[i]);
            }

            var data = {
                'labels': labels,
                datasets : [
                    {
                        fillColor : "rgba(220,220,220,0.5)",
                        strokeColor : "rgba(220,220,220,1)",
                        pointColor : "rgba(220,220,220,1)",
                        pointStrokeColor : "#fff",
                        data: dataSet
                    }
                ]
            }

            var outputDiv = this.graphContext.canvas.parentNode;
            var titleSpan = document.createElement('span');
            titleSpan.style.fontWeight = 'bold';
            titleSpan.innerHTML = 'Times the term "'+this.config.word.value+'" has been used';
            outputDiv.appendChild(titleSpan);

            new Chart(this.graphContext).Line(data, {animation:false});
        }
    }

    plugin.prototype = t.pluginPrototype;
    t.hookPlugin(new plugin());
})(tweetgrinder)