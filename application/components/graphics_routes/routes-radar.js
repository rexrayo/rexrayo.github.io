'use strict';

var routesRadar = Vue.component('routes-radar-graphics', {

	props: { "router": null, "year" : null },

    data: function(){
        return {
            dataRadar: null, 
            optionsRadar: {
				legend: { position: 'top', },
				scale: { ticks: { beginAtZero: true } }
			}
        };
	},
	
	// antes de crear la grafica crea este tipo de estado
	created: function(){
        
        let routes = this.router == null ? "" : this.router;
        let year = this.year == null ? "" : this.year;

		fetch(`./controllers/Graphics.php?call=routes&route_id=${routes}&year=${year}`).then((response)=>{
			return response.json();
		}).then((data)=>{
			let labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Ocutbre","Noviembre", "Diciembre"];
			let color = window.getColorRandom();
			let datasets = [{
				label: 'Ventas por mes',
				backgroundColor: Color( color ).alpha(0.1).rgbString(),
				borderColor: color,
				pointBackgroundColor: color,
				data: []
			}];

			// ciclo que descomponen los meses dados
			for(var i = 0; i < labels.length; i++){
				for(var j = 0; j < data.length; j++){
					if( (data[j].month - 1) ==  i )
						datasets[0].data[i] = data[j].invoice_units;
				}

				if( datasets[0].data[i] == 0 )
					datasets[0].data[i] = 0;
			}

			this.dataRadar = { datasets, labels };
		});
	},

	template: `
		<div>
			<v-container v-if = "dataRadar == null" >
				<progress-loading>
				</progress-loading>
			</v-container>

			<v-container v-else>
        		<graphics-radar :chartdata = "dataRadar" :setOptions = "optionsRadar" >
				</graphics-radar>
			</v-container>

		</div>
    `
});

export default routesRadar;