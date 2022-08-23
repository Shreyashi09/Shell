import { LightningElement, wire } from 'lwc';
import getCaseList from '@salesforce/apex/CaseController.getCaseList';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import TYPE_ORIGIN from '@salesforce/schema/Case.Origin';
import TYPE_PRIORITY from '@salesforce/schema/Case.Priority';
import TYPE_REASON from '@salesforce/schema/Case.Reason';
import TYPE_STATUS from '@salesforce/schema/Case.Status';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CASE_OBJECT from '@salesforce/schema/Case';
import getFilteredCase from "@salesforce/apex/CaseController.getFilteredCase";
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import jspdf from '@salesforce/resourceUrl/jsPdf';


const caseColumns = [ {label: 'Case Number', fieldName: 'ConName', type: 'url',
                        typeAttributes: {label: { fieldName: 'CaseNumber' }, target: '_self'},sortable: true },                    
                        { label: 'Case Origin', fieldName: 'Origin', sortable: "true"},
                        { label: 'Priority', fieldName: 'Priority', sortable: "true"},
                        { label: 'Reason', fieldName: 'Reason',  sortable: "true" },
                        { label: 'Status', fieldName: 'Status',  sortable: "true" },
                    ];

export default class CaseDataTable extends LightningElement {

    //contactList = [];
    headers = this.createHeaders([
        "CaseNumber",
        "Origin",
        "Priority",
        "Reason",
        "Status"
    ]);

    //dataTable = [];
    columns = caseColumns;
    sortBy;
    sortDirection;
    hasCaseTableData = false;
    caseList = []; //is it used to keep case table data

    //pagination attributes
    rowNumberOffset;
    recordsToDisplay = [];

    //search attriutes
    searchString;
    initialRecords;

    //filter attributes
    selectedOrigin;
    originOptions;
    selectedPriority;
    priorityOptions;
    selectedReason;
    selectedStatus;
    reasonOptions;
    statusOptions;

    //download attributes
    tableDataPDF;

    @wire(getObjectInfo, { objectApiName: CASE_OBJECT })
    caseInfo;

    @wire(getPicklistValues, { recordTypeId: '$caseInfo.data.defaultRecordTypeId', fieldApiName: TYPE_ORIGIN })
    origins({error, data}) {
        if (data) {
            this.originOptions = data.values;
            console
        } else if (error) {
        }
    }

    @wire(getPicklistValues, { recordTypeId: '$caseInfo.data.defaultRecordTypeId', fieldApiName: TYPE_PRIORITY })
    priorities({error, data}) {
        if (data) {
            this.priorityOptions = data.values;
            console
        } else if (error) {
        }
    }

    @wire(getPicklistValues, { recordTypeId: '$caseInfo.data.defaultRecordTypeId', fieldApiName: TYPE_REASON })
    reasons({error, data}) {
        if (data) {
            this.reasonOptions = data.values;
            console
        } else if (error) {
        }
    }

    @wire(getPicklistValues, { recordTypeId: '$caseInfo.data.defaultRecordTypeId', fieldApiName: TYPE_STATUS })
    statuses({error, data}) {
        if (data) {
            this.statusOptions = data.values;
            console
        } else if (error) {
        }
    }

    selectOrigin(event){
        this.selectedOrigin = event.target.value;

    }

    selectPriority(event){
        this.selectedPriority = event.target.value;
        
    }

    selectReason(event){
        this.selectedReason = event.target.value;
        
    }

    selectStatus(event){
        this.selectedStatus = event.target.value;
        
    }

    connectedCallback(){
        this.getCaseTable();
    }

    getCaseTable(){
        getFilteredCase({origin: this.selectedOrigin, priority: this.selectedPriority, 
                        reason: this.selectedReason, status:this.selectedStatus})
        .then(result =>{
            let caseTableData = [];

            if (result.length > 0) {
                let i = 1;
                result.forEach((caseRec) => {
                  let case_rec = {};
                  case_rec.CaseNumber = caseRec.CaseNumber;
                  case_rec.ConName = '/' + caseRec.Id;    
                  case_rec.Origin = caseRec.Origin; 
                  case_rec.Priority = caseRec.Priority;
                  case_rec.Reason = caseRec.Reason;
                  case_rec.Status = caseRec.Status;                                  
                  caseTableData.push(case_rec);
                });
              }
                this.recordsToDisplay = caseTableData;
                this.caseList = caseTableData;
                this.initialRecords = caseTableData;
                this.error = undefined;
                this.hasCaseTableData = true;
        })
        .catch(error=>{
            this.caseList = undefined;
            this.error = error;
            this.hasCaseTableData = true;
        });
    }
    searchCase(){

        this.getCaseTable();
    }

    clearFilter(){
        this.selectedOrigin = null;
        this.selectedPriority = null;
        this.selectedReason = null;
        this.selectedStatus = null;
        this.recordsToDisplay = this.initialRecords;
        this.getCaseTable();
    }

    @wire(getCaseList)
    wiredCaseList({ data, error }){
        if(data){
            let caseTableData = JSON.parse(JSON.stringify(data));            
            this.tableDataPDF = data;
                
            let tempCaseList = [];
            data.forEach((record) => {
                let tempCaseRec = Object.assign({}, record);  
                tempCaseRec.ConName = '/' + tempCaseRec.Id;
                tempCaseList.push(tempCaseRec);
                
            });
            this.caseList = tempCaseList;
            this.initialRecords = tempCaseList;
            this.error = undefined;
            this.hasCaseTableData = true;

        }
        else if (error) {
            this.caseList = undefined;
            this.error = error;
            this.hasCaseTableData = true;
        }
    }
    
    handlePaginatorChange(event) {
        this.recordsToDisplay = event.detail;
        this.rowNumberOffset = this.recordsToDisplay[0].rowNumber - 1;
    }
      //sorting funstions
    performColumnSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }
      // sortData function --- used for sorting
    sortData(fieldName, direction) {
        let prodTable = JSON.parse(JSON.stringify(this.recordsToDisplay));
        //return the value sorted in the field
        let key_Value = (val) => {
          return val[fieldName];
    };
        //checking reverse direction
        let isReverse = direction === "asc" ? 1 : -1;
        //sorting data
        prodTable.sort((x, y) => {
          x = key_Value(x) ? key_Value(x) : "";
          y = key_Value(y) ? key_Value(y) : ""; // handling null values
          //soritng values based on direction
          return isReverse * ((x > y) - (y > x));
        });
        //set the sorted data into table
        this.recordsToDisplay = prodTable;
    }


    handleSearch( event ) {
        const searchKey = event.target.value.toLowerCase();
        if ( searchKey.length >=3 && searchKey != null ) {
            this.caseList = this.initialRecords;

            if ( this.caseList ) {
                let recs = [];
                for ( let rec of this.caseList ) {

                    let valuesArray = Object.values( rec );
 
                    for ( let val of valuesArray ) {

                        //console.log( 'val is ‘'+ val );
                        let strVal = String( val );
                        
                        if ( strVal ) {

                            if ( strVal.toLowerCase().includes( searchKey ) ) {

                                recs.push( rec );
                                break;
                        
                            }

                        }

                    }
                    this.recordsToDisplay =  recs;

                }
            }
           
        }
        else{
            this.recordsToDisplay = this.initialRecords;

        }    
    
    }

    
    renderedCallback() {
        Promise.all([
            loadScript(this, jspdf)// load script here
        ])
    }

    createHeaders(keys) {
        var result = [];
        for (var i = 0; i < keys.length; i += 1) {
            result.push({
                id: keys[i],
                name: keys[i],
                prompt: keys[i],
                width: 65,
                align: "center",
                padding: 0
            });
        }
        return result;
    }

    generatePdf(){
        const { jsPDF } = window.jspdf;
        const pdfSize = 'a4';
        const doc = new jsPDF('p', 'mm', [ 300,  350]);
        
        console.log('table data from generatepdf -------->'+this.tableDataPDF);
        let pdfTableData = this.tableDataPDF;
        let pdf_table =[];
        if (this.tableDataPDF.length > 0) {
            let i = 1;
            this.tableDataPDF.forEach((case_rec) => {
              let caseTableItem = {};
              caseTableItem.CaseNumber = case_rec.CaseNumber;
              caseTableItem.Origin = case_rec.Origin;
              caseTableItem.Priority = case_rec.Priority;
              caseTableItem.Reason = case_rec.Reason;
              caseTableItem.Status = case_rec.Status;
              pdf_table.push(caseTableItem);
            });
          }
        doc.table(30, 30, pdf_table, this.headers, { autosize:false });
        doc.save("Case.pdf");
    }
            
    
}