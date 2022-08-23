/**
 * description       : Controller class contains all auraenabled functions
 * author            : Shreyashi Sarkar
 * last modified on  : 08-15-2022
 * last modified by  : Shreyashi Sarkar
 **/

public class CaseController {
    /**
     * author:   Shreyashi Sarkar
     * method:   contains case table data
     * return:   list of cases
     */
    @AuraEnabled(Cacheable = true)
    public static List<Case> getCaseList() {
      CaseServiceController instance = CaseServiceController.getInstance();
  
      try {
        List<Case> caseList = new List<Case>();
        caseList = instance.getAllCase();
  
        return caseList;
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }
  
    /**
     * author:   Shreyashi Sarkar
     * method:   contains case table filtered data
     * return:   list of cases
     */
    @AuraEnabled(Cacheable = true)
    public static List<Case> getFilteredCase(
        String origin, String priority, String reason, String status) {
      CaseServiceController instance = CaseServiceController.getInstance();
  
      try {
        List<Case> caseList = new List<Case>();
        caseList = instance.getFilteredCase(origin, priority, reason, status);
  
        return caseList;
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }
  }