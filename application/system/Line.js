'use strict';

var chartsLine =  Vue.component('graphics-line', {
    
    extends: VueChartJs.Line,
    props: ['chartdata', 'setOptions'],

    mounted: function (){
        this.renderChart(this.chartdata, this.setOptions);
    }
});

export default chartsLine;
