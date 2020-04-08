'use strict';


var barChartJs =  Vue.component('graphics-bar', {
	extends: VueChartJs.Bar,
	props: ['chartdata', 'setOptions'],
  	mounted: function(){
    	this.renderChart(this.chartdata, this.setOptions);
  	}
});

export default barChartJs;