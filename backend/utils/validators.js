const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const pincodeRegex = /^\d{6}$/;

const validateEmail = (email) => emailRegex.test(email);
const validatePhone = (phone) => phoneRegex.test(phone);
const validatePincode = (pincode) => pincodeRegex.test(pincode);

module.exports = {
  validateEmail,
  validatePhone,
  validatePincode
};