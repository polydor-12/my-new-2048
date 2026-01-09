var filter = "win16|win32|win64|mac|macintel"; 
function pc_or_mobile () {
	var mode = ""
	if ( navigator.platform ) { 
		if ( filter.indexOf( navigator.platform.toLowerCase() ) < 0 ) { 
			mode = "mobile";
		} else { //pc alert('pc 접속'); } 
			mode = "pc"
		}
	}
	return mode;
}


$(document).ready(function(){
	if (pc_or_mobile() == "pc") {
		var x = $(window).width();
		if (x > 1000) {
			x = 700;
		} 
		$("#base").width(x);
		$("#base_outer").css({"display":"flex", "align-items":"center", "justify-content": "center"}) ;
	}
	$("#startboard").show();
});