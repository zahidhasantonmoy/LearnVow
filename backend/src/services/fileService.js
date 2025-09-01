// File service for secure file access
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

class FileService {
  // Generate a signed URL for secure file access
  static generateSignedUrl(filePath, expiresIn = 3600) {
    // In a real app, this would generate a signed URL using Supabase Storage or AWS S3
    // For now, we'll create a mock signed URL
    
    const timestamp = Date.now();
    const expiry = timestamp + (expiresIn * 1000);
    const signature = Buffer.from(`${filePath}:${expiry}`).toString('base64');
    
    return {
      url: `${config.baseUrl}/secure-file/${signature}`,
      expiresAt: new Date(expiry)
    };
  }
  
  // Verify a signed URL
  static verifySignedUrl(signature) {
    try {
      const decoded = Buffer.from(signature, 'base64').toString('utf-8');
      const [filePath, expiry] = decoded.split(':');
      
      // Check if the URL has expired
      if (Date.now() > parseInt(expiry)) {
        return { valid: false, error: 'URL has expired' };
      }
      
      return { valid: true, filePath };
    } catch (error) {
      return { valid: false, error: 'Invalid signature' };
    }
  }
  
  // Get file path from signed URL
  static getFilePathFromSignature(signature) {
    const verification = this.verifySignedUrl(signature);
    if (verification.valid) {
      return verification.filePath;
    }
    return null;
  }
}

module.exports = FileService;