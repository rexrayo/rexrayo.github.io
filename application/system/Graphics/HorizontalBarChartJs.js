'use strict';


var barChartJs =  Vue.component('graphics-horizontal-bar', {
	extends: VueChartJs.HorizontalBar,
	props: ['chartdata', 'setOptions'],
  	mounted: function(){
    	this.renderChart(this.chartdata, this.setOptions);
  	}
});

export default barChartJs;