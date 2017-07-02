<%@ page language="java" import="java.util.*" pageEncoding="ISO-8859-1"%>
<%@page import="Model.MLogin"%>
<jsp:useBean id="UInfo" class="Model.MLogin" scope="request"/>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
  	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
  	<script type="text/javascript" src="JavaScript/jquery-1.12.3.js"></script>
	<script src="JavaScript/Login.js"></script>
	<link type="text/css" rel="stylesheet" href="CSS/Login.css">
	<title>PageM Login</title>
  </head>
  
  <body>
	  <div id="divtable">
	  	  <div id="divtablecell">
			  Login<br><br>
			  <form action="CLogin" method="post">
			  	User Name:<input type="text" name="UserName" class="TextInput"><br>
			  	Password&nbsp;&nbsp;:<input type="password" name="Password" class="TextInput"><br>
			  	<p style="font-size:20px;">&nbsp;<jsp:getProperty name="UInfo" property="message"/></p>
			  	<input type="submit" name="submit" value="Login" class="Button">
			  	&nbsp;
			  	<input type="submit" name="submit" value="Register" class="Button">
			  </form>
			  </div>
		  </div>
  </body>
</html>
