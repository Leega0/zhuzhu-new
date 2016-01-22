
var $shadow = null,
    $lotterBtn = $('#lottery_btn'),
    isMove = false,
    count = 1,
    startLotter,
    cycle = 0,
    speed = 70;

//闪动阴影函数
  function goNext(number) {
    $shadow.appendTo($('.prize-number-'+number));
  }
//抽奖动作函数
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
          //如果中的是实物，则跳转中奖地址
       if(pPhy==1){
              phyPox = $.dialog('.lottery-award-dialog', {
                isBtn: false
              });
              $(".ui-dialog").addClass('ui-dialog-success');
              $("#lottery_award_content").html(prizeName);

              $("#phy_award_btn").removeClass('ui-hide').attr('href',pUrl).html("知道了").prev("a").remove()
          }else{
              $.dialog('.lottery-award-dialog', {
                isBtn: false
              });
              $(".ui-dialog").addClass('ui-dialog-success')
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
      $(".ui-dialog").addClass('ui-dialog-fail');
      $("#lottery_award_content").html("您今天的抽奖机会已用完（每个用户每天限1次），明天再来。");
      $(".ui-dialog-btn-submit").html("知道了");
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
               pUrl = '//'+data.prizePUrl;
               pPhy = data.prizePhy;
               prizePrice = data.prizePrice;
               
              if($shadow == null) {
              $('.prize-lotter-item:first').append('<div class="prize-lotter-shadow" id="prize-lotter-shadow"></div>');
              $shadow = $('#prize-lotter-shadow');
            }
            
            startLotter = setInterval(lotter,speed);
            timeC.text(timeC.text()-1);
             
            }else if(code == "-1") {
              alert(data.errMsg);
              return ;
            }else {
              alert("系统繁忙,请稍候再试..")
              return ;
            }       
         }
      });
     }  
  });
// 中奖用户信息滚动

var speed=30;
var scrollWrap=document.getElementById("award_list_wrap");
var scrollOne=document.getElementById("award_list_origin");
var scrollTwo=document.getElementById("awrad_list_clone");
scrollTwo.innerHTML=scrollOne.innerHTML;

function Marquee(){
  if (scrollTwo.offsetWidth-scrollWrap.scrollLeft<=0) {
    scrollWrap.scrollLeft-=scrollOne.offsetWidth;
  } else {
    scrollWrap.scrollLeft++;
  }
}
// Marquee();
 var MyMar = setInterval(Marquee,speed);


