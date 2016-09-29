/**
 * Created by viabrema on 02/11/2015.
 */

 $backspaceActive = false;

$.clickOrTouch = (('ontouchend' in window)) ? 'touchend' : 'click';

$.arrRemove = function(arr, index) {
    arr.splice(index,1);
    return arr;
};

$.fn.getValue = function(){
    var value;
    if($(this).val()){
       value = $(this).val();
    }else{
        value = $(this).attr("data-val");
    }
    return value;
};

$.fn.evt = function(event, call, self){

    if(event == "click"){
        event = $.clickOrTouch;
    }

    $(this).off(event);

    $(this).on(event, {self: self},  call);
    return this;
};

$.fn.cond = function(cond,call,call2){
    if(cond){
        if(typeof call == 'function') {
            call($(this));
        }
    }else{
        if(typeof call2 == 'function') {
            call2($(this));
        }
    }
    return this;
};


$.fn.condAddClass = function(cond, class1, class2){
    if(cond){
        $(this).addClass(class1);
    }else{
        if(class2){
            $(this).addClass(class2);
        }
    }
    return this;
};

$.getContext = function(sel, call){
    var x = $(sel), y = {};
    if(x.length == 0) return;
    x.find("[data-evt]").each(function(){
        y[$(this).data("evt")] = $(this);
    });
    call(y, x);
};

$.fn.fnd = function(sel, str){
    var sel = $(this).find(sel);
    if(typeof  str == "function"){
        srt(sel);
    }
    if(typeof str == "string"){
        sel.html(str);
    }
    return this;
};

$.fn.bindData = function(data, call){
    var k, item, template;
    if($(this).data("template")){
        template = $(this).data("template");
    }else{
        template = $(this).html();
        $(this).data("template", template);
    }
    $(this).html("");
    for(k in data){
        item = call(template, data[k]);
        item.appendTo($(this));
    }
    return this;
};

$.foreach = function(arr, call){
    var x;
    for(x in arr){
        call(x, arr[x]);
    }
};

$.replace = function(str, find, replace) {
    return str.split(find).join(replace);
};

$.random = function(n1, n2){
    return Math.floor((Math.random() * n2) + n1);
};

$.fn.bgImg = function(url, repeat, size, position){
    $(this).css("background-image",'url("'+ url +'")');
    if(repeat){
        $(this).css("background-repeat", repeat);
    }
    if(size){
        $(this).css("background-size", size);
    }
    if(position){
        $(this).css("background-position", position);
    }
    return this;
};

$.shuffle = function(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

$.fn.setTabs = function(){
    var tabs = $("<ul />").addClass("links"), index, label, group, disabled = false;
    $(this).find("[data-tab]").each(function(){
        index = $(this).data("tab");
        label =  $(this).data("label");
        disabled = $(this).hasClass("disabled");
        $("<li />").condAddClass($(this).hasClass("selected"),"selected")
            .condAddClass(disabled,"disabled")
            .html(label)
            .attr("data-link", index)
            .appendTo(tabs)
            .evt("click",function(){
                if ($(this).hasClass("disabled")) {
                    return;
                }
                index = $(this).data("link");
                group = $(".tabs-group").has($(this));
                group.find("[data-link]").removeClass("selected");
                $(this).addClass("selected");
                group.find("[data-tab]").removeClass("selected");
                group.find("[data-tab="+ index +"]").addClass("selected");
            });
    });
    tabs.prependTo($(this));
    return this;
};

$.alert = function(obj){

    var buttons, alert, msg, content, title, inner;

    $(".alert").remove();

    alert = $("<div />").addClass("alert").appendTo("#all");
    msg = $("<div />").addClass("msg").appendTo(alert);
    content = $("<div />").addClass("content").appendTo(msg);
    title = $("<div />").addClass("title").appendTo(content);
    inner = $("<div />").addClass("inner").appendTo(content);
    $("<span />").addClass("cell").html(obj.title).appendTo(title);
    $("<span />").addClass("cell").html(obj.msg).appendTo(inner);

    if(obj.option1 || obj.option2){
        buttons = $("<div />").addClass("buttons").appendTo(content);
        if(obj.option1){
            $("<a />").html(obj.option1.label).appendTo(buttons).evt("click",function(){
                obj.option1.call(alert);
            });
        }
        if(obj.option2){
            $("<a />").html(obj.option2.label).appendTo(buttons).evt("click",function(){
                obj.option2.call(alert);
            });
        }
    }
};

$.msg = function(msg, type){
    var box;

    box = $("<div />").addClass("alert-msg").condAddClass(type,type).html(msg).appendTo("#all");

    setTimeout(function(){

        box.animate({"opacity": "0"}, 1000, function(){
            $(this).remove();
        });
    },2000);
};

$.fn.checkbox = function(){
    $(this).find("li").evt("click", function(){
        $(this).toggleClass("selected");
    });
};

$(window).on('hashchange',function(){
    var x = location.hash, y = x.split("/"), route = $.replace(y[0], "#", "");
    if(!$factory.preventChangeHash) {
        if(typeof $routes[route] === "function"){
            $routes[route](y);
        }else {
            $routes["init"]();
        }
    }
});

$(window).on('load',function(){
    var x = location.hash, y = x.split("/"), route = $.replace(y[0], "#", "");
    if(typeof $routes[route] === "function"){
        $routes[route](y);
    }else {
        $routes["init"]();
    }
});

$.fn.getFile = function(call) {
    var x, _this = $(this);
    $(this).evt("click",function(){
        $(".filetemp").remove();
        x = $("<input />").addClass("filetemp").attr("type","file").css("display","none").appendTo("body");
        x.change(function(e){
            var reader = new FileReader();
            reader.onload = function (e) {
               call(e.target.result, _this);
               x.remove();
            }
            reader.readAsDataURL(this.files[0]);
        });
        x.click();
    });
};

$.popup = function(call){
    var buttons, popup, title, inner, close, overContent;
    $(".popup").remove();

    popup   = $("<div />").addClass("popup").appendTo("#all");
    content = $("<div />").addClass("content").appendTo(popup);
    inner   = $("<div />").addClass("inner-popup").appendTo(content);

    close = $("<span />").addClass("close").click(function() {
        $(".popup").remove();
    });

    content.mouseover(function() { overContent = true }).mouseout(function() { overContent = false });
    popup.click(function () {
        if (!overContent) {
            $(".popup").remove();
        }
    });

    close.appendTo(content);
    if(typeof call == "function"){
        call(inner, popup);
    }
};

$.curtain = function(call, sel){
    var buttons, popup, title, inner, close, overContent;
    $(".popup").remove();
    popup = $("<div />").addClass("curtain").addClass("popup");

    if(sel){
        popup.appendTo(sel);
    }else{
        popup.appendTo("#all");
    }

    content = $("<div />").addClass("content").appendTo(popup);
    inner   = $("<div />").addClass("inner-popup").appendTo(content);
    close   = $("<span />").addClass("close").appendTo(content);

    close = $("<span />").addClass("close").click(function() {
        $(".popup").remove();
    });

    content.mouseover(function() { overContent = true }).mouseout(function() { overContent = false });
    popup.click(function () {
        if (!overContent) {
            $(".popup").remove();
        }
    });

    close.appendTo(content);

    if(typeof call == "function"){
        call(inner, popup);
    }
};

$.processingImage = function(base64, call, config){
    var canvas, table, context, imageObj, handle, wind;
    table = $("<div />")
    .css("width", "100%")
    .css("height","100%")
    .css("box-sizing","bordr-box")
    .css("border","solid 2px #000")
    .css("background-image","url(img/png-background.png)");

    image = $("<img />").appendTo(table);

    if(!config){
        config = {};
        config.ratio = 3/4;
    }

    handle = $("<div />")
    .css("width", "300")
    .css("position", "absolute")
    .css("height","400")
    .css("top", "10px")
    .css("left", "10px")
    .css("box-sizing","border-box")
    .css("border","dotted 2px #fff")
    .css("box-shadow","2px 2px rgba(0,0,0,0.3)")
    .css("z-index","1")
    .draggable({
        containment: "parent"
    })
    .resizable({
        aspectRatio: config.ratio,
        containment: "parent"
    })
    .appendTo(table);




    $.popup(function(inner, obj){
        wind = obj;
        inner.html(table);
     });

    /*


     context = canvas[0].getContext('2d'),

    */
    imageObj = new Image();

     imageObj.onload = function() {
        var w = imageObj.width, h = imageObj.height, scale, p, cw = table.width(), ch = table.height();

        image.attr("src", imageObj.src).cond(ch>cw,function(){
            image.css("width","100%");
        }, function(){
            image.css("height","100%");
        });

        if(cw>ch){
            p = (ch * 100) / h;
        }else{
            p = (cw * 100) / w;
        }
        scale = 1 - ((100 - p) /100) ;

        table.dblclick(function(){
           canvas = $('<canvas width="'+ (handle.width()) +'" height="'+ (handle.height()) +'" />');
           context = canvas[0].getContext('2d'),
           //canvas.appendTo("table");


           context.drawImage(
            imageObj,
            handle.position().left / scale,
            handle.position().top / scale,
            w,
            h,
            0,
            0,
            w * scale,
            h * scale);

           call(canvas[0].toDataURL());
           wind.remove();
        });

     };

     imageObj.src = base64;
};

$.webCam = function(call){

    var vd = $('<video width="100%" height="100%" style="margin: 0 auto" autoplay></video>'),
    cv = $('<canvas id="canvas" width="640" height="480"></canvas>'),
    canvas = cv[0],
    context = canvas.getContext("2d"),
    video = vd[0],
        videoObj = { "video": true },
        errBack = function(error) {
            console.log("Video capture error: ", error.code);
        };

        // Put video listeners into place
        if(navigator.getUserMedia) { // Standard
            navigator.getUserMedia(videoObj, function(stream) {
                video.src = stream;
                video.play();
            }, errBack);
        } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
            navigator.webkitGetUserMedia(videoObj, function(stream){
                video.src = window.webkitURL.createObjectURL(stream);
                video.play();
            }, errBack);
        }
        else if(navigator.mozGetUserMedia) { // Firefox-prefixed
            navigator.mozGetUserMedia(videoObj, function(stream){
                video.src = window.URL.createObjectURL(stream);
                video.play();
            }, errBack);
        }



    $.popup(function(inner, obj){
        wind = obj;
        inner.html(vd);
        //inner.append(cv);
        inner.evt("dblclick",function(){

            context.drawImage(video, 0, 0, 640, 480);
            $.processingImage(canvas.toDataURL(),function(base64){
                call(base64);
            });


        });
     });
}

$.formatDate = function(strDate,formatIn,formatOut) {
    return moment(strDate, formatIn).format(formatOut);
};

$(document).delegate("input, textarea","focus",function(e){
    $backspaceActive = true;
});

$(document).delegate("input, textarea","blur",function(e){
    $backspaceActive = false;
});

$(document).keydown(function(e){
    if(e.which == 8){
        if(!$backspaceActive){
            event.preventDefault();
        }
    }
})
