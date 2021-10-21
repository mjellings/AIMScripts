async function grabSales() {

    if (typeof jQuery == 'undefined') {
      var script_jQuery = document.createElement('script');
      script_jQuery.src = 'https://code.jquery.com/jquery-latest.min.js';
      script_jQuery.onload = openModal;
      document.body.appendChild(script_jQuery);
    }
  
    function openModal(params) {
      $('body').append(`
      <div id="myModal" class="modal" style="display: block; position: fixed; /*! padding-top: 100px; */ left: 0px; top: 20vh; width: 100%; height: 100%; overflow: auto; background-color: rgba(0, 0, 0, 0.4); z-index: 2147483647;">
    
      <div class="modal-content" style="background-color: #424242;  margin: auto;  padding: 20px;  border: 1px solid #888;  width: 50%;">
        <span class="close" style="color: #aaaaaa;  float: right;  font-size: 28px;  font-weight: bold;">&times;</span>
        <div id="modalText"></div>
      </div>
    
    </div>
      `);
    
      $('#myModal').css("display","block");
    }
  
    
  
      sales = [];
      cashbackServices = [];
      count = 0;
      header = { "page":1,"limit":10,"userLang":"en" };
  
      await fetch('https://ai.marketing/service/api/v1/user/robot/stat/sales/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(header),
      })
      .then(response => response.json())
      .then(data => {
          count = data.data.count;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  
      const timer = ms => new Promise(res => setTimeout(res, ms))
  
      async function getSales() {
         limit = 20; // Should be 10, but for now we're allowed to use 20 :Shrug:
          for (let index = 1; index < Math.ceil(count/limit)+1; index++) {
              $('#modalText').html(`
    <p>Please do not close this modal, refresh the page (Including auto refresh) or browser Ai.Marketing even in another tab whilst the sales table is generating</p>
    <p>Current Progress: `+index +"/" +Math.ceil(count/limit)+`</p>
    <p>Time Remaining: `+(Math.ceil(count/limit) - index)+` Seconds</p>
    <p>Once finished it'll open the table in a new tab</p>
    `);
              await timer(1000);
              header = { "page":index,"limit":limit,"userLang":"en" };
      
          await fetch('https://ai.marketing/service/api/v1/user/robot/stat/sales/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(header),
          })
          .then(response => response.json())
          .then(data => {
              sales.push(data.data.list);
              cashbackServices.push(data.data.servicesCashBack);
              // console.log(data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });  
                 
          }
      }
  
     await getSales();
     $('#myModal').css("display","none");
     sales = sales.flat(1);
     cashbackServices = Object.assign(...cashbackServices);
     localStorage.setItem("sales", JSON.stringify(sales));
     localStorage.setItem("cashbackServices", JSON.stringify(cashbackServices));
     var opened = window.open("");
  opened.document.write(`
  <!DOCTYPE html>
  <html>
  <head>
  
      <title> Sales Table</title>
  <style>
      body{
          background-color: #f5f5f5 !important;
      }
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }
  
  td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
  
  tr:nth-child(even) {
    background-color: #dddddd;
  }
  </style>
  </head>
  <body>
  
  <div class="ui equal width grid container">
      <div class="row"></div>
  <div class="column" id="oldbotunpaidcol">
  
  <div class="ui statistic">
  <div class="label">
    Old bot unpaid cashback
  </div>
  <div class="value" id="oldbotunpaid">
  </div>
  </div>
  
  </div>
  
    <div class="column">
  
    <div class="ui statistic">
    <div class="label">
      Overdue Cashback
    </div>
    <div class="value" id="overduecashback">
    </div>
    </div>
  
    </div>
  
    <div class="column">
  
    <div class="ui statistic">
    <div class="label">
      Cashback due < 7 Days
    </div>
    <div class="value" id="cashbackduelessthan7days">
    </div>
    </div>
  
    </div>
  
    <div class="column">
    <div class="ui statistic">
    <div class="label">
      Average days left
    </div>
    <div class="value" id="averagedaysleftvalue">
    </div>
  </div>
    </div>
  
  </div>
  
  <div class="ui  grid">
  
  <div class="one wide column"></div>
  <div class="fourteen wide column">
  <table id="table" class="ui striped compact table">
  <thead>
    <tr>
      <th>Date of sale</th>
      <th>Aggregator</th>
      <th>Sale amount</th>
      <th>Ð¡ashback rate</th>
      <th>Cashback(Your 55%)</th>
      <th>Deduction(AIM's 45%)</th>
      <th>Wait Time</th>
      <th>Status</th>
      <th>Estimated Days Left</th>
    </tr>
    </thead>
    <tbody id="tbody">
    </tbody>
    <tfoot>
              <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
              </tr>
          </tfoot>
    
  </table>
  </div>
  <div class="one wide column"></div>
  
  
  </div>
  
  <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js"></script>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.8/dist/semantic.min.css">
  <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.8/dist/semantic.min.js"></script>
  
  <!-- <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.0/css/jquery.dataTables.css"> -->
  <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.11.0/js/jquery.dataTables.js"></script>
  
  <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.1/css/dataTables.semanticui.min.css">
  <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.11.1/js/dataTables.semanticui.min.js"></script>
  
  
  
  
  
  <script src="https://oce3d.com/aimscripts/addToTable.js?rndstr=`+Math.floor(Math.random() * 1000000000000)+`"></script>
  <script data-domain="oce3d.com" src="https://plausible.io/js/plausible.js"></script>
  <script>
  sales = JSON.parse(localStorage.getItem("sales"));
  cashbackServices = JSON.parse(localStorage.getItem("cashbackServices"));
  addToTable();
  
  
  
  
  </script>
  </body>
  </html>
  `);
  
  
  
  }