/**
 * 
 */
var IsEditPage=false;
var IsPageManage=false;
$(document).ready(function(){
	LoadMenu();
}); 
/*
 |=======================================================================
 |
 |Name: LoadMenu
 |
 |Function:Add Side Menu
 |
 |=======================================================================
 */
function LoadMenu()
{
	var SideMenu ="" +
	"<input type='checkbox' id='sideToggle'>" +
	"<aside>" +
		"<h2>Tool Bar</h2>" +
		"<div id=\"AccountManage\"><a href=\"javascript:void(0)\" onclick=\"AccountManage()\" class=\"Button\">Account Manage</a></div><br>" +
		"<div id=\"PageManage\"><a href=\"javascript:void(0)\" onclick=\"PageManage()\" class=\"Button\">Page Manage</a></div><br>" +
		"<div id=\"EditPage\"><a href=\"javascript:void(0)\" onclick=\"EditPage()\" class=\"Button\">Edit Page</a></div><br>" +
		"<div id=\"UpLoad\"><a href=\"javascript:void(0)\" onclick=\"UploadImg()\" class=\"Button\">UploadImg</a></div><br>" +
		"<div id=\"CSS\"><a href=\"javascript:void(0)\" onclick=\"ManageCSS()\" class=\"Button\">CSS</a></div><br><hr><br>" +
		"<div id=\"Tools\" style=\"text-align:center; width: 180px;overflow:auto;overflow-x:hidden;height:70%;\">" +
		"</div>" +
	"</aside>" +
	"<div id='wrap'>" +
		"<label id='sideMenuControl' for='sideToggle'>M</label>" +
	"</div>";
	$(SideMenu).appendTo(document.body);
}
/*
|=======================================================================
|
|Name: EditPage
|
|Function:Edit current Page CSS
|
|=======================================================================
*/
function EditPage()
{
	if(!IsEditPage)
	{
		//Edit
		if(IsPageManage)
		{
			alert("Please save PageManage first.");
			return;
		}
		ChangeEditMode("EditPage");
	}
	else
	{
		//Save
		ChangeEditMode("SaveEditPage");
	}
}
/*
|=======================================================================
|
|Name: PageManage
|
|Function:Manage all pages,add,delete,open
|
|=======================================================================
*/
function PageManage()
{
	if(!IsPageManage)
	{
		//Edit
		if(IsEditPage)
		{
			alert("Please save EditPage first.");
			return;
		}
		ChangeEditMode("PageManage");
	}
	else
	{
		//Save
		ChangeEditMode("SavePageManage");
	}
}
/*
|=======================================================================
|
|Name: DeleteUser
|
|Function:Delete Specific User Info
|
|=======================================================================
*/
function DeleteUser(UserName)
{
	var Confirm="<div class=\"Confirm\">" +
			"<span>Are you sure you want to delete Account: "+UserName+" ?</span>" +
			"</div>";
	var IsManager;
	$(Confirm).dialog({closeText: "Close",title: "Confirm",modal: true,buttons:
		[
		 {
		      text: "Confirm",
		      click: function(){
		    	  $.post("CPage", {Operation:"DeleteAccount",Account:UserName}, function(data, textStatus, req){
	    				if(textStatus=="success")
	    				{
	    					alert("Success!");
	    					return;
	    				}
	    				else
	    				{
	    					alert("Save Failed...");
	    					return;
	    				}
	    		  });
		    	  //reload
		    	  var text=$("#SearchAccount").val();
		    	  $.post("CPage", {Operation:"GetAccount",KeyWord:text}, function(data, textStatus, req){
		  			if(textStatus=="success")
		  			{
		  				//flush old result
		  				$(".Result").remove();
		  				//Format:
		  				//Account IsManager IsValid
		  				var Accounts=data.split("\n");
		  				//remove last \n
		  				delete Accounts[Accounts.length-1];
		  				Accounts.length--;
		  				for(var i=0;i<Accounts.length;i++)
		  				{
		  					var param=Accounts[i].split(" ");
		  					if(param.length!=3)
		  					{
		  						break;//error
		  					}
		  					var DeleteButton="<a href=\"javascript:void(0)\" onclick=\"DeleteUser(\'"+param[0]+"\')\" style=\"float:left;margin-top:3px;font-size:10px;border:1px solid black;\" >Del</a>";
		  					if(param[1]==1)
		  					{
		  						IsManager="<input class=\"IsManager\" name=\""+param[0]+"\" type=\"checkbox\" checked>";
		  					}
		  					else if(param[1]==0)
		  					{
		  						IsManager="<input class=\"IsManager\" name=\""+param[0]+"\" type=\"checkbox\">";
		  					}
		  					else
		  					{
		  						IsManager="Me";
		  						DeleteButton="";
		  					}
		  					var IsValid;
		  					if(param[1]==0)
		  					{
		  						if(param[2]==1)
		  						{
		  							IsValid="<input class=\"IsValid\" name=\""+param[0]+"\" type=\"checkbox\" checked>";
		  						}
		  						else
		  						{
		  							IsValid="<input class=\"IsValid\" name=\""+param[0]+"\" type=\"checkbox\">";
		  						}
		  					}
		  					else
		  					{
		  						IsValid="";
		  					}
		  					$("#HR").after("<tr class=\"Result\"><td>"+DeleteButton+""+param[0]+"</td><td>"+IsManager+"</td><td>"+IsValid+"</td></tr>");
		  				}
		  			}
		  			else
		  			{
		  				alert("Opps...A mistake have occurred...please try again.");
		  			}
		  		});
		    	  $( this ).dialog("close");
		      }
	    },
	    {
	      text: "Cancel",
	      click: function() {$( this ).dialog("close");}
	    }
	    ]
	,maxWidth: 530
	,minHeight: 100,maxHeight: 200
	,close:function(){
		$(".Confirm").remove();//remove Dialog class
	}
	});
	$(".ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-dialog-titlebar-close").css({"text-align":"center","line-height":"10px"}).html("x");//close button
}
/*
|=======================================================================
|
|Name: AccountManage
|
|Function:Manage Account :Add account,delete account,search account,change account(IsManager,IsValid)
|
|=======================================================================
*/
function AccountManage()
{
	var IsDeleteAccount=false;
	var IsManager;
	if(IsEditPage)
	{
		alert("Please Save EditPage first.");
		return;
	}
	if(IsPageManage)
	{
		alert("Please Save PageManage first.");
		return;
	}
	//Dialog
	var AccountDialog = "<div class=\"AccountDialog\" style=\"text-align:center;\">" +
			"Search:<input id=\"SearchAccount\" type=\"text\" style=\"width:200px;text-align:center;\">" +
			"<table style=\"width:500;font-size:20px;text-align:center;\">" +
			"<tr>" +
			"<td width=\"160\">Account</td>" +
			"<td width=\"160\">Manager</td>" +
			"<td width=\"160\">Valid</td>" +
			"</tr>" +
			"<tr id=\"HR\"><td colspan=3><hr></td></tr>" +
			"</table>" +					
			"</div>";
	
	$(AccountDialog).dialog({closeText: "Close",title: "Account Manage",modal: true,buttons:
		[
		 {
		      text: "Save",
		      click: function(){
		    	  $(".IsManager").each(function(index, data) {
		    		  var name=$(data).attr("name");
		    		  var ManagerCheck=$(data).is(':checked');
		    		  var ValidCheck="";
		    		  if(ManagerCheck!="checked")//not manager
		    		  {
		    			  $(".IsValid").each(function(index, data) {
			    			  if($(data).attr("name")==name)
			    			  {
			    				  ValidCheck=$(data).is(':checked');
			    			  }
			    		  });
		    		  }
		    		  else
		    		  {
		    			  ValidCheck="checked";
		    		  }
		    		  //format
		    		  ManagerCheck=(ManagerCheck==true)?"1":"0";
		    		  ValidCheck=(ValidCheck==true)?"1":"0";
		    		  //update
		    		  $.post("CPage", {Operation:"UpdateAccount",Account:name,IsManager:ManagerCheck,IsValid:ValidCheck}, function(data, textStatus, req){
		    				if(textStatus!="success")
		    				{
		    					alert("Save Failed...");
		    					return;
		    				}
		    		  });
		    	  });
		    	  $( this ).dialog("close");
		      }
	    },
	    {
	      text: "Cancel",
	      click: function() {
	    	  $( this ).dialog("close");}
	    }
	    ]
	,minWidth:530,maxWidth: 530
	,minHeight: 680,maxHeight: 680
	,close:function(){
		  $(".AccountDialog").remove();//remove Dialog class
	  }
	});
	$(".ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-dialog-titlebar-close").css({"text-align":"center","line-height":"10px"}).html("x");//close button
	//onchange
	$("#SearchAccount").on("keyup",function(){
		var text=$("#SearchAccount").val();
		if(text=="")
		{
			$(".Result").remove();
			return;
		}
		$.post("CPage", {Operation:"GetAccount",KeyWord:text}, function(data, textStatus, req){
			if(textStatus=="success")
			{
				//flush old result
				$(".Result").remove();
				//Format:
				//Account IsManager IsValid
				var Accounts=data.split("\n");
				//remove last \n
				delete Accounts[Accounts.length-1];
				Accounts.length--;
				for(var i=0;i<Accounts.length;i++)
				{
					var param=Accounts[i].split(" ");
					if(param.length!=3)
					{
						break;//error
					}
					var DeleteButton="<a href=\"javascript:void(0)\" onclick=\"DeleteUser(\'"+param[0]+"\')\" style=\"float:left;margin-top:3px;font-size:10px;border:1px solid black;\" >Del</a>";
					if(param[1]==1)
					{
						IsManager="<input class=\"IsManager\" name=\""+param[0]+"\" type=\"checkbox\" checked>";
					}
					else if(param[1]==0)
					{
						IsManager="<input class=\"IsManager\" name=\""+param[0]+"\" type=\"checkbox\">";
					}
					else
					{
						IsManager="Me";
						DeleteButton="";
					}
					var IsValid;
					if(param[1]==0)
					{
						if(param[2]==1)
						{
							IsValid="<input class=\"IsValid\" name=\""+param[0]+"\" type=\"checkbox\" checked>";
						}
						else
						{
							IsValid="<input class=\"IsValid\" name=\""+param[0]+"\" type=\"checkbox\">";
						}
					}
					else
					{
						IsValid="";
					}
					$("#HR").after("<tr class=\"Result\"><td>"+DeleteButton+""+param[0]+"</td><td>"+IsManager+"</td><td>"+IsValid+"</td></tr>");
				}
			}
			else
			{
				alert("Opps...A mistake have occurred...please try again.");
			}
		});
	});
}
/*
|=======================================================================
|
|Name: ReLoadHtml
|
|Function:reload page from database to undo changes
|
|=======================================================================
*//*
function ReLoadHtml(type)//Load Page From DataBase(Cancel)
{
	if(type.toString()=="EditPage")
	{
		ChangeEditMode("CancelEditPage");
	}
	else if(type.toString()=="PageManage")
	{
		ChangeEditMode("CancelPageManage");
	}
}*/
/*
|=======================================================================
|
|Name: IsInsertable
|
|Function: check the element to see if it's insertable
|
|=======================================================================
*/
function IsInsertable()
{
	var IsInsertable=false;
	var range = window.getSelection().getRangeAt(0);
	if(range==null||range.commonAncestorContainer==null)
	{
		return null;
	}
	$(range.commonAncestorContainer).parents().each(function(index,data){
		if($(data).attr("id")=="Head"||$(data).attr("id")=="Logo"||$(data).attr("id")=="Navigation"||$(data).attr("id")=="Content"||$(data).attr("id")=="Foot")
		{
			IsInsertable=true;
		}
	});
	return IsInsertable?range:null;
}
/*
|=======================================================================
|
|Name: AddImg
|
|Function: Insert a Image at current cursor
|
|=======================================================================
*/
function AddImg()
{
	var range=IsInsertable();
	if(range==null)
	{
		alert("Please select an Element which is insertable.");
		return;
	}
	
	var ImgDialog="<div class=\"AddImgDialog\" style=\"text-align:center;\">" +
			"<div id=\"ImgWindow\" style=\"float:left;width:580px;height:400px;overflow-x:hidden;\"></div>" +
			"<br><br>Width:<input id=\"InputImgWidth\" type=\"text\"/><br><br>" +
			"URL:&nbsp;&nbsp;&nbsp;<input id=\"InputImgURL\" type=\"text\"><br><br>" +
			"Class:&nbsp;<input id=\"InputImgClass\" type=\"text\"><br><br>" +
			"Id:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id=\"InputImgId\" type=\"text\">" +
			"</div>";
	$(ImgDialog).dialog({closeText: "Close",title: "Add Image",modal: true,buttons:
		[
		 {
		      text: "Insert",
		      click: function(){
		    	  var Imgsrc=$("[select=selected]");
		    	  if(Imgsrc.length<=0)
		    	  {
		    		  alert("Please Select A Image.");
		    		  return;
		    	  }
		    	  Imgsrc=Imgsrc.attr("src");
		    	  var ImgWidth=$("#InputImgWidth").val();
		    	  var ImgURL=$("#InputImgURL").val();
		    	  var ImgClass=$("#InputImgClass").val();
		    	  var ImgId=$("#InputImgId").val();
		    	  //check
		    	  ImgWidth=Check("width",ImgWidth);
		    	  ImgURL=Check("URL",ImgURL);
		    	  ImgId=Check("id",ImgId);
		    	  ImgClass=Check("wordandnumber",ImgClass);
		    	  if(ImgWidth==null)
		    	  {
		    		  alert("Image width error!");
		    		  return;
		    	  }
		    	  if(ImgURL==null)
		    	  {
		    		  alert("URL Error");
		    		  return;
		    	  }
		    	  if(ImgClass==null)
		    	  {
		    		  alert("Illegal Char In Class");
		    		  return;
		    	  }
		    	  if(ImgId==null)
		    	  {
		    		  alert("Illegal Char in Id or Id already exist.");
		    		  return;
		    	  }
		    	  //insert
		    	  if(ImgURL!=null&&ImgURL!="")
		    	  {
		    		  InsertAtCursor(range,"<a href=\"javascript:void(0)\" onclick=\"Jump(\'"+ImgURL+"\')\"><img id=\"tempImg\" src=\""+Imgsrc+"\" /></a>");
		    	  }
		    	  else
		    	  {
		    		  InsertAtCursor(range,"<img id=\"tempImg\" src=\""+Imgsrc+"\" />");
		    	  }
		    	  (ImgClass=="")?null:$("#tempImg").addClass(ImgClass);
		    	  $("#tempImg").css("width",ImgWidth);
		    	  //change id
		    	  (ImgId=="")?$("#tempImg").removeAttr("id"):$("#tempImg").attr("id",ImgId);
		    	  
		    	  $( this ).dialog("close");
		      }
	    },
	    {
	      text: "Cancel",
	      click: function() {$( this ).dialog("close");}
	    }
	    ]
	,minWidth:650,maxWidth: 650
	,minHeight: 800,maxHeight: 800
	,close:function(){
		$(".AddImgDialog").remove();//remove Dialog class
	}
	});
	$(".ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-dialog-titlebar-close").css({"text-align":"center","line-height":"10px"}).html("x");//close button);
	$.post("CPage", {Operation:"AllPirctures"}, function(data, textStatus, req){
		if(textStatus=="success")
		{
			var PicNames=data.split("\n");
		}
		delete PicNames[PicNames.length-1];
		PicNames.length--;
		for(var i=0;i<PicNames.length;i++)
		{
			$("#ImgWindow").append("<img class=\"Pictures\" src=\"Picture/"+PicNames[i]+"\" title=\""+PicNames[i]+"\" style=\"margin:5px;max-width:250px;width:250px;width:expression(document.body.clientWidth>250?\"250px\":\"auto\");overflow:hidden;\" /><a href=\"javascript:void(0)\" onclick=\"DeleteImg(\'"+PicNames[i]+"\')\" style=\"font-size:10px;text-align:center;line-height: 10px;opacity:50%;color:white;width: 10px;height: 10px;background-color: rgba(0,0,0,0.3);z-index:1\">x</a>");
		}
		$(".Pictures").on("click",function(){
			$("[select=selected]").css("border","");
			$("[select=selected]").attr("select","");
			$(this).attr("select","selected");
			$(this).css("border","5px solid rgba(100,200,100,0.5)");
		});
	});
}
/*
|=======================================================================
|
|Name: DeleteImg
|
|Function: Delete Image
|
|=======================================================================
*/
function DeleteImg(ImgName)
{
	var DeleteImageDialog="<div class=\"DeleteImageDialog\">" +
			"Are you sure you want to delete image " +ImgName+" ?" +
			"Please Save Your work before you delete image."+
			"</div>";
	$(DeleteImageDialog).dialog({closeText: "Close",title: "Delete Image",modal: true,buttons:
		[
		 {
		      text: "Confirm",
		      click: function(){
		    	  $.post("CPage", {Operation:"DeleteImage",ImageName:ImgName}, function(data, textStatus, req){
		    			if(textStatus=="success"&&data=="success")
		    			{
		    				alert("Delete complete.");
		    				PreparePost("Refresh");
		    				$( this ).dialog("close");
		    			}
		    			else
		    			{
		    				alert("Delete Fail.");
		    			}
		    	  });
		      }
	    },
	    {
	      text: "Cancel",
	      click: function() {$( this ).dialog("close");}
	    }
	    ]
	,minWidth:600,maxWidth: 600
	,minHeight: 200,maxHeight: 200
	,close:function(){
		$(".DeleteImageDialog").remove();//remove Dialog class
	}
	});
	$(".ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-dialog-titlebar-close").css({"text-align":"center","line-height":"10px"}).html("x");//close button);
}
/*
|=======================================================================
|
|Name: AddImgURL
|
|Function: Change text into <a></a> or insert <a></a>
|
|=======================================================================
*/
function AddAdvancedText()
{
	var range=IsInsertable();
	if(range==null)
	{
		alert("Please Select an Element.");
		return;
	}
	var AddURLDialog="<div class=\"URLDialog\" style=\"text-align:center;\">" +
			"Class:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"text\" id=\"InputClassObj\"><br><br>" +
			"Id:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"text\" id=\"InputIdObj\"><br><br>" +
			"URL:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"text\" id=\"InputURLObj\"><br><br>" +
			"Content:<input type=\"text\" id=\"InputContentObj\">" +
			"</div>";
	$(AddURLDialog).dialog({closeText: "Close",title: "Add Advanced Text",modal: true,buttons:
		[
		 {
		      text: "Insert",
		      click: function(){
		    	  var textclass=$("#InputClassObj").val();
		    	  var textid=$("#InputIdObj").val();
		    	  var url=$("#InputURLObj").val();
		    	  var content=$("#InputContentObj").val();
		    	  textclass=Check("wordandnumber",textclass);
		    	  if(textclass==null)
		    	  {
		    		  alert("Class Error!");
		    		  return;
		    	  }
		    	  textid=Check("id",textid);
		    	  if(textid==null)
		    	  {
		    		  alert("Id Error!");
		    		  return;
		    	  }
		    	  url=Check("URL",url);
		    	  if(url==null)
		    	  {
		    		  alert("URL Error");
		    		  return;
		    	  }
		    	  if(content=="")
		    	  {
		    		  alert("Please Insert a content.")
		    		  return;
		    	  }
		    	  if(url==""&&textclass==""&&textid=="")
		    	  {
		    		  alert("Please Fill at least one attribute.");
		    		  return;
		    	  }
		    	  var ALabel1="";
		    	  var ALabel2="";
		    	  var SpanLabel1="";
		    	  var SpanLabel2="";
		    	  var ClassLabel="";
		    	  var IdLabel="";
		    	//insert
		    	  if(url!="")
		    	  {
		    		  ALabel1="<a href=\"javascript:void(0)\" onclick=\"Jump(\'"+url+"\')\">";
		    		  ALabel2="</a>";
		    	  }
		    	  if(textclass!=""||textid!="")
		    	  {
		    		  if(textclass!="")
		    		  {
		    			  ClassLabel="class=\""+textclass+"\"";
		    		  }
		    		  if(textid!="")
		    		  {
		    			  IdLabel="id=\""+textid+"\"";
		    		  }
		    		  SpanLabel1="<span "+ClassLabel+" "+IdLabel+">";
		    		  SpanLabel2="</span>";
		    	  }
		    	  InsertAtCursor(range,ALabel1+SpanLabel1+content+SpanLabel2+ALabel2);
		    	  $( this ).dialog("close");
		      }
	    },
	    {
	      text: "Cancel",
	      click: function() {$( this ).dialog("close");}
	    }
	    ]
	,minWidth:400,maxWidth: 400
	,minHeight: 350,maxHeight: 350
	,close:function(){
		$(".URLDialog").remove();//remove Dialog class
	}
	});
	$(".ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-dialog-titlebar-close").css({"text-align":"center","line-height":"10px"}).html("x");//close button);
}
/*
|=======================================================================
|
|Name: AddCustom
|
|Function: add a custom label
|
|=======================================================================
*/
function AddCustom()
{
	var range=IsInsertable();
	if(range==null)
	{
		alert("Please select a insertable element.");
		return;
	}
	var CustomDialog="<div class=\"CustomDialog\">" +
			"Label:<textarea id=\"CustomLabel\" cols=40 rows=10></textarea>" +
			"</div>";
	$(CustomDialog).dialog({closeText: "Close",title: "Add Custom",modal: true,buttons:
		[
		 {
		      text: "Insert",
		      click: function(){
		    	  InsertAtCursor(range,$(CustomLabel).val());
		    	  $( this ).dialog("close");
		      }
	    },
	    {
	      text: "Cancel",
	      click: function() {$( this ).dialog("close");}
	    }
	    ]
	,minWidth:400,maxWidth: 400
	,minHeight: 40,maxHeight: 400
	,close:function(){
		$(".CustomDialog").remove();//remove Dialog class
	}
	});
	$(".ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-dialog-titlebar-close").css({"text-align":"center","line-height":"10px"}).html("x");//close button);
}
/*
|=======================================================================
|
|Name: UploadImg
|
|Function: Upload Img to server
|
|=======================================================================
*/
function UploadImg()
{
	if(IsEditPage)
	{
		alert("Please Save Page First.");
		return;
	}
	if(IsPageManage)
	{
		alert("Please Save PageManage.");
		return;
	}
	var Upload="<div class=\"UploadImg\">" +
			"<form id=\"formUploadImg\" method=\"post\" action=\"CPage\" enctype=\"multipart/form-data\">" +
			"<input type=\"file\" name=\"InputUploadImg\" id=\"IdUploadImg\" />" +
			"</form>" +
			"</div>";
	$(Upload).dialog({closeText: "Close",title: "Upload Image",modal: true,buttons:
		[
		 {
		      text: "Upload",
		      click: function(){
		    	  var str=$("#IdUploadImg").val();
		    	  var format=str.substr(str.lastIndexOf(".")+1, str.length);
		    	  if(format!="jpg"&&format!="png")
		    	  {
		    		  alert("Only jpg or png is accepted.");
		    		  return;
		    	  }
		    	  $.post("CPage", {Operation:"UploadImg",FileName:$("#IdUploadImg").val()}, function(data, textStatus, req){
		    		  if(textStatus=="success")
		    		  { 
		    			  $("#formUploadImg").submit();
		    			  $("body").html("UpLoading...Please Wait");
		    		  }
		    	  });
		    	  $( this ).dialog("close");
		      }
	    },
	    {
	      text: "Cancel",
	      click: function() {$( this ).dialog("close");}
	    }
	    ]
	,minWidth:400,maxWidth: 600
	,maxHeight: 300
	,close:function(){
		$(".Upload").remove();//remove Dialog class
	}
	});
	$(".ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-dialog-titlebar-close").css({"text-align":"center","line-height":"10px"}).html("x");//close button);
}
/*
|=======================================================================
|
|Name: InsertAtCursor
|
|Function: add text to cursor point
|
|=======================================================================
*/
function InsertAtCursor(range,text)
{
	var node;
	//var obj= $(".im-message-area")[0];
	/*if(!obj.hasfocus)
	  {
	  obj.focus();
	  }*/
	//alert(event.srcElement);
	if (window.getSelection && window.getSelection().getRangeAt)
	{
		//range = window.getSelection().getRangeAt(0);
		range.collapse(false);
	    node = range.createContextualFragment(text);
	    
	    var c = node.lastChild;
	    range.insertNode(node);
	    if(c)
	    {
	    	range.setEndAfter(c);
	    	range.setStartAfter(c)
	    }
	    var j = window.getSelection();
	    j.removeAllRanges();
	    j.addRange(range);
	}
	else if (document.selection && document.selection.createRange)
	{
		document.selection.createRange().pasteHTML(text);
	}
}
/*
|=======================================================================
|
|Name: ManageCSS
|
|Function: manage css file
|
|=======================================================================
*/
function ManageCSS()
{
	if(IsEditPage)
	{
		alert("Please Save Edit Page first.");
		return;
	}
	if(IsPageManage)
	{
		alert("Please Save Page Manage first.");
		return;
	}
	var CheckNames=new Array();
	var CheckSuccess=true;
	var ManageCSS="<div class=\"ManageCSSDialog\" style=\"text-align:center;\">" +
			"<table id=\"CSSTable\" style=\"width:550;text-align:center;\" cellspacing=10 contenteditable=true>" +
			"<tr contenteditable=false><td style=\"width:30px;\"></td><td style=\"width:200px;\">Object</td><td style=\"width:350px;\">Style</td></tr>" +
			"<tr><td colspan=3><hr></td></tr>" +
			"</table>" +
			"</div>";
	$(ManageCSS).dialog({closeText: "Close",title: "Manage CSS",modal: true,buttons:
		[
		 {
			 text: "Add Object",
			 click: function(){
				 $("#CSSTable").append("<tr><td><a href=\"javascript:void(0)\" onclick=\"$(this).parents(\'tr\').remove()\" style=\"border:2px solid white;float:left;text-align:center;color:white;z-index:1;\" contenteditable=false>Del</a></td><td name=\"ObjectName\">NewObject</td><td name=\"ObjectStyle\">NewStyle</td></tr>");
			 }
		 },
		 {
		      text: "Save",
		      click: function(){
		    	  CheckSuccess=true;
		    	 //ObjectName check blanck and repeat name
		    	  $("#CSSTable tr td+[name=ObjectName]").each(function(index, data) {
		    		  if(!CheckSuccess)
		    		  {
		    			  return;
		    		  }
		    		  var name=$(data).html();
		    		  if(name=="<br>"||name.match(/(\&nbsp;)/))
		    		  {
		    			  alert("Null Name was found.");
		    			  CheckSuccess=false;
		    			  return;
		    		  }
	    			  for(var i=0;i<index;i++)
	    			  {
	    				  if(CheckNames[i]==$(data).html())
	    				  {
	    					  alert("Repeat Name was found.");
	    					  CheckSuccess=false;
	    					  return;
	    				  }
	    			  }
	    			  CheckNames[index]=$(data).html();
		    	  });
		    	  //ObjectStyle check blanck
		    	  $("#CSSTable tr td+[name=ObjectStyle]").each(function(index, data) {
		    		  if(!CheckSuccess)
		    		  {
		    			  return;
		    		  }
		    		  var style=$(data).html();
		    		  if(style=="<br>"||style.match(/^((\&nbsp;)*| *)*$/))
		    		  {
		    			  alert("Null Style was found.");
		    			  CheckSuccess=false;
		    			  return;
		    		  }
		    	  });
		    	  if(!CheckSuccess)
		    	  {
		    		  return;
		    	  }
		    	 //save
		    	  var lenth=CheckNames.length;
		    	  var TempName="";
		    	  var TempStyle="";
		    	  $("#CSSTable tr td").each(function(index, data) {
		    		  if($(data).attr("name")=="ObjectName")
		    		  {
		    			  TempName=$(data).html();
		    			  return;
		    		  }
		    		  if($(data).attr("name")=="ObjectStyle")
		    		  {
		    			  TempStyle=$(data).html();
		    			  $.post("CPage", {Operation:"PrepareSaveCSS",Object:TempName,Style:TempStyle,Lenth:lenth}, function(data, textStatus, req){
		    				  if(textStatus=="success"&&data=="final")
		    				  {
		    					  //final to save
		    					  $.post("CPage", {Operation:"SaveCSS"}, function(data, textStatus, req){
		    			    		  if(textStatus=="success"&&data=="success")
		    			    		  {
		    			    			  alert("Save Success");
		    			    			  PreparePost("Refresh");
		    			    		  }
		    			    		  else
		    			    		  {
		    			    			  alert("Error!");
		    			    		  }
		    			    	  });
		    			    	  $( this ).dialog("close");
		    				  }
		    			  });
		    		  }
		    	  });
		      }
	    },
	    {
	      text: "Cancel",
	      click: function() {$( this ).dialog("close");}
	    }
	    ]
	,minWidth:600,maxWidth: 600
	,minHeight:600,maxHeight: 600
	,close:function(){
		$(".ManageCSSDialog").remove();//remove Dialog class
	}
	});
	$(".ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-dialog-titlebar-close").css({"text-align":"center","line-height":"10px"}).html("x");//close button););
	//get all css
	$.post("CPage", {Operation:"GetCSS"}, function(data, textStatus, req){
		if(textStatus=="success")
		{
			//format:name1 attributes
			//name2 attributes
			//...
			var block=data.split("\n");
			delete block[block.length-1];
			block.length--;
			var names=new Array();
			var attributes=new Array();
			for(var i=0;i<block.length;i++)
			{
				var temp=block[i].split("=");
				names[i]=temp[0];
				attributes[i]=temp[1];
				$("#CSSTable").append("<tr><td><a href=\"javascript:void(0)\" onclick=\"$(this).parents(\'tr\').remove()\" style=\"border:2px solid white;float:left;text-align:center;color:white;z-index:1;\" contenteditable=false>Del</a></td><td style=\"word-break:break-all;\" name=\"ObjectName\">"+names[i]+"</td><td style=\"word-break:break-all;\" name=\"ObjectStyle\">"+attributes[i]+"</td></tr>");
			}
		}
	});
}
/*
|=======================================================================
|
|Name: ChangeEditMode
|
|Function: change side menu edit mode
|
|=======================================================================
*/
function ChangeEditMode(mode)
{
	if(mode.toString()=="EditPage")
	{
		//Editable
		//document.body.contentEditable=true;
		$("#Head").attr("contenteditable","true");
		$("#Navigation").attr("contenteditable","true");
		$("#Logo").attr("contenteditable","true");
		$("#Content").attr("contenteditable","true");
		$("#Foot").attr("contenteditable","true");
		//Add Widget [Css]
		$("<a class=\"Widget\" style=\"right:12px;\" contenteditable=false href=\"javascript:void(0)\" onclick=\"SetCSS(event)\">c</a>").appendTo($("#Head"));
		$("<a class=\"Widget\" style=\"right:12px;\" contenteditable=false href=\"javascript:void(0)\" onclick=\"SetCSS(event)\">c</a>").appendTo($("#Navigation"));
		$("<a class=\"Widget\" style=\"right:12px;\" contenteditable=false href=\"javascript:void(0)\" onclick=\"SetCSS(event)\">c</a>").appendTo($("#Logo"));
		$("<a class=\"Widget\" style=\"right:12px;\" contenteditable=false href=\"javascript:void(0)\" onclick=\"SetCSS(event)\">c</a>").appendTo($("#Content"));
		$("<a class=\"Widget\" style=\"right:12px;\" contenteditable=false href=\"javascript:void(0)\" onclick=\"SetCSS(event)\">c</a>").appendTo($("#Foot"));
		//Add Widget [x]
		$("<a class=\"Widget\" contenteditable=false href=\"javascript:void(0)\" onclick=\"Hide(event)\">x</a>").appendTo($("#Head"));
		$("<a class=\"Widget\" contenteditable=false href=\"javascript:void(0)\" onclick=\"Hide(event)\">x</a>").appendTo($("#Navigation"));
		$("<a class=\"Widget\" contenteditable=false href=\"javascript:void(0)\" onclick=\"Hide(event)\">x</a>").appendTo($("#Logo"));
		$("<a class=\"Widget\" contenteditable=false href=\"javascript:void(0)\" onclick=\"Hide(event)\">x</a>").appendTo($("#Content"));
		$("<a class=\"Widget\" contenteditable=false href=\"javascript:void(0)\" onclick=\"Hide(event)\">x</a>").appendTo($("#Foot"));
		$("<div class=\"Widget\" style=\"right:24px;cursor:move;\" contenteditable=false >+</div>").appendTo($("#Logo"));//Draggable
		$("#Logo").draggable({handle: "div"});
		//Load Tools Button
		var Tools="<a class=\"ToolsButton\" href=\"javascript:void(0)\" onclick=\"AddImg()\">Img</a><br>" +
				"<a class=\"ToolsButton\" href=\"javascript:void(0)\" onclick=\"AddAdvancedText()\">Advanced Text</a><br>" +
				"<a class=\"ToolsButton\" href=\"javascript:void(0)\" onclick=\"AddCustom()\">&lt;&nbsp;&gt;</a><br>" +
				"<a class=\"ToolsButton\" href=\"javascript:void(0)\" onclick=\"Modules()\">Modules</a>"
		$("#Tools").html(Tools);
		//change button
		$("#EditPage").html("<a href=\"javascript:void(0)\" onclick=\"EditPage();PreparePost(\'SavePage\');\" class=\"Button\">Save</a>" +
				"&nbsp;&nbsp;" +
				"<a href=\"javascript:void(0)\" onclick=\"EditPage();PreparePost(\'Refresh\');\" class=\"Button\">Cancel</a>");
		IsEditPage=true;
	}
	else if(mode.toString()=="SaveEditPage"||mode.toString()=="CancelEditPage")
	{
		$("#EditPage").html("<a href=\"javascript:void(0)\" onclick=\"EditPage()\" class=\"Button\">Edit Page</a>");
		$(".ToolsButton").remove();
		//remove widget
		$(".Widget").remove();
		//UnEditable
		$("#Head").attr("contenteditable","false");
		$("#Navigation").attr("contenteditable","false");
		$("#Logo").attr("contenteditable","false");
		$("#Content").attr("contenteditable","false");
		$("#Foot").attr("contenteditable","false");
		$("#Logo").draggable("destroy");//Logo draggable disable
		IsEditPage=false;
	}
	else if(mode.toString()=="PageManage")
	{
		var PageH=new Array();
		var PageItems=new Array();
		var PageName,PageTime;
		$.post("CPage", {Operation:"GetPages"}, function(data, textStatus, req){
			if(textStatus=="success"&&data!="error")
			{
				PageH=data.split("\n");
				delete PageH[PageH.length-1];
				PageH.length--;
				//Load Pages
				var Pages="";
				var PageWidget="";
				for(var i=0;i<PageH.length;i++)
				{
					PageItems=PageH[i].split(":");
					PageName=PageItems[0];
					PageTime=PageItems[1];
					PageWidget="<a class=\"PageWidget\" href=\"javascript:void(0)\" onclick=\"DeletePage(\'"+PageName+"\')\">x</a>";
					if(PageName=="Home")
					{
						PageWidget="";
					}
					Pages=Pages+"<a class=\"ToolsButton\" href=\"javascript:void(0)\" onclick=\"Post('JumpDatabase',\'"+PageName+"\')\" title=\""+PageTime+"\">"+PageName+"</a>"+PageWidget+"<br>";
				}
				//New Page
				Pages=Pages+"<a class=\"ToolsButton\" href=\"javascript:void(0)\" onclick=\"NewPage()\">New Page</a>";
				$("#Tools").html(Pages);
			}
			else
			{
				alert("Load Pages Error!");
				return;
			}
		});
		//chang button
		$("#PageManage").html("<a href=\"javascript:void(0)\" onclick=\"PageManage()\" class=\"Button\">Back</a>");/* +
				"&nbsp;&nbsp;" +
				"<a href=\"javascript:void(0)\" onclick=\"PageManage();PreparePost(\'Refresh\');\" class=\"Button\">Cancel</a>");*/
		IsPageManage=true;
	}
	else if(mode.toString()=="SavePageManage"||mode.toString()=="CancelPageManage")
	{
		$("#PageManage").html("<a href=\"javascript:void(0)\" onclick=\"PageManage()\" class=\"Button\">Page Manage</a>");
		$("#Tools").html("");
		IsPageManage=false;
	}
}
/*
|=======================================================================
|
|Name: NewPage
|
|Function: Add A new page
|
|=======================================================================
*/
function NewPage()
{
	var NewPageDialog="<div class=\"NewPageDialog\" style=\"text-align:center;\">" +
			"<table>" +
			"<tr>" +
			"<td style=\"width:200px;\">Name</td>" +
			"<td style=\"width:400px;\"><input type=\"text\" id=\"PageName\"></td>" +
			"</tr>" +
			"<tr><td colspan=2><br></td></tr>" +
			"<tr>" +
			"<td>External Label</td>" +
			"<td><textarea rows=\"8\" cols=\"45\" id=\"PageExternalLabel\"></textarea></td>" +
			"</tr>" +
			"</table>" +
			"</div>";
	$(NewPageDialog).dialog({closeText: "Close",title: "Add New Page",modal: true,buttons:
		[
		 {
		      text: "Create",
		      click: function(){
		    	  var Name=$("#PageName").val();
		    	  var External=$("#PageExternalLabel").val();
		    	  //check name
		    	  Name=Check("wordandnumber",Name);
		    	  if(Name==null||Name==""||Name.match(/^ *$/))
		    	  {
		    		  alert("Name Error!");
		    		  return;
		    	  }
		    	  if(External.match(/^ *$/))
		    	  {
		    		  External="";
		    	  }
		    	  $.post("CPage", {Operation:"CheckPageName",PageName:Name}, function(data, textStatus, req){
		  			if(textStatus=="success")
		  			{
		  				if(data=="error")
		  				{
		  					alert("Name has been used.");
			  				return;
		  				}
		  				else if(data=="success")
			  			{
		  					//create
		  					$.post("CPage", {Operation:"CreatePage",PageName:Name,External:External}, function(data, textStatus, req){
		  			  			if(textStatus=="success"&&data=="success")
		  			  			{
		  			  				alert("Create Success!");
		  			  				//reload
		  			  				PreparePost("refresh");
		  			  			}
		  			  			else
		  			  			{
		  			  				alert("Create Fail!");
		  			  			}
		  			  		});
			  				$(".NewPageDialog").dialog("close");
			  			}
		  			}
		  			else
		  			{
		  				alert("Error!");
		  				return;
		  			}
		    	  });
		      }
	    },
	    {
	      text: "Cancel",
	      click: function() {$( this ).dialog("close");}
	    }
	    ]
	,minWidth:500,maxWidth: 500
	,minHeight:400,maxHeight: 400
	,close:function(){
		$(".NewPageDialog").remove();//remove Dialog class
	}
	});
	$(".ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-dialog-titlebar-close").css({"text-align":"center","line-height":"10px"}).html("x");//close button););
}
/*
|=======================================================================
|
|Name: DeletePage
|
|Function: Delete Page named by Name
|
|=======================================================================
*/
function DeletePage(PageName)
{
	var DeletePageDialog="<div class=\"DeletePageDialog\">" +
			"<span>Are you sure you want to Delete Page : "+PageName+"</span>" +
			"</div>";
	$(DeletePageDialog).dialog({closeText: "Close",title: "Delete Page",modal: true,buttons:
		[
		 {
		      text: "Confirm",
		      click: function(){
		    	  $.post("CPage", {Operation:"DeletePage",PageName:PageName}, function(data, textStatus, req){
		  			if(textStatus=="success"&&data=="success")
		  			{
		  				alert("Delete Success!");
		  				PreparePost("Refresh");
		  			}
		  			else
		  			{
		  				alert("Delete Fail.")
		  			}
		    	  });
		      }
	    },
	    {
	      text: "Cancel",
	      click: function() {$( this ).dialog("close");}
	    }
	    ]
	,minWidth:300,maxWidth: 300
	,minHeight:250,maxHeight: 250
	,close:function(){
		$(".DeletePageDialog").remove();//remove Dialog class
	}
	});
	$(".ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-dialog-titlebar-close").css({"text-align":"center","line-height":"10px"}).html("x");//close button););
}
/*
|=======================================================================
|
|Name: SetCSS
|
|Function: set div's css
|
|=======================================================================
*/
function SetCSS(e)
{	
	var Element=$(e.target).parent();
	var BGColor=Element.css("background-color");
	var BGColorParts =ColorMatch(BGColor);
	BGColor="rgb("+BGColorParts[1]+","+BGColorParts[2]+","+BGColorParts[3]+")";//Refine Background-color remove alpha
	var BGOpacity="1";
	if(BGColorParts.length==5)//alpha
	{
		if(BGColorParts[4]!="-1")
		{
			BGOpacity="0."+BGColorParts[4];
		}
		else
		{
			BGOpacity="1";
		}
	}
	var BColor=Element.css("border-color");
	var BWidth=Element.css("border-width");
	var TColor=Element.css("color");	
	var TextAlign=Element.css("text-align");
		var SelectTALeft="",SelectTARight="",SelectTACenter="";
		switch(TextAlign)
		{
		case "left":SelectTALeft="selected";break;
		case "right":SelectTARight="selected";break;
		case "center":SelectTACenter="selected";break;
		}
	var Font=Element.css("font-family");
		var start=Font.indexOf("\'");
		if(start>=0)//remove '
		{
			var end=Font.lastIndexOf("\'");
			Font=Font.substring(start+1,end-start);
		}
		var SelectFont1="",SelectFont2="",SelectFont3="",SelectFont4="",SelectFont5="",SelectFont6="",SelectFont7="",SelectFont8="",SelectFont9="";
		switch(Font)
		{
		case "SimSun":SelectFont1="selected";break;
		case "SimHei":SelectFont2="selected";break;
		case "Microsoft YaHei":SelectFont3="selected";break;
		case "Microsoft JhengHei":SelectFont4="selected";break;
		case "KaiTi_GB2312":SelectFont5="selected";break;
		case "PMingLiU":SelectFont6="selected";break;
		case "MingLiU":SelectFont7="selected";break;
		case "DFKai-SB":SelectFont8="selected";break;
		case "arial":SelectFont9="selected";break;
		}
	var FontSize=Element.css("font-size");
	var IsHeight=new RegExp("height").test(Element.attr("style"));
		var CheckHeightSelfAdapt="",CheckHeightValue="",InputHeightValue="";
		var Height="";
		if(IsHeight)//fixed
		{
			CheckHeightValue="checked";
			Height=Element.css("height");
		}
		else//flexiable
		{
			CheckHeightSelfAdapt="checked";
			InputHeightValue="disabled";
		}
	var Content="<table class=\"Dialog\">" +
			//Line One:Background
			"<tr>"+
			"<td>"+
			"BackGround Color" +
			"<a href=\"javascript:void(0)\" onclick=\"OpenPalette(this)\" style=\"float:right;\"><div id=\"DBGColorDiv\" style=\"border: 2px solid white;height:20px;width:20px;background-color:"+BGColor+"\"></div></a>" +
			"</td>" +
			"<td>" +
			"<span>Opacity<input id=\"InputBGOpacity\" type=\"text\" value=\""+BGOpacity+"\"/></span>" +
			"</td>" +
			"</tr>" +
			//Line Two:Border
			"<tr>" +
			"<td>" +
			"Border-Color" +
			"<a href=\"javascript:void(0)\" onclick=\"OpenPalette(this)\" style=\"float:right;\"><div id=\"DBColorDiv\" style=\"border: 2px solid white;height:20px;width:20px;background:"+BColor+";\"></div></a>" +
			"</td>" +
			"<td>" +
			"<span>Border-Width<input id=\"InputBWidth\" type=\"text\" value=\""+BWidth+"\"/></span>" +
			"</td>" +
			"</tr>"+
			//Line Three:Text
			"<tr>" +
			"<td>" +
			"Text-Color" +
			"<a href=\"javascript:void(0)\" onclick=\"OpenPalette(this)\" style=\"float:right;\"><div id=\"DTColorDiv\" style=\"border: 2px solid white;height:20px;width:20px;background:"+TColor+";\"></div></a>" +
			"</td>" +
			"<td>" +
			"Text-Align" +
			"<select id=\"SelectTextAlign\">" +
			"<option value=\"left\""+SelectTALeft+">left</option>" +
			"<option value=\"right\""+SelectTARight+">right</option>" +
			"<option value=\"center\""+SelectTACenter+">center</option>" +
			"</select>" +
			"</td>" +
			"</tr>"+
			//Line Four:Font
			"<tr>" +
			"<td>" +
			"Font" +
			"<select id=\"SelectFont\">" +
			"<option value=\"SimSun\""+SelectFont1+">SimSun</option>" +
			"<option value=\"SimHei\""+SelectFont2+">SimHei</option>" +
			"<option value=\"Microsoft YaHei\""+SelectFont3+">Microsoft YaHei</option>" +
			"<option value=\"Microsoft JhengHei\""+SelectFont4+">Microsoft JhengHei</option>" +
			"<option value=\"KaiTi_GB2312\""+SelectFont5+">KaiTi_GB2312</option>" +
			"<option value=\"PMingLiU\""+SelectFont6+">PMingLiU</option>" +
			"<option value=\"MingLiU\""+SelectFont7+">MingLiU</option>" +
			"<option value=\"DFKai-SB\""+SelectFont8+">DFKai-SB</option>" +
			"<option value=\"arial\""+SelectFont9+">arial</option>" +
			"</select>" +
			"</td>" +
			"<td>" +
			"Font-Size" +
			"<input id=\"InputFontSize\" type=\"text\" value=\""+FontSize+"\">" +
			"</td>" +
			"</tr>"+
			//Line Five:Height
			"<tr>" +
			"<td style=\"vertical-align: top;\">" +
			"<p style=\"float:right\">Height</p>" +
			"</td>" +
			"<td>" +
			"<span style=\"float:left;\"><input type=\"radio\" name=\"HeightMode\" style=\"float:left\" value=\"SelfAdapt\" "+CheckHeightSelfAdapt+">Self-Adapt</span><br>" +
			"<span style=\"float:left;\"><input type=\"radio\" name=\"HeightMode\" style=\"float:left\" value=\"Value\" "+CheckHeightValue+">Value<input id=\"HeightInputValueID\" type=\"text\" "+InputHeightValue+" value=\""+Height+"\"></span>" +
			"</td>" +
			"</tr>"+
			"</table>";
	$(Content).dialog({closeText: "Close",title: "Set CSS",modal: true,buttons:
		[{
	      text: "Ok",
	      click: function()
	      {
	    	  //Apply CSS
	    	  var SBackgroundColorParts=ColorMatch($("#DBGColorDiv").css("background-color"));
	    	  var SBackgroundOpacity=$("#InputBGOpacity").val();
	    	  	//Check opacity
	    	  	SBackgroundOpacity=Check("opacity",SBackgroundOpacity);
	    	  	if(SBackgroundOpacity==null)
	    	  	{
	    	  		alert("Opacity Error!");
	    	  		return;
	    	  	}
	    	  var SBorderColor=$("#DBColorDiv").css("background-color");//String rgb()
	    	  	var SBorderWidth=$("#InputBWidth").val();
	    	  	//Check border-width
	    	  	SBorderWidth=Check("border-width",SBorderWidth);
	    	  	if(SBorderWidth==null)
	    	  	{
	    	  		alert("Border-Width Error!");
	    	  		return;
	    	  	}
	    	  var STextColor=$("#DTColorDiv").css("background-color");//String rgb() Not Null
	    	  	//Check font-size
	    	  	var FontSize=$("#InputFontSize").val();
	    	  	FontSize=Check("size",FontSize);
	    	  	if(FontSize==null)
	    	  	{
	    	  		alert("Font-Size Error!");
	    	  		return;
	    	  	}
	    	  $(Element).css({
	    		  "background-color":"rgba("+SBackgroundColorParts[1]+","+SBackgroundColorParts[2]+","+SBackgroundColorParts[3]+","+SBackgroundOpacity+")",
	    		  "color":STextColor,
	    		  "border":SBorderWidth+" solid "+SBorderColor,
	    		  "text-align":$("#SelectTextAlign").val(),
	    		  "font-family":$("#SelectFont").val(),
	    		  "font-size":FontSize
	    	  });
	    	  if($("input[name=HeightMode]:checked").attr("value")=="Value")
	    	  {
	    		  var Height=$("#HeightInputValueID").val();
	    		  Height=Check("height",Height);
	    		  if(Height==null)
	    		  {
	    			  alert("Height Error!");
	    			  return;
	    		  }
	    		  $(Element).css({
	    			  "height":$("#HeightInputValueID").val(),
	    			  "overflow":"scroll",
	    			  "overflow-x":"hidden"
	    		  });
	    	  }
	    	  else
	    	  {
	    		  $(Element).css("height","");
	    		  $(Element).css("overflow","");
	    		  $(Element).css("overflow-x","");
	    	  }
	    	  $( this ).dialog("close");
	      }
	      // Uncommenting the following line would hide the text,
	      // resulting in the label being used as a tooltip
	      //showText: false
	    },
	    {
	      text: "Cancel",
	      click: function() {
	    	  $( this ).dialog("close");}
	    }
	    ]
	,minWidth:500
	,close:function(){
		  $(".Dialog").remove();//remove Dialog class
	  }
	});
	$(".ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-dialog-titlebar-close").css({"text-align":"center","line-height":"10px"}).html("x");//close button
	//click event height
	$("input[name=HeightMode]").on("click",function(){
			var value=$("input[name=HeightMode]:checked").attr("value");
			if(value=="SelfAdapt")
			{
				$("#HeightInputValueID").attr("disabled","true");
				
			}
			else if(value=="Value")
			{
				$("#HeightInputValueID").removeAttr("disabled");
			}
		});
}
/*
|=======================================================================
|
|Name: OpenPalette
|
|Function: Show a Palette to choose color
|
|=======================================================================
*/
function OpenPalette(obj)
{
	var palette="<div style=\"text-align:center;\" class=\"palette\">" +
			"<div id=\"RedSlider\"></div>" +
			"<table id=\"PaletteColor\" cellspacing=\"0\" style=\"text-align:centet\">";
	var r=200;
	for(var g=0;g<255;g=g+2)
	{
		palette=palette+"<tr>";
		for(var b=0;b<255;b=b+2)
		{
			palette=palette+"<td>";
			palette=palette+"<div onclick=\"" +
					"var patterns=ColorMatch($(this).css(\'background-color\'));" +
					"$(\'#Sample\').css(\'background-color\',\'rgb(\'+patterns[1]+\',\'+patterns[2]+\',\'+patterns[3]+\')\')" +
					"\" style=\"height:2px;width:2px;background-color:rgb("+r+","+g+","+b+")\"></div>";
			palette=palette+"</td>";
		}
		palette=palette+"</tr>";
	}
	palette=palette+"</table>";
	palette=palette+"<div id=\'Sample\' style=\'height:30px;width:30px;border:2px solid white;background-color:"+$(obj).children().css("background-color")+"\'></div>";
	palette=palette+"<div id=\'Object\' value=\'"+$(obj).children().attr("id")+"\' stlye=\'display:none;\'></div>"
	palette=palette+"</div>"
	$(palette).dialog({closeText: "Close",title: "Palette",modal: true,buttons:
		[{
		      text: "Ok",
		      click: function(){
		    	  var patterns=ColorMatch($("#Sample").css("background-color"));
		    	  //get object
		    	  var obj="#"+$("#Object").attr("value");
		    	  $(obj).css("background-color","rgb("+patterns[1]+","+patterns[2]+","+patterns[3]+")");
		    	  $( this ).dialog("close");
		      }
	      // Uncommenting the following line would hide the text,
	      // resulting in the label being used as a tooltip
	      //showText: false
	    },
	    {
	      text: "Cancel",
	      click: function() {
	    	  $( this ).dialog("close");}
	    }
	    ]
	,maxWidth: 400
	,maxHeight: 500
	,close:function(){
		  $(".palette").remove();//remove Dialog class
	  }
	});
	$(".ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-dialog-titlebar-close").css({"text-align":"center","line-height":"10px"}).html("x");//close button
	//Red Slider
	$("#RedSlider").slider({		
		min:0,
		max:255,
		value:200,
		change:function(event,ui){
			var Red=$(this).slider("option","value");
			$("#PaletteColor tr td div").each(function(index,data) {
				var colorpart=ColorMatch($(this).css("background-color"));
				var r=Red;
				var g=colorpart[2];
				var b=colorpart[3];
				$(this).css("background-color","rgb("+r+","+g+","+b+")");
			});
		}
	});
}
/*
|=======================================================================
|
|Name: Hide
|
|Function: Hide parent element
|
|=======================================================================
*/
function Hide(e)
{
	$(e.target).parent().hide("slow");
}
/*
|=======================================================================
|
|Name: Modules
|
|Function: Show All Modules to change their Hide/Show toggler
|
|=======================================================================
*/
function Modules(e)
{
	var HeadHide="",HeadShow="";
	var LogoHide="",LogoShow="";
	var NavigationHide="",NavigationShow="";
	var ContentHide="",ContentShow="";
	var FootHide="",FootShow="";
	($("#Head").css("display")=="none")?(HeadHide="checked"):(HeadShow="checked");
	($("#Logo").css("display")=="none")?(LogoHide="checked"):(LogoShow="checked");
	($("#Navigation").css("display")=="none")?(NavigationHide="checked"):(NavigationShow="checked");
	($("#Content").css("display")=="none")?(ContentHide="checked"):(ContentShow="checked");
	($("#Foot").css("display")=="none")?(FootHide="checked"):(FootShow="checked");
	var Dialog="<div class=\"Modules\">" +
			"<table style=\"text-align:center;width:250px;height:300px;\">" +
			"<tr>" +
			"<td>Module</td>" +
			"<td colspan=2>Style</td>" +
			"</tr>" +
			"<tr><td colspan=3><hr></td></tr>" +
			"<tr>" +
			"<td>Head</td>" +
			"<td><input type=\"radio\" name=\"Head\" value=\"Hide\" "+HeadHide+">Hide</td>" +
			"<td><input type=\"radio\" name=\"Head\" value=\"Show\" "+HeadShow+">Show</td>" +
			"</tr>" +
			"<tr>" +
			"<td>Logo</td>" +
			"<td><input type=\"radio\" name=\"Logo\" value=\"Hide\" "+LogoHide+">Hide</td>" +
			"<td><input type=\"radio\" name=\"Logo\" value=\"Show\" "+LogoShow+">Show</td>" +
			"</tr>" +
			"<tr>" +
			"<td>Navigation</td>" +
			"<td><input type=\"radio\" name=\"Navigation\" value=\"Hide\" "+NavigationHide+">Hide</td>" +
			"<td><input type=\"radio\" name=\"Navigation\" value=\"Show\" "+NavigationShow+">Show</td>" +
			"</tr>" +
			"<tr>" +
			"<td>Content</td>" +
			"<td><input type=\"radio\" name=\"Content\" value=\"Hide\" "+ContentHide+">Hide</td>" +
			"<td><input type=\"radio\" name=\"Content\" value=\"Show\" "+ContentShow+">Show</td>" +
			"</tr>" +
			"<tr>" +
			"<td>Foot</td>" +
			"<td><input type=\"radio\" name=\"Foot\" value=\"Hide\" "+FootHide+">Hide</td>" +
			"<td><input type=\"radio\" name=\"Foot\" value=\"Show\" "+FootShow+">Show</td>" +
			"</tr>" +
			"</table>" +
			"</div>";
	$(Dialog).dialog({closeText: "Close",title: "Modules",modal: true,buttons:
		[{
		      text: "Ok",
		      click: function(){
		    	  ($("input[name=Head]:checked").attr("value")=="Hide")?($("#Head").hide("slow")):($("#Head").show(1000));
		    	  ($("input[name=Logo]:checked").attr("value")=="Hide")?($("#Logo").hide("slow")):($("#Logo").show(1000));
		    	  ($("input[name=Navigation]:checked").attr("value")=="Hide")?($("#Navigation").hide("slow")):($("#Navigation").show(1000));
		    	  ($("input[name=Content]:checked").attr("value")=="Hide")?($("#Content").hide("slow")):($("#Content").show(1000));
		    	  ($("input[name=Foot]:checked").attr("value")=="Hide")?($("#Foot").hide("slow")):($("#Foot").show(1000));
		    	  $( this ).dialog("close");
		      }
	      // Uncommenting the following line would hide the text,
	      // resulting in the label being used as a tooltip
	      //showText: false
	    },
	    {
	      text: "Cancel",
	      click: function() {
	    	  $( this ).dialog("close");}
	    }
	    ]
	,maxWidth: 400
	,maxHeight: 500
	,close:function(){
		  $(".Modules").remove();//remove Dialog class
	  }
	});
	$(".ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-dialog-titlebar-close").css({"text-align":"center","line-height":"10px"}).html("x");//close button
}
/*
|=======================================================================
|
|Name: PreparePost
|
|Function: prepare data for post
|
|=======================================================================
*/
function PreparePost(type)
{
	if(type=="SavePage")
	{
		
		var DataArray=new Array();
		DataArray[0]="SavePage";
		DataArray[1]=$("#Head").prop("outerHTML");
		DataArray[2]=$("#Logo").prop("outerHTML");
		DataArray[3]=$("#Navigation").prop("outerHTML");
		DataArray[4]=$("#Content").prop("outerHTML");
		DataArray[5]=$("#Foot").prop("outerHTML");
		var VisibleArray=new Array();
		VisibleArray[0]=($("#Head").css("display")=="none")?0:1;
		VisibleArray[1]=($("#Logo").css("display")=="none")?0:1;
		VisibleArray[2]=($("#Navigation").css("display")=="none")?0:1;
		VisibleArray[3]=($("#Content").css("display")=="none")?0:1;
		VisibleArray[4]=($("#Foot").css("display")=="none")?0:1;
		DataArray[6]=VisibleArray.join("");
		//ajax
		$.post("CPage", {Operation:"SavePage",Operation:DataArray[0],Head:DataArray[1],Logo:DataArray[2],Navigation:DataArray[3],Content:DataArray[4],Foot:DataArray[5],VisibleArray:DataArray[6]}, function(data, textStatus, req){
  			if(textStatus=="success"&&data=="success")
  			{
  				PreparePost("Refresh");
  			}
		});
		
		//Post("SavePage",DataArray);
	}
	else if(type=="Refresh")
	{
		Post("Refresh",null);
	}
}
/*
|=======================================================================
|
|Name: PostSubmit
|
|Function: post method
|
|=======================================================================
*/
function Post(type,DataArray) {  
    var postUrl = "CPage";//address
    var ExportForm = document.createElement("FORM");
    document.body.appendChild(ExportForm);
    ExportForm.method = "POST";
    if(type=="SavePage")
    {
    	//Save Operation PageID #Head #Navigation #Logo #Content #Foot VisibleArray
    	//Operation
    	var Operation=document.createElement("input");
    	Operation.setAttribute("name","Operation");
    	Operation.setAttribute("type", "hidden");
    	ExportForm.appendChild(Operation);
    	Operation.value = DataArray[0];
    	//Head
    	var Head=document.createElement("input");
    	Head.setAttribute("name","Head");
    	Head.setAttribute("type", "hidden");
    	ExportForm.appendChild(Head);
    	Head.value = DataArray[1];
    	//Logo
    	var Logo=document.createElement("input");
    	Logo.setAttribute("name","Logo");
    	Logo.setAttribute("type", "hidden");
    	ExportForm.appendChild(Logo);
    	Logo.value = DataArray[2];
    	//Navigation
    	var Navigation=document.createElement("input");
    	Navigation.setAttribute("name","Navigation");
    	Navigation.setAttribute("type", "hidden");
    	ExportForm.appendChild(Navigation);
    	Navigation.value = DataArray[3];
    	//Content
    	var Content=document.createElement("input");
    	Content.setAttribute("name","Content");
    	Content.setAttribute("type", "hidden");
    	ExportForm.appendChild(Content);
    	Content.value = DataArray[4];
    	//Foot
    	var Foot=document.createElement("input");
    	Foot.setAttribute("name","Foot");
    	Foot.setAttribute("type", "hidden");
    	ExportForm.appendChild(Foot);
    	Foot.value = DataArray[5];
    	//VisibleArray
    	var VisibleArray=document.createElement("input");
    	VisibleArray.setAttribute("name","VisibleArray");
    	VisibleArray.setAttribute("type", "hidden");
    	ExportForm.appendChild(VisibleArray);
    	VisibleArray.value = DataArray[6];
    }
    else if(type=="Refresh")
    {
    	//Operation
    	var Operation=document.createElement("input");
    	Operation.setAttribute("name","Operation");
    	Operation.setAttribute("type", "hidden");
    	ExportForm.appendChild(Operation);
    	Operation.value = "Refresh";
    }
    else if(type=="JumpDatabase")
    {
    	//Operation
    	var Operation=document.createElement("input");
    	Operation.setAttribute("name","Operation");
    	Operation.setAttribute("type", "hidden");
    	ExportForm.appendChild(Operation);
    	Operation.value ="JumpDatabase";
    	//url
    	var URL=document.createElement("input");
    	URL.setAttribute("name","PageName");
    	URL.setAttribute("type", "hidden");
    	ExportForm.appendChild(URL);
    	URL.value = DataArray;
    }
    ExportForm.action = postUrl;
    ExportForm.submit();
}; 
/*
|=======================================================================
|
|Name: getX,getY
|
|Function: get cursor position
|
|=======================================================================
*/
function getX(e)
{
	e = e || window.event;
	return e.pageX || e.clientX + document.body.scroolLeft;
}

function getY(e)
{
	 e = e|| window.event;
	 return e.pageY || e.clientY + document.boyd.scrollTop;
}
/*
|=======================================================================
|
|Name: ColorMatch
|
|Function: seperate r,g,b,a from rgb(r,g,b) or rgba(r,g,b,a)
|
|=======================================================================
*/
function ColorMatch(ColorString)
{
	var colorpattern1=ColorString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	var colorpattern2=ColorString.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*0\)$/);
	var colorpattern3=ColorString.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*1\)$/);
	var colorpattern4=ColorString.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*0\.(\d+)\)$/);
	if(colorpattern1!=null)
	{
		return colorpattern1;
	}
	else if(colorpattern2!=null)
	{
		colorpattern2[4]="0";
		return colorpattern2;
	}
	else if(colorpattern3!=null)
	{
		colorpattern3[4]="-1";
		return colorpattern3;
	}
	else if(colorpattern4!=null)
	{
		return colorpattern4;
	}
	return null;
}
/*
|=======================================================================
|
|Name: Check
|
|Function: check value in type
|
|=======================================================================
*/
function Check(type,value)
{
	if(type=="opacity")
	{
		if(value=="1"||value=="0"||value.match(/^0\.(\d+)$/))
		{
			return value;
		}
		else
		{
			return null;
		}
	}
	else if(type=="border-width")
	{
		if(value=="thick"||value=="inherit"||value=="thin"||value=="medium"||(value.match(/\d+(px|em|ex|in|cm|mm|pt|pc)$/)!=null))
		{
			return value;
		}
		else if(value.match(/^\d+$/)!=null)
		{
			return value+"px";
		}
		else
		{
			return null;
		}
	}
	else if(type=="height")
	{
		if(value=="auto"||value=="inherit"||(value.match(/\d+(px|em|ex|in|cm|mm|pt|pc|%)$/)!=null))
		{
			return value;
		}
		else if(value.match(/^\d+$/)!=null)
		{
			return value+"px";
		}
		else
		{
			return null;
		}
	}
	else if(type=="size")
	{
		if(value=="small"||value=="large"||value=="medium"||value=="inherit"||(value.match(/\d+(px|em|ex|in|cm|mm|pt|pc|%)$/)!=null))
		{
			return value;
		}
		else if(value.match(/^\d+$/)!=null)
		{
			return value+"px";
		}
		else
		{
			return null;
		}
	}
	else if(type=="width")
	{
		if(value=="inherit"||value=="auto"||(value.match(/\d+(px|em|ex|in|cm|mm|pt|pc|%)$/)!=null)||value=="")
		{
			return value;
		}
		else if(value.match(/^\d+$/)!=null)
		{
			return value+"px";
		}
		else
		{
			return null;
		}
	}
	else if(type=="wordandnumber")
	{
		if(value=="")
		{
			return value;
		}
		if(value.match(/^[A-Za-z0-9]+$/)==null)
		{
			return null;
		}
		else
		{
			return value;
		}
	}
	else if(type=="URL")
	{
		if(value=="")
		{
			return value;
		}
		if(value.match(/('|")+/)!=null)
		{
			return null;
		}
		else
		{
			return value;
		}
	}
	else if(type=="id")
	{
		if(value=="")
		{
			return value;
		}
		if(value.match(" ")!=null||document.getElementById(value)!=null)
		{
			return null;
		}
		else
		{
			return value;
		}
	}
}