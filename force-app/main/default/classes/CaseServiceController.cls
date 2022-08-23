/**
 * description       : Service class contains all DML functions
 * author            : Shreyashi Sarkar
 * last modified on  : 08-15-2022
 * last modified by  : Shreyashi Sarkar
 **/

public class CaseServiceController {
    private static CaseServiceController instance = null;
  
    public static CaseServiceController getInstance() {
      if (instance == null) {
        instance = new CaseServiceController();
      }
      return instance;
    }
  
    /**
     * author:   Shreyashi Sarkar
     * method:   contains case table data
     * return:   list of cases
     */
    public List<Case> getAllCase() {
      List<Case> caseList = [
        SELECT Id, CaseNumber, Priority, Reason, Origin,
        Status from Case WITH SECURITY_ENFORCED ORDER BY CREATEDDATE DESC
      ];
      return caseList;
    }
  
    /**
     * author:   Shreyashi Sarkar
     * method:   contains filtered case table data
     * return:   list of cases
     */
    public List<Case> getFilteredCase(
        String origin, String priority, String reason, String status) {
      List<Case> caseList = new List<Case>();
      String query =
          'SELECT Id,CaseNumber,Priority,Reason,Origin,Status from Case WHERE CaseNumber !=null';
  
      if (String.isNotBlank(origin)) {
        query +=
            ' AND Origin = \'' + String.escapeSingleQuotes(origin.trim()) + '\'';
      }
      if (String.isNotBlank(priority)) {
        query += ' AND Priority = \'' + String.escapeSingleQuotes(priority.trim())
            + '\'';
      }
      if (String.isNotBlank(reason)) {
        query +=
            ' AND Reason = \'' + String.escapeSingleQuotes(reason.trim()) + '\'';
      }
      if (String.isNotBlank(status)) {
        query +=
            ' AND Status = \'' + String.escapeSingleQuotes(status.trim()) + '\'';
      }
  
      query += ' WITH SECURITY_ENFORCED ORDER BY CREATEDDATE DESC ';
      caseList = Database.query(query);
  
      return caseList;
    }
  }