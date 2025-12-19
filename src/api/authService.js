import api from './axios';

// Change password directly with old password
export const changePassword = async (oldPassword, newPassword) => {
  const response = await api.post('/auth/change-password', {
    oldPassword,
    newPassword,
  });
  return response;
};

// Request OTP for changing password
export const requestChangePasswordOtp = async (oldPassword, newPassword) => {
  const response = await api.post('/auth/request-change-password-otp', {
    oldPassword,
    newPassword,
  });
  return response;
};

// Verify OTP for changing password
export const verifyChangePasswordOtp = async (otp) => {
  const response = await api.post('/auth/verify-change-password-otp', {
    otp,
  });
  return response;
};

// Change password with OTP (if separate endpoint)
export const changePasswordWithOtp = async (otp, newPassword) => {
  const response = await api.post('/auth/change-password-otp', {
    otp,
    newPassword,
  });
  return response;
};

// Request reset password OTP
export const requestResetPasswordOtp = async (email) => {
  const response = await api.post('/auth/forgot-password', {
    email,
  });
  return response;
};

// Verify reset password OTP
export const verifyResetPasswordOtp = async (email, otp) => {
  const response = await api.post('/auth/verify-reset-password-otp', {
    email,
    otp,
  });
  return response;
};

// Reset password with OTP
export const resetPasswordWithOtp = async (email, otp, newPassword) => {
  const response = await api.post('/auth/reset-password', {
    email,
    otp,
    newPassword,
  });
  return response;
};

// Reset password with token
export const resetPasswordWithToken = async (resetToken, newPassword) => {
  const response = await api.post('/auth/reset-password-token', {
    resetToken,
    newPassword,
  });
  return response;
};