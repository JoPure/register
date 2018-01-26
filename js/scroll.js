var timer;
var addMouseWheelHandler = function () {
        if (document.addEventListener) {
            document.addEventListener('mousewheel', MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
            document.addEventListener('wheel', MouseWheelHandler, false); //Firefox
            document.addEventListener('DOMMouseScroll', MouseWheelHandler, false); //Old Firefox
        } else {
            document.attachEvent('onmousewheel', MouseWheelHandler); //IE 6/7/8
        }
    },
    removeMouseWheelHandler = function () {
        if (document.addEventListener) {
            document.removeEventListener('mousewheel', MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
            document.removeEventListener('wheel', MouseWheelHandler, false); //Firefox
            document.removeEventListener('DOMMouseScroll', MouseWheelHandler, false); //old Firefox
        } else {
            document.detachEvent('onmousewheel', MouseWheelHandler); //IE 6/7/8
        }
    },
    stopDefault = function (e) {
        //W3C
        if (e && e.preventDefault)
            e.preventDefault();
        //IE
        else
            window.event.returnValue = false;
        return false;
    },

    MouseWheelHandler = function (e) {//滚动后的处理函数
        stopDefault(e);
        var e = e || window.event,
            value = e.wheelDelta || -e.deltaY || -e.detail,
            delta = Math.max(-1, Math.min(1, value));
        if (delta < 0) {
            //scrolling down
            // slideDown();
            clearTimeout(timer)
            timer = setTimeout(function () {
                slideDown();
            }, 100);

        } else {
            //scrolling up
            // slideUp();
            clearTimeout(timer)
            timer = setTimeout(function () {
                slideUp();
            }, 100);
        }
    };

//调用
addMouseWheelHandler();

var page = sessionStorage.getItem("page");
if (!page) {
    page = 1;
}
$("html, body").animate({
    scrollTop: $(".section-" + page).offset().top
}, 800);

function slideUp() {
    if (page == 1) {
        return;
    } else {
        page--;
    }
    $("html, body").animate({
        scrollTop: $(".section-" + page).offset().top
    }, 800);
    sessionStorage.setItem("page", page);
}

function slideDown() {
    console.log(123);
    if (page == 3) {
        return;
    } else {
        page++;
    }
    $("html, body").animate({
        scrollTop: $(".section-" + page).offset().top
    }, 800);
    sessionStorage.setItem("page", page);
}

$(".res-btn-pc").on("click", function () {
    slideDown();
    fbq('track', 'Lead');
});

$(".pull-down").on("click", function () {
    slideDown();
});

$.loading = {
    PageLoading: function (options) {
        var defaults = {
            delayTime: 500,
            sleep: 0
        };
        var options = $.extend(defaults, options);
        $('head').append(defaults.css);
        document.onreadystatechange = PageLoaded;
        function PageLoaded() {
            var loadingMask = $('.percent');
            var loadingLeft = $(".leftl i");
            var loadingRight = $(".rightl i");
            $({
                property: 0
            }).animate({
                property: 95
            }, {
                duration: 3000,
                step: function () {
                    var percentage = Math.round(this.property);
                    loadingLeft.css('width', percentage + "%");
                    loadingRight.css('width', percentage + "%");
                    loadingMask.text(percentage + "%");
                    //页面加载后执行
                    if (document.readyState == "complete") {
                        loadingLeft.css('width', 50 + "%");
                        loadingRight.css('width', 50 + "%");
                        loadingMask.text(100 + "%");
                        setTimeout(function () {
                                $(".loader-section").animate({
                                        "opacity": 0
                                    },
                                    options.delayTime,
                                    function () {
                                        $(this).remove();
                                        $(".section-1").addClass('active');
                                        $(".load_wrap").remove();
                                        gtag('event', 'page1', {
                                            'event_category': 'page1_category',
                                            'event_label': 'page1_label'
                                        });
                                        console.log('Loading has been successful');
                                    });
                            },
                            options.sleep);
                    }
                }
            });
        }
    }
};

$.loading.PageLoading({
    sleep: 50
});

