function goNext(e){$shadow.appendTo($(".prize-number-"+e))}function lotter(){if(8==count?(count=1,cycle++):count++,cycle>1){if(clearInterval(startLotter),speed>150&&lotterNum-3>count?speed=360:speed+=20,speed>350&&count==lotterNum)return goNext(count),setTimeout(function(){count=1,cycle=0,speed=70,isMove=!1,1==pPhy?(phyPox=$.dialog(".lottery-award-dialog",{isBtn:!1}),$("#phyPox").find("img").attr("src",pUrl),$("#phyPrize").html(prizeName)):$.dialog(".lottery-award-dialog",{isBtn:!1})},500),!1;setTimeout(lotter,speed)}goNext(count)}var $shadow=null,$lotterBtn=$("#lottery_btn"),isMove=!1,count=1,startLotter,cycle=0,speed=100,normalPox,phyPox,recordPagei,id,prizeName,prizeCode,prizePrice,lotterNum=null,pUrl,pPhy;$lotterBtn.on("click",function(){if(0)return void alert("本次抽奖已结束。敬请期待下次抽奖活动");var e=$("#timeC");return e.text()<1&&!isMove?($.dialog(".lottery-award-dialog",{isBtn:!1}),void $("#test_content").html("对不起，抽奖次数已用完")):void(isMove||(isMove=!0,$.ajax({type:"GET",url:"event-01-25-lotteryaward.json",async:!0,dataType:"json",success:function(t){var r=t.code;return"0"!=r?"-1"==r?void layer.msg(t.errMsg):void layer.msg("系统繁忙,请稍候再试.."):(id=t.pId,prizeName=t.prizeName,lotterNum=t.index,pUrl="/"+t.prizePUrl,pPhy=t.prizePhy,prizePrice=t.prizePrice,null==$shadow&&($(".prize-lotter-item:first").append('<div class="prize-lotter-shadow" id="prize-lotter-shadow"></div>'),$shadow=$("#prize-lotter-shadow")),startLotter=setInterval(lotter,speed),e.text(e.text()-1),void 0)}})))});