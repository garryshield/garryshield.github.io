$('[data-fancybox]').fancybox({
  loop: true,
  buttons: [
    'zoom',
    'slideShow',
    'fullScreen',
    'download',
    'close'
  ],
  baseClass: 'fancybox-custom'
});

(function (window) {
  var INSIGHT_CONFIG = {
    TRANSLATION: {
      POSTS: '日志',
      PAGES: '文章',
      CATEGORIES: '分类',
      TAGS: '标签',
      UNTITLED: '其它',
    },
    CONTENT_URL: '/content.json',
  };
  window.INSIGHT_CONFIG = INSIGHT_CONFIG;
})(window);

(function () {
  var $header = $('.article').find('h1, h2, h3, h4, h5, h6');

  $header.on('click', function () {
    $(this).get(0).id && (window.location.hash = $(this).get(0).id)
  })

  var $catalog = $('.catalog');
  if(!$catalog.length) return;

  $header.addClass('heading');
  $header = $('.article').find('.heading');
  var $catalog_inn = $('.catalog-inn');
  var catalog_top = $catalog.offset().top;

  var $result = $('<div/>');
  var curDepth = 0;
  $header.each(function () {
    var $a = $('<a href="#' + $(this).attr('id') + '">' + $(this).text() + '</a>');
    var $li = $('<li/>').html($a);
    var depth = parseInt(this.tagName.substring(1));

    if (depth > curDepth) {
      $result.append($('<ol/>').append($li));
      $result = $li;
    } else if (depth < curDepth) {
      $result.parents('ol:eq(' + (curDepth - depth - 1) + ')').append($li);
      $result = $li;
    } else {
      $result.parent().append($li);
      $result = $li;
    }
    curDepth = depth;
  });
  $result = $result.parents('ol:last');
  $catalog_inn.html($result);

  $header.removeAttr('class');

  function fix() {
    if ($(window).scrollTop() > catalog_top) {
      $catalog.addClass('fixed');
    } else {
      $catalog.removeClass('fixed');
    }
  }

  $(window).scroll(fix);
  fix();
})()