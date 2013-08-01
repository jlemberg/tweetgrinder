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
                label : 'search terms (comma separated)'
            }
        };

        var times;
        var searchTerms;
        var searchTermCount;

        this.before = function(c) {
            searchTerms = this.config.word.value.split(',');
            searchTermCount = searchTerms.length;
            times = [];
            for(var i=0;i<searchTermCount; i++) {
                times[i] = [];
                for(var h= 0; h<24; h++) {
                    times[i][h] = 0;
                }
            }
        }

        /**
         * Receives one line of data at a time
         */
        this.during = function(line, c) {
            for(var i=0;i<searchTermCount; i++) {
                if(line[c.text].indexOf(searchTerms[i]) != -1) {
                    times[i][parseInt(line[c.timestamp].match(/(\d\d):/)[1])] ++;
                }
            }
        }

        /**
         * Called after all data has been fed to the plugin
         */
        this.after = function(c) {
            var labels = [];
            var dataSets = [];
            var words=[];

            for(var h= 0; h<24; h++) {
                labels.push(h);
            }

            console.log('sasdads');


            for(var i=0; i<searchTermCount; i++) {
                var dataSet = [];
                for(var j= 0, k=times[i].length; j<k; j++) {
                    dataSet.push(times[i][j]);
                }

                var randRGB = randCol() + ',' + randCol() + ',' + randCol();
                dataSets.push({
                    fillColor : "rgba("+randRGB+",0.5)",
                    strokeColor : "rgba("+randRGB+",1)",
                    pointColor : "rgba("+randRGB+",1)",
                    data: dataSet
                });
                words.push('<span style="color:rgb('+randRGB+')">'+searchTerms[i]+'</span>');
            }

            var data = {
                'labels': labels,
                datasets : dataSets
            }

            var outputDiv = this.graphContext.canvas.parentNode;
            var titleSpan = document.createElement('span');
            titleSpan.style.fontWeight = 'bold';
            titleSpan.innerHTML = words.join(' ');
            outputDiv.appendChild(titleSpan);

            new Chart(this.graphContext).Line(data, {animation:false});
        }
    }

    function randCol() {
        return Math.ceil((Math.random()*255));
    }

    plugin.prototype = t.pluginPrototype;
    t.hookPlugin(new plugin());
})(tweetgrinder)