export const otpVerificationTemplate = `


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Account</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7f6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { font-size: 24px; color: #4A90E2; margin: 0; letter-spacing: 1px; }
        .content { text-align: center; line-height: 1.6; }
        .otp-box { background: #f0f4f8; border-radius: 8px; padding: 20px; margin: 25px 0; font-size: 32px; font-weight: bold; color: #2c3e50; letter-spacing: 8px; border: 1px dashed #4A90E2; }
        .footer { margin-top: 30px; text-align: center; font-size: 13px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
        .btn { display: inline-block; padding: 12px 24px; background: #4A90E2; color: white !important; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>BlogYourWay</h1>
        </div>
        <div class="content">
            <p>Hi there,</p>
            <p>Please use the following One-Time Password (OTP) to verify your account. This code is valid for 10 minutes.</p>
            
            <div class="otp-box">
                {OTP}
            </div>

            <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            &copy; 2026 The Unfolding. All rights reserved.
        </div>
    </div>
</body>
</html>
`