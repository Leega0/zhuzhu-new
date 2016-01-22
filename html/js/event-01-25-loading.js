$(function() {
  var $stage = $('#stage');
  var $loading = $('#loading');
  var imgs = $stage.find('img'),
    loads= {
      total: imgs.length,
      complete: 0
    };

  function loading() {
    loads.complete++;
    isLoadingComplete()
  }

  imgs.each(function() {
    if (this.complete) {
      loads.complete++;
    } else {
      $(this).load(loading);
    }
  });

  isLoadingComplete();

  function isLoadingComplete() {
    if (loads.complete == loads.total) {
      $stage.removeClass('ui-hide');
      $loading.remove();
    }
  }
});