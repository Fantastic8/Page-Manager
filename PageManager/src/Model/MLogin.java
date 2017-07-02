package Model;

public class MLogin {
	String account=null;
	String message=" ";
	boolean isManager=false;
	boolean isValid=false;
	int PageID=0;
	
	public int getPageID() {
		return PageID;
	}
	public void setPageID(int pageID) {
		PageID = pageID;
	}
	public String getAccount() {
		return account;
	}
	public void setAccount(String account) {
		this.account = account;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public boolean isManager() {
		return isManager;
	}
	public void setManager(boolean isManager) {
		this.isManager = isManager;
	}
	public boolean isValid() {
		return isValid;
	}
	public void setValid(boolean isValid) {
		this.isValid = isValid;
	}
}
