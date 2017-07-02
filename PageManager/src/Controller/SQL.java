package Controller;

import java.sql.*;
import java.util.Vector;

public class SQL {
	private Connection dbConn;
	private String driverName = "com.microsoft.sqlserver.jdbc.SQLServerDriver";//load JDBC driver
	private String dbURL = "jdbc:sqlserver://localhost:1433; DatabaseName=PageManager";   //connect to server and sql server database
	private String userName = "PageManager";   //username
	private String userPwd = "administrator";   //password
	private boolean IsConnect=false;
//==========================================================================Init Function
	public boolean Connect()
	{
		try {
		Class.forName(driverName);
		dbConn = DriverManager.getConnection(dbURL, userName, userPwd);
		if(!Select("select * from sys.tables;").next())//Not exist Table
		{
			InitTable();
		}
		IsConnect=true;
		return true;
		}
		catch(Exception e)
		{
			System.out.println(e);
			return false;
		}
	}
	public boolean DisConnect()
	{
		try {
			dbConn.close();
			IsConnect=false;
			return true;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
	}
	public boolean InitTable()
	{
		Statement state;
		ResultSet rs;
		//Batching
		try {
			dbConn.setAutoCommit(false);
			state=dbConn.createStatement();
			String UseDatabase="use PageManager;";
			String Usertable="create table UserAccount"
					+ "("
					+ "Account varchar(15) COLLATE Chinese_PRC_CS_AS primary key,"
					+ "Password varchar(20) COLLATE Chinese_PRC_CS_AS NOT NULL,"
					+ "IsManager bit NOT NULL,"
					+ "IsValid bit"
					+ ");";
			String PageHeadtable="create table PageHead"
					+ "("
					+ "PageID int primary key,"
					+ "PageName varchar(15) COLLATE Chinese_PRC_CS_AS NOT NULL,"
					+ "PageTime Date NOT NULL,"
					+ "Head Text COLLATE Chinese_PRC_CS_AS NOT NULL,"
					+ "ExternalLabel Text COLLATE Chinese_PRC_CS_AS"
					+ ");";
			String PageBodytable="create table PageBody"
					+ "("
					+ "PageID int,"
					+ "Position char(10) COLLATE Chinese_PRC_CS_AS ,"
					+ "Visible bit NOT NULL,"
					+ "Content Text COLLATE Chinese_PRC_CS_AS ,"
					+ "PRIMARY KEY(PageID,Position),"
					+ "foreign key(PageID) references PageHead(PageID)"
					+ ");";
			String CSStable="create table CSS"
					+ "("
					+ "PageID int,"
					+ "Object varchar(20) COLLATE Chinese_PRC_CS_AS ,"
					+ "Style Text COLLATE Chinese_PRC_CS_AS ,"
					+ "PRIMARY KEY(PageID,Object),"
					+ "foreign key(PageID) references PageHead(PageID)"
					+ ");";
			String HomePageHead="insert into PageHead values(0,'Home','2016-06-14','<title>Home</title>',NULL);";
			String HomePageBody="insert into PageBody values(0,'Head',1,'<div id=\"Head\">Head</div>');"
					+ "insert into PageBody values(0,'Logo',1,'<div id=\"Logo\"><p>Logo</p></div>');"
					+ "insert into PageBody values(0,'Navigation',1,'<div id=\"Navigation\"><p>Navigation</p></div>');"
					+ "insert into PageBody values(0,'Content',1,'<div id=\"Content\"><p>Content</p></div>');"
					+ "insert into PageBody values(0,'Foot',1,'<div id=\"Foot\"><p>Foot</p></div>');";
			String HomeCSS="insert into CSS values(0,'#Head','position: relative;right:0px;left:0px;top:0px;');"
					+ "insert into CSS values(0,'#Logo','position: absolute;z-index: 1;');"
					+ "insert into CSS values(0,'#Navigation','position: relative;right:0px;left:0px;');"
					+ "insert into CSS values(0,'#Content','position: relative;right:0px;left:0px;');"
					+ "insert into CSS values(0,'#Foot','position: relative;right:0px;left:0px;bottom:0px;');"
					+ "insert into css values(0,'p','margin:0px;padding:0px;border:0px;');"
					+ "insert into css values(0,'div','margin:0px;padding:0px;border:0px;');"
					+ "insert into css values(0,'a:link','text-decoration: none;');"
					+ "insert into css values(0,'a:visited','color: inherit;');";
			String Administrator="Insert into UserAccount Values('Administrator','administrator',1,1);";
			
			state.execute(UseDatabase);
			state.execute(Usertable);
			state.execute(PageHeadtable);
			state.execute(PageBodytable);
			state.execute(CSStable);
			
			state.executeUpdate(Administrator);
			state.executeUpdate(HomePageHead);
			state.executeUpdate(HomePageBody);
			state.executeUpdate(HomeCSS);
			
			dbConn.commit();//execute all
			dbConn.setAutoCommit(true);
			return true;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			try {
				dbConn.rollback();
			} catch (SQLException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			return false;
		}
	}
//==========================================================================Execute Function
	public ResultSet Select(String str)
	{
		Statement state;
		try {
			state = dbConn.createStatement();
			ResultSet rs=state.executeQuery(str);
			return rs;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
	}
	
	public int Insert(String str)
	{
		Statement state;
		try {
			state=dbConn.createStatement();
			return state.executeUpdate(str);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return 0;
	}
	
	public int Delete(String str)
	{
		return Insert(str);
	}
	
	public int Update(String str)
	{
		return Insert(str);
	}
	public boolean BatchSave(String str[])
	{
		Statement state;
		ResultSet rs;
		//Batching
		try {
			state=dbConn.createStatement();
			/* *param
			 * 1:PageID
			 * 2:Head
			 * 3:Navigation
			 * 4:Logo
			 * 5:Content
			 * 6:Foot
			 * 7:VisibleArray
			 */
			int PageID=Integer.parseInt(str[0]);
			String Head=str[1];
			String Logo=str[2];
			String Navigation=str[3];
			String Content=str[4];
			String Foot=str[5];
			char VisibleArray[]=str[6].toCharArray();
			//replace illegal char '
			Head=Head.replace("\'","\'\'");
			Navigation=Navigation.replace("\'","\'\'");
			Logo=Logo.replace("\'","\'\'");
			Content=Content.replace("\'","\'\'");
			Foot=Foot.replace("\'","\'\'");
			//Find Page exist
			rs=state.executeQuery("select * from PageHead where PageID="+PageID+";");
			if(rs.next())
			{
				//batch
				//Page exist==>Update(Save)
				dbConn.setAutoCommit(false);
				state=dbConn.createStatement();
				state.executeUpdate("update PageBody set Visible="+Integer.parseInt(String.valueOf(VisibleArray[0]))+",Content='"+Head+"' where PageID="+PageID+" and Position='Head';");
				state.executeUpdate("update PageBody set Visible="+Integer.parseInt(String.valueOf(VisibleArray[1]))+",Content='"+Navigation+"' where PageID="+PageID+" and Position='Navigation';");
				state.executeUpdate("update PageBody set Visible="+Integer.parseInt(String.valueOf(VisibleArray[2]))+",Content='"+Logo+"' where PageID="+PageID+" and Position='Logo';");
				state.executeUpdate("update PageBody set Visible="+Integer.parseInt(String.valueOf(VisibleArray[3]))+",Content='"+Content+"' where PageID="+PageID+" and Position='Content';");
				state.executeUpdate("update PageBody set Visible="+Integer.parseInt(String.valueOf(VisibleArray[4]))+",Content='"+Foot+"' where PageID="+PageID+" and Position='Foot';");
			}
			else
			{
				return false;
			}
			dbConn.commit();//execute all
			dbConn.setAutoCommit(true);
			return true;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			try {
				dbConn.rollback();
			} catch (SQLException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			return false;
		}
	}
	public boolean BatchCreatePage(int PageID,String PageName,String PageTime,String PageHead,String ExternalLabel)
	{
		Statement state;
		ResultSet rs;
		//Batching
		try {
			state=dbConn.createStatement();
			dbConn.setAutoCommit(false);
			//PageHead
			if(ExternalLabel==null||ExternalLabel.equals(" ")||ExternalLabel.equals(""))
			{
				ExternalLabel="NULL";
			}
			else
			{
				ExternalLabel="'"+ExternalLabel+"'";
			}
			state.executeUpdate("insert into PageHead values("+PageID+",'"+PageName+"','"+PageTime+"','"+PageHead+"',"+ExternalLabel+");");
			//PageBody
			String CreatePageBody="insert into PageBody values("+PageID+",'Head',1,'<div id=\"Head\">Head</div>');"
					+ "insert into PageBody values("+PageID+",'Logo',1,'<div id=\"Logo\"><p>Logo</p></div>');"
					+ "insert into PageBody values("+PageID+",'Navigation',1,'<div id=\"Navigation\"><p>Navigation</p></div>');"
					+ "insert into PageBody values("+PageID+",'Content',1,'<div id=\"Content\"><p>Content</p></div>');"
					+ "insert into PageBody values("+PageID+",'Foot',1,'<div id=\"Foot\"><p>Foot</p></div>');";
			
			state.executeUpdate(CreatePageBody);
			//CSS
			String CreateCSS="insert into CSS values("+PageID+",'#Head','position: relative;right:0px;left:0px;top:0px;');"
					+ "insert into CSS values("+PageID+",'#Logo','position: absolute;z-index: 1;');"
					+ "insert into CSS values("+PageID+",'#Navigation','position: relative;right:0px;left:0px;');"
					+ "insert into CSS values("+PageID+",'#Content','position: relative;right:0px;left:0px;');"
					+ "insert into CSS values("+PageID+",'#Foot','position: relative;right:0px;left:0px;bottom:0px;');"
					+ "insert into css values("+PageID+",'p','margin:0px;padding:0px;border:0px;');"
					+ "insert into css values("+PageID+",'div','margin:0px;padding:0px;border:0px;');"
					+ "insert into css values("+PageID+",'a:link','text-decoration: none;');"
					+ "insert into css values("+PageID+",'a:visited','color: inherit;');";
			state.executeUpdate(CreateCSS);
			
			dbConn.commit();//execute all
			dbConn.setAutoCommit(true);
			return true;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			try {
				dbConn.rollback();
			} catch (SQLException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			return false;
		}
	}
	public boolean BatchSaveCSS(int PageID,Vector Object,Vector Style)
	{
		Statement state;
		ResultSet rs;
		//Batching
		try {
			state=dbConn.createStatement();
			dbConn.setAutoCommit(false);
			state.executeUpdate("delete from CSS where PageID="+PageID+";");
			for(int i=0;i<Object.size();i++)
			{
				state.executeUpdate("insert into CSS values("+PageID+",'"+(String)Object.get(i)+"','"+(String)Style.get(i)+"');");
			}
			dbConn.commit();//execute all
			dbConn.setAutoCommit(true);
			return true;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			try {
				dbConn.rollback();
			} catch (SQLException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			return false;
		}
	}
	public boolean BatchDeletePage(String PageName)
	{
		Statement state;
		ResultSet rs;
		int PageID;
		//Batching
		try {
			state=dbConn.createStatement();
			rs=state.executeQuery("select * from PageHead where PageName='"+PageName+"';");
			if(rs.next())
			{
				dbConn.setAutoCommit(false);
				PageID=rs.getInt("PageID");
				state.executeUpdate("delete from PageBody where PageID="+PageID+";");
				state.executeUpdate("delete from CSS where PageID="+PageID+";");
				state.executeUpdate("delete from PageHead where PageID="+PageID+";");
			}
			else
			{
				return false;
			}
			dbConn.commit();//execute all
			dbConn.setAutoCommit(true);
			return true;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			try {
				dbConn.rollback();
			} catch (SQLException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			return false;
		}
	}
//==========================================================================getter&setter Function
	public boolean IsConnect()
	{
		return IsConnect;
	}
}
