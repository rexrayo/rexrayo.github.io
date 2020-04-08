'use strict';

var Radar = Vue.component('graphics-radar',{
    extends: VueChartJs.Radar,
    props: ['chartdata', 'setOptions'],

    mounted: function (){
        this.renderChart(this.chartdata, this.setOptions);
    }
});

export default Radar;