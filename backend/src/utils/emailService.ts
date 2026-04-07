import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send order confirmation email
export const sendOrderConfirmation = async (
  to: string,
  customerName: string,
  orderId: string,
  orderDetails: any
) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Cake Delivery" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Order Confirmation - #${orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #db2777, #ec4899); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            .button { display: inline-block; background: #db2777; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            h1 { margin: 0; font-size: 28px; }
            .greeting { font-size: 18px; margin-bottom: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎂 Order Confirmed!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your purchase</p>
            </div>
            
            <div class="content">
              <p class="greeting">Dear ${customerName},</p>
              
              <p>Great news! Your order has been confirmed and is being processed.</p>
              
              <div class="order-details">
                <h2 style="margin-top: 0; color: #db2777;">Order Details</h2>
                <p><strong>Order Number:</strong> #${orderId}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> $${orderDetails.totalPrice.toFixed(2)}</p>
                
                <h3 style="margin-top: 20px; color: #db2777;">Items Ordered:</h3>
                <ul>
                  ${orderDetails.items.map((item: any) => 
                    `<li>${item.cake.name} × ${item.quantity} - $${(item.cake.price * item.quantity).toFixed(2)}</li>`
                  ).join('')}
                </ul>
                
                <h3 style="margin-top: 20px; color: #db2777;">Delivery Address:</h3>
                <p>
                  ${orderDetails.shippingAddr.street}<br>
                  ${orderDetails.shippingAddr.city}, ${orderDetails.shippingAddr.postalCode}
                </p>
                
                <h3 style="margin-top: 20px; color: #db2777;">Expected Delivery:</h3>
                <p>${new Date(orderDetails.deliveryDate).toLocaleDateString()}</p>
              </div>
              
              <p>We'll send you another email when your order ships!</p>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${orderId}" class="button">
                  Track Your Order
                </a>
              </div>
              
              <p style="margin-top: 20px;">If you have any questions, please don't hesitate to contact us.</p>
              
              <p>Happy baking!<br>
              <strong>The Cake Delivery Team</strong></p>
            </div>
            
            <div class="footer">
              <p>© 2024 Cake Delivery. All rights reserved.</p>
              <p>This email was sent to ${to}</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
};

// Send welcome email after registration
export const sendWelcomeEmail = async (to: string, customerName: string) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Cake Delivery" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Welcome to Cake Delivery! 🎂',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #db2777, #ec4899); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Cake Delivery!</h1>
            </div>
            
            <div class="content">
              <p>Dear ${customerName},</p>
              
              <p>Welcome to our cake delivery family! We're excited to have you on board.</p>
              
              <p>You can now:</p>
              <ul>
                <li>Browse our delicious cake collection</li>
                <li>Place orders with ease</li>
                <li>Track your orders in real-time</li>
                <li>Save your favorite cakes</li>
              </ul>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
                   style="display: inline-block; background: #db2777; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
                  Start Shopping
                </a>
              </p>
              
              <p>Use your registered email to login and start exploring our delicious offerings!</p>
              
              <p>Happy shopping!<br>
              <strong>The Cake Delivery Team</strong></p>
            </div>
            
            <div class="footer">
              <p>© 2024 Cake Delivery. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

// Send order status update email
export const sendOrderStatusUpdate = async (
  to: string,
  customerName: string,
  orderId: string,
  newStatus: string
) => {
  try {
    const transporter = createTransporter();

    const getStatusEmoji = (status: string) => {
      switch (status) {
        case 'processing': return '⚙️';
        case 'shipped': return '📦';
        case 'delivered': return '✅';
        case 'cancelled': return '❌';
        default: return '📋';
      }
    };

    const mailOptions = {
      from: `"Cake Delivery" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Order Update - #${orderId} is now ${newStatus}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #db2777, #ec4899); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .status-badge { background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; margin: 20px 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${getStatusEmoji(newStatus)} Order Update</h1>
            </div>
            
            <div class="content">
              <p>Dear ${customerName},</p>
              
              <p>Your order <strong>#${orderId}</strong> status has been updated:</p>
              
              <div style="text-align: center;">
                <span class="status-badge">${newStatus.toUpperCase()}</span>
              </div>
              
              ${newStatus === 'delivered' ? 
                '<p style="color: #059669; font-weight: bold;">🎉 Enjoy your cake! We hope it brings sweetness to your celebration!</p>' : 
                ''}
              
              ${newStatus === 'shipped' ? 
                '<p>Your order is on its way! Keep an eye out for the delivery.</p>' : 
                ''}
              
              <p>You can always check your order status by logging into your account.</p>
              
              <p>Thank you for choosing Cake Delivery!</p>
              
              <p>Best regards,<br>
              <strong>The Cake Delivery Team</strong></p>
            </div>
            
            <div class="footer">
              <p>© 2024 Cake Delivery. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order status update email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending order status update email:', error);
    return false;
  }
};
