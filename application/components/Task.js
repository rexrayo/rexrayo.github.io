'use strict';

var Task = Vue.component('task-app', {

	data: function(){
		return {
			
		};
	},


	methods: {
		
	},


	template: `
		<div>
			<template-basic>
				<template slot = "form-new-template-basic" slot-scope = "slotProps">
				</template>
			</template-basic>
			<div>
				<br>
				<h2 class = "text-center">
					<span>Task</span>
				</h2>
				<gridbox-app 
					url = "./controllers/Task.php?call=index"
					headJson = "./application/headers/task.json"
				>
				</gridbox-app>
			</div>
		</div>
	`
});

export default Task;