'use strict';

// radar que constituye el valor obtenido de los datos
// de compras de un grupo determinado de clientes
var radarProducts = Vue.component('radar-inventory-product-graphics', {
    props: ["month", "year", "product"],

    data: function(){
        return {
            dataRadar: null,
            optionsRadar: {
				legend: { position: 'top', },
				scale: { ticks: { beginAtZero: true } }
			}
        };
    },
    
    // al crear el complemento envia la solicitud
    // para obtenet los puntos datos 
    created: function(){
        
        fetch(`./controllers/Inventory.php?call=products_graphics&product=${this.product}&month=${this.month}&year=${this.year}`).then((response)=>{
            return response.json();
        }).then((data)=>{
            let labels = [];
            let month = 0;
            let months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Ocutbre","Noviembre", "Diciembre"];
            let color = window.getColorRandom();
            let colors = [];

            for(var i = 0; i < 2; ++i){
                while( colors.indexOf( color ) > (-1) )
                    color = window.getColorRandom();
                colors.push( color );
            }
            
            let datasets = [
                {
                    label: 'Unidades Vendidas', 
                    backgroundColor: Color( colors[0] ).alpha(0.2).rgbString(), 
                    borderColor: colors[0], 
                    pointBackgroundColor: colors[0], 
                    data: []
                },
                {
                    label: 'Unidades Exitencia', 
                    backgroundColor: Color( colors[1] ).alpha(0.2).rgbString(), 
                    borderColor: colors[1], 
                    pointBackgroundColor: colors[1], 
                    data: []
                }
            ];
            let quantity = 0;

            for(var i = this.month - 7; i < this.month; i++)
                labels.push( months[ i >= 0 ? i : i + 12 ] );
            
            for(var i = 0; i < labels.length; i++){
                quantity = 0;
                data.inputs.forEach((invoice) => {
                    if(  invoice.month == (months.indexOf(labels[i]) + 1)  )
                        quantity += parseInt(invoice.total_units);
                });
                datasets[0].data.push( quantity );
            }

            for(var i = 0; i < labels.length; i++){
                quantity = 0;
                data.outputs.forEach((invoice) => {
                    if(  invoice.month == (months.indexOf(labels[i]) + 1)  )
                        quantity += parseInt(invoice.instock);
                });
                datasets[1].data.push( quantity );
            }

            console.log( datasets[1] );

            this.dataRadar = {datasets: datasets, labels: labels};
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

export default radarProducts;