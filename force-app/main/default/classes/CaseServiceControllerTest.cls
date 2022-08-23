/**
 * description       : Test class is for CaseServiceController
 * author            : Shreyashi Sarkar
 * last modified on  : 08-20-2022
 * last modified by  : Shreyashi Sarkar
 **/
@isTest
public class CaseServiceControllerTest {
  @TestSetup
  static void createCommonTestRecords() {
    Case testCase1 = new Case(
        status = 'New', Origin = 'Web', Priority = 'Low', Reason = 'Feedback');
    Case testCase2 = new Case(status = 'New', Origin = 'Email',
        Priority = 'High', Reason = 'Installation');
    Case testCase3 = new Case(
        status = 'New', Origin = 'Email', Priority = 'Low', Reason = 'Other');

    List<Case> testCaseList = new List<Case>();
    testCaseList.add(testCase1);
    testCaseList.add(testCase2);
    testCaseList.add(testCase3);

    insert testCaseList;
  }

  @isTest
  static void getAllCase() {
    List<Case> caseList = [ SELECT ID, CaseNumber from Case ];
    List<Case> listOfCases = CaseController.getCaseList();
    System.assertEquals(3, listOfCases.size());
  }

  @isTest
  static void getFilterCaseWithFilteredValues() {
    List<Case> caseList =
        [ SELECT ID, CaseNumber from Case Where Priority = 'Low' ];
    List<Case> listOfCases =
        CaseController.getFilteredCase(null, 'Low', null, null);
    System.assertEquals(2, listOfCases.size());
  }

  @isTest
  static void getFilterCaseWithZeroList() {
    List<Case> caseList = [
      SELECT ID,
      CaseNumber from Case Where Priority = 'Low' AND Reason =
          'Other' AND Origin = 'Web'
    ];
    List<Case> listOfCases =
        CaseController.getFilteredCase('Web', 'Low', 'Other', null);

    System.assertEquals(0, listOfCases.size());
  }
}