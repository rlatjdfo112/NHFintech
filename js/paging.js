var filterList = {
    init: function () {
      $('#portfoliolist').mixitup({
        targetSelector: '.portfolio',
        filterSelector: '.filter',
        effects: ['fade'],
        easing: 'snap',
        // call the hover effect
        onMixEnd: filterList.hoverEffect()
      });
    },
    hoverEffect: function () {
      $('#portfoliolist .portfolio').hover(
        function () {
          $(this).find('.label').stop().animate({bottom: 0}, 200, 'easeOutQuad');
          $(this).find('img').stop().animate({top: -30}, 500, 'easeOutQuad');
        },
        function () {
          $(this).find('.label').stop().animate({bottom: -40}, 200, 'easeInQua d');
          $(this).find('img').stop().animate({top: 0}, 300, 'easeOutQuad');
        }
      );
    }
};

var items = 0;
function seeMore(category,filter=""){
var params = 'begin='+items+'&count=10&category='+category;
  $.ajax({
  type: "POST",
      url: '/nh/ReadPost.php',
  data: params,
  success: function(responseData){
      for( var i = 0; i < responseData.length; i += 1 ) {
        items++;
        var data = responseData[i];
          if(data.title!=undefined){
              if(!data['per'])
                  var per = 0;
              else if(data['per']>100)
                  var per = 100;
              else
                  var per = data['per'];
              if(data['title'].indexOf(filter) == -1)
                  continue;
        var item = createItemHtml(data['title'], data['image'], data['category'], data['price'], per, data['no']);
        $('#portfoliolist').append(item);
        }
      }
    }
  });
  filterList.init();
}


function getCart(){
  $.ajax({
  type: "POST",
  url: 'http://sprout.kr/nh/ReadHistory.php',
  success: function(responseData){
      for( var i = 0; i < responseData.length; i += 1 ) {
        items++;
        var data = responseData[i];
        if(data.title!=undefined){
        var item = createItemHtml(data['title'], data['image'], data['category'], data['pay']+'/'+data['price'], data['per'], data['no']);
        $('#portfoliolist').append(item);
        }
      }
      $('#cart-count').text(items);
      if(items>0){
        $('#not-have').hide();
      }
      filterList.init();
    }
  });
}

function createItemHtml(title, image, category, price, percent, no){
  var progressClass = 'progress-bar-warning';
  if(percent>50){
    progressClass = 'progress-bar-info';
  }
  if(percent == 100){
    progressClass = 'progress-bar-success';
  }

  return '<div onclick="single('+no+')" class="portfolio '+category+' mix_all" data-cat="'+category+'" style="display: inline-block; opacity: 1;">'+
                        '<div class="portfolio-wrapper">'+
                            '<a class="b-link-stripe b-animate-go  thickbox">'+
                             '<img id="fixed-img" src="'+image+'" class="img-responsive" alt="" /><div class="b-wrapper"><div class="atc"><p>장바구니로!</p></div><div class="clearfix"></div><h2 class="b-animate b-from-left    b-delay03 "><img src="images/icon-eye.png" class="img-responsive go" alt=""/></h2>'+
                            '</div></a>'+
                            '<div class="title">'+
                                '<div class="colors">'+
                                '<h4>'+title+'</h4>'+
                                '<p> 달성률:'+
                  '<span class="progress-mobile">'+percent+'%</span></p>'+
                                    '<div class="progress percents" style="width: 100px;">'+
                      '<div class="progress-bar percents '+progressClass+'" role="progressbar" aria-valuenow="'+percent+'" aria-valuemin="0" aria-valuemax="100" style="width: '+percent+'px;">'+
                      percent+'%'+
                      '</div>'+
                      '</div>'+
                                '</div>'+
                                '<div class="main-price">'+
                                    '<h3>'+price+'<span>원</span></h3>'+
                                '</div>'+
                                '<div class="clearfix"></div>'+
                            '</div>'+
                 '</div>'+
                    '</div>';
}

function single(no){
    window.location.href='/nh/NHFintech/single.php?post_uid='+no;
}
