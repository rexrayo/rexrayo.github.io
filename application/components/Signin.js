'use strict';

// componente que se encarga del inicio de cesion
var Signin = Vue.component('sign-app', {

	data: function() {
		return {user_name: "", password: "", errors: null};
	},

	methods: {

		Signin: function(){

			fetch(`./controllers/Session.php?call=signin`,{
				method: "POST",
				body: `username=${this.user_name}&password=${this.password}`,
				credentials: "include",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then((response)=> {
                if( response.status != 202 )
				    return response.json();
                else
                    this.$router.push("/home");
			}).then((response) => {
                if(response != null){
                    this.errors = null;
                    window.setTimeout(()=>{ this.errors = response.errors; }, 200);
                }
            });
		}

	},

	template: `
	<div>
		
        <snackbar-basic-app v-if = "errors" color = "error" :message = "errors"> 
        </snackbar-basic-app>

		<div style = "margin-bottom: 50px;">
        	<v-card class = "overflow-hidden">
    			<v-app-bar fixed color="blue accent-4" dark>
    				<v-avatar>
    					<v-img src = "./resources/images/drotaca.png"  /> 
    				</v-avatar>
    				<v-toolbar-title class = "text-center">
    					<span>Drotaca C.A</span>
    				</v-toolbar-title>
    			</v-app-bar>
    		</v-card>
    	</div>

    	<div style = "margin: 5px auto; margin-top: 60px; max-width: 600px">
    		<v-form>
    			<v-container>
    				<v-row>
    					<v-col cols = "12">
    						<h2 class = "text-center">
    							<span>Iniciar Cesión</span>
    						</h2>
    					</v-col>
    					<v-col cols="12">
    						<v-text-field append-icon = "mdi-account" v-model = "user_name" label="Usuario" outlined shaped></v-text-field>
        				</v-col>
        				<v-col cols  = "12">
          					<v-text-field type = "password" v-model = "password" append-icon = "mdi-lock" label = "Contraseña" outlined shaped></v-text-field>
        				</v-col>
        				<v-col cols = "12">
        					<v-btn color = "blue" style = "width: 100%;color: white;" @click = "Signin">
              					<v-icon>mdi-send</v-icon>
              					<span>Entrar</span>
            				</v-btn>
        				</v-col>
      				</v-row>
    			</v-container>
    		</v-form>
    	</div>

    </div>
	`
});

export default Signin;