package Controller;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.RandomAccessFile;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Vector;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import Model.MLogin;

public class CPage extends HttpServlet {
	Vector CSSName=new Vector();
	Vector CSSStyle=new Vector();
	boolean ImgTemp=false;
	String ImgName=null;
	SQL sql;
	MLogin Info;
	/**
	 * Constructor of the object.
	 */
	public CPage() {
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
//==========================================================================Get Post Function	
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
	public void doGet(HttpServletRequest request, HttpServletResponse response)//First Login
			throws ServletException, IOException {
		//Information
		boolean IsManager=false;
		HttpSession session=request.getSession(true);
		Info=(MLogin)session.getAttribute("UserInfo");
		IsManager=Info.isManager();
		String User=Info.getAccount();
		LoadPage(0,IsManager,User,request,response);
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
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		
		String Operation=request.getParameter("Operation");
		
		if(ImgTemp)
		{
			ImgTemp=false;
			//Upload Img
			File dir=new File("E:/JSP/Curriculum Design/PageManager/WebRoot/Picture");
			String Savedir=dir.getAbsolutePath();
			File allfile[]=dir.listFiles();
			for(int i=0;i<allfile.length;i++)
			{
				if(allfile[i].getName().equals(ImgName))
				{
					//file already exist
					out.println("File Already Exist!");
					out.println("<form action=\"CPage\" method=\"post\"><input type=\"hidden\" name=\"Operation\" value=\"Refresh\"><input type=\"submit\" value=\"Back\"></form>");
					return;
				}
			}
			
			File TempImage=new File(Savedir+"/temp",ImgName);
			FileOutputStream o=new FileOutputStream(TempImage);
			InputStream in=request.getInputStream();
			byte b[]=new byte[10000];
			int n;
			while((n=in.read(b))!=-1)
			{
				o.write(b,0,n);
			}
			o.close();
			in.close();
			
			RandomAccessFile randomRead=new RandomAccessFile(TempImage,"r");
			long forthEndPosition=0;
			int forth=1;
			while((n=randomRead.readByte())!=-1&&(forth<=4))
			{
				if(n=='\n')
				{
					forthEndPosition=randomRead.getFilePointer();
					forth++;
				}
			}
			byte cc[]=ImgName.getBytes("GB2312");
			ImgName=new String(cc);
			File Image=new File(Savedir,ImgName);
			RandomAccessFile randomWrite=new RandomAccessFile(Image,"rw");
			randomRead.seek(randomRead.length());
			long endPosition=randomRead.getFilePointer();
			long mark=endPosition;
			int j=1;
			while((mark>=0)&&(j<=6))
			{
				mark--;
				randomRead.seek(mark);
				n=randomRead.readByte();
				if(n=='\n')
				{
					endPosition=randomRead.getFilePointer();
					j++;
				}
			}
			randomRead.seek(forthEndPosition);
			long startPoint=randomRead.getFilePointer();
			while(startPoint<endPosition-1)
			{
				n=randomRead.readByte();
				randomWrite.write(n);
				startPoint=randomRead.getFilePointer();
			}
			randomWrite.close();
			randomRead.close();
			TempImage.delete();
			
			LoadPage(Info.getPageID(),Info.isManager(),Info.getAccount(),request,response);
			
			return;
		}
		if(Operation.equals("SavePage"))
		{
			String param[]=new String[7];
			param[0]=String.valueOf(Info.getPageID());
			param[1]=request.getParameter("Head");
			param[2]=request.getParameter("Logo");
			param[3]=request.getParameter("Navigation");
			param[4]=request.getParameter("Content");
			param[5]=request.getParameter("Foot");
			param[6]=request.getParameter("VisibleArray");
			if(sql.BatchSave(param))
			{
				out.print("success");
				//LoadPage(Info.getPageID(),Info.isManager(),Info.getAccount(),request,response);
			}
			else
			{
				response.sendRedirect("Error.html");
			}
			return;
		}
		else if(Operation.equals("Refresh"))
		{
			LoadPage(Info.getPageID(),Info.isManager(),Info.getAccount(),request,response);
			return;
		}
		else if(Operation.equals("GetAccount"))
		{
			String KeyWord=request.getParameter("KeyWord");
			KeyWord=KeyWord.replace("\'", "\'\'");
			KeyWord=KeyWord.replace("%", "[%]");
			KeyWord=KeyWord.replace("_", "[_]");
			if(KeyWord.equals("*"))
			{
				KeyWord="";
			}
			ResultSet rs;
			rs=sql.Select("select * from UserAccount where Account like '%"+KeyWord+"%' order by Account desc;");
			try {
				String Account;
				Byte IsManager;
				while(rs.next())
				{
					Account=rs.getString("Account");
					IsManager=rs.getByte("IsManager");
					
					if(Account.equals(Info.getAccount()))
					{
						IsManager=-1;
					}
					out.println(Account+" "+IsManager+" "+rs.getByte("IsValid"));
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return;
		}
		else if(Operation.equals("UpdateAccount"))
		{
			String UserName=request.getParameter("Account");
			String Manager=request.getParameter("IsManager");
			String Valid=request.getParameter("IsValid");
			sql.Update("update UserAccount set IsManager="+Manager+",IsValid="+Valid+" where Account='"+UserName+"';");
			return;
		}
		else if(Operation.equals("DeleteAccount"))
		{
			String UserName=request.getParameter("Account");
			sql.Delete("delete from UserAccount where Account='"+UserName+"';");
			return;
		}
		else if(Operation.equals("AllPirctures"))
		{
			File dir=new File("E:/JSP/Curriculum Design/PageManager/WebRoot/Picture");
			File file[]=dir.listFiles();
			for(int i=0;i<file.length;i++)
			{
				if(!file[i].getName().endsWith(".jpg")&&!file[i].getName().endsWith(".png"))
				{
					continue;
				}
				out.print(file[i].getName()+"\n");
			}
			return;
		}
		else if(Operation.equals("UploadImg"))
		{
			ImgTemp=true;
			ImgName=request.getParameter("FileName");
			ImgName=ImgName.substring(ImgName.lastIndexOf("\\")+1,ImgName.length());
			return;
		}
		else if(Operation.equals("GetCSS"))
		{
			ResultSet rs=sql.Select("select * from CSS where PageID="+Info.getPageID()+" order by Object asc;");
			try {
				while(rs.next())
				{
					out.print(rs.getString("Object")+"="+rs.getString("Style")+"\n");
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return;
		}
		else if(Operation.equals("PrepareSaveCSS"))
		{
			//int index=Integer.parseInt(request.getParameter("Index"));
			CSSName.add(request.getParameter("Object"));
			CSSStyle.add(request.getParameter("Style"));
			int lenth=Integer.parseInt(request.getParameter("Lenth"));
			if(CSSName.size()==lenth)
			{
				out.print("final");
			}
			return;
		}
		else if(Operation.equals("SaveCSS"))
		{
			if(sql.BatchSaveCSS(Info.getPageID(),CSSName,CSSStyle))
			{
				out.print("success");
			}
			else
			{
				out.print("fail");
			}
			//empty
			CSSName=new Vector();
			CSSStyle=new Vector();
			return;
		}
		else if(Operation.equals("GetPages"))
		{
			ResultSet rs=sql.Select("Select * from PageHead;");
			try {
				while(rs.next())
				{
					out.print(rs.getString("PageName")+":"+rs.getString("PageTime")+"\n");
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				out.print("error");
				e.printStackTrace();
			}
			return;
		}
		else if(Operation.equals("CheckPageName"))
		{
			String PageName=request.getParameter("PageName");
			ResultSet rs=sql.Select("select PageName from PageHead where PageName='"+PageName+"';");
			try {
				if(rs.next())//exist
				{
					out.print("error");
				}
				else
				{
					out.print("success");
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				out.print("error");
			}
			return;
		}
		else if(Operation.equals("CreatePage"))
		{
			String PageName=request.getParameter("PageName");
			String External=request.getParameter("External");
			Date d=new Date();
			DateFormat format=new SimpleDateFormat("yyyy-MM-dd");
			String date=format.format(d);
			String Head="<title>"+PageName+"</title>";
			//Distribute PageID
			ResultSet rs=sql.Select("select PageID from PageHead order by PageID asc;");
			int Newid=0;
			try {
				while(rs.next())
				{
					if(Newid==rs.getInt("PageID"))
					{
						Newid++;
					}
					else
					{
						break;
					}
				}
				//insert
				if(sql.BatchCreatePage(Newid, PageName, date, Head, External))
				{
					out.print("success");
				}
				else
				{
					out.print("fail");
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				out.print("fail");
			}
			return;
		}
		else if(Operation.equals("JumpDatabase"))
		{
			String PageName=request.getParameter("PageName");
			ResultSet rs=sql.Select("select * from PageHead where PageName='"+PageName+"';");
			try {
				if(rs.next())
				{
					int PageID=rs.getInt("PageID");
					LoadPage(PageID,Info.isManager(),Info.getAccount(),request,response);
					return;
				}
				else
				{
					response.sendRedirect("Error.html");
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				response.sendRedirect("Error.html");
			}
			return;
		}
		else if(Operation.equals("Jump"))
		{
			String URL=request.getParameter("URL");
			//search in database
			String DURL=URL.replace("\'", "\'\'");
			ResultSet rs=sql.Select("select * from PageHead where PageName='"+DURL+"';");
			try {
				if(rs.next())
				{
					int PageID=rs.getInt("PageID");
					LoadPage(PageID,Info.isManager(),Info.getAccount(),request,response);
				}
				else
				{
					response.sendRedirect(URL);
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				response.sendRedirect("Error.html");
			}
			return;
		}
		else if(Operation.equals("DeletePage"))
		{
			String PageName=request.getParameter("PageName");
			if(sql.BatchDeletePage(PageName))
			{
				out.print("success");
			}
		}
		else if(Operation.equals("DeleteImage"))
		{
			String ImageName=request.getParameter("ImageName");
			String dir="E:/JSP/Curriculum Design/PageManager/WebRoot/Picture";
			File Image=new File(dir,ImageName);
			if(Image.delete())
			{
				out.print("success");
			}
		}
	}
	public boolean LoadPage(int PageID,boolean IsManager,String User,HttpServletRequest request, HttpServletResponse response)
	{
//sql
		ResultSet rs;
//Home Page
		response.setContentType("text/html");
		PrintWriter out;
		try {
			out = response.getWriter();
			out.println("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">");
			out.println("<HTML>");
	//PageHead
			out.println("<HEAD>");
			out.println("<style>"
					+ "*{margin:0;padding:0;}"
					+ "</style>");
			rs=sql.Select("select * from PageHead where PageID="+PageID+";");
			try {
				if(rs.next())
				{
					String external=rs.getString("ExternalLabel");
					out.println(rs.getString("Head"));
					if(external!=null&&external!="")
					{
						out.println(external);
					}
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		//CSS
			//User CSS
			out.println("<style>");
			rs=sql.Select("select * from CSS where PageID="+PageID+";");
			try {
				while(rs.next())
				{
					out.println(rs.getString("Object"));
					out.println("{");
					out.println(rs.getString("Style"));
					out.println("}");
					
				}
			} catch (SQLException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			out.println("</style>");
			//Manager CSS
			if(IsManager)
			{
				out.println("<link type=\"text/css\" rel=\"stylesheet\" href=\"CSS/jquery-ui.min.css\">");
				out.println("<link type=\"text/css\" rel=\"stylesheet\" href=\"CSS/Manager.css\">");
			}
		//javascript
			//User Javascript(Unavailable Now)
			out.println("<script type=\"text/javascript\" src=\"JavaScript/Jump.js\"></script>");
			//Manager Javascript
			if(IsManager)
			{
				out.println("<script type=\"text/javascript\" src=\"JavaScript/jquery-1.12.3.js\"></script>");
				out.println("<script type=\"text/javascript\" src=\"JavaScript/jquery-ui.min.js\"></script>");
				out.println("<script type=\"text/javascript\" src=\"JavaScript/Manager.js\"></script>");
			}
			
			out.println("</HEAD>");
	//PageBody
			out.println("<BODY>");
			out.println("<div id=\"LogOut\"><div style=\"position:absolute;right:5px;top:8px;z-index:1;\">Hello "+User+"</div>");
			out.println("<a href=\"http://localhost:8080/PageManager/Login.jsp\" style=\"position:absolute;right:5px;top:28px;z-index:1;\">Log Out</a></div>");
		//Body-Head
			rs=sql.Select("select * from PageBody where PageID="+PageID+" and Position='Head';");
			try {
				if(rs.next())
				{
					out.println(rs.getString("Content"));
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		//Body-Logo
			rs=sql.Select("select * from PageBody where PageID="+PageID+" and Position='Logo';");
			try {
				if(rs.next())
				{
					out.println(rs.getString("Content"));
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		//Body-Navigation
			rs=sql.Select("select * from PageBody where PageID="+PageID+" and Position='Navigation';");
			try {
				if(rs.next())
				{
					out.println(rs.getString("Content"));
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		//Body-Content
			rs=sql.Select("select * from PageBody where PageID="+PageID+" and Position='Content';");
			try {
				if(rs.next())
				{
					out.println(rs.getString("Content"));
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		//Body-Foot
			rs=sql.Select("select * from PageBody where PageID="+PageID+" and Position='Foot';");
			try {
				if(rs.next())
				{
					out.println(rs.getString("Content"));
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			out.println("</BODY>");
			
			out.println("</HTML>");
			out.flush();
			out.close();
			
			Info.setPageID(PageID);//update User Info
			
			return true;
		} catch (IOException e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
		}
		return false;
	}
}