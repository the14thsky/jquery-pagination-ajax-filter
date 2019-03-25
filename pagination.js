(function($){
    let item_year = $('#item_year');
    let limit = 15;
    let numOfPages = 0;
    let pagesNav = $('.page-list-nav');
    let items = $('.page-list ul li');
    let breakpoint = 8;
    function pagination_init(){
        let pagination = $('.pagination');
        let currentPage = 1;
        let once = true;
        pagination.empty();
        $('<li class="disabled" data-id="prev"><a aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>').appendTo(pagination);
        for(let num=1;num<=numOfPages;num++){
            let navbox = '<li data-id="'+num+'"><a>'+num+'</a></li>';
            if(numOfPages>breakpoint && num>5 && num<numOfPages){
                if(once===true){
                    pagination.append('<li data-id="rightdots"><a class="dots">...</a></li>');
                    once = false;
                }
            }else{
                if(currentPage===num){
                    $(navbox).addClass('active').appendTo(pagination);
                }else{
                    pagination.append(navbox);
                }
            }
        }
        $('<li data-id="next"><a aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>').appendTo(pagination);
    }
    function showlist(current_pageNum) {
        let startrow = (current_pageNum-1) * limit;
        let lastrow = startrow + limit;
        let rows = items;
        rows.hide();
        rows.slice(startrow,lastrow).show();
    }
    function targetPage(current,target){
        current.removeClass('active');
        target.not('.pagination li[data-id=prev],.pagination li[data-id=next]').addClass('active');
    }
    function pagination_click(){
        $(document).on("click",".pagination li",function(){
            let prev = $('.pagination li[data-id=prev]');
            let next = $('.pagination li[data-id=next]');
            let activebox = $('.pagination li[class=active]');
            let target_pageNum = $(this).data('id');
            let current_pageNum = activebox.data('id');
            if(target_pageNum==='next'){
                if(current_pageNum < numOfPages){
                    target_pageNum = current_pageNum + 1;
                }else{
                    target_pageNum = current_pageNum
                }
            }else if(target_pageNum==='prev'){
                if(current_pageNum > 1){
                    target_pageNum = current_pageNum - 1;
                }else{
                    target_pageNum = current_pageNum
                }
            }
            let targetbox = $('.pagination li[data-id='+target_pageNum+']');
            if($.isNumeric(target_pageNum)){
                targetPage(activebox,targetbox);
            }
            if(target_pageNum===1){
                prev.addClass('disabled');
            }else{
                prev.removeClass('disabled');
            }
            if(target_pageNum===numOfPages){
                next.addClass('disabled');
            }else{
                next.removeClass('disabled');
            }
            if(numOfPages>breakpoint){
                let num = null;
                let leftdotbox = $('.pagination li[data-id=leftdots]');
                let rightdotbox = $('.pagination li[data-id=rightdots]');
                let firstbox = $('.pagination li[data-id=1]');
                let lastbox = $('.pagination li[data-id='+numOfPages+']');
                if(targetbox.next().data('id')==='rightdots'){
                    if(target_pageNum===numOfPages-2){
                        num=target_pageNum+1;
                        $('<li data-id="'+num+'"><a>'+num+'</a></li>').insertBefore(rightdotbox);
                    }else{
                        for(num=target_pageNum+1;num<=target_pageNum+2;num++){
                            $('<li data-id="'+num+'"><a>'+num+'</a></li>').insertBefore(rightdotbox);
                        }
                    }
                    if(leftdotbox.length===0){
                        $('.pagination li[data-id=2]').remove();
                        $('<li data-id="leftdots"><a class="dots">...</a></li>').insertAfter(firstbox);
                    }else{
                        for(num=target_pageNum-3;num>target_pageNum-5;num--){
                            $('.pagination li[data-id='+num+']').remove();
                        }
                    }
                    let lastboxNum = numOfPages - 5 + 2;
                    if(lastboxNum<=target_pageNum){
                        num = lastboxNum - 2;
                        $('.pagination li[data-id='+num+']').remove();
                        rightdotbox.remove();
                    }
                }else if(targetbox.prev().data('id')==='leftdots'){
                    if(target_pageNum===3){
                        num=target_pageNum-1;
                        $('<li data-id="'+num+'"><a>'+num+'</a></li>').insertAfter(leftdotbox);
                    }else{
                        for(num=target_pageNum-1;num>=target_pageNum-2;num--){
                            $('<li data-id="'+num+'"><a>'+num+'</a></li>').insertAfter(leftdotbox);
                        }
                    }
                    if(rightdotbox.length===0){
                        num = numOfPages-1;
                        $('.pagination li[data-id='+num+']').remove();
                        $('<li data-id="rightdots"><a class="dots">...</a></li>').insertBefore(lastbox);
                    }else{
                        for (num = target_pageNum + 3; num < target_pageNum + 5; num++) {
                            $('.pagination li[data-id=' + num + ']').remove();
                        }
                    }
                    let firstboxNum = 4;
                    if(firstboxNum>=target_pageNum){
                        num = firstboxNum + 2;
                        $('.pagination li[data-id='+num+']').remove();
                        leftdotbox.remove();
                    }
                }
                if(targetbox.data('id')===1){
                    targetbox.nextAll().not('.pagination li[data-id=next]').not(lastbox).remove();
                    $('<li data-id="rightdots"><a class="dots">...</a></li>').insertBefore(lastbox);
                    for(num=5;num>=2;num--){
                        $('<li data-id="'+num+'"><a>'+num+'</a></li>').insertAfter(firstbox);
                    }
                }else if(targetbox.data('id')===numOfPages){
                    targetbox.prevAll().not('.pagination li[data-id=prev]').not(firstbox).remove();
                    $('<li data-id="leftdots"><a class="dots">...</a></li>').insertAfter(firstbox);
                    for(num=numOfPages-4;num<numOfPages;num++){
                        $('<li data-id="'+num+'"><a>'+num+'</a></li>').insertBefore(lastbox);
                    }
                }
            }
            if($.isNumeric(target_pageNum)){
                showlist(target_pageNum);
            }
        });
    }
    function load_content(year,content){
        $.ajax({
            url: '<ajax_url>',
            type: 'get',
            data: {'item_year':year},
            timeout:5000,
            beforeSend:function(){
                pagesNav.hide();
                content.html("<li style='color:#ccc;'><i class='fa fa-refresh fa-spin fa-3x fa-fw'></i><span class='sr-only'>Loading...</span></li>");
            },
            error: function () {
                content.empty();
                content.append("<li>No response. Please try refreshing again.</li>");
            },
            success: function (response) {
                content.empty();
                if(response.length>1){
                    content.append(response);
                }else{
                    content.append("<li>No item yet</li>");
                }
            },
            complete: function () {
                if(year!=='all'){
                    items = $('.page-list ul li[data-year='+year+']');
                }else{
                    items = $('.page-list ul li');
                }
                if(items.length > limit){
                    numOfPages = Math.ceil(items.length/limit);
                    pagination_init();
                    pagesNav.show();
                    showlist(1,1);
                }
            }
        });
    }
    if(items.length > limit){
        numOfPages = Math.ceil(items.length/limit);
        pagesNav.show();
        load_content(item_year.find(":selected").val(),$('.page-list ul'));
    }
    item_year.change(function(){
        load_content($(this).val(),$('.page-list ul'));
    });
    pagination_click();
})(jQuery);