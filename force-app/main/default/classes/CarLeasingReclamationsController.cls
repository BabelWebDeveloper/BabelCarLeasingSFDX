public without sharing class CarLeasingReclamationsController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getAllCases() {
        return [SELECT OwnerId, Type, CreatedDate, Product.Model__c, Description, Product.Manufacturer__c 
        FROM Case 
        WHERE OwnerId =: getUser().Id];
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
