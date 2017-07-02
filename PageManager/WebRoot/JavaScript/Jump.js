/**
 * 
 */
function Jump(url) {
    var postUrl = "CPage";//address
    var ExportForm = document.createElement("FORM");
    document.body.appendChild(ExportForm);
    ExportForm.method = "POST";
	//Operation
	var Operation=document.createElement("input");
	Operation.setAttribute("name","Operation");
	Operation.setAttribute("type", "hidden");
	ExportForm.appendChild(Operation);
	Operation.value = "Jump";
	//url
	var URL=document.createElement("input");
	URL.setAttribute("name","URL");
	URL.setAttribute("type", "hidden");
	ExportForm.appendChild(URL);
	URL.value = url;
	
    ExportForm.action = postUrl;
    ExportForm.submit();
}; 