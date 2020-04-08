'use strict';

// radar que constituye el valor obtenido de los datos
// de compras de un grupo determinado de clientes
var radarSales = Vue.component('radar-sales-graphics', {
    props: ["month", "year", "seller", "customer", "group"],

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

        let seller = this.seller != null ? this.seller : "";
        let customer = this.customer != null ? this.customer : "";
        
        fetch(`./controllers/Telemarketing.php?call=group_clients_sales&group=${this.group}&month=${this.month}&year=${this.year}&customer=${customer}&seller=${seller}`).then((response)=>{
            return response.json();
        }).then((data)=>{
            let labels = [];
            let month = 0;
            let months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Ocutbre","Noviembre", "Diciembre"];
            let color = window.getColorRandom();
            let datasets = [{label: 'Unidades Vendidas', backgroundColor: Color( color ).alpha(0.2).rgbString(), borderColor: color, pointBackgroundColor: color, data: []}];
            let quantity = 0;

            for(var i = this.month - 7; i < this.month; i++)
                labels.push( months[ i >= 0 ? i : i + 12 ] );
            
            for(var i = 0; i < labels.length; i++){
                quantity = 0;
                data.forEach((invoice) => {
                    if(  invoice.month == (months.indexOf(labels[i]) + 1)  )
                        quantity += parseInt(invoice.total_units);
                });
                datasets[0].data.push( quantity );
            }

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

export default radarSales;