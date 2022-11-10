public without sharing class carLeasingCasesController {
    @AuraEnabled
    public static CarLeasingWrapper createNewCase (CarLeasingWrapper caseWrapper){
        System.debug('createNewCase');
        System.debug(caseWrapper);
        // List<OrderItem> orderItems = [
        //     SELECT Id, Product2.Id
        //     FROM OrderItem 
        //     WHERE Id =: caseWrapper.orderItemId];
        
        // Case newCase = new Case();
        // newCase.Origin = 'Web';
        // newCase.ContactId = getUser().Contact.Id;
        // newCase.Type = caseWrapper.caseType;
        // newCase.Reason = caseWrapper.caseReason;
        // newCase.ProductId = orderItems[0].Product2.Id;
        // newCase.Subject = caseWrapper.subject;
        // newCase.Description = caseWrapper.description;
        // // insert newCase;

        return caseWrapper;
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
}
