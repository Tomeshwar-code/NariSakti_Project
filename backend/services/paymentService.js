const crypto = require('crypto');
const razorpay = require('../config/razorpay');

exports.createOrder = async ({ amount, currency = 'INR', receipt = `order_${Date.now()}`, payment_capture = 1 }) => {
  if (!amount || amount <= 0) {
    throw new Error('Amount is required to create an order');
  }

  const orderOptions = {
    amount: Math.round(amount * 100),
    currency,
    receipt,
    payment_capture
  };

  const order = await razorpay.orders.create(orderOptions);
  return order;
};

exports.verifyPayment = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return false;
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  return generatedSignature === razorpay_signature;
};

exports.capturePayment = async ({ paymentId, amount, currency = 'INR' }) => {
  if (!paymentId || !amount) {
    throw new Error('paymentId and amount are required to capture payment');
  }

  return await razorpay.payments.capture(paymentId, Math.round(amount * 100), currency);
};
