public class CaseController {

    @AuraEnabled(Cacheable = true)
    public static List<Case> getCaseList(){
       CaseServiceController instance =  CaseServiceController.getInstance();

        try {

            List<Case> caseList = new List<Case>();
            caseList = instance.getAllCase();
           
            return caseList;           
        } 
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled(Cacheable = true)
    public static List<Case> getFilteredCase(String origin, String priority, String reason, String status){
       CaseServiceController instance =  CaseServiceController.getInstance();

        try {

            List<Case> caseList = new List<Case>();
            caseList = instance.getFilteredCase(origin, priority, reason, status);
           
            return caseList;           
        } 
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}