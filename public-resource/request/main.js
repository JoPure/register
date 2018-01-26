/**
 * Created by jo.chan on 2017/11/8.
 */
window.pg_config = {
    status: {
        200: "ยินดีด้วย คุณลงทะเบียนสำเร็จแล้ว",
        1002: "กรุณาอย่าลงทะเบียนหลายครั้ง",
        404: "param_is_null",
        403: "กิจกรรมยังไม่เปิด",
        402: "กิจกรรมสิ้นสุดแล้ว"
    },
    fb_app_id: 350126708743029,
    // api_url: 'http://10.10.3.144:8081',
    actId: '5a1237ec13294f0cf37ed2da',
    groupId: '5a12377213294f0cf37ed2d9',
    api_url: 'https://activity.pocketgamesol.com'
//     api_url: 'http://52.221.145.234:8081'
};

//事件
function addListner() {
    $(".res-success").on("click", function () {
        var num = $(".check-num").val();
        checkMobile(num);
      
    });
    $(".closeBtn").on("click", function () {
        $(".black").hide();
        $(".section-alert-tip").hide();
    });
  
    $(".video-wrap").on("click", function () {
        $(".video").html("").hide();
        $(".black").hide();
        $(".box").hide();
        $(this).hide();
    });
    $(".res-btn-mobile").click(function () {
      
        $("html,body").animate({scrollTop: $("#page2").offset().top}, 800);
    });
    $('#slide3d').slideCarsousel({slideType: '3d', indicatorEvent: 'mouseover'});
    $('#slideBig3d').slideCarsousel({slideType: '3d', indicatorEvent: 'mouseover'});
}

//手机验证
function checkMobile(num) {
    if (num == "") {
        tip("กรุณากรอกเบอร์มือถือ！");
    }
    else {
        var re = /^\d{10}$/;
        if (re.exec(num)) {
            joinActivity();
        } else {
            tip("กรุณากรอกเบอร์มือถือที่ถูกต้อง！");
        }
    }
}
//查人数
function infoActivity() {
    Raven.captureMessage('get join count begin', {
        level: 'info'
    });
    var infoUrl = pg_config.api_url + "/activity/info";
    $.ajax({
        url: infoUrl,
        type: "GET",
        data: {
            actId: pg_config.actId,
            groupId: pg_config.groupId
        },
        success: function (result) {
         
            if (result.code == 200) {
                setCount(result.state.countTimes);
            }
            else {
                tip(pg_config.status[result.code] ? pg_config.status[result.code] : 'request error');
             
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            tip('request error');
        }
    });
}

//预注册
function joinActivity() {
    Raven.captureMessage('put tel num begin', {
        level: 'info'
    });
    var joinUrl = pg_config.api_url + "/activity/advance/join";
    var num = '066-' + $(".check-num").val();
    $.ajax({
        url: joinUrl,
        type: "GET",
        data: {
            actId: pg_config.actId,
            groupId: pg_config.groupId,
            phone: num
        },
        success: function (result) {
           
            if (result.code == 200) {
            
               
                tip(pg_config.status[result.code]);
                infoActivity();
            }
            else if (result.code == 1002) {
         
                tip(pg_config.status[result.code]);
            }
            else {
             
                tip(pg_config.status[result.code] ? pg_config.status[result.code] : 'request error');
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
         
            tip('request error');
        }
    });
}

function setCount(countTimes) {
    var awardUl = $(".award-ul li");
    for (var i = 0; i < awardUl.length; i++) {
        var dataNum = awardUl.eq(i).attr('data-num');
        if (countTimes >= dataNum) {
            awardUl.eq(i).find('div.award-desc').addClass('active');
            awardUl.eq(i).find('div.award-tip').addClass('active');
            awardUl.eq(i).find('div.award-active').addClass('active');
        }
    }
    var k = 0;
    while (countTimes) {
        var num = countTimes % 10;
        $(".list-num li").eq(4 - k).find("span").text(num);
        countTimes = Math.floor(countTimes / 10);
        k++;
    }
}


function tip(tip) {
    $(".black").show();
    $(".section-alert-tip").show();
    $(".alert-tip").text(tip)
}


//youtube
window.videoHtml = '<div id="player"></div>';
$(".playBtn").on("click", function () {
    $(".video-wrap").show();
    $(".black").show();
    $(".video").append(videoHtml).show();
    var player = new YT.Player('player', {
        width: '750',
        height: '468',
        videoId: '_rVkr0PFJVo',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
});

window.tag = document.createElement('script');

tag.src = "http://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.done = false;

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
}

function onPlayerReady(event) {
    event.target.playVideo();
}


function stopVideo() {
    player.stopVideo();
}

function initFbZan() {
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8&appId=" + pg_config.fb_app_id;
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    window.fbAsyncInit = function () {
        FB.init({
            appId: pg_config.fb_app_id,
            xfbml: true,
            version: 'v2.4'
        });
    };
}


window.initMyApp = function () {
    infoActivity();
    initFbZan();
    addListner();
};