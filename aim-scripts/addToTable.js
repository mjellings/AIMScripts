function addToTable() {
    totaldays =0;
    saleswithpositivedays =0;
    cashbackduelessthan7days =0;
    overduecashback =0;
    oldbotunpaid=0;
    oldbotsaleifbefore = new Date('2021-08-18');
  
      for (let index = 0; index < sales.length; index++) {
          
        saleMadeDate = new Date(sales[index].created_at);
        estiamtedpaymentday = saleMadeDate.setDate(saleMadeDate.getDate() + cashbackServices[sales[index].traffic_source_id].payment_delay)
        new Date(estiamtedpaymentday );
        var now = new Date();
        remainingTime = estiamtedpaymentday - now
        var _second = 1000;
        var _minute = _second * 60;
        var _hour = _minute * 60;
        var _day = _hour * 24;
        var timer;
        var daysleft = Math.floor(remainingTime / _day);
        
        $('#tbody').append(`
        <tr>
            <td>${sales[index].created_at}</td>
            <td>${cashbackServices[sales[index].traffic_source_id].site_name}</td>
            <td>$${sales[index].full_buy_sum}</td>
            <td>${sales[index].cashback_percent}%</td>
            <td>$${sales[index].sum}</td>
            <td>$${sales[index].company_revenue_sum}</td>
            <td>~${cashbackServices[sales[index].traffic_source_id].payment_delay} Days</td>
            <td class="${sales[index].status == "WAIT" ? 'warning' : 'positive'}">${sales[index].status == "WAIT" ? 'Pending' : 'Approved'}</td>
            <td class="${sales[index].status == "WAIT" && Math.sign(daysleft) == -1 ? 'warning' : 'positive'}">${daysleft}</td>
          </tr>
        `);
        Math.sign(daysleft) == 1  ? totaldays += daysleft : totaldays += 0
        
        Math.sign(daysleft) == 1  ? saleswithpositivedays += 1 : saleswithpositivedays += 0
        
        Math.sign(daysleft) == 1 && daysleft < 7 ? cashbackduelessthan7days += parseFloat(sales[index].sum) : cashbackduelessthan7days += 0
  
        Math.sign(daysleft) == -1 && sales[index].status == "WAIT" && new Date(sales[index].created_at) > oldbotsaleifbefore ? overduecashback += parseFloat(sales[index].sum) : overduecashback += 0
  
        Math.sign(daysleft) == 0 && sales[index].status == "WAIT" && saleMadeDate > oldbotsaleifbefore ? overduecashback += parseFloat(sales[index].sum) : overduecashback += 0
  
        
        saleMadeDate < oldbotsaleifbefore && sales[index].status == "WAIT" ? oldbotunpaid += parseFloat(sales[index].sum) : oldbotunpaid += 0
        
  
    }
  
    $('#averagedaysleftvalue').text(Math.round(totaldays/saleswithpositivedays));
    $('#cashbackduelessthan7days').text("$"+(cashbackduelessthan7days).toFixed(2));
    $('#overduecashback').text("$"+(overduecashback).toFixed(2));
    $('#oldbotunpaid').text("$"+(oldbotunpaid).toFixed(2));
    
    if(oldbotunpaid <= 0){
      $('#oldbotunpaidcol').hide();
    }
    
  
  
    $('#table').DataTable( {
      scrollY: "60vh",
      paging: false,
      renderer: {
        "header": "semanticui"
                },
      "footerCallback": function ( row, data, start, end, display ) {
              var api = this.api(), data;
              var intVal = function ( i ) {
                  return typeof i === 'string' ?
                      i.replace(/[\$,]/g, '')*1 :
                      typeof i === 'number' ?
                          i : 0;
              };
              
              cashback = api.column( 4 ).data().reduce( function (a, b) {  return intVal(a) + intVal(b); }, 0 );
              cashbackpage = api.column( 4, { page: 'current'} ).data().reduce( function (a, b) { return intVal(a) + intVal(b);}, 0 );
              $( api.column( 4 ).footer() ).html('$'+cashbackpage.toFixed(2) +' ( $'+ cashback.toFixed(2) +' total)');
  
              aimcashback = api.column( 5 ).data().reduce( function (a, b) {  return intVal(a) + intVal(b); }, 0 );
              aimcashbackpage = api.column( 5, { page: 'current'} ).data().reduce( function (a, b) { return intVal(a) + intVal(b);}, 0 );
              $( api.column( 5 ).footer() ).html('$'+aimcashbackpage.toFixed(2) +' ( $'+ aimcashback.toFixed(2) +' total)');
  
              saleamount = api.column( 2 ).data().reduce( function (a, b) {  return intVal(a) + intVal(b); }, 0 );
              saleamountpage = api.column( 2, { page: 'current'} ).data().reduce( function (a, b) { return intVal(a) + intVal(b);}, 0 );
              $( api.column( 2 ).footer() ).html('$'+saleamountpage.toFixed(2) +' ( $'+ saleamount.toFixed(2) +' total)');
  
          }
      } );
  
  
    }