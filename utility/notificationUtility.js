

//Generate OTP
export const GenerateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 8000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + 30*60*1000);

    return { otp, expiry };
}

