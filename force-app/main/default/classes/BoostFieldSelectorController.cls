public without sharing class BoostFieldSelectorController {

    @AuraEnabled(cacheable=true)
    public static List<String> getAllCustomSObjects() {
        List<String> sObjectList = new List<String>();
        sObjectList.add('Account');
        sObjectList.add('Case');
        return sObjectList;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getAllSObjectFields(String sObjectString){
        SObjectType accountType = Schema.getGlobalDescribe().get(sObjectString);
        Map<String,Schema.SObjectField> mfields = accountType.getDescribe().fields.getMap();
        Map<String, String> fields = new Map<String, String>();

        List<String> fieldList = new List<String>();

        for (String fieldName : mfields.keySet()){
            fieldList.add(fieldName);
            fields.put(fieldName, fieldName);
        }

        return fieldList;
    }
}