global class RESTIntegrationAccounts_Wrapper {
    public String name;
    public String description;
    public String externalId;

    global RESTIntegrationAccounts_Wrapper(Account account){
        this.name = account.Name;
        this.description = account.Description;
        this.externalId = account.External_ID__c;
    }
}