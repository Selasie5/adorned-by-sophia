import { gql } from '@apollo/client';

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    getAllCategories {
      code
      success
      message
      data {
        id
        name
        description
       
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    getAllProducts {
      code
      success
      message
      data {
        id
        name
        description
        images
        category {
          id
          name
        }
        price
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_ALL_INVENTORY = gql`
  query GetAllInventory {
    getAllInventory {
      code
      success
      message
      data {
        id
        product {
          id
          name
          images
          price
        }
        sizes
        quantity
        createdBy { id name email }
        updatedBy { id name email }
        createdAt
        updatedAt
      }
    }
  }
`;

// ==================== ORDERS ====================

export const GET_ORDERS = gql`
  query GetOrders($filter: OrderFilterInput, $page: Int, $limit: Int) {
    getOrders(filter: $filter, page: $page, limit: $limit) {
      code
      success
      message
      data {
        id
        orderNumber
        customer {
          id
          firstName
          lastName
          email
        }
        items {
          product {
            id
            name
            images
          }
          productName
          size
          quantity
          unitPrice
          totalPrice
        }
        subtotal
        shippingCost
        discount
        discountCode
        total
        status
        trackingNumber
        shippingAddress {
          fullName
          phone
          email
          addressLine1
          city
          country
        }
        payment {
          method
          status
          amount
          currency
          transactionId
          paidAt
        }
        createdAt
        updatedAt
      }
      totalCount
      page
      limit
    }
  }
`;

export const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: ID!) {
    getOrderById(id: $id) {
      code
      success
      message
      data {
        id
        orderNumber
        customer {
          id
          firstName
          lastName
          email
          phone
        }
        items {
          product {
            id
            name
            images
          }
          productName
          productImage
          size
          quantity
          unitPrice
          totalPrice
        }
        subtotal
        shippingCost
        discount
        discountCode
        total
        status
        trackingNumber
        shippingAddress {
          fullName
          phone
          email
          addressLine1
          addressLine2
          city
          state
          country
          postalCode
        }
        shippingZone
        payment {
          method
          status
          amount
          currency
          transactionId
          paidAt
          refundedAt
          refundReason
        }
        adminNotes {
          note
          createdBy {
            id
            name
          }
          createdAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_ORDER_STATS = gql`
  query GetOrderStats {
    getOrderStats {
      totalOrders
      pendingOrders
      processingOrders
      shippedOrders
      deliveredOrders
      cancelledOrders
      totalRevenue
      todayRevenue
      monthRevenue
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) {
      code
      success
      message
      data {
        id
        status
      }
    }
  }
`;

export const UPDATE_PAYMENT_STATUS = gql`
  mutation UpdatePaymentStatus($id: ID!, $status: PaymentStatus!, $transactionId: String) {
    updatePaymentStatus(id: $id, status: $status, transactionId: $transactionId) {
      code
      success
      message
      data {
        id
        payment {
          status
          transactionId
          paidAt
        }
      }
    }
  }
`;

export const UPDATE_TRACKING_NUMBER = gql`
  mutation UpdateTrackingNumber($id: ID!, $trackingNumber: String!) {
    updateTrackingNumber(id: $id, trackingNumber: $trackingNumber) {
      code
      success
      message
      data {
        id
        trackingNumber
        status
      }
    }
  }
`;

export const ADD_ADMIN_NOTE = gql`
  mutation AddAdminNote($id: ID!, $note: String!) {
    addAdminNote(id: $id, note: $note) {
      code
      success
      message
      data {
        id
        adminNotes {
          note
          createdBy {
            id
            name
          }
          createdAt
        }
      }
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($id: ID!, $reason: String!) {
    cancelOrder(id: $id, reason: $reason) {
      code
      success
      message
      data {
        id
        status
      }
    }
  }
`;

// ==================== CUSTOMERS ====================

export const GET_CUSTOMERS = gql`
  query GetCustomers($page: Int, $limit: Int, $search: String) {
    getCustomers(page: $page, limit: $limit, search: $search) {
      code
      success
      message
      data {
        id
        email
        firstName
        lastName
        phone
        totalOrders
        totalSpent
        lastOrderAt
        isActive
        createdAt
      }
      totalCount
      page
      limit
    }
  }
`;

export const GET_CUSTOMER_BY_ID = gql`
  query GetCustomerById($id: ID!) {
    getCustomerById(id: $id) {
      code
      success
      message
      data {
        id
        email
        firstName
        lastName
        phone
        addresses {
          label
          fullName
          phone
          addressLine1
          addressLine2
          city
          state
          country
          postalCode
          isDefault
        }
        totalOrders
        totalSpent
        lastOrderAt
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_CUSTOMER_ORDER_HISTORY = gql`
  query GetCustomerOrderHistory($customerId: ID!, $page: Int, $limit: Int) {
    getCustomerOrderHistory(customerId: $customerId, page: $page, limit: $limit) {
      code
      success
      message
      data {
        id
        orderNumber
        total
        status
        createdAt
      }
      totalCount
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      code
      success
      message
      data {
        id
        firstName
        lastName
        phone
        isActive
      }
    }
  }
`;

// ==================== PROMOTIONS ====================

export const GET_PROMOTIONS = gql`
  query GetPromotions($page: Int, $limit: Int, $isActive: Boolean) {
    getPromotions(page: $page, limit: $limit, isActive: $isActive) {
      code
      success
      message
      data {
        id
        code
        description
        discountType
        discountValue
        minimumOrderAmount
        maximumDiscount
        usageLimit
        usageCount
        perCustomerLimit
        validFrom
        validUntil
        isActive
        createdAt
      }
      totalCount
      page
      limit
    }
  }
`;

export const GET_PROMOTION_BY_ID = gql`
  query GetPromotionById($id: ID!) {
    getPromotionById(id: $id) {
      code
      success
      message
      data {
        id
        code
        description
        discountType
        discountValue
        minimumOrderAmount
        maximumDiscount
        usageLimit
        usageCount
        perCustomerLimit
        validFrom
        validUntil
        applicableProducts
        applicableCategories
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const VALIDATE_PROMOTION = gql`
  query ValidatePromotion($code: String!, $customerId: ID!, $orderTotal: Float!) {
    validatePromotion(code: $code, customerId: $customerId, orderTotal: $orderTotal) {
      valid
      message
      discount {
        type
        value
        calculatedAmount
      }
    }
  }
`;

export const CREATE_PROMOTION = gql`
  mutation CreatePromotion($input: CreatePromotionInput!) {
    createPromotion(input: $input) {
      code
      success
      message
      data {
        id
        code
        discountType
        discountValue
        validFrom
        validUntil
        isActive
      }
    }
  }
`;

export const UPDATE_PROMOTION = gql`
  mutation UpdatePromotion($id: ID!, $input: UpdatePromotionInput!) {
    updatePromotion(id: $id, input: $input) {
      code
      success
      message
      data {
        id
        code
        description
        discountType
        discountValue
        isActive
      }
    }
  }
`;

export const DELETE_PROMOTION = gql`
  mutation DeletePromotion($id: ID!) {
    deletePromotion(id: $id) {
      code
      success
      message
    }
  }
`;

// ==================== SHIPPING ====================

export const GET_SHIPPING_RATES = gql`
  query GetShippingRates {
    getShippingRates {
      code
      success
      message
      data {
        id
        name
        zone
        countries
        flatRate
        currency
        estimatedDays {
          min
          max
        }
        isActive
        createdAt
      }
    }
  }
`;

export const GET_SHIPPING_RATE_FOR_COUNTRY = gql`
  query GetShippingRateForCountry($country: String!) {
    getShippingRateForCountry(country: $country) {
      code
      success
      message
      data {
        id
        name
        zone
        flatRate
        currency
        estimatedDays {
          min
          max
        }
      }
    }
  }
`;

export const CREATE_SHIPPING_RATE = gql`
  mutation CreateShippingRate($input: CreateShippingRateInput!) {
    createShippingRate(input: $input) {
      code
      success
      message
      data {
        id
        name
        zone
        flatRate
        isActive
      }
    }
  }
`;

export const UPDATE_SHIPPING_RATE = gql`
  mutation UpdateShippingRate($id: ID!, $input: UpdateShippingRateInput!) {
    updateShippingRate(id: $id, input: $input) {
      code
      success
      message
      data {
        id
        name
        zone
        flatRate
        isActive
      }
    }
  }
`;

export const DELETE_SHIPPING_RATE = gql`
  mutation DeleteShippingRate($id: ID!) {
    deleteShippingRate(id: $id) {
      code
      success
      message
    }
  }
`;

// ==================== SETTINGS ====================

export const GET_STORE_SETTINGS = gql`
  query GetStoreSettings {
    getStoreSettings {
      code
      success
      message
      data {
        id
        storeName
        storeEmail
        storePhone
        storeAddress {
          addressLine1
          addressLine2
          city
          state
          country
          postalCode
        }
        currency {
          code
          symbol
        }
        socialMedia {
          instagram
          facebook
          twitter
          tiktok
        }
        emailNotifications {
          orderConfirmation
          orderShipped
          orderDelivered
          lowStockAlert
          lowStockThreshold
        }
        businessHours
        returnPolicy
        updatedAt
      }
    }
  }
`;

export const UPDATE_STORE_SETTINGS = gql`
  mutation UpdateStoreSettings($input: UpdateStoreSettingsInput!) {
    updateStoreSettings(input: $input) {
      code
      success
      message
      data {
        id
        storeName
        storeEmail
        storePhone
        updatedAt
      }
    }
  }
`;

// ==================== DASHBOARD ====================

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    getDashboardData {
      orders {
        total
        pending
        processing
        todayCount
        monthCount
      }
      revenue {
        total
        thisMonth
        lastMonth
        growth
        currency
      }
      customers {
        total
        newThisMonth
      }
      inventory {
        lowStockCount
        outOfStockCount
        threshold
      }
      products {
        total
      }
    }
  }
`;

export const GET_LOW_STOCK_ALERTS = gql`
  query GetLowStockAlerts($limit: Int) {
    getLowStockAlerts(limit: $limit) {
      id
      product {
        id
        name
        images
      }
      currentStock
      threshold
      isOutOfStock
    }
  }
`;

export const GET_RECENT_DASHBOARD_ORDERS = gql`
  query GetRecentDashboardOrders($limit: Int) {
    getRecentDashboardOrders(limit: $limit) {
      code
      success
      message
      data {
        id
        orderNumber
        customer {
          id
          firstName
          lastName
        }
        total
        status
        createdAt
      }
    }
  }
`;

export const GET_REVENUE_BY_PERIOD = gql`
  query GetRevenueByPeriod($period: String!, $days: Int) {
    getRevenueByPeriod(period: $period, days: $days) {
      code
      success
      message
      data {
        period
        revenue
        orderCount
      }
    }
  }
`;
