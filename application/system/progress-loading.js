'use strict';

var progress = Vue.component('progress-loading', {
    data: function(){
        return {colorLoading: window.getColorRandom()};
    },

    beforeCreate: function(){
        window.setInterval(()=>{
			this.colorLoading = window.getColorRandom();
		}, 1000);
    },

    template: `
        <v-container>
            <v-row>
                <v-col cols = "12">
                    <div class="text-center ma-12">
                        <v-progress-circular style = "margin: 10px auto;" :size = "100" :width = "5" :color = "colorLoading" indeterminate>
                            <v-progress-circular style = "margin: 10px auto;" :size = "50" :width = "2" :color = "colorLoading" indeterminate>
                                <v-progress-circular style = "margin: 10px auto;" :size = "20" :width = "1" :color = "colorLoading" indeterminate>
                                </v-progress-circular>
                            </v-progress-circular>
                        </v-progress-circular>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    `
});

export default progress;