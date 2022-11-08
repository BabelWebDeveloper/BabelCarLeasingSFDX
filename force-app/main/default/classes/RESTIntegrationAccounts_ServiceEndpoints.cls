@RestResource(urlMapping='/AccountIntegration/*')
global with sharing class RESTIntegrationAccounts_ServiceEndpoints {
    @HttpPost
    global static void doPost(String operationType, List<RESTIntegrationAccounts_Wrapper> wrappers, String status) {
        System.debug('wrappers: ' + wrappers);
    }
}