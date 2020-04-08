'use strict';
      
var DoughnutChart =  Vue.component('graphics-doughnut', {
	extends: VueChartJs.Doughnut,
	props: ['chartdata', 'setOptions'],
  	mounted: function(){
    	this.renderChart(this.chartdata, this.setOptions);
  	}
});

export default DoughnutChart;