// Mock payment service for SSLCommerz
// In a real application, this would integrate with the actual SSLCommerz API

class PaymentService {
  // Mock method to initiate a payment
  static async initiatePayment(orderData) {
    // In a real app, this would make a request to SSLCommerz API
    // For now, we'll return mock data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock payment gateway URL
    return {
      status: 'SUCCESS',
      gatewayUrl: 'http://localhost:3001/mock-payment-gateway',
      orderId: orderData.orderId,
      amount: orderData.amount
    };
  }
  
  // Mock method to verify payment
  static async verifyPayment(paymentData) {
    // In a real app, this would verify the payment with SSLCommerz
    // For now, we'll just return success
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      status: 'SUCCESS',
      transactionId: paymentData.transactionId,
      orderId: paymentData.orderId
    };
  }
}

module.exports = PaymentService;