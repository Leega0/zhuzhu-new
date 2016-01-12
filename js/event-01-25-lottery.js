var $shadow = null,
        $lotterBtn = $('#lottery_btn'),
        isMove = false,
        count = 1,
        startLotter,
        cycle = 0,
        speed = 100;

    function goNext(number) {
        $shadow.appendTo($('.prize-number-'+number));
    }

    function lotter() {
        if(count == 8) {
            count = 1;
            cycle++;
        } else {
            count++;
        }

        if(cycle > 1) {
            clearInterval(startLotter);
            if(speed > 150 && count < (lotterNum - 3)) {
                speed = 360;
            } else {
                speed += 20;
            }
            
           if(speed > 350 && count == lotterNum) {
                goNext(count);
                setTimeout(function() {
                count = 1,cycle = 0,speed = 70;
                isMove = false;
             if(pPhy==1){
                    phyPox = $.dialog('.lottery-award-dialog', {
                      isBtn: false
                    });
                    
                    $('#phyPox').find('img').attr('src',pUrl);
                    $('#phyPrize').html(prizeName);                    
                }else{
                    $.dialog('.lottery-award-dialog', {
                      isBtn: false
                    });
                    }
                }, 500);
                return false;
            }
            setTimeout(lotter,speed);
        }
        goNext(count);
    }
// start
var normalPox;  
  var phyPox; 
  var recordPagei;
  var id;
  var prizeName;
  var prizeCode;
  var prizePrice;
  var lotterNum = null ;
  var pUrl;
  var pPhy;
  $lotterBtn.on('click',function() {
    if(!true){
      alert("本次抽奖已结束。敬请期待下次抽奖活动");
      return ;
    }
    
  var timeC = $("#timeC"); 
    
    if(timeC.text()<1&&!isMove){
      $.dialog('.lottery-award-dialog', {
                      isBtn: false
                    });
      $("#test_content").html("对不起，抽奖次数已用完")
      return ;
    }
    
  /**
    *抽奖
    */
    if(isMove) {
      //用户多次点击 不进行处理
    }else{
      isMove = true;
    $.ajax({
         // type: "POST",
         // url: "/luckyDraw/getPrize.jhtml?t="+Math.random(),
         type:"GET",
         url:"event-01-25-lotteryaward.json",
         async: true,
         dataType: "json",
         success: function(data){ 
            var code = data.code;
            if(code == "0") {
               id = data.pId;
               prizeName = data.prizeName;
               lotterNum = data.index;
               pUrl = "/"+data.prizePUrl;
               pPhy = data.prizePhy;
               prizePrice = data.prizePrice;
               
               /* console.log(lotterNum); */
              if($shadow == null) {
              $('.prize-lotter-item:first').append('<div class="prize-lotter-shadow" id="prize-lotter-shadow"></div>');
              $shadow = $('#prize-lotter-shadow');
            }
            
            startLotter = setInterval(lotter,speed);
            timeC.text(timeC.text()-1);
             
            }else if(code == "-1") {
              layer.msg(data.errMsg);
              return ;
            }else {
              layer.msg("系统繁忙,请稍候再试..")
              return ;
            }       
         }
      });
     }  
  });
