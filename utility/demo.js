import axios from 'axios';
export const sendOTP = async() =>{ 

      try{
        var data = JSON.stringify({
            "messages": [
              {
                "channel": "sms",
                "recipients": [
                  "+8801828123264",
                  "+8801828123264"
                ],
                "content": "Greetings from Farmex.",
                "msg_type": "text",
                "data_coding": "text"
              }
            ],
            "message_globals": {
              "originator": "Farmex",
              "report_url": "https://the_url_to_recieve_delivery_report.com"
            }
          });
          
          var config = {
            method: 'post',
            url: 'https://api.d7networks.com/messages/v1/send',
            headers: { 
              'Content-Type': 'application/json', 
              'Accept': 'application/json', 
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoLWJhY2tlbmQ6YXBwIiwic3ViIjoiNTc2MDI0NTYtZTYzMC00NDI5LThiYzQtNjI4YzQzZTE5MmQyIn0.iswdtrA09BBOBW5WVs8hmKM6QNo3Nmz3nsUHKSP19Gg'
            },
            data : data
          };
          const response = await axios(config);
          console.log(JSON.stringify(response.data));
      } catch(error) {
          console.log(error);
      }

        
    //   axios(config)
    //   .then(function (response) {
    //     console.log(JSON.stringify(response.data));
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
}