public without sharing class BoostFieldSelectorController {
    @AuraEnabled(cacheable=true)
    public static Map<String, Boolean> setQueryPermissions(BoostFieldSelectorWrapper wrapper){
        Map<String, Boolean> permissionMap = new Map<String,Boolean>();
        permissionMap.put('enableObjectsSelecton', wrapper.enableObjectsSelecton);
        permissionMap.put('enableFieldsSelecton', wrapper.enableFieldsSelecton);
        permissionMap.put('enableConditionsSelecton', wrapper.enableConditionsSelecton);
        permissionMap.put('enableOrdering', wrapper.enableOrdering);
        permissionMap.put('enableLimit', wrapper.enableLimit);

        return permissionMap;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getObjects() {
        List<String> sObjectList = new List<String>();
        sObjectList.add('Account');
        sObjectList.add('Case');
        return sObjectList;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getObjectFields(String objectName){
        SObjectType accountType = Schema.getGlobalDescribe().get(objectName);
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