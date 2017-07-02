<%@ page language="java" import="java.util.*" pageEncoding="ISO-8859-1"%>
<%@page import="Model.MRegister"%>
<jsp:useBean id="RInfo" class="Model.MRegister" scope="request"/>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>Register</title>
    <!-- <%--
		String path = request.getContextPath();
		String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
	--%>
	<base href="<%--=basePath--%>"> -->
	<link type="text/css" rel="stylesheet" href="CSS/Register.css">
  </head>
  
  <body>
  	<div id="divtable">
  		<div id="divtablecell">
  			<p style="font-size:50px;color: white;">Register</p>
  			<br><br>
  			<form action="CLogin" method="post">
  				<div style="float:left;">User Name:</div><input type="text" name="UserName" class="TextInput"><br><br>
  				<div style="float:left;">Password:</div><input type="password" name="Password" class="TextInput"><br><br>
  				<div style="float:left;">Repeat Password:</div><input type="password" name="RePassword" class="TextInput"><br><br>
  				<br>
  				<p style="font-size: 20px;">&nbsp;<jsp:getProperty name="RInfo" property="message" /></p>
  				<br>
  				<input type="submit" name="submit" value="OK" class="Button">
  				&nbsp;
  				<input type="submit" name="submit" value="Cancel" class="Button">
  			</form>
  		</div>
  	</div>
  </body>
</html>
