
const crypto = require('crypto');
const Order = require('../model/Orders');
const User = require('../model/Users');


const payment =async (req, res) => {
  console.log(req.body);
    let salt_key="96434309-7796-489d-8924-ab56988a6076"
    let key_index=1;
    let merchant_id="PGTESTPAYUAT86"
     const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"
    try {
const order=await Order.create({
      userId: req.body.userId,
      courseId: req.body.courseId,
      amount: req.body.amount,
      transactionId: req.body.transactionId,
      status: 'PENDING'
    });

          const data = {
            merchantId: merchant_id,
            merchantTransactionId: req.body.transactionId,
            merchantUserId: req.body.MUID,
            name: req.body.name,
            amount: req.body.amount * 100,
            redirectUrl: `http://localhost:3000/api/order/status/?id=${req.body.transactionId}`,
            redirectMode: 'POST',
            mobileNumber: req.body.number,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };
        const payload = JSON.stringify(data);
        const payloadMain= Buffer.from(payload).toString('base64');
        const string=payloadMain+'/pg/v1/pay'+salt_key;
        const sha256= crypto.createHash('sha256').update(string).digest('hex');
        const checksum=sha256+'###'+key_index;
       const options = {
  method: 'POST',
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'X-VERIFY': checksum
  },
  body: JSON.stringify({
    request: payloadMain
  })
};

await fetch(prod_URL, options)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTT1P error! status: ${response.status}`);
    }
   
    return response.json();
  })
  .then(data => {
    console.log(data);
    return res.json(data);
  })
  .catch(error => {
    console.error('Error:', error);
    
    res.status(500).json({ error: error.message });
  });
        
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({ message: 'Payment processing failed' });
        
    }
}


const status = async (req, res) => {
      let salt_key="96434309-7796-489d-8924-ab56988a6076"
   let merchant_id="PGTESTPAYUAT86"
    try {

      


        const merchantTransactionId = req.query.id
    const merchantId = merchant_id

    const order = await Order.findOne({transactionId: merchantTransactionId})
      .populate('userId')
      .populate('courseId');

    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;

    const options = {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'X-VERIFY': checksum,
    'X-MERCHANT-ID': merchantId
  }
};

// CHECK PAYMENT STATUS
await fetch(`https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`, options)
  .then(async (response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
   
    
    if (data.success === true) {
        order.status = 'SUCCESS';
      await order.save();

      await User.findByIdAndUpdate(
        order.userId,
        { $addToSet: { purchasedCourses: order.courseId } }
      );

      const url = `http://localhost:5173/payment?status=success&courseId=${order.courseId}`;
      return res.redirect(url);
    } else {
      const url = `http://localhost:5173/payment?status=failed`;
      return res.redirect(url);
    }
  })
  .catch((error) => {
    console.error('Error checking payment status:', error);
    // You might want to redirect to failure page here as well
    const url = `http://localhost:5173/failure`;
    return res.redirect(url);
  });

        
    } catch (error) {
        console.error('Payment status error:', error);
        res.status(500).json({ message: 'Failed to retrieve payment status' });
        
    }
}

module
.exports = {
    payment,
    status
};