public without sharing class CarLeasingOrdersController {
    @AuraEnabled(cacheable=true)
    public static List<Order> getActiveOrders(String userId) {
        List<Order> orders = [
                SELECT Id, CreatedById, Status, CreatedDate, TotalAmount,
                (SELECT Id, Quantity, Product2.Manufacturer__c, Product2.Model__c,Product2.Picture__c,
                        Product2.Horsepower__c,Product2.Engine_Type__c,Product2.Gearbox__c,TotalPrice
                FROM OrderItems)
                FROM Order
                WHERE CreatedById = :userId
                AND Status =: CarLeasingSettingService.ORDER_STATUS_ACTIVATED
                ORDER BY CreatedDate DESC
        ];
        
        return orders;
    }

    @AuraEnabled
    public static User getUser() {
        List<User> users = [
            SELECT Id, FirstName, LastName, Title, FullPhotoUrl, Contact.Id
            FROM User
            WHERE Id =: UserInfo.getUserId()
        ];
        if(users.isEmpty()) {
            return null;
        }
        return users[0];
    }

    @AuraEnabled
    public static Case createNewCase (CarLeasingWrapper caseWrapper){
        List<OrderItem> orderItems = [
            SELECT Id, Product2.Id
            FROM OrderItem 
            WHERE Id =: caseWrapper.orderItemId];

        String contactId = getUser().Contact.Id;
        
        Case newCase = new Case();
        newCase.Origin = 'Web';
        if (contactId != null) {
            newCase.ContactId = contactId;
        }
        newCase.Type = caseWrapper.caseType;
        newCase.Reason = caseWrapper.caseReason;
        newCase.ProductId = orderItems[0].Product2.Id;
        newCase.Description = caseWrapper.description;
        insert newCase;

        return newCase;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getCaseTypeOptions() {
        List<String> caseType = new List<String>();
        Schema.DescribeFieldResult fieldResult = Case.Type.getDescribe();
        List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();
        for(Schema.PicklistEntry picklistEntry : picklistEntries) {
            caseType.add(picklistEntry.getLabel());
        }
        return caseType;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getReasonTypeOptions() {
        List<String> caseType = new List<String>();
        Schema.DescribeFieldResult fieldResult = Case.Reason.getDescribe();
        List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();
        for(Schema.PicklistEntry picklistEntry : picklistEntries) {
            caseType.add(picklistEntry.getLabel());
        }
        return caseType;
    }
}