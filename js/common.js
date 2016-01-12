var deviceWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    deviceHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    baseFontsize = 16,
    $resizeShade,
    $body = $('body');

if (!window.jQuery) {
  var jQuery = Zepto;
}

$(function() {
  inputInit();

  checkboxInit();

  /**
   * 进度条
   * @type {*|jQuery|HTMLElement}
   */
  var $progress = $('.account-progress');

  $progress.each(function() {
    var _self = $(this),
        $bar = _self.find('.account-progress-bar'),
        value = _self.find('.account-progress-value').text();

    $bar.css('width', value);
  });



  /**
   * 窗口大小改变
   */
  fixedAdaptive.call($('.ui-fixed-bottom'));

  $(window).on('resize', function() {
    deviceWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    deviceHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    if (deviceWidth > 400 && deviceWidth < 428) {
      baseFontsize = 20;
    } else if (deviceWidth >= 428 && deviceWidth < 481) {
      baseFontsize = 24;
    } else if (deviceWidth >= 481 && deviceWidth < 569) {
      baseFontsize = 28;
    } else if (deviceWidth >= 569) {
      baseFontsize = 32;
    }

    if ($resizeShade != undefined && $resizeShade[0]) {
      $resizeShade.height(deviceHeight > $body.height() ? deviceHeight : $body.height());
    }

    fixedAdaptive.call($('.ui-fixed-bottom'));
  });
});

/**
 * 输入框控件初始化
 */
function inputInit() {
  var $input = $('.ui-input'),
      $input_clear = $('.ui-input-clear'),
      $input_label = $('.ui-label');

  $input.each(function() {
    var $this = $(this);
    var this_placeholder = $this.attr('placeholder');

    $this.on('focus', function() {
      var $this = $(this);

      if ($this.parent('.ui-input-content').hasClass('ui-input-wrong')) {
        $this.val('').attr('placeholder', this_placeholder);
      }
      $this.parent('.ui-input-content').removeClass('ui-input-wrong').addClass('ui-input-focus');
      $this.parent('.ui-input-content').find('.ui-input-clear').css('display', 'block');
    });

    $this.on('blur', function() {
      var $this = $(this);

      $this.parent('.ui-input-content').removeClass('ui-input-focus');
      if ($this.val() == '') {
        $this.parent('.ui-input-content').find('.ui-input-clear').css('display', 'none');
      }
    });
  });

  $input_label.on('click', function() {
    var $this = $(this);
    var _input = $this.next('.ui-input-body').find('.ui-input');

    _input.focus();

    $(window).trigger('resize');
  });

  $input_clear.on('click', function() {
    var $this = $(this);
    var _input = $this.parent('.ui-input-content').find('.ui-input');

    _input.val('').focus();

    $(window).trigger('resize');
  });
}

/**
 * 选择控件初始化
 */
function checkboxInit() {
  var $checkbox = $('.ui-checkbox');

  $checkbox.each(function() {
    var $this = $(this),
        html;
    if($this.next('.ui-checkbox-icon')[0]) {
      return false;
    }
    $this.css('display', 'none');
    html = $('<a class="ui-checkbox-icon" href="javascript:void(0);"></a>');
    $this.after(html);

    if (this.checked) {
      html.addClass('ui-checkbox-icon-checked');
    }

    html.on('click', function(e) {

      e.stopPropagation();

      var _this = $(this);

      $this.trigger('click');

      if (!!$this[0].checked) {
        _this.addClass('ui-checkbox-icon-checked');
      } else {
        _this.removeClass('ui-checkbox-icon-checked');
      }
    });

    $this.on('click', function(e) {
      e.stopPropagation();

      if (!!$this[0].checked) {
        html.addClass('ui-checkbox-icon-checked');
      } else {
        html.removeClass('ui-checkbox-icon-checked');
      }
    });
  });
}

/**
 * 空弹窗
 * @params {String} 引用弹窗ID,class字符串
 * @returns {Boolean}
 */
$.dialog = function(html) {
  var defaults = {
    type: 'dialog',
    isBtn: true,
    btn: '',
    onDialog: null,
    submitCallback: null,
    cancelCallback: null,
    closeCallback: null,
    redClose: false,
    neverAlert: false,
    neverFunc: null,
    submitText: '确认',
    cancelText: '取消',
    str: ''
  };

  var settings = arguments[1];

  if (typeof html != 'string') {
    console.error('引用内容错误');
    return false;
  }

  if(settings) {
    if(typeof settings != 'object') {
      console.error('参数错误');
      return false;
    }
  }

  settings = $.extend({}, defaults, settings);

  var $dialogContainer;

  switch(settings.type) {
    case 'alert':
      settings.str = html;
      settings.btn = '<a href="javascript:void(0);" class="ui-btn ui-btn-whiteBlack ui-dialog-btn-submit">'+ settings.submitText + '</a>';
      break;
    case 'confirm':
      settings.str = html;
      settings.btn = '<a href="javascript:void(0);" class="ui-btn ui-dialog-btn-submit ui-btn-inline ui-btn-whiteBlack">'+ settings.submitText + '</a>' +
                      '<a href="javascript:void(0);" class="ui-btn ui-dialog-btn-cancel ui-btn-inline ui-btn-whiteBlack">'+ settings.cancelText + '</a>';
      break;
    default :
      settings.btn = '<a href="javascript:void(0);" class="ui-btn ui-btn-whiteBlack ui-dialog-btn-submit">确定</a>';
      break;
  }

  if(settings.type == 'alert' || settings.type == 'confirm') {
    $dialogContainer = $('<div class="ui-dialog ui-dialog-alert">' +
                            '<i class="ui-dialog-close"></i>' +
                            '<p class="ui-dialog-text">' + settings.str + '</p>' +
                            (settings.neverAlert ? '<div class="ui-checkbox-wrap"><input class="ui-checkbox" type="checkbox"/><span class="ui-checkbox-label">不再提示</span></div>' : '') +
                            '<div class="ui-dialog-btnWrap">' +
                            settings.btn +
                            '</div>' +
                          '</div>');
  } else {

    var $dialog = $(html);
    $dialogContainer = $('<div class="ui-dialog"><i class="' + (settings.redClose ? 'ui-dialog-close-red' : 'ui-dialog-close') + '"></i></div>');

    $dialog.css('display', 'block').appendTo($dialogContainer);

    if(settings.isBtn) {
      $dialogContainer.append('<div class="ui-dialog-btnWrap">' +
        settings.btn  +
        '</div>');
    }
  }

  var $shade = $('<div class="ui-shade"></div>');
  var $dialogWrap = $('<div class="ui-dialog-wrap"></div>');

  $dialogWrap.append($dialogContainer)
             .append($shade);

  $body.append($dialogWrap);
  $dialogWrap.css('display', 'block');

  $shade.height(deviceHeight > $body.height() ? deviceHeight : $body.height()).css('display', 'block');
  checkboxInit();
  dialogOffset($dialogContainer);


  var $submit = $('.ui-dialog-btn-submit', $dialogContainer),
      $cancel = $('.ui-dialog-btn-cancel', $dialogContainer),
      $close = $('.ui-dialog-close,.ui-dialog-close-red', $dialogContainer),
      $never = $('.ui-checkbox', $dialogContainer);

  $close.on('click', function(e) {
    e.preventDefault();
    $dialogWrap.dialogOff();

    if (settings.closeCallback && settings.closeCallback.call($dialogWrap) === false) {
      return false;
    }
  });

  $submit.on('click', function(e) {
    e.preventDefault();
    $dialogWrap.dialogOff();

    if (settings.submitCallback && settings.submitCallback.call($dialogWrap, $never) === false) {
      return false;
    }
  });

  $cancel.on('click', function(e) {
    e.preventDefault();
    $dialogWrap.dialogOff();

    if (settings.cancelCallback && settings.cancelCallback.call($dialogWrap) === false) {
      return false;
    }
  });

  $.fn.dialogOff = function() {
    if(settings.type == 'alert' || settings.type == 'confirm') {
      $dialogWrap.remove();
    } else {
      $dialog.css('display', 'none').appendTo('body');
      $dialogWrap.remove();
    }
  };

  if (settings.onDialog && settings.onDialog.call($dialogWrap, $shade) === false) {
    return false;
  }
};

/**
 * 基本信息弹窗
 */
$.alert = function() {
  var str = arguments[0];

  var defaults = {
    type: 'alert',
    submitCallback: null,
    closeCallback: null,
    neverAlert: false,
    neverFunc: null,
    submitText: '确认'
  };

  var settings = arguments[1];

  if (typeof str != 'string') {
    console.error('引用内容错误');
    return false;
  }

  if(settings) {
    if(typeof settings != 'object') {
      console.error('参数错误');
      return false;
    }
  }

  settings = $.extend({}, defaults, settings);
  $.dialog(str, settings);
  /*var defaults = {
    type: 'alert',
    submitCallback: null,
    cancelCallback: null,
    closeCallback: null,
    btn: '<a href="javascript:void(0);" class="ui-btn ui-btn-whiteBlack ui-dialog-btn-submit">确定</a>',
    neverAlert: false,
    neverFunc: null,
    submitText: '确认',
    cancelText: '取消'
  };

  var settings = arguments[1];

  if (typeof str != 'string') {
    console.error('引用内容错误');
    return false;
  }

  if(settings) {
    if(typeof settings != 'object') {
      console.error('参数错误');
      return false;
    }
  }

  settings = $.extend({}, defaults, settings);

  switch(settings.type) {
    case 'alert':
      settings.btn = '<a href="javascript:void(0);" class="ui-btn ui-btn-whiteBlack ui-dialog-btn-submit">'+ settings.submitText + '</a>';
      break;
    case 'confirm':
      settings.btn = '<a href="javascript:void(0);" class="ui-btn ui-dialog-btn-submit ui-btn-inline ui-btn-whiteBlack">'+ settings.submitText + '</a>' +
                      '<a href="javascript:void(0);" class="ui-btn ui-dialog-btn-cancel ui-btn-inline ui-btn-whiteBlack">'+ settings.cancelText + '</a>';
      break;
    default :
      settings.btn = '<a href="javascript:void(0);" class="ui-dialog-btn ui-dialog-btn-submit">确定</a>';
      break;
  }

  var $dialogWrap = $('<div class="ui-dialog-wrap"></div>');
  var $alert = $('<div class="ui-dialog ui-dialog-alert">' +
                    '<i class="ui-dialog-close"></i>' +
                    '<p class="ui-dialog-text">' + str + '</p>' +
                    (settings.neverAlert ? '<div class="ui-checkbox-wrap"><input class="ui-checkbox" type="checkbox"/><span class="ui-checkbox-label">不再提示</span></div>' : '') +
                    '<div class="ui-dialog-btnWrap">' +
                      settings.btn +
                    '</div>' +
                 '</div>'),
      $shade = $('<div class="ui-shade"></div>');

  $dialogWrap.append($alert)
             .append($shade);
  $('body').append($dialogWrap);
  $dialogWrap.css('display', 'block');
  $shade.height(deviceHeight > $body.height() ? deviceHeight : $body.height()).css('display', 'block');
  //$shade = showShade($alert);
  dialogOffset($alert);
  checkboxInit();

  var $submit = $('.ui-dialog-btn-submit', $alert);
  var $cancel = $('.ui-dialog-btn-cancel', $alert);
  var $close = $('.ui-dialog-close', $alert);
  var $never = $('.ui-checkbox', $alert);

  $submit.on('click', function() {
    $dialogWrap.remove();

    if (settings.submitCallback && settings.submitCallback.call($alert, $never) === false) {
      return false;
    }
  });

  $cancel.on('click', function() {
    $dialogWrap.remove();
    if (settings.cancelCallback && settings.cancelCallback.call($alert) === false) {
      return false;
    }
  });

  $close.on('click', function() {
    $dialogWrap.remove();

    if (settings.closeCallback && settings.closeCallback.call($alert) === false) {
      return false;
    }
  });*/
};

/**
 * 确认弹窗
 */

$.confirm = function () {
  var str = arguments[0];
  var defaults = {
    type: 'confirm',
    submitCallback: null,
    closeCallback: null,
    neverAlert: false,
    neverFunc: null,
    submitText: '确认'
  };

  var settings = arguments[1];

  if (typeof str != 'string') {
    console.error('引用内容错误');
    return false;
  }

  if(settings) {
    if(typeof settings != 'object') {
      console.error('参数错误');
      return false;
    }
  }

  settings = $.extend({}, defaults, settings);
  $.dialog(str, settings);

  /*var defaults = {
    type: 'confirm',
    submitCallback: null,
    cancelCallback: null
  };

  var settings = arguments[1];

  if (typeof str != 'string') {
    console.error('引用内容错误');
    return false;
  }

  if(settings) {
    if(typeof settings != 'object') {
      console.error('参数错误');
      return false;
    }
  }

  settings = $.extend({}, settings, defaults);

  $.alert(str, settings);*/
};

/**
 * 遮罩
 * @param {jQuery} $dialog 引用弹窗
 * @param {Boolean} isClickOff 点击遮罩关闭
 * @returns {*|jQuery|HTMLElement}
 */
function showShade($dialog, isClickOff) {
  var $shade = $('.ui-shade'),
      isDialog = $dialog == undefined || $dialog == null || $dialog == '';

  if ($shade[0]) {
    $shade.show();
  } else {
    $shade = $('<div class="ui-shade"></div>');
    $shade.appendTo('body').show();
  }

  $shade.height(deviceHeight > $body.height() ? deviceHeight : $body.height());

  if (isClickOff === null || isClickOff === undefined || isClickOff === '' || isClickOff === true) {
    $shade.on('click', function() {
      if (!isDialog) {
        $dialog.remove();
      }
      $shade.remove();
    });
  }
  $resizeShade = $shade;
  return $shade;
}

/**
 * 弹窗定位
 * @param {String} $dialog 引用弹窗
 */
function dialogOffset($dialog) {

  var $dialogOption = {};

  $dialogOption.width = $dialog.width();
  $dialogOption.height = $dialog.height();
  $dialogOption.offsetTop = (deviceHeight - $dialog.height()) / 2;
  $dialogOption.offsetLeft = ($(document).width() - $dialogOption.width) / 2;
  $dialog.css({
    'top': $dialogOption.offsetTop,
    'left': $dialogOption.offsetLeft
  });

  $(window).scrollTop(0);
}
/**
 * 底部固定框
 */
function fixedAdaptive() {
  var $this = $(this);

  if (deviceHeight < ($body.height() + $this.height() + 4 * baseFontsize)) {
    $this.addClass('ui-fixed-adaptive');
  } else {
    $this.removeClass('ui-fixed-adaptive');
  }
}

/**
 * 封装选择插件
 */
(function($) {

  var methods = {
    init: function(options) {
      return this.each(function () {
        var $this = $(this);
        var defaults = {
          defaultText: '选择'
        };

        var settings = $.extend({}, defaults, options);
        var id = $this.attr('id'),
            classes = $this.attr('class');
        var html = '<a id="' + id + '_button" href="javascript:void(0);" class="ui-select ' + (classes ? classes : '') + '">' + settings.defaultText +'</a>';

        $this.before(html);
        settings.btn = $('#' + id + '_button');
        $this.mobiscroll().select({
          mod: 'scroller',
          display: 'modal',
          lang: 'zh',
          rows: 3,
          buttons: [
            {
              text: '确认',
              handler: 'set',
              cssClass: 'ui-btn-whiteBlack ui-btn'
            }
          ],
          inputClass: 'ui-hide',
          onSelect: function(valueText, inst) {
            var $button = settings.btn;
            var value = inst.getVal();

            $button.empty().text(valueText);

            settings.onSelect.call($button, valueText, value);
          }
        });
        settings.input = $('#' + id + '_dummy');
        settings.btn.on('click', function(e) {
          e.preventDefault();

          settings.input.trigger('click');
        });

        $this.data('tinySelect', settings);
      });
    },

    reset: function() {
      return this.each(function () {
        var $this = $(this);
        var id = $this.attr('id');
        var $btn = $('#' + id + '_button');
        var $temp = $('#' + id + '_dummy');
        var settings = $this.data('tinySelect');

        if(typeof(settings) == 'undefined') {
          return $.error('插件未初始化');
        }

        $this.mobiscroll('setVal', 0);
        if ($temp.value == '' || $temp.value == null || $temp.value == undefined) {
          $btn.empty().text(settings.defaultText);
        } else {
          $btn.empty().text($temp.value);
        }

      });
    }
  };

  $.fn.tinySelect = function () {
    var method = arguments[0];

    if (methods[method]) {
      method = methods[method];
      arguments = Array.prototype.slice.call(arguments, 1);
    } else if (typeof(method) == 'object' || !method) {
      method = methods.init;
    } else {
      $.error('该方法不存在！');
    }

    return method.apply(this, arguments);
  };
})(jQuery);


/**
 * 买就送选择前端
 * @type {{init: Function}}
 */
$.item = {
  init: function() {
    var $get = $('#item-get');
    var isLogin = arguments[0],
        items = arguments[1],
        attrArray = arguments[2],
        attr = [],
        limitCount = arguments[3],
        defaultItem;

    if (!isLogin) {
      return;
    }

    if (!Array.isArray(items) && !Array.isArray(attrArray)) {
      return $.error('item数据错误');
    }

    $.each(items, function() {
      if (this.defaults == 1) {
        defaultItem = this;
      }
    });

    $.each(attrArray, function() {
      attr.push(this.name);
    });

    $get.on('click', function() {
      var $dialog = $('.item-dialog'),
        $close = $('.item-dialog-close');
      var $shade = showShade($dialog, false);

      $dialog.css({
        'display': 'block',
        '-webkit-transform': 'translate(0, 0)',
        'transform': 'translate(0, 0)'
      });

      $close.one('click', function() {
        $dialog.css({
          'display': 'block',
          '-webkit-transform': 'translate(0, 60em)',
          'transform': 'translate(0, 60em)'
        });
        $shade.remove();
      });
    });

    var $content = $('.item-dialog-content');
    var $countSurplus = $('#item-count-surplus'),
        $plus = $('#item-count-plus'),
        $minux = $('#item-count-minus'),
        $temp = $('#item-count-temp'),
        $countInput = $('#item-count'),
        maxCount = $countSurplus.text() <= 0 ? 0 : $countSurplus.text(),
        surplus = maxCount > 0 ? maxCount - 1 : 0,
        count = 1,
        $money = $('#item-money-temp'),
        $moneyInput = $money.parent('p').next('input[type=hidden]'),
        price = parseFloat($money.text()),
        itemObj = {};

    limitCount = limitCount >= maxCount ? maxCount : limitCount;
    $temp.empty().text(count);

    $content.each(function() {
      var $this = $(this);
      var $input = $this.find('input[type=hidden]');
      $this.on('click', 'a.ui-btn-link', function() {
        var $this = $(this);
        $this.addClass('ui-btn-choose').removeClass('ui-btn-unchoose').siblings('.ui-btn-choose').addClass('ui-btn-unchoose').removeClass('ui-btn-choose');
        $input.val($this.data('value'));
        itemObj[$this.data('type')] = $this.data('value');
        amountCount();
      });
    });

    $content.find('a.ui-btn-link').each(function() {
      var $this = $(this);

      $.each(defaultItem, function(key, value) {
        if ($this.data('type') == key && $this.data('value') == value) {
          $this.trigger('click');
        }
      });
    });

    //$countSurplus.empty().text(surplus);
    $countInput.val(count);
    $plus.on('click', function() {

      if (limitCount == undefined || limitCount == "null" || limitCount <= 0) {
        if (count >= maxCount) {
          return;
        }
      } else {
        if (count >= limitCount) {
          return;
        }
      }

      count++;
      surplus--;
      $temp.empty().text(count);
      //$countSurplus.empty().text(surplus);
      moneyChage();
    });

    $minux.on('click', function() {
      if (count <= 1) {
        return;
      }
      count--;
      surplus++;
      $temp.empty().text(count);
      //$countSurplus.empty().text(surplus);
      moneyChage();
    });

    function amountCount() {
      $.each(items, function () {
        for (var i = 0, len = attr.length; i < len; i++) {
          if (!(this[attr[i]] == itemObj[attr[i]])) {
            return;
          }
        }
        $('.item-dialog-detail').next('input[type=hidden]').val(this.id);
        $('.item-dialog-name').empty().text(this.fullname).next('input[type=hidden]').val(this.fullname);
        price = this.depositAmount;
        moneyChage();
      });
    }

    function moneyChage() {
      $countInput.val(count);
      $money.text(price * count);
      $moneyInput.val(price * count);
    }
  }
};

/**
 * 银行卡号输入
 */
$.fn.bankInput = function() {
  var _self = $(this);
  _self.on('keyup', function() {
    var value = _self.val().replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
    _self.val(value)
  });

};


/**
 * 输入框错误提示
 * @param {String} str 提示字符串
 */
$.fn.wrongInput = function(str) {
  var _self = $(this);
  var $content = _self.parent();

  $content.addClass('ui-input-wrong');
  _self.val('').attr('placeholder', str);
};


/**
 * loading
 */

$.loadingShow = function() {
  //var url = 'images/loading-image.gif';
  var url = 'http://' + window.location.host + '/images/loading-image.gif';
  var $loading = $('<img class="ui-loading" src="" alt=""/>');
  var $shade;
  var img = new Image();
  img.src = url;

  if(img.complete) {
    $loading[0].src = url;
  } else {
    img.onload = function() {
      $loading[0].src = url;
    }
  }

  $shade = showShade($loading, false);
  $(window).scrollTop(0);
  $shade.append($loading);
  $shade.addClass('ui-shade');
};

$.loadingHide = function() {
  $(document).find('.ui-loading').parent('.ui-shade').remove();
};