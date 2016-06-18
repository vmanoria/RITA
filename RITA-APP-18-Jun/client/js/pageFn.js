/* on page load  ************************************************** */   	  
/* on page load  ************************************************** */   	  
$(document).ready(function(){   
    
	/* Showing content by selecting Dropdown
	************************************************** */	
	$(".tab_content").hide(); //Hide all user content	 	
	
	var defaultSelUser = $('#selectMe option[value="arun"]');
	var showUserContent = $('#selectMe option[value="arun"]').val();
	
	$(defaultSelUser).prop('selected', true);//Select default user in dropdown
	$("#" + showUserContent).show();//Show default user content
	
	//Show content By selecting drop down
	$('#selectMe').change(function(){		
		$(".tab_content").hide(); 		
		$('#'+$(this).val()).show();		
	});	
	
	/* Arun - chart Begin */
	//Left chart
	setTimeout(function(){
	if($('#arun_originalChart').length>0){
		var data = {
			labels:  $('#arun_originallabels').text().trim().split(','),
			datasets: [	{
				data: $('#arun_originalchartdata').text().trim().split(','),
				backgroundColor: ["#FF6384", "#36B2EB", "#36A2EB", "#FFCE56"],
				hoverBackgroundColor: ["#FF6384", "#36A2EB", "#36B2EB", "#FFCE56"]
			}]
		};
		
		// For a pie chart
		var ctx = $('#arun_originalChart').get(0).getContext('2d');
		myorigPieChart = new Chart(ctx,{  
			type: 'pie', 
			data: data,
			options:{
				legend:{
					position:'bottom'
				}
			}
		});
	}
	
	//Right chart
	if($('#arun_currentChart').length>0){
		var data = {
			labels:  $('#arun_currentlabels').text().trim().split(','),
			datasets: [	{
				data: $('#arun_currentchartdata').text().trim().split(','),
				backgroundColor: ["#FF6384", "#36B2EB", "#36A2EB", "#FFCE56"],
				hoverBackgroundColor: ["#FF6384", "#36A2EB", "#36B2EB", "#FFCE56"]
			}]
		};
		// For a pie chart
		var ctx = $('#arun_currentChart').get(0).getContext('2d');
		myPieChart = new Chart(ctx,{  
			type: 'pie', 
			data: data,
			options:{
				legend:{
					position:'bottom'
				}
			}
		});
	}

	$("#update_chart").on('click',function(){
		$("#arun_originalchartdata").text("28,4.18,7.20,59.86");
		myorigPieChart.data.datasets[0].data = $('#arun_originalchartdata').text().trim().split(',');
		myorigPieChart.update();
	})
	},1000);
	/* Arun - chart End*/
	 // Bar chart -slide 7
	
	if($('#arun_barchar').length>0){
		var data = {
			labels:  $('#arun_Barlabels').text().trim().split(','),
			datasets: [	
				{
					label: "Original Allocation",
					backgroundColor: "#36B2EB",
					borderColor: "#36B2EB",
					borderWidth: 1,
					hoverBackgroundColor: "#36B2EB",
					hoverBorderColor: "#36B2EB",
					data: $('#arun_BarOriginalData').text().trim().split(','),
				},
				{
				label: "Current Allocation",
				backgroundColor: "#1d5045",
				borderColor: "#1d5045",
				borderWidth: 1,
				hoverBackgroundColor: "#1d5045",
				hoverBorderColor: "#1d5045",
				data: $('#arun_BarCurrentData').text().trim().split(','),
				}
			]
		};
		var ctx = $('#arun_barchar').get(0).getContext('2d');
		var myBarChart = new Chart(ctx, {
				type: 'bar',
				data: data,
				options: {
					legend:{
							position:'bottom'
						}
					}
		});
	}
});
