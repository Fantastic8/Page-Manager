package Controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import Model.*;

import com.microsoft.sqlserver.jdbc.SQLServerDriver;

public class CLogin extends HttpServlet {
	SQL sql;
	/**
	 * Constructor of the object.
	 */
	public CLogin() {
		super();
	}
	
	/**
	 * Initialization of the servlet. <br>
	 *
	 * @throws ServletException if an error occurs
	 */
	public void init() throws ServletException {
		// Put your code here
		sql=new SQL();
		if(!sql.IsConnect())
		{
			sql.Connect();
		}
	}
	
	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
		if(sql.IsConnect())
		{
			sql.DisConnect();
		}
	}

	/**
	 * The doGet method of the servlet. <br>
	 *
	 * This method is called when a form has its tag value method equals to get.
	 * 
	 * @param request the request send by the client to the server
	 * @param response the response send by the server to the client
	 * @throws ServletException if an error occurred
	 * @throws IOException if an error occurred
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		out.println("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">");
		out.println("<HTML>");
		out.println("  <HEAD><TITLE>A Servlet</TITLE></HEAD>");
		out.println("  <BODY>");
		out.print("    This is ");
		out.print(this.getClass());
		out.println(", using the GET method");
		out.println("  </BODY>");
		out.println("</HTML>");
		out.flush();
		out.close();
	}

	/**
	 * The doPost method of the servlet. <br>
	 *
	 * This method is called when a form has its tag value method equals to post.
	 * 
	 * @param request the request send by the client to the server
	 * @param response the response send by the server to the client
	 * @throws ServletException if an error occurred
	 * @throws IOException if an error occurred
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String type=request.getParameter("submit");//check button
		if(type.equals("Register"))//Login.jsp->Register button
		{
			RequestDispatcher dispatcher=request.getRequestDispatcher("Register.jsp");
	        dispatcher.forward(request, response);
		}
		else if(type.equals("Login"))//Login.jsp->Login button
		{
			MLogin UInfo=new MLogin();
			request.setAttribute("UInfo", UInfo);
			
			String UserName=request.getParameter("UserName");
			String Password=request.getParameter("Password");
			UserName=UserName.replace("\'","\'\'");//sql '
			ResultSet rs=sql.Select("select * from UserAccount where Account="+"'"+UserName+"'"+";");
			try {
				if(rs.next())
				{//account exist
					if(Password.equals(rs.getString("Password")))//Login Success!
					{
						HttpSession session=request.getSession(true);
						session.setAttribute("UserInfo", UInfo);
						//set User Infomation
						UInfo.setAccount(UserName);
						UInfo.setManager(rs.getByte("IsManager")==1);
						UInfo.setMessage("Login Success!");
						//jump
						if(rs.getByte("IsManager")!=1&&rs.getByte("IsValid")!=1)
						{
							RequestDispatcher dispatcher=request.getRequestDispatcher("Invalid.html");
					        dispatcher.forward(request, response);
					        return;
						}
						response.sendRedirect("CPage");
						/*RequestDispatcher dispatcher=request.getRequestDispatcher("CPage");
				        dispatcher.forward(request, response);*/
				        return;
					}
				}
				//Login fail...
				UInfo.setMessage("Account or Password Incorrect!");
				RequestDispatcher dispatcher=request.getRequestDispatcher("Login.jsp");
		        dispatcher.forward(request, response);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				UInfo.setMessage(e.toString());
				RequestDispatcher dispatcher=request.getRequestDispatcher("Login.jsp");
		        dispatcher.forward(request, response);
			}
		}
		else if(type.equals("Cancel"))//Register.jsp->Cancel button
		{
			RequestDispatcher dispatcher=request.getRequestDispatcher("Login.jsp");
	        dispatcher.forward(request, response);
		}
		else if(type.equals("OK"))//Register.jsp->OK button
		{
			MRegister RInfo=new MRegister();
			request.setAttribute("RInfo", RInfo);//Register Message
			String username=request.getParameter("UserName");
			String password=request.getParameter("Password");
			String repassword=request.getParameter("RePassword");
			String Message=checkInfo(username,password,repassword);
			if(Message==null)//user info available
			{
				if(sql.Insert("Insert into UserAccount values("+"'"+username+"','"+password+"',0,0)")==1)
				{
					RequestDispatcher dispatcher=request.getRequestDispatcher("Login.jsp");
			        dispatcher.forward(request, response);
			        return;
				}
				RequestDispatcher dispatcher=request.getRequestDispatcher("Error.html");
		        dispatcher.forward(request, response);
			}
			else//user info not available
			{
				RInfo.setMessage(Message);
				RequestDispatcher dispatcher=request.getRequestDispatcher("Register.jsp");
		        dispatcher.forward(request, response);
			}
		}
	}
//==========================================================================Check Function	
	public String checkInfo(String username,String password,String repassword)
	{
		if(username.equals("")||!checkIllegalCharacter(username))
		{
			return "Illegal Character in User Name!";
		}
		username=username.replace("\'","\'\'");//sql '
		//username legal
		ResultSet rs=sql.Select("select * from UserAccount where Account="+"'"+username+"'"+";");
		try {
			if(rs.next())
			{
				return "User Name already exist!"; 
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "An Error occurred!Please try again.";
		}
		
		//username not exist
		if(password.equals(""))
		{
			return "Password cannot be Empty!";
		}
		if(!password.equals(repassword))
		{
			return "Password Not Match!";
		}
		return null;
	}
	public boolean checkIllegalCharacter(String str)
	{
		char illegal[]={'.','!','@','#','$','%','^','&','*','(',')','_','+','=','-','`','~','\'','\"',':',';','?','>','<',',','.','/','\\',' '};
		for(int i=0;i<illegal.length;i++)
		{
			if(str.contains(String.valueOf(illegal[i])))
			{
				return false;
			}
		}
		return true;
	}
}
