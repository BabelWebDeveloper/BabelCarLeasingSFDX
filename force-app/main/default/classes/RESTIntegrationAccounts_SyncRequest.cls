global class RESTIntegrationAccounts_SyncRequest {
    public String operationType;
    public List<RESTIntegrationAccounts_Wrapper> wrappers;
    public String status;

    global RESTIntegrationAccounts_SyncRequest(String operationType, List<RESTIntegrationAccounts_Wrapper> wrappers, String status) {
        this.operationType = operationType;
        this.wrappers = wrappers;
        this.status = status;
    }
}