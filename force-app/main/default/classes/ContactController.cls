public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        return [
                SELECT FirstName, LastName, Email, Phone, Title, Name
                FROM Contact
                WITH SECURITY_ENFORCED
        ];
        // throw new AuraHandledException('Forced error');
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> findContacts(String searchKey) {
        String key = '%' + searchKey + '%';
        return [
                SELECT Id, Name, Title, Phone, Email
                FROM Contact
                WHERE Name LIKE :key
                WITH SECURITY_ENFORCED
                LIMIT 10
        ];
    }
}