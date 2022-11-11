public without sharing class CarLeasingCartController {
    @AuraEnabled(cacheable=true)
    public static String getStandardPricebook() {
        PriceBook2 pb2Standard = [
                SELECT Id, IsStandard
                FROM Pricebook2
                WHERE IsStandard = TRUE
        ];
        return pb2Standard.Id;
    }

    @AuraEnabled(cacheable=true)
    public static Order getUserOrder() {
        Order order = [
                SELECT Id, OwnerId, Status
                FROM Order
                WHERE OwnerId =: getUser().Id
                AND Status =: CarLeasingSettingService.ORDER_STATUS_DRAFT
        ];
        return order;
    }

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

    @AuraEnabled(cacheable=true)
    public static List<OrderItem> getOrderItems(String orderId) {
        List<OrderItem> orderItems = [
                SELECT Product2Id, Product2.Manufacturer__c, Product2.Model__c, Product2.Picture__c, Product2.Horsepower__c,
                        Product2.Engine_Type__c, Product2.Gearbox__c, Product2.Body_Type__c, Product2.Year_of_production__c,
                        Product2.Width__c, Product2.Height__c, Product2.Length__c, Product2.Number_of_seats__c,
                        Product2.Engine_capacity__c, Product2.Acceleration__c, Product2.Average_fuel_consumption__c,
                        Product2.The_size_of_the_wheels__c, Quantity, OrderId, Id, UnitPrice
                FROM OrderItem
                WHERE OrderId = :orderId
        ];
        return orderItems;
    }

    @AuraEnabled(cacheable=true)
    public static String getUserAccountId(String userId) {
        User user = [
                SELECT Account.Id
                FROM User
                WHERE Id = :userId
        ];
        return user.Account.Id;
    }

    @AuraEnabled(cacheable=true)
    public static String getUserAccountId2() {
        String userId2 = getUser().Id;
        User user = [
                SELECT Account.Id
                FROM User
                WHERE Id =: userId2
        ];
        return user.Account.Id;
    }

    // @AuraEnabled
    // public static OrderItem createOrderItem(String carId, String manufacturer, String model, String picture,
    //         Double totalMonthlyPayment, Integer carsQuantity, Integer contractPeriod, Double startFee,
    //         Double unitPrice) {
    //     try {
    //         String userId2 = getUser().Id;
    //         String orderId2 = getUserOrder().Id;
    //         List<OrderItem> orderItems = checkIfOrderItemExist(carId, userId2, orderId2);
    //         if (orderItems.size() > 0) {
    //             System.debug(orderItems);
    //             for (OrderItem orderItem : orderItems){
    //                 orderItem.Quantity = orderItem.Quantity + carsQuantity;
    //             }
    //             System.debug(orderItems);
    //             update orderItems;
    //         } else {
    //             String pricebookId = getStandardPricebookId();
    //             String pricebookEntryId = getPricebookEntryId(carId);
    //             String userAccountId2 = getUserAccountId2();

    //             if (orderId2 == null) {
    //                 Order order = new Order();
    //                 order.AccountId = userAccountId2;
    //                 order.EffectiveDate = System.today();
    //                 order.Status = CarLeasingSettingService.ORDER_STATUS_DRAFT;
    //                 order.PriceBook2Id = pricebookId;
    //                 insert order;

    //                 OrderItem lineItem = new OrderItem();
    //                 lineItem.OrderId = order.id;
    //                 lineItem.Quantity = carsQuantity;
    //                 lineItem.UnitPrice = unitPrice;
    //                 lineItem.Product2id = carId;
    //                 lineItem.PricebookEntryId = pricebookEntryId;
    //                 insert lineItem;
    //                 return lineItem;

    //             } else {
    //                 OrderItem lineItem = new OrderItem();
    //                 lineItem.OrderId = orderId2;
    //                 lineItem.Quantity = carsQuantity;
    //                 lineItem.UnitPrice = unitPrice;
    //                 lineItem.Product2id = carId;
    //                 lineItem.PricebookEntryId = pricebookEntryId;
    //                 insert lineItem;
    //                 return lineItem;
    //             }
    //         }
    //     } catch (Exception e) {
    //         System.debug(e);
    //         return null;
    //     }
    //     return null;
    // }

    @AuraEnabled
    public static OrderItem createOrderItem(String userId, String carId, String manufacturer, String model, String picture,
            Double totalMonthlyPayment, Integer carsQuantity, Integer contractPeriod, Double startFee,
            String orderId, String userAccountId, Double unitPrice) {
        try {
            List<OrderItem> orderItems = checkIfOrderItemExist(carId, userId, orderId);
            if (orderItems.size() > 0) {
                System.debug(orderItems);
                for (OrderItem orderItem : orderItems){
                    orderItem.Quantity = orderItem.Quantity + carsQuantity;
                }
                System.debug(orderItems);
                update orderItems;
            } else {
                String pricebookId = getStandardPricebookId();
                String pricebookEntryId = getPricebookEntryId(carId);

                if (orderId == null) {
                    Order order = new Order();
                    order.AccountId = userAccountId;
                    order.EffectiveDate = System.today();
                    order.Status = CarLeasingSettingService.ORDER_STATUS_DRAFT;
                    order.PriceBook2Id = pricebookId;
                    insert order;

                    OrderItem lineItem = new OrderItem();
                    lineItem.OrderId = order.id;
                    lineItem.Quantity = carsQuantity;
                    lineItem.UnitPrice = unitPrice;
                    lineItem.Product2id = carId;
                    lineItem.PricebookEntryId = pricebookEntryId;
                    insert lineItem;
                    return lineItem;

                } else {
                    OrderItem lineItem = new OrderItem();
                    lineItem.OrderId = orderId;
                    lineItem.Quantity = carsQuantity;
                    lineItem.UnitPrice = unitPrice;
                    lineItem.Product2id = carId;
                    lineItem.PricebookEntryId = pricebookEntryId;
                    insert lineItem;
                    return lineItem;
                }
            }
        } catch (Exception e) {
            System.debug(e);
            return null;
        }
        return null;
    }

    public static String getStandardPricebookId() {
        return [
                SELECT Id, IsStandard
                FROM Pricebook2
                WHERE IsStandard = TRUE
        ].Id;
    }

    public static String getPricebookEntryId(String carId) {
        return [
                SELECT Id, Name, Product2Id, Pricebook2.IsStandard
                FROM PricebookEntry
                WHERE Product2Id = :carId
                AND Pricebook2.IsStandard = TRUE
        ].Id;
    }

    public static List<OrderItem> checkIfOrderItemExist(String product2Id, String userId, String orderId) {
        return [
                SELECT Id, OrderId, CreatedById, Product2Id, Quantity
                FROM OrderItem
                WHERE CreatedById =: userId
                AND OrderId =: orderId
                AND Product2Id =: product2Id
        ];
    }


    @AuraEnabled
    public static void setActiveOrder(String billingStreet, String billingCity, String billingStateProvince,
            String billingCountry, String billingZipPostalCode, String orderId) {
        Order order = [
                SELECT
                        Id
                FROM Order
                WHERE Id = :orderId
        ];
        order.BillingStreet = billingStreet;
        order.BillingCity = billingStreet;
        order.BillingState = billingStreet;
        order.BillingCountry = billingStreet;
        order.BillingPostalCode = billingStreet;
        order.Status = CarLeasingSettingService.ORDER_STATUS_ACTIVATED;

        try {
            update order;
        } catch (Exception e) {
            System.debug(e);
        }
    }

    @AuraEnabled
    public static void deleteOrderItem(String orderItemId) {
        OrderItem orderItem = [
                SELECT
                        Product2Id
                FROM OrderItem
                WHERE Id = :orderItemId
        ];
        delete orderItem;
    }
}