public with sharing class BoostFieldSelectorWrapper {
    @AuraEnabled
    public Boolean enableObjectsSelecton{get; set;}
    @AuraEnabled
    public Boolean enableFieldsSelecton{get; set;}
    @AuraEnabled
    public Boolean enableConditionsSelecton{get; set;}
    @AuraEnabled
    public Boolean enableOrdering{get; set;}
    @AuraEnabled
    public Boolean enableLimit{get; set;}
}
