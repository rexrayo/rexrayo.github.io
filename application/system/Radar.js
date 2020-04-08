'use strict';

var chartsRadar =  Vue.component('charts-radar', {
    
    extends: VueChartJs.Radar,
    props: ['chartdata', 'options'],

    mounted: function (){
        this.renderChart(this.chartdata, this.options);
    }
});

export default chartsRadar;
