if (!window.jQuery) {

    var jQuery = Zepto;

    (function ($) {

        ['width', 'height'].forEach(function (dimension) {
            $.fn[dimension] = function (value) {
                var offset,
                    body = document.body,
                    html = document.documentElement,
                    Dimension = dimension.replace(/./, function (m) { return m[0].toUpperCase(); });
                if (value === undefined) {
                    return this[0] == window ?
                            html['client' + Dimension] :
                            this[0] == document ?
                                    Math.max(body['scroll' + Dimension], body['offset' + Dimension], html['client' + Dimension], html['scroll' + Dimension], html['offset' + Dimension]) :
                                    (offset = this.offset()) && offset[dimension];
                } else {
                    return this.each(function (idx) {
                        $(this).css(dimension, value);
                    });
                }
            };
        });


        ['width', 'height'].forEach(function (dimension) {
            var offset, Dimension = dimension.replace(/./, function (m) { return m[0].toUpperCase(); });
            $.fn['outer' + Dimension] = function (margin) {
                var elem = this;
                if (elem) {
                    var size = elem[0]['offset' + Dimension],
                        sides = {'width': ['left', 'right'], 'height': ['top', 'bottom']};
                    sides[dimension].forEach(function (side) {
                        if (margin) {
                            size += parseInt(elem.css('margin-' + side), 10);
                        }
                    });
                    return size;
                } else {
                    return null;
                }
            };
        });

        ['width', 'height'].forEach(function (dimension) {
            var offset, Dimension = dimension.replace(/./, function (m) { return m[0].toUpperCase(); });
            $.fn['inner' + Dimension] = function () {
                var elem = this;
                if (elem[0]['inner' + Dimension]) {
                    return elem[0]['inner' + Dimension];
                } else {
                    var size = elem[0]['offset' + Dimension],
                        sides = {'width': ['left', 'right'], 'height': ['top', 'bottom']};
                    sides[dimension].forEach(function (side) {
                        size -= parseInt(elem.css('border-' + side + '-width'), 10);
                    });

                    return size;
                }
            };
        });

        ["Left", "Top"].forEach(function (name, i) {
            var method = "scroll" + name;

            function isWindow(obj) {
                return obj && typeof obj === "object" && "setInterval" in obj;
            }

            function getWindow(elem) {
                return isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;
            }

            $.fn[method] = function (val) {
                var elem, win;
                if (val === undefined) {
                    elem = this[0];
                    if (!elem) {
                        return null;
                    }
                    win = getWindow(elem);
                    // Return the scroll offset
                    return win ? ("pageXOffset" in win) ? win[i ? "pageYOffset" : "pageXOffset"] :
                            win.document.documentElement[method] ||
                            win.document.body[method] :
                            elem[method];
                }

                // Set the scroll offset
                this.each(function () {
                    win = getWindow(this);
                    if (win) {
                        var xCoord = !i ? val : $(win).scrollLeft(),
                            yCoord = i ? val : $(win).scrollTop();
                        win.scrollTo(xCoord, yCoord);
                    } else {
                        this[method] = val;
                    }
                });
            };
        });
        
        $.fn.prevUntil = function (selector) {
            var n = this,
                array = [];

            while (n.length && !$(n).filter(selector).length) {
                array.push(n[0]);
                n = n.prev();
            }

            return $(array);
        };

        $.fn.nextUntil = function (selector) {
            var n = this,
                array = [];

            while (n.length && !n.filter(selector).length) {
                array.push(n[0]);
                n = n.next();
            }

            return $(array);
        };

        // Fix zepto.js extend to work with undefined parameter
        $._extend = $.extend;
        $.extend = function () {
            arguments[0] = arguments[0] || {};
            return $._extend.apply(this, arguments);
        };

    })(jQuery);

}
;/*!
 * Mobiscroll v2.15.1
 * http://mobiscroll.com
 *
 * Copyright 2010-2015, Acid Media
 * Licensed under the MIT license.
 *
 */
(function ($, undefined) {

    function testProps(props) {
        var i;
        for (i in props) {
            if (mod[props[i]] !== undefined) {
                return true;
            }
        }
        return false;
    }

    function testPrefix() {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            p;

        for (p in prefixes) {
            if (testProps([prefixes[p] + 'Transform'])) {
                return '-' + prefixes[p].toLowerCase() + '-';
            }
        }
        return '';
    }

    function init(that, options, args) {
        var ret = that;

        // Init
        if (typeof options === 'object') {
            return that.each(function () {
                if (instances[this.id]) {
                    instances[this.id].destroy();
                }
                new $.mobiscroll.classes[options.component || 'Scroller'](this, options);
            });
        }

        // Method call
        if (typeof options === 'string') {
            that.each(function () {
                var r,
                    inst = instances[this.id];

                if (inst && inst[options]) {
                    r = inst[options].apply(this, Array.prototype.slice.call(args, 1));
                    if (r !== undefined) {
                        ret = r;
                        return false;
                    }
                }
            });
        }

        return ret;
    }

    var id = +new Date(),
        instances = {},
        extend = $.extend,
        mod = document.createElement('modernizr').style,
        has3d = testProps(['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective']),
        hasFlex = testProps(['flex', 'msFlex', 'WebkitBoxDirection']),
        prefix = testPrefix(),
        pr = prefix.replace(/^\-/, '').replace(/\-$/, '').replace('moz', 'Moz');

    $.fn.mobiscroll = function (method) {
        extend(this, $.mobiscroll.components);
        return init(this, method, arguments);
    };

    $.mobiscroll = $.mobiscroll || {
        version: '2.15.1',
        util: {
            prefix: prefix,
            jsPrefix: pr,
            has3d: has3d,
            hasFlex: hasFlex,
            testTouch: function (e, elm) {
                if (e.type == 'touchstart') {
                    $(elm).attr('data-touch', '1');
                } else if ($(elm).attr('data-touch')) {
                    $(elm).removeAttr('data-touch');
                    return false;
                }
                return true;
            },
            objectToArray: function (obj) {
                var arr = [],
                    i;

                for (i in obj) {
                    arr.push(obj[i]);
                }

                return arr;
            },
            arrayToObject: function (arr) {
                var obj = {},
                    i;

                if (arr) {
                    for (i = 0; i < arr.length; i++) {
                        obj[arr[i]] = arr[i];
                    }
                }

                return obj;
            },
            isNumeric: function (a) {
                return a - parseFloat(a) >= 0;
            },
            isString: function (s) {
                return typeof s === 'string';
            },
            getCoord: function (e, c) {
                var ev = e.originalEvent || e;
                return ev.changedTouches ? ev.changedTouches[0]['page' + c] : e['page' + c];
            },
            getPosition: function (t, vertical) {
                var style = window.getComputedStyle ? getComputedStyle(t[0]) : t[0].style,
                    matrix,
                    px;

                if (has3d) {
                    $.each(['t', 'webkitT', 'MozT', 'OT', 'msT'], function (i, v) {
                        if (style[v + 'ransform'] !== undefined) {
                            matrix = style[v + 'ransform'];
                            return false;
                        }
                    });
                    matrix = matrix.split(')')[0].split(', ');
                    px = vertical ? (matrix[13] || matrix[5]) : (matrix[12] || matrix[4]);
                } else {
                    px = vertical ? style.top.replace('px', '') : style.left.replace('px', '');
                }

                return px;
            },
            constrain: function (val, min, max) {
                return Math.max(min, Math.min(val, max));
            },
            vibrate: function (time) {
                if ('vibrate' in navigator) {
                    navigator.vibrate(time || 50);
                }
            }
        },
        tapped: false,
        autoTheme: 'mobiscroll',
        presets: {
            scroller: {},
            numpad: {},
            listview: {},
            menustrip: {}
        },
        themes: {
            frame: {},
            listview: {},
            menustrip: {}
        },
        i18n: {},
        instances: instances,
        classes: {},
        components: {},
        defaults: {
            context: 'body',
            mousewheel: true,
            vibrate: true
        },
        setDefaults: function (o) {
            extend(this.defaults, o);
        },
        presetShort: function (name, c, p) {
            this.components[name] = function (s) {
                return init(this, extend(s, { component: c, preset: p === false ? undefined : name }), arguments);
            };
        }
    };

    $.mobiscroll.classes.Base = function (el, settings) {

        var lang,
            preset,
            s,
            theme,
            themeName,
            defaults,
            ms = $.mobiscroll,
            that = this;

        that.settings = {};

        that._presetLoad = function () {};

        that._init = function (ss) {
            s = that.settings;

            // Update original user settings
            extend(settings, ss);

            // Load user defaults
            if (that._hasDef) {
                defaults = ms.defaults;
            }

            // Create settings object
            extend(s, that._defaults, defaults, settings);

            // Get theme defaults
            if (that._hasTheme) {

                themeName = s.theme;

                if (themeName == 'auto' || !themeName) {
                    themeName = ms.autoTheme;
                }

                if (themeName == 'default') {
                    themeName = 'mobiscroll';
                }

                settings.theme = themeName;

                theme = ms.themes[that._class][themeName];
            }

            // Get language defaults
            if (that._hasLang) {
                lang = ms.i18n[s.lang];
            }

            if (that._hasTheme) {
                that.trigger('onThemeLoad', [lang, settings]);
            }

            // Update settings object
            extend(s, theme, lang, defaults, settings);

            // Load preset settings
            if (that._hasPreset) {

                that._presetLoad(s);

                preset = ms.presets[that._class][s.preset];

                if (preset) {
                    preset = preset.call(el, that);
                    extend(s, preset, settings);
                }
            }
        };

        that._destroy = function () {
            that.trigger('onDestroy', []);

            // Delete scroller instance
            delete instances[el.id];

            that = null;
        };

        /**
         * Triggers an event
         */
        that.trigger = function (name, args) {
            var ret;
            args.push(that);
            $.each([defaults, theme, preset, settings], function (i, v) {
                if (v && v[name]) { // Call preset event
                    ret = v[name].apply(el, args);
                }
            });
            return ret;
        };

        /**
         * Sets one ore more options.
         */
        that.option = function (opt, value) {
            var obj = {};
            if (typeof opt === 'object') {
                obj = opt;
            } else {
                obj[opt] = value;
            }
            that.init(obj);
        };

        /**
         * Returns the mobiscroll instance.
         */
        that.getInst = function () {
            return that;
        };

        settings = settings || {};

        // Autogenerate id
        if (!el.id) {
            el.id = 'mobiscroll' + (++id);
        }

        // Save instance
        instances[el.id] = that;
    };

})(jQuery);
;(function ($, window, document, undefined) {

    var $activeElm,
        preventShow,
        ms = $.mobiscroll,
        instances = ms.instances,
        util = ms.util,
        pr = util.jsPrefix,
        has3d = util.has3d,
        getCoord = util.getCoord,
        constrain = util.constrain,
        isString = util.isString,
        isOldAndroid = /android [1-3]/i.test(navigator.userAgent),
        isIOS8 = /(iphone|ipod|ipad).* os 8_/i.test(navigator.userAgent),
        animEnd = 'webkitAnimationEnd animationend',
        empty = function () { },
        prevdef = function (ev) { ev.preventDefault(); };

    ms.classes.Frame = function (el, settings, inherit) {
        var $ariaDiv,
            $ctx,
            $header,
            $markup,
            $overlay,
            $persp,
            $popup,
            $wnd,
            $wrapper,
            buttons,
            btn,
            doAnim,
            event,
            hasButtons,
            isModal,
            modalWidth,
            modalHeight,
            posEvents,
            preventPos,
            s,
            scrollLock,
            setReadOnly,
            wndWidth,
            wndHeight,

            that = this,
            $elm = $(el),
            elmList = [],
            posDebounce = {};

        function onBtnStart(ev) {
            // Can't call preventDefault here, it kills page scroll
            if (btn) {
                btn.removeClass('dwb-a');
            }
            btn = $(this);
            // Active button
            if (!btn.hasClass('dwb-d') && !btn.hasClass('dwb-nhl')) {
                btn.addClass('dwb-a');
            }
            if (ev.type === 'mousedown') {
                $(document).on('mouseup', onBtnEnd);
            }
        }

        function onBtnEnd(ev) {
            if (btn) {
                btn.removeClass('dwb-a');
                btn = null;
            }
            if (ev.type === 'mouseup') {
                $(document).off('mouseup', onBtnEnd);
            }
        }

        function onWndKeyDown(ev) {
            if (ev.keyCode == 13) {
                that.select();
            } else if (ev.keyCode == 27) {
                that.cancel();
            }
        }

        function onShow(prevFocus) {
            if (!prevFocus) {
                $popup.focus();
            }
            that.ariaMessage(s.ariaMessage);
        }

        function onHide(prevAnim) {
            var activeEl,
                value,
                type,
                focus = s.focusOnClose;

            $markup.remove();

            if ($activeElm && !prevAnim) {
                setTimeout(function () {
                    if (focus === undefined || focus === true) {
                        preventShow = true;
                        activeEl = $activeElm[0];
                        type = activeEl.type;
                        value = activeEl.value;
                        try {
                            activeEl.type = 'button';
                        } catch (ex) { }
                        $activeElm.focus();
                        activeEl.type = type;
                        activeEl.value = value;
                    } else if (focus) {
                        // If a mobiscroll field is focused, allow show
                        if (instances[$(focus).attr('id')]) {
                            ms.tapped = false;
                        }
                        $(focus).focus();
                    }
                }, 200);
            }

            that._isVisible = false;

            event('onHide', []);
        }

        function onPosition(ev) {
            clearTimeout(posDebounce[ev.type]);
            posDebounce[ev.type] = setTimeout(function () {
                var isScroll = ev.type == 'scroll';
                if (isScroll && !scrollLock) {
                    return;
                }
                that.position(!isScroll);
            }, 200);
        }

        function onFocus(ev) {
            if (!$popup[0].contains(ev.target)) {
                $popup.focus();
            }
        }

        function show(beforeShow, $elm) {
            if (!ms.tapped) {

                if (beforeShow) {
                    beforeShow();
                }

                // Hide virtual keyboard
                if ($(document.activeElement).is('input,textarea')) {
                    $(document.activeElement).blur();
                }

                $activeElm = $elm;
                that.show();
            }

            setTimeout(function () {
                preventShow = false;
            }, 300); // With jQuery < 1.9 focus is fired twice in IE
        }

        // Call the parent constructor
        ms.classes.Base.call(this, el, settings, true);

        /**
        * Positions the scroller on the screen.
        */
        that.position = function (check) {
            var w,
                l,
                t,
                anchor,
                aw, // anchor width
                ah, // anchor height
                ap, // anchor position
                at, // anchor top
                al, // anchor left
                arr, // arrow
                arrw, // arrow width
                arrl, // arrow left
                dh,
                scroll,
                sl, // scroll left
                st, // scroll top
                totalw = 0,
                minw = 0,
                css = {},
                nw = Math.min($wnd[0].innerWidth || $wnd.innerWidth(), $persp.width()), //$persp.width(), // To get the width without scrollbar
                nh = $wnd[0].innerHeight || $wnd.innerHeight();

            if ((wndWidth === nw && wndHeight === nh && check) || preventPos) {
                return;
            }

            if (that._isFullScreen || /top|bottom/.test(s.display)) {
                // Set width, if document is larger than viewport, needs to be set before onPosition (for calendar)
                $popup.width(nw);
            }

            if (event('onPosition', [$markup, nw, nh]) === false || !isModal) {
                return;
            }

            sl = $wnd.scrollLeft();
            st = $wnd.scrollTop();
            anchor = s.anchor === undefined ? $elm : $(s.anchor);

            // Set / unset liquid layout based on screen width, but only if not set explicitly by the user
            if (that._isLiquid && s.layout !== 'liquid') {
                if (nw < 400) {
                    $markup.addClass('dw-liq');
                } else {
                    $markup.removeClass('dw-liq');
                }
            }

            if (!that._isFullScreen && /modal|bubble/.test(s.display)) {
                $wrapper.width('');
                $('.mbsc-w-p', $markup).each(function () {
                    w = $(this).outerWidth(true);
                    totalw += w;
                    minw = (w > minw) ? w : minw;
                });
                w = totalw > nw ? minw : totalw;
                $wrapper.width(w).css('white-space', totalw > nw ? '' : 'nowrap');
            }

            modalWidth = that._isFullScreen ? nw : $popup.outerWidth();
            modalHeight = that._isFullScreen ? nh : $popup.outerHeight(true);
            scrollLock = modalHeight <= nh && modalWidth <= nw;

            that.scrollLock = scrollLock;

            if (s.display == 'modal') {
                l = Math.max(0, sl + (nw - modalWidth) / 2);
                t = st + (nh - modalHeight) / 2;
            } else if (s.display == 'bubble') {
                scroll = true;
                arr = $('.dw-arrw-i', $markup);
                ap = anchor.offset();
                at = Math.abs($ctx.offset().top - ap.top);
                al = Math.abs($ctx.offset().left - ap.left);

                // horizontal positioning
                aw = anchor.outerWidth();
                ah = anchor.outerHeight();
                l = constrain(al - ($popup.outerWidth(true) - aw) / 2, sl + 3, sl + nw - modalWidth - 3);

                // vertical positioning
                t = at - modalHeight; // above the input
                if ((t < st) || (at > st + nh)) { // if doesn't fit above or the input is out of the screen
                    $popup.removeClass('dw-bubble-top').addClass('dw-bubble-bottom');
                    t = at + ah; // below the input
                } else {
                    $popup.removeClass('dw-bubble-bottom').addClass('dw-bubble-top');
                }

                // Calculate Arrow position
                arrw = arr.outerWidth();
                arrl = constrain(al + aw / 2 - (l + (modalWidth - arrw) / 2), 0, arrw);

                // Limit Arrow position
                $('.dw-arr', $markup).css({ left: arrl });
            } else {
                l = sl;
                if (s.display == 'top') {
                    t = st;
                } else if (s.display == 'bottom') {
                    t = st + nh - modalHeight;
                }
            }

            t = t < 0 ? 0 : t;

            css.top = t;
            css.left = l;
            $popup.css(css);

            // If top + modal height > doc height, increase doc height
            $persp.height(0);
            dh = Math.max(t + modalHeight, s.context == 'body' ? $(document).height() : $ctx[0].scrollHeight);
            $persp.css({ height: dh });

            // Scroll needed
            if (scroll && ((t + modalHeight > st + nh) || (at > st + nh))) {
                preventPos = true;
                setTimeout(function () { preventPos = false; }, 300);
                $wnd.scrollTop(Math.min(t + modalHeight - nh, dh - nh));
            }

            wndWidth = nw;
            wndHeight = nh;
        };

        /**
        * Show mobiscroll on focus and click event of the parameter.
        * @param {jQuery} $elm - Events will be attached to this element.
        * @param {Function} [beforeShow=undefined] - Optional function to execute before showing mobiscroll.
        */
        that.attachShow = function ($elm, beforeShow) {
            elmList.push({ readOnly: $elm.prop('readonly'), el: $elm });
            if (s.display !== 'inline') {
                if (setReadOnly && $elm.is('input')) {
                    $elm.prop('readonly', true).on('mousedown.dw', function (ev) {
                        // Prevent input to get focus on tap (virtual keyboard pops up on some devices)
                        ev.preventDefault();
                    });
                }

                if (s.showOnFocus) {
                    $elm.on('focus.dw', function () {
                        if (!preventShow) {
                            show(beforeShow, $elm);
                        }
                    });
                }

                if (s.showOnTap) {

                    $elm.on('keydown.dw', function (ev) {
                        if (ev.keyCode == 32 || ev.keyCode == 13) { // Space or Enter
                            ev.preventDefault();
                            ev.stopPropagation();
                            show(beforeShow, $elm);
                        }
                    });

                    that.tap($elm, function () {
                        show(beforeShow, $elm);
                    });
                }
            }
        };

        /**
        * Set button handler.
        */
        that.select = function () {
            if (!isModal || that.hide(false, 'set') !== false) {
                that._fillValue();
                event('onSelect', [that._value]);
            }
        };

        /**
        * Cancel and hide the scroller instance.
        */
        that.cancel = function () {
            if (!isModal || that.hide(false, 'cancel') !== false) {
                event('onCancel', [that._value]);
            }
        };

        /**
        * Clear button handler.
        */
        that.clear = function () {
            event('onClear', [$markup]);
            if (isModal && !that.live) {
                that.hide(false, 'clear');
            }
            that.setVal(null, true);
        };

        /**
        * Enables the scroller and the associated input.
        */
        that.enable = function () {
            s.disabled = false;
            if (that._isInput) {
                $elm.prop('disabled', false);
            }
        };

        /**
        * Disables the scroller and the associated input.
        */
        that.disable = function () {
            s.disabled = true;
            if (that._isInput) {
                $elm.prop('disabled', true);
            }
        };

        /**
        * Shows the scroller instance.
        * @param {Boolean} prevAnim - Prevent animation if true
        * @param {Boolean} prevFocus - Prevent focusing if true
        */
        that.show = function (prevAnim, prevFocus) {
            // Create wheels
            var html;

            if (s.disabled || that._isVisible) {
                return;
            }

            if (doAnim !== false) {
                if (s.display == 'top') {
                    doAnim = 'slidedown';
                }
                if (s.display == 'bottom') {
                    doAnim = 'slideup';
                }
            }

            // Parse value from input
            that._readValue();

            event('onBeforeShow', []);

            // Create wheels containers
            html = '<div lang="' + s.lang + '" class="mbsc-' + s.theme +  (s.baseTheme ? ' mbsc-' + s.baseTheme : '') + ' dw-' + s.display + ' ' +
                (s.cssClass || '') +
                (that._isLiquid ? ' dw-liq' : '') +
                (isOldAndroid ? ' mbsc-old' : '') +
                (hasButtons ? '' : ' dw-nobtn') + '">' +
                    '<div class="dw-persp">' +
                        (isModal ? '<div class="dwo"></div>' : '') + // Overlay
                        '<div' + (isModal ? ' role="dialog" tabindex="-1"' : '') + ' class="dw' + (s.rtl ? ' dw-rtl' : ' dw-ltr') + '">' + // Popup
                            (s.display === 'bubble' ? '<div class="dw-arrw"><div class="dw-arrw-i"><div class="dw-arr"></div></div></div>' : '') + // Bubble arrow
                            '<div class="dwwr">' + // Popup content
                                '<div aria-live="assertive" class="dw-aria dw-hidden"></div>' +
                                (s.headerText ? '<div class="dwv">' + (isString(s.headerText) ? s.headerText : '') + '</div>' : '') + // Header
                                '<div class="dwcc">' +
                                    '<i class="ui-dialog-close"></i>'; // Wheel group container
            
            html += that._generateContent();

            html += '</div>';

            if (hasButtons) {
                html += '<div class="dwbc">';
                $.each(buttons, function (i, b) {
                    b = isString(b) ? that.buttons[b] : b;

                    if (b.handler === 'set') {
                        b.parentClass = 'dwb-s';
                    }

                    if (b.handler === 'cancel') {
                        b.parentClass = 'dwb-c';
                    }

                    b.handler = isString(b.handler) ? that.handlers[b.handler] : b.handler;

                    html += '<div' + (s.btnWidth ? ' style="width:' + (100 / buttons.length) + '%"' : '') + ' class="dwbw ' + (b.parentClass || '') + '"><div tabindex="0" role="button" class="dwb' + i + ' dwb-e ' + (b.cssClass === undefined ? s.btnClass : b.cssClass) + (b.icon ? ' mbsc-ic mbsc-ic-' + b.icon : '') + '">' + (b.text || '') + '</div></div>';
                });
                html += '</div>';
            }
            html += '</div></div></div></div>';

            $markup = $(html);
            $persp = $('.dw-persp', $markup);
            $overlay = $('.dwo', $markup);
            $wrapper = $('.dwwr', $markup);
            $header = $('.dwv', $markup);
            $popup = $('.dw', $markup);
            $ariaDiv = $('.dw-aria', $markup);
            $closeBtn = $('.ui-dialog-close', $markup);

            $closeBtn.on('click', function() {
                that.cancel();
            });

            that._markup = $markup;
            that._header = $header;
            that._isVisible = true;

            posEvents = 'orientationchange resize';

            that._markupReady($markup);
            
            event('onMarkupReady', [$markup]);

            // Show
            if (isModal) {

                // Enter / ESC
                $(window).on('keydown', onWndKeyDown);

                // Prevent scroll if not specified otherwise
                if (s.scrollLock) {
                    $markup.on('touchmove mousewheel wheel', function (ev) {
                        if (scrollLock) {
                            ev.preventDefault();
                        }
                    });
                }

                // Disable inputs to prevent bleed through (Android bug)
                if (pr !== 'Moz') {
                    $('input,select,button', $ctx).each(function () {
                        if (!this.disabled) {
                            $(this).addClass('dwtd').prop('disabled', true);
                        }
                    });
                }

                posEvents += ' scroll';

                ms.activeInstance = that;

                $markup.appendTo($ctx);

                if (has3d && doAnim && !prevAnim) {
                    $markup.addClass('dw-in dw-trans').on(animEnd, function () {
                        $markup.off(animEnd).removeClass('dw-in dw-trans').find('.dw').removeClass('dw-' + doAnim);
                        onShow(prevFocus);
                    }).find('.dw').addClass('dw-' + doAnim);
                }
            } else if ($elm.is('div') && !that._hasContent) {
                $elm.html($markup);
            } else {
                $markup.insertAfter($elm);
            }

            event('onMarkupInserted', [$markup]);

            // Set position
            that.position();

            $wnd
                .on(posEvents, onPosition)
                .on('focusin', onFocus);

            // Events
            $markup
                .on('selectstart mousedown', prevdef) // Prevents blue highlight on Android and text selection in IE
                .on('click', '.dwb-e', prevdef)
                .on('keydown', '.dwb-e', function (ev) {
                    if (ev.keyCode == 32) { // Space
                        ev.preventDefault();
                        ev.stopPropagation();
                        $(this).click();
                    }
                })
                .on('keydown', function (ev) { // Trap focus inside modal
                    if (ev.keyCode == 32) { // Space
                        ev.preventDefault();
                    } else if (ev.keyCode == 9) { // Tab

                        var $focusable = $markup.find('[tabindex="0"]').filter(function () {
                                return this.offsetWidth > 0 || this.offsetHeight > 0;
                            }),
                            index = $focusable.index($(':focus', $markup)),
                            i = $focusable.length - 1,
                            target = 0;

                        if (ev.shiftKey) {
                            i = 0;
                            target = -1;
                        }

                        if (index === i) {
                            $focusable.eq(target).focus();
                            ev.preventDefault();
                        }

                    }
                });

            $('input', $markup).on('selectstart mousedown', function (ev) {
                ev.stopPropagation();
            });

            setTimeout(function () {
                // Init buttons
                $.each(buttons, function (i, b) {
                    that.tap($('.dwb' + i, $markup), function (ev) {
                        b = isString(b) ? that.buttons[b] : b;
                        b.handler.call(this, ev, that);
                    }, true);
                });

                if (s.closeOnOverlay) {
                    that.tap($overlay, function () {
                        that.cancel();
                    });
                }

                if (isModal && !doAnim) {
                    onShow(prevFocus);
                }

                $markup
                    .on('touchstart mousedown', '.dwb-e', onBtnStart)
                    .on('touchend', '.dwb-e', onBtnEnd);

                that._attachEvents($markup);

            }, 300);

            event('onShow', [$markup, that._tempValue]);
        };

        /**
        * Hides the scroller instance.
        */
        that.hide = function (prevAnim, btn, force) {

            // If onClose handler returns false, prevent hide
            if (!that._isVisible || (!force && !that._isValid && btn == 'set') || (!force && event('onClose', [that._tempValue, btn]) === false)) {
                return false;
            }

            // Hide wheels and overlay
            if ($markup) {

                // Re-enable temporary disabled fields
                if (pr !== 'Moz') {
                    $('.dwtd', $ctx).each(function () {
                        $(this).prop('disabled', false).removeClass('dwtd');
                    });
                }

                if (has3d && isModal && doAnim && !prevAnim && !$markup.hasClass('dw-trans')) { // If dw-trans class was not removed, means that there was no animation
                    $markup.addClass('dw-out dw-trans').find('.dw').addClass('dw-' + doAnim).on(animEnd, function () {
                        onHide(prevAnim);
                    });
                } else {
                    onHide(prevAnim);
                }

                // Stop positioning on window resize
                $wnd
                    .off(posEvents, onPosition)
                    .off('focusin', onFocus);
            }

            if (isModal) {
                $(window).off('keydown', onWndKeyDown);
                delete ms.activeInstance;
            }
        };

        that.ariaMessage = function (txt) {
            $ariaDiv.html('');
            setTimeout(function () {
                $ariaDiv.html(txt);
            }, 100);
        };

        /**
        * Return true if the scroller is currently visible.
        */
        that.isVisible = function () {
            return that._isVisible;
        };

        // Protected functions to override

        that.setVal = empty;

        that._generateContent = empty;

        that._attachEvents = empty;

        that._readValue = empty;

        that._fillValue = empty;

        that._markupReady = empty;

        that._processSettings = empty;

        that._presetLoad = function (s) {
            // Add default buttons
            s.buttons = s.buttons || (s.display !== 'inline' ? ['set', 'cancel'] : []);

            // Hide header text in inline mode by default
            s.headerText = s.headerText === undefined ? (s.display !== 'inline' ? '{value}' : false) : s.headerText;
        };

        // Generic frame functions

        /**
        * Attach tap event to the given element.
        */
        that.tap = function (el, handler, prevent) {
            var startX,
                startY,
                moved;

            if (s.tap) {
                el.on('touchstart.dw', function (ev) {
                    // Can't always call preventDefault here, it kills page scroll
                    if (prevent) {
                        ev.preventDefault();
                    }
                    startX = getCoord(ev, 'X');
                    startY = getCoord(ev, 'Y');
                    moved = false;
                }).on('touchmove.dw', function (ev) {
                    // If movement is more than 20px, don't fire the click event handler
                    if (Math.abs(getCoord(ev, 'X') - startX) > 20 || Math.abs(getCoord(ev, 'Y') - startY) > 20) {
                        moved = true;
                    }
                }).on('touchend.dw', function (ev) {
                    var that = this;
                    
                    if (!moved) {
                        // preventDefault and setTimeout are needed by iOS
                        ev.preventDefault();
                        //setTimeout(function () {
                        handler.call(that, ev);
                        //}, isOldAndroid ? 400 : 10);
                    }
                    // Prevent click events to happen
                    ms.tapped = true;
                    setTimeout(function () {
                        ms.tapped = false;
                    }, 500);
                });
            }

            el.on('click.dw', function (ev) {
                if (!ms.tapped) {
                    // If handler was not called on touchend, call it on click;
                    handler.call(this, ev);
                }
                ev.preventDefault();
            });

        };

        /**
        * Destroys the mobiscroll instance.
        */
        that.destroy = function () {
            // Force hide without animation
            that.hide(true, false, true);

            // Remove all events from elements
            $.each(elmList, function (i, v) {
                v.el.off('.dw').prop('readonly', v.readOnly);
            });

            that._destroy();
        };

        /**
        * Scroller initialization.
        */
        that.init = function (ss) {

            that._init(ss);

            that._isLiquid = (s.layout || (/top|bottom/.test(s.display) ? 'liquid' : '')) === 'liquid';

            that._processSettings();

            // Unbind all events (if re-init)
            $elm.off('.dw');

            doAnim = isOldAndroid ? false : s.animate;
            buttons = s.buttons || [];
            isModal = s.display !== 'inline';
            setReadOnly = s.showOnFocus || s.showOnTap;
            $wnd = $(s.context == 'body' ? window : s.context);
            $ctx = $(s.context);

            that.context = $wnd;

            that.live = true;

            // If no set button is found, live mode is activated
            $.each(buttons, function (i, b) {
                if (b == 'ok' || b == 'set' || b.handler == 'set') {
                    that.live = false;
                    return false;
                }
            });

            that.buttons.set = { text: s.setText, handler: 'set' };
            that.buttons.cancel = { text: (that.live) ? s.closeText : s.cancelText, handler: 'cancel' };
            that.buttons.clear = { text: s.clearText, handler: 'clear' };

            that._isInput = $elm.is('input');

            hasButtons = buttons.length > 0;

            if (that._isVisible) {
                that.hide(true, false, true);
            }

            event('onInit', []);

            if (isModal) {
                that._readValue();
                if (!that._hasContent) {
                    that.attachShow($elm);
                }
            } else {
                that.show();
            }

            $elm.on('change.dw', function () {
                if (!that._preventChange) {
                    that.setVal($elm.val(), true, false);
                }
                that._preventChange = false;
            });
        };

        that.buttons = {};
        that.handlers = {
            set: that.select,
            cancel: that.cancel,
            clear: that.clear
        };

        that._value = null;

        that._isValid = true;
        that._isVisible = false;

        // Constructor

        s = that.settings;
        event = that.trigger;

        if (!inherit) {
            that.init(settings);
        }
    };

    ms.classes.Frame.prototype._defaults = {
        // Localization
        lang: 'en',
        setText: 'Set',
        selectedText: 'Selected',
        closeText: 'Close',
        cancelText: 'Cancel',
        clearText: 'Clear',
        // Options
        disabled: false,
        closeOnOverlay: true,
        showOnFocus: false,
        showOnTap: true,
        display: 'modal',
        scrollLock: true,
        tap: true,
        btnClass: 'dwb',
        btnWidth: true,
        focusOnClose: !isIOS8 // Temporary for iOS8
    };

    ms.themes.frame.mobiscroll = {
        rows: 5,
        showLabel: false,
        headerText: false,
        btnWidth: false,
        selectedLineHeight: true,
        selectedLineBorder: 1,
        dateOrder: 'MMddyy',
        weekDays: 'min',
        checkIcon: 'ion-ios7-checkmark-empty',
        btnPlusClass: 'mbsc-ic mbsc-ic-arrow-down5',
        btnMinusClass: 'mbsc-ic mbsc-ic-arrow-up5',
        btnCalPrevClass: 'mbsc-ic mbsc-ic-arrow-left5',
        btnCalNextClass: 'mbsc-ic mbsc-ic-arrow-right5'
    };

    // Prevent re-show on window focus
    $(window).on('focus', function () {
        if ($activeElm) {
            preventShow = true;
        }
    });

    // Prevent standard behaviour on body click
    $(document).on('mouseover mouseup mousedown click', function (ev) { 
        if (ms.tapped) {
            ev.stopPropagation();
            ev.preventDefault();
            return false;
        }
    });

})(jQuery, window, document);
;(function ($, window, document, undefined) {

    var move,
        ms = $.mobiscroll,
        classes = ms.classes,
        util = ms.util,
        pr = util.jsPrefix,
        has3d = util.has3d,
        hasFlex = util.hasFlex,
        getCoord = util.getCoord,
        constrain = util.constrain,
        testTouch = util.testTouch;

    ms.presetShort('scroller', 'Scroller', false);

    classes.Scroller = function (el, settings, inherit) {
        var $markup,
            btn,
            isScrollable,
            itemHeight,
            multiple,
            s,
            scrollDebounce,
            trigger,

            click,
            moved,
            start,
            startTime,
            stop,
            p,
            min,
            max,
            target,
            index,
            lines,
            timer,
            that = this,
            $elm = $(el),
            iv = {},
            pos = {},
            pixels = {},
            wheels = [];

        // Event handlers

        function onStart(ev) {
            // Scroll start
            if (testTouch(ev, this) && !move && !click && !btn && !isReadOnly(this)) {
                // Prevent touch highlight
                ev.preventDefault();
                // Better performance if there are tap events on document
                ev.stopPropagation();

                move = true;
                isScrollable = s.mode != 'clickpick';
                target = $('.dw-ul', this);
                setGlobals(target);
                moved = iv[index] !== undefined; // Don't allow tap, if still moving
                p = moved ? getCurrentPosition(target) : pos[index];
                start = getCoord(ev, 'Y');
                startTime = new Date();
                stop = start;
                scroll(target, index, p, 0.001);

                if (isScrollable) {
                    target.closest('.dwwl').addClass('dwa');
                }

                if (ev.type === 'mousedown') {
                    $(document).on('mousemove', onMove).on('mouseup', onEnd);
                }
            }
        }

        function onMove(ev) {
            if (move) {
                if (isScrollable) {
                    // Prevent scroll
                    ev.preventDefault();
                    ev.stopPropagation();
                    stop = getCoord(ev, 'Y');
                    if (Math.abs(stop - start) > 3 || moved) {
                        scroll(target, index, constrain(p + (start - stop) / itemHeight, min - 1, max + 1));
                        moved = true;
                    }
                }
            }
        }

        function onEnd(ev) {
            if (move) {
                var time = new Date() - startTime,
                    curr = constrain(Math.round(p + (start - stop) / itemHeight), min - 1, max + 1),
                    val = curr,
                    speed,
                    dist,
                    ttop = target.offset().top;

                // Better performance if there are tap events on document
                ev.stopPropagation();

                move = false;

                if (ev.type === 'mouseup') {
                    $(document).off('mousemove', onMove).off('mouseup', onEnd);
                }

                if (has3d && time < 300) {
                    speed = (stop - start) / time;
                    dist = (speed * speed) / s.speedUnit;
                    if (stop - start < 0) {
                        dist = -dist;
                    }
                } else {
                    dist = stop - start;
                }

                if (!moved) { // this is a "tap"
                    var idx = Math.floor((stop - ttop) / itemHeight),
                        li = $($('.dw-li', target)[idx]),
                        valid = li.hasClass('dw-v'),
                        hl = isScrollable;

                    time = 0.1;

                    if (trigger('onValueTap', [li]) !== false && valid) {
                        val = idx;
                    } else {
                        hl = true;
                    }

                    if (hl && valid) {
                        li.addClass('dw-hl'); // Highlight
                        setTimeout(function () {
                            li.removeClass('dw-hl');
                        }, 100);
                    }

                    if (!multiple && (s.confirmOnTap === true || s.confirmOnTap[index]) && li.hasClass('dw-sel')) {
                        that.select();
                        return;
                    }
                } else {
                    val = constrain(Math.round(p - dist / itemHeight), min, max);
                    time = speed ? Math.max(0.1, Math.abs((val - curr) / speed) * s.timeUnit) : 0.1;
                }

                if (isScrollable) {
                    calc(target, index, val, 0, time, true);
                }
            }
        }

        function onBtnStart(ev) {
            btn = $(this);
            // +/- buttons
            if (testTouch(ev, this)) {
                step(ev, btn.closest('.dwwl'), btn.hasClass('dwwbp') ? plus : minus);
            }
            if (ev.type === 'mousedown') {
                $(document).on('mouseup', onBtnEnd);
            }
        }

        function onBtnEnd(ev) {
            btn = null;
            if (click) {
                clearInterval(timer);
                click = false;
            }
            if (ev.type === 'mouseup') {
                $(document).off('mouseup', onBtnEnd);
            }
        }

        function onKeyDown(ev) {
            if (ev.keyCode == 38) { // up
                step(ev, $(this), minus);
            } else if (ev.keyCode == 40) { // down
                step(ev, $(this), plus);
            }
        }

        function onKeyUp() {
            if (click) {
                clearInterval(timer);
                click = false;
            }
        }

        function onScroll(ev) {
            if (!isReadOnly(this)) {
                ev.preventDefault();
                ev = ev.originalEvent || ev;

                var delta = ev.deltaY || ev.wheelDelta || ev.detail,
                    t = $('.dw-ul', this);

                setGlobals(t);

                scroll(t, index, constrain(((delta < 0 ? -20 : 20) - pixels[index]) / itemHeight, min - 1, max + 1));

                clearTimeout(scrollDebounce);
                scrollDebounce = setTimeout(function () {
                    calc(t, index, Math.round(pos[index]), delta > 0 ? 1 : 2, 0.1);
                }, 200);
            }
        }

        // Private functions

        function step(ev, w, func) {
            ev.stopPropagation();
            ev.preventDefault();
            if (!click && !isReadOnly(w) && !w.hasClass('dwa')) {
                click = true;
                // + Button
                var t = w.find('.dw-ul');

                setGlobals(t);
                clearInterval(timer);
                timer = setInterval(function () { func(t); }, s.delay);
                func(t);
            }
        }

        function isReadOnly(wh) {
            if ($.isArray(s.readonly)) {
                var i = $('.dwwl', $markup).index(wh);
                return s.readonly[i];
            }
            return s.readonly;
        }

        function generateWheelItems(i) {
            var html = '<div class="dw-bf">',
                w = wheels[i],
                l = 1,
                labels = w.labels || [],
                values = w.values || [],
                keys = w.keys || values;

            $.each(values, function (j, v) {
                if (l % 20 === 0) {
                    html += '</div><div class="dw-bf">';
                }
                html += '<div role="option" aria-selected="false" class="dw-li dw-v" data-val="' + keys[j] + '"' + (labels[j] ? ' aria-label="' + labels[j] + '"' : '') + ' style="height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;">' +
                    '<div class="dw-i"' + (lines > 1 ? ' style="line-height:' + Math.round(itemHeight / lines) + 'px;font-size:' + Math.round(itemHeight / lines * 0.8) + 'px;"' : '') + '>' + v + '</div></div>';
                l++;
            });

            html += '</div>';
            return html;
        }

        function setGlobals(t) {
            multiple = t.closest('.dwwl').hasClass('dwwms');
            min = $('.dw-li', t).index($(multiple ? '.dw-li' : '.dw-v', t).eq(0));
            max = Math.max(min, $('.dw-li', t).index($(multiple ? '.dw-li' : '.dw-v', t).eq(-1)) - (multiple ? s.rows - (s.mode == 'scroller' ? 1 : 3) : 0));
            index = $('.dw-ul', $markup).index(t);
        }

        function formatHeader(v) {
            var t = s.headerText;
            return t ? (typeof t === 'function' ? t.call(el, v) : t.replace(/\{value\}/i, v)) : '';
        }

        function getCurrentPosition(t) {
            return Math.round(-util.getPosition(t, true) / itemHeight);
        }

        function ready(t, i) {
            clearTimeout(iv[i]);
            delete iv[i];
            t.closest('.dwwl').removeClass('dwa');
        }

        function scroll(t, index, val, time, active) {
            var px = -val * itemHeight,
                style = t[0].style;

            if (px == pixels[index] && iv[index]) {
                return;
            }

            //if (time && px != pixels[index]) {
            // Trigger animation start event
            //trigger('onAnimStart', [$markup, index, time]);
            //}

            pixels[index] = px;

            if (has3d) {
                style[pr + 'Transition'] = util.prefix + 'transform ' + (time ? time.toFixed(3) : 0) + 's ease-out';
                style[pr + 'Transform'] = 'translate3d(0,' + px + 'px,0)';
            } else {
                style.top = px + 'px';
            }

            if (iv[index]) {
                ready(t, index);
            }

            if (time && active) {
                t.closest('.dwwl').addClass('dwa');
                iv[index] = setTimeout(function () {
                    ready(t, index);
                }, time * 1000);
            }

            pos[index] = val;
        }

        function getValid(val, t, dir, multiple, select) {
            var selected,
                cell = $('.dw-li[data-val="' + val + '"]', t),
                cells = $('.dw-li', t),
                v = cells.index(cell),
                l = cells.length;

            if (multiple) {
                setGlobals(t);
            } else if (!cell.hasClass('dw-v')) { // Scroll to a valid cell
                var cell1 = cell,
                    cell2 = cell,
                    dist1 = 0,
                    dist2 = 0;

                while (v - dist1 >= 0 && !cell1.hasClass('dw-v')) {
                    dist1++;
                    cell1 = cells.eq(v - dist1);
                }

                while (v + dist2 < l && !cell2.hasClass('dw-v')) {
                    dist2++;
                    cell2 = cells.eq(v + dist2);
                }

                // If we have direction (+/- or mouse wheel), the distance does not count
                if (((dist2 < dist1 && dist2 && dir !== 2) || !dist1 || (v - dist1 < 0) || dir == 1) && cell2.hasClass('dw-v')) {
                    cell = cell2;
                    v = v + dist2;
                } else {
                    cell = cell1;
                    v = v - dist1;
                }
            }

            selected = cell.hasClass('dw-sel');

            if (select) {
                if (!multiple) {
                    $('.dw-sel', t).removeAttr('aria-selected');
                    cell.attr('aria-selected', 'true');
                }

                // Add selected class to cell
                $('.dw-sel', t).removeClass('dw-sel');
                cell.addClass('dw-sel');
            }

            return {
                selected: selected,
                v: multiple ? constrain(v, min, max) : v,
                val: cell.hasClass('dw-v') ? cell.attr('data-val') : null
            };
        }

        function scrollToPos(time, index, manual, dir, active) {
            // Call validation event
            if (trigger('validate', [$markup, index, time, dir]) !== false) {
                // Set scrollers to position
                $('.dw-ul', $markup).each(function (i) {
                    var t = $(this),
                        multiple = t.closest('.dwwl').hasClass('dwwms'),
                        sc = i == index || index === undefined,
                        res = getValid(that._tempWheelArray[i], t, dir, multiple, true),
                        selected = res.selected;

                    if (!selected || sc) {
                        // Set valid value
                        that._tempWheelArray[i] = res.val;

                        // Scroll to position
                        scroll(t, i, res.v, sc ? time : 0.1, sc ? active : false);
                    }
                });

                trigger('onValidated', []);

                // Reformat value if validation changed something
                that._tempValue = s.formatValue(that._tempWheelArray, that);

                if (that.live) {
                    that._hasValue = manual || that._hasValue;
                    setValue(manual, manual, 0, true);
                }

                that._header.html(formatHeader(that._tempValue));

                if (manual) {
                    trigger('onChange', [that._tempValue]);
                }
            }

        }

        function calc(t, idx, val, dir, time, active) {
            val = constrain(val, min, max);

            // Set selected scroller value
            that._tempWheelArray[idx] = $('.dw-li', t).eq(val).attr('data-val');

            scroll(t, idx, val, time, active);

            setTimeout(function () {
                // Validate
                scrollToPos(time, idx, true, dir, active);
            }, 10);
        }

        function plus(t) {
            var val = pos[index] + 1;
            calc(t, index, val > max ? min : val, 1, 0.1);
        }

        function minus(t) {
            var val = pos[index] - 1;
            calc(t, index, val < min ? max : val, 2, 0.1);
        }

        function setValue(fill, change, time, noscroll, temp) {
            if (that._isVisible && !noscroll) {
                scrollToPos(time);
            }

            that._tempValue = s.formatValue(that._tempWheelArray, that);

            if (!temp) {
                that._wheelArray = that._tempWheelArray.slice(0);
                that._value = that._hasValue ? that._tempValue : null;
            }

            if (fill) {

                trigger('onValueFill', [that._hasValue ? that._tempValue : '', change]);

                if (that._isInput) {
                    $elm.val(that._hasValue ? that._tempValue : '');
                }

                if (change) {
                    that._preventChange = true;
                    $elm.change();
                }
            }
        }

        // Call the parent constructor
        classes.Frame.call(this, el, settings, true);

        // Public functions

        /**
        * Gets the selected wheel values, formats it, and set the value of the scroller instance.
        * If input parameter is true, populates the associated input element.
        * @param {Array} values Wheel values.
        * @param {Boolean} [fill=false] Also set the value of the associated input element.
        * @param {Number} [time=0] Animation time
        * @param {Boolean} [temp=false] If true, then only set the temporary value.(only scroll there but not set the value)
        * @param {Boolean} [change=false] Trigger change on the input element
        */
        that.setVal = that._setVal = function (val, fill, change, temp, time) {
            that._hasValue = val !== null && val !== undefined;
            that._tempWheelArray = $.isArray(val) ? val.slice(0) : s.parseValue.call(el, val, that) || [];
            setValue(fill, change === undefined ? fill : change, time, false, temp);
        };

        /**
         * Returns the selected value
         */
        that.getVal = that._getVal = function (temp) {
            var val = that._hasValue || temp ? that[temp ? '_tempValue' : '_value'] : null;
            return util.isNumeric(val) ? +val : val;
        };

        /*
         * Sets the wheel values (passed as an array)
         */
        that.setArrayVal = that.setVal;

        /*
         * Returns the selected wheel values as an array
         */
        that.getArrayVal = function (temp) {
            return temp ? that._tempWheelArray : that._wheelArray;
        };

        // @deprecated since 2.14.0, backward compatibility code
        // ---

        that.setValue = function (val, fill, time, temp, change) {
            that.setVal(val, fill, change, temp, time);
        };

        /**
        * Return the selected wheel values.
        */
        that.getValue = that.getArrayVal;

        // ---

        /**
        * Changes the values of a wheel, and scrolls to the correct position
        * @param {Array} idx Indexes of the wheels to change.
        * @param {Number} [time=0] Animation time when scrolling to the selected value on the new wheel.
        * @param {Boolean} [manual=false] Indicates that the change was triggered by the user or from code.
        */
        that.changeWheel = function (idx, time, manual) {
            if ($markup) {
                var i = 0,
                    nr = idx.length;

                $.each(s.wheels, function (j, wg) {
                    $.each(wg, function (k, w) {
                        if ($.inArray(i, idx) > -1) {
                            wheels[i] = w;
                            $('.dw-ul', $markup).eq(i).html(generateWheelItems(i));
                            nr--;
                            if (!nr) {
                                that.position();
                                scrollToPos(time, undefined, manual);
                                return false;
                            }
                        }
                        i++;
                    });
                    if (!nr) {
                        return false;
                    }
                });
            }
        };

        /**
        * Returns the closest valid cell.
        */
        that.getValidCell = getValid;

        that.scroll = scroll;

        // Protected overrides

        that._generateContent = function () {
            var lbl,
                html = '',
                l = 0;

            $.each(s.wheels, function (i, wg) { // Wheel groups
                html += '<div class="mbsc-w-p dwc' + (s.mode != 'scroller' ? ' dwpm' : ' dwsc') + (s.showLabel ? '' : ' dwhl') + '">' +
                            '<div class="dwwc"' + (s.maxWidth ? '' : ' style="max-width:600px;"') + '>' +
                                (hasFlex ? '' : '<table class="dw-tbl" cellpadding="0" cellspacing="0"><tr>');

                $.each(wg, function (j, w) { // Wheels
                    wheels[l] = w;
                    lbl = w.label !== undefined ? w.label : j;
                    html += '<' + (hasFlex ? 'div' : 'td') + ' class="dwfl"' + ' style="' +
                                    (s.fixedWidth ? ('width:' + (s.fixedWidth[l] || s.fixedWidth) + 'px;') :
                                    (s.minWidth ? ('min-width:' + (s.minWidth[l] || s.minWidth) + 'px;') : 'min-width:' + s.width + 'px;') +
                                    (s.maxWidth ? ('max-width:' + (s.maxWidth[l] || s.maxWidth) + 'px;') : '')) + '">' +
                                '<div class="dwwl dwwl' + l + (w.multiple ? ' dwwms' : '') + '">' +
                                (s.mode != 'scroller' ?
                                    '<div class="dwb-e dwwb dwwbp ' + (s.btnPlusClass || '') + '" style="height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;"><span>+</span></div>' + // + button
                                    '<div class="dwb-e dwwb dwwbm ' + (s.btnMinusClass || '') + '" style="height:' + itemHeight + 'px;line-height:' + itemHeight + 'px;"><span>&ndash;</span></div>' : '') + // - button
                                '<div class="dwl">' + lbl + '</div>' + // Wheel label
                                '<div tabindex="0" aria-live="off" aria-label="' + lbl + '" role="listbox" class="dwww">' +
                                    '<div class="dww" style="height:' + (s.rows * itemHeight) + 'px;">' +
                                        '<div class="dw-ul" style="margin-top:' + (w.multiple ? (s.mode == 'scroller' ? 0 : itemHeight) : s.rows / 2 * itemHeight - itemHeight / 2) + 'px;">';

                    // Create wheel values
                    html += generateWheelItems(l) +
                        '</div></div><div class="dwwo"></div></div><div class="dwwol"' +
                        (s.selectedLineHeight ? ' style="height:' + itemHeight + 'px;margin-top:-' + (itemHeight / 2 + (s.selectedLineBorder || 0)) + 'px;"' : '') + '></div></div>' +
                        (hasFlex ? '</div>' : '</td>');

                    l++;
                });

                html += (hasFlex ? '' : '</tr></table>') + '</div></div>';
            });

            return html;
        };

        that._attachEvents = function ($markup) {
            $markup
                .on('keydown', '.dwwl', onKeyDown)
                .on('keyup', '.dwwl', onKeyUp)
                .on('touchstart mousedown', '.dwwl', onStart)
                .on('touchmove', '.dwwl', onMove)
                .on('touchend', '.dwwl', onEnd)
                .on('touchstart mousedown', '.dwwb', onBtnStart)
                .on('touchend', '.dwwb', onBtnEnd);

            if (s.mousewheel) {
                $markup.on('wheel mousewheel', '.dwwl', onScroll);
            }
        };

        that._markupReady = function ($m) {
            $markup = $m;
            scrollToPos();
        };

        that._fillValue = function () {
            that._hasValue = true;
            setValue(true, true, 0, true);
        };

        that._readValue = function () {
            var v = $elm.val() || '';

            if (v !== '') {
                that._hasValue = true;
            }

            that._tempWheelArray = that._hasValue && that._wheelArray ? that._wheelArray.slice(0) : s.parseValue.call(el, v, that) || [];
            setValue();
        };

        that._processSettings = function () {
            s = that.settings;
            trigger = that.trigger;
            itemHeight = s.height;
            lines = s.multiline;

            that._isLiquid = (s.layout || (/top|bottom/.test(s.display) && s.wheels.length == 1 ? 'liquid' : '')) === 'liquid';

            // @deprecated since 2.15.0, backward compatibility code
            // ---
            if (s.formatResult) {
                s.formatValue = s.formatResult;
            }
            // ---

            if (lines > 1) {
                s.cssClass = (s.cssClass || '') + ' dw-ml';
            }

            // Ensure a minimum number of 3 items if clickpick buttons present
            if (s.mode != 'scroller') {
                s.rows = Math.max(3, s.rows);
            }
        };

        // Properties

        that._selectedValues = {};

        // Constructor
        if (!inherit) {
            that.init(settings);
        }
    };

    // Extend defaults
    classes.Scroller.prototype = {
        _hasDef: true,
        _hasTheme: true,
        _hasLang: true,
        _hasPreset: true,
        _class: 'scroller',
        _defaults: $.extend({}, classes.Frame.prototype._defaults, {
            // Options
            minWidth: 70,
            height: 40,
            rows: 3,
            multiline: 1,
            delay: 300,
            readonly: false,
            showLabel: true,
            confirmOnTap: true,
            wheels: [],
            mode: 'scroller',
            preset: '',
            speedUnit: 0.0012,
            timeUnit: 0.08,
            formatValue: function (d) {
                return d.join(' ');
            },
            parseValue: function (value, inst) {
                var val = [],
                    ret = [],
                    i = 0,
                    found,
                    keys;

                if (value !== null && value !== undefined) {
                    val = (value + '').split(' ');
                }

                $.each(inst.settings.wheels, function (j, wg) {
                    $.each(wg, function (k, w) {
                        keys = w.keys || w.values;
                        found = keys[0]; // Default to first wheel value if not found
                        $.each(keys, function (l, key) {
                            if (val[i] == key) { // Don't do strict comparison
                                found = key;
                                return false;
                            }
                        });
                        ret.push(found);
                        i++;
                    });
                });
                return ret;
            }
        })
    };

    ms.themes.scroller = ms.themes.frame;

})(jQuery, window, document);
;(function ($, undefined) {
    var ms = $.mobiscroll;

    ms.datetime = {
        defaults: {
            shortYearCutoff: '+10',
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            amText: 'am',
            pmText: 'pm',
            getYear: function (d) { return d.getFullYear(); },
            getMonth: function (d) { return d.getMonth(); },
            getDay: function (d) { return d.getDate(); },
            getDate: function (y, m, d, h, i, s, u) { return new Date(y, m, d, h || 0, i || 0, s || 0, u || 0); },
            getMaxDayOfMonth: function (y, m) { return 32 - new Date(y, m, 32).getDate(); },
            getWeekNumber: function (d) {
                // Copy date so don't modify original
                d = new Date(d);
                d.setHours(0, 0, 0);
                // Set to nearest Thursday: current date + 4 - current day number
                // Make Sunday's day number 7
                d.setDate(d.getDate() + 4 - (d.getDay() || 7));
                // Get first day of year
                var yearStart = new Date(d.getFullYear(), 0, 1);
                // Calculate full weeks to nearest Thursday
                return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
            }
        },
        /**
        * Format a date into a string value with a specified format.
        * @param {String} format Output format.
        * @param {Date} date Date to format.
        * @param {Object} [settings={}] Settings.
        * @return {String} Returns the formatted date string.
        */
        formatDate: function (format, date, settings) {
            if (!date) {
                return null;
            }
            var s = $.extend({}, ms.datetime.defaults, settings),
                look = function (m) { // Check whether a format character is doubled
                    var n = 0;
                    while (i + 1 < format.length && format.charAt(i + 1) == m) {
                        n++;
                        i++;
                    }
                    return n;
                },
                f1 = function (m, val, len) { // Format a number, with leading zero if necessary
                    var n = '' + val;
                    if (look(m)) {
                        while (n.length < len) {
                            n = '0' + n;
                        }
                    }
                    return n;
                },
                f2 = function (m, val, s, l) { // Format a name, short or long as requested
                    return (look(m) ? l[val] : s[val]);
                },
                i,
                year,
                output = '',
                literal = false;

            for (i = 0; i < format.length; i++) {
                if (literal) {
                    if (format.charAt(i) == "'" && !look("'")) {
                        literal = false;
                    } else {
                        output += format.charAt(i);
                    }
                } else {
                    switch (format.charAt(i)) {
                        case 'd':
                            output += f1('d', s.getDay(date), 2);
                            break;
                        case 'D':
                            output += f2('D', date.getDay(), s.dayNamesShort, s.dayNames);
                            break;
                        case 'o':
                            output += f1('o', (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000, 3);
                            break;
                        case 'm':
                            output += f1('m', s.getMonth(date) + 1, 2);
                            break;
                        case 'M':
                            output += f2('M', s.getMonth(date), s.monthNamesShort, s.monthNames);
                            break;
                        case 'y':
                            year = s.getYear(date);
                            output += (look('y') ? year : (year % 100 < 10 ? '0' : '') + year % 100);
                            //output += (look('y') ? date.getFullYear() : (date.getYear() % 100 < 10 ? '0' : '') + date.getYear() % 100);
                            break;
                        case 'h':
                            var h = date.getHours();
                            output += f1('h', (h > 12 ? (h - 12) : (h === 0 ? 12 : h)), 2);
                            break;
                        case 'H':
                            output += f1('H', date.getHours(), 2);
                            break;
                        case 'i':
                            output += f1('i', date.getMinutes(), 2);
                            break;
                        case 's':
                            output += f1('s', date.getSeconds(), 2);
                            break;
                        case 'a':
                            output += date.getHours() > 11 ? s.pmText : s.amText;
                            break;
                        case 'A':
                            output += date.getHours() > 11 ? s.pmText.toUpperCase() : s.amText.toUpperCase();
                            break;
                        case "'":
                            if (look("'")) {
                                output += "'";
                            } else {
                                literal = true;
                            }
                            break;
                        default:
                            output += format.charAt(i);
                    }
                }
            }
            return output;
        },
        /**
        * Extract a date from a string value with a specified format.
        * @param {String} format Input format.
        * @param {String} value String to parse.
        * @param {Object} [settings={}] Settings.
        * @return {Date} Returns the extracted date.
        */
        parseDate: function (format, value, settings) {
            var s = $.extend({}, ms.datetime.defaults, settings),
                def = s.defaultValue || new Date();

            if (!format || !value) {
                return def;
            }

            // If already a date object
            if (value.getTime) {
                return value;
            }

            value = (typeof value == 'object' ? value.toString() : value + '');

            var shortYearCutoff = s.shortYearCutoff,
                year = s.getYear(def),
                month = s.getMonth(def) + 1,
                day = s.getDay(def),
                doy = -1,
                hours = def.getHours(),
                minutes = def.getMinutes(),
                seconds = 0, //def.getSeconds(),
                ampm = -1,
                literal = false, // Check whether a format character is doubled
                lookAhead = function (match) {
                    var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
                    if (matches) {
                        iFormat++;
                    }
                    return matches;
                },
                getNumber = function (match) { // Extract a number from the string value
                    lookAhead(match);
                    var size = (match == '@' ? 14 : (match == '!' ? 20 : (match == 'y' ? 4 : (match == 'o' ? 3 : 2)))),
                        digits = new RegExp('^\\d{1,' + size + '}'),
                        num = value.substr(iValue).match(digits);

                    if (!num) {
                        return 0;
                    }
                    iValue += num[0].length;
                    return parseInt(num[0], 10);
                },
                getName = function (match, s, l) { // Extract a name from the string value and convert to an index
                    var names = (lookAhead(match) ? l : s),
                        i;

                    for (i = 0; i < names.length; i++) {
                        if (value.substr(iValue, names[i].length).toLowerCase() == names[i].toLowerCase()) {
                            iValue += names[i].length;
                            return i + 1;
                        }
                    }
                    return 0;
                },
                checkLiteral = function () {
                    iValue++;
                },
                iValue = 0,
                iFormat;

            for (iFormat = 0; iFormat < format.length; iFormat++) {
                if (literal) {
                    if (format.charAt(iFormat) == "'" && !lookAhead("'")) {
                        literal = false;
                    } else {
                        checkLiteral();
                    }
                } else {
                    switch (format.charAt(iFormat)) {
                        case 'd':
                            day = getNumber('d');
                            break;
                        case 'D':
                            getName('D', s.dayNamesShort, s.dayNames);
                            break;
                        case 'o':
                            doy = getNumber('o');
                            break;
                        case 'm':
                            month = getNumber('m');
                            break;
                        case 'M':
                            month = getName('M', s.monthNamesShort, s.monthNames);
                            break;
                        case 'y':
                            year = getNumber('y');
                            break;
                        case 'H':
                            hours = getNumber('H');
                            break;
                        case 'h':
                            hours = getNumber('h');
                            break;
                        case 'i':
                            minutes = getNumber('i');
                            break;
                        case 's':
                            seconds = getNumber('s');
                            break;
                        case 'a':
                            ampm = getName('a', [s.amText, s.pmText], [s.amText, s.pmText]) - 1;
                            break;
                        case 'A':
                            ampm = getName('A', [s.amText, s.pmText], [s.amText, s.pmText]) - 1;
                            break;
                        case "'":
                            if (lookAhead("'")) {
                                checkLiteral();
                            } else {
                                literal = true;
                            }
                            break;
                        default:
                            checkLiteral();
                    }
                }
            }
            if (year < 100) {
                year += new Date().getFullYear() - new Date().getFullYear() % 100 +
                    (year <= (typeof shortYearCutoff != 'string' ? shortYearCutoff : new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10)) ? 0 : -100);
            }
            if (doy > -1) {
                month = 1;
                day = doy;
                do {
                    var dim = 32 - new Date(year, month - 1, 32).getDate();
                    if (day <= dim) {
                        break;
                    }
                    month++;
                    day -= dim;
                } while (true);
            }
            hours = (ampm == -1) ? hours : ((ampm && hours < 12) ? (hours + 12) : (!ampm && hours == 12 ? 0 : hours));

            var date = s.getDate(year, month - 1, day, hours, minutes, seconds);

            if (s.getYear(date) != year || s.getMonth(date) + 1 != month || s.getDay(date) != day) {
                return def; // Invalid date
            }

            return date;
        }
    };

    // @deprecated since 2.11.0, backward compatibility code
    // ---
    ms.formatDate = ms.datetime.formatDate;
    ms.parseDate = ms.datetime.parseDate;
    // ---
    
})(jQuery);;(function ($, undefined) {

    var ms = $.mobiscroll,
        datetime = ms.datetime,
        date = new Date(),
        defaults = {
            startYear: date.getFullYear() - 100,
            endYear: date.getFullYear() + 1, 
            separator: ' ',
            // Localization
            dateFormat: 'mm/dd/yy',
            dateOrder: 'mmddy',
            timeWheels: 'hhiiA',
            timeFormat: 'hh:ii A',
            dayText: 'Day',
            monthText: 'Month',
            yearText: 'Year',
            hourText: 'Hours',
            minuteText: 'Minutes',
            ampmText: '&nbsp;',
            secText: 'Seconds',
            nowText: 'Now'
        },
        /**
         * @class Mobiscroll.datetime
         * @extends Mobiscroll
         * Mobiscroll Datetime component
         */
        preset = function (inst) {
            var that = $(this),
                html5def = {},
                format;
            // Force format for html5 date inputs (experimental)
            if (that.is('input')) {
                switch (that.attr('type')) {
                case 'date':
                    format = 'yy-mm-dd';
                    break;
                case 'datetime':
                    format = 'yy-mm-ddTHH:ii:ssZ';
                    break;
                case 'datetime-local':
                    format = 'yy-mm-ddTHH:ii:ss';
                    break;
                case 'month':
                    format = 'yy-mm';
                    html5def.dateOrder = 'mmyy';
                    break;
                case 'time':
                    format = 'HH:ii:ss';
                    break;
                }
                // Check for min/max attributes
                var min = that.attr('min'),
                    max = that.attr('max');
                if (min) {
                    html5def.minDate = datetime.parseDate(format, min);
                }
                if (max) {
                    html5def.maxDate = datetime.parseDate(format, max);
                }
            }

            // Set year-month-day order
            var i,
                k,
                keys,
                values,
                wg,
                start,
                end,
                hasTime,
                mins,
                maxs,
                orig = $.extend({}, inst.settings),
                s = $.extend(inst.settings, ms.datetime.defaults, defaults, html5def, orig),
                offset = 0,
                validValues = [],
                wheels = [],
                ord = [],
                o = {},
                innerValues = {},
                f = { y: getYear, m: getMonth, d: getDay, h: getHour, i: getMinute, s: getSecond, u: getMillisecond, a: getAmPm },
                invalid = s.invalid,
                valid = s.valid,
                p = s.preset,
                dord = s.dateOrder,
                tord = s.timeWheels,
                regen = dord.match(/D/),
                ampm = tord.match(/a/i),
                hampm = tord.match(/h/),
                hformat = p == 'datetime' ? s.dateFormat + s.separator + s.timeFormat : p == 'time' ? s.timeFormat : s.dateFormat,
                defd = new Date(),
                steps = s.steps || {},
                stepH = steps.hour || s.stepHour || 1,
                stepM = steps.minute || s.stepMinute || 1,
                stepS = steps.second || s.stepSecond || 1,
                zeroBased = steps.zeroBased,
                mind = s.minDate || new Date(s.startYear, 0, 1),
                maxd = s.maxDate || new Date(s.endYear, 11, 31, 23, 59, 59),
                minH = zeroBased ? 0 : mind.getHours() % stepH,
                minM = zeroBased ? 0 : mind.getMinutes() % stepM,
                minS = zeroBased ? 0 : mind.getSeconds() % stepS,
                maxH = getMax(stepH, minH, (hampm ? 11 : 23)),
                maxM = getMax(stepM, minM, 59),
                maxS = getMax(stepM, minM, 59);

            format = format || hformat;

            if (p.match(/date/i)) {

                // Determine the order of year, month, day wheels
                $.each(['y', 'm', 'd'], function (j, v) {
                    i = dord.search(new RegExp(v, 'i'));
                    if (i > -1) {
                        ord.push({ o: i, v: v });
                    }
                });
                ord.sort(function (a, b) { return a.o > b.o ? 1 : -1; });
                $.each(ord, function (i, v) {
                    o[v.v] = i;
                });

                wg = [];
                for (k = 0; k < 3; k++) {
                    if (k == o.y) {
                        offset++;
                        values = [];
                        keys = [];
                        start = s.getYear(mind);
                        end = s.getYear(maxd);
                        for (i = start; i <= end; i++) {
                            keys.push(i);
                            values.push((dord.match(/yy/i) ? i : (i + '').substr(2, 2)) + (s.yearSuffix || ''));
                        }
                        addWheel(wg, keys, values, s.yearText);
                    } else if (k == o.m) {
                        offset++;
                        values = [];
                        keys = [];
                        for (i = 0; i < 12; i++) {
                            var str = dord.replace(/[dy]/gi, '').replace(/mm/, (i < 9 ? '0' + (i + 1) : i + 1) + (s.monthSuffix || '')).replace(/m/, i + 1 + (s.monthSuffix || ''));
                            keys.push(i);
                            values.push(str.match(/MM/) ? str.replace(/MM/, '<span class="dw-mon">' + s.monthNames[i] + '</span>') : str.replace(/M/, '<span class="dw-mon">' + s.monthNamesShort[i] + '</span>'));
                        }
                        addWheel(wg, keys, values, s.monthText);
                    } else if (k == o.d) {
                        offset++;
                        values = [];
                        keys = [];
                        for (i = 1; i < 32; i++) {
                            keys.push(i);
                            values.push((dord.match(/dd/i) && i < 10 ? '0' + i : i) + (s.daySuffix || ''));
                        }
                        addWheel(wg, keys, values, s.dayText);
                    }
                }
                wheels.push(wg);
            }

            if (p.match(/time/i)) {
                hasTime = true;

                // Determine the order of hours, minutes, seconds wheels
                ord = [];
                $.each(['h', 'i', 's', 'a'], function (i, v) {
                    i = tord.search(new RegExp(v, 'i'));
                    if (i > -1) {
                        ord.push({ o: i, v: v });
                    }
                });
                ord.sort(function (a, b) {
                    return a.o > b.o ? 1 : -1;
                });
                $.each(ord, function (i, v) {
                    o[v.v] = offset + i;
                });

                wg = [];
                for (k = offset; k < offset + 4; k++) {
                    if (k == o.h) {
                        offset++;
                        values = [];
                        keys = [];
                        for (i = minH; i < (hampm ? 12 : 24); i += stepH) {
                            keys.push(i);
                            values.push(hampm && i === 0 ? 12 : tord.match(/hh/i) && i < 10 ? '0' + i : i);
                        }
                        addWheel(wg, keys, values, s.hourText);
                    } else if (k == o.i) {
                        offset++;
                        values = [];
                        keys = [];
                        for (i = minM; i < 60; i += stepM) {
                            keys.push(i);
                            values.push(tord.match(/ii/) && i < 10 ? '0' + i : i);
                        }
                        addWheel(wg, keys, values, s.minuteText);
                    } else if (k == o.s) {
                        offset++;
                        values = [];
                        keys = [];
                        for (i = minS; i < 60; i += stepS) {
                            keys.push(i);
                            values.push(tord.match(/ss/) && i < 10 ? '0' + i : i);
                        }
                        addWheel(wg, keys, values, s.secText);
                    } else if (k == o.a) {
                        offset++;
                        var upper = tord.match(/A/);
                        addWheel(wg, [0, 1], upper ? [s.amText.toUpperCase(), s.pmText.toUpperCase()] : [s.amText, s.pmText], s.ampmText);
                    }
                }

                wheels.push(wg);
            }

            function get(d, i, def) {
                if (o[i] !== undefined) {
                    return +d[o[i]];
                }
                if (innerValues[i] !== undefined) {
                    return innerValues[i];
                }
                if (def !== undefined) {
                    return def;
                }
                return f[i](defd);
            }

            function addWheel(wg, k, v, lbl) {
                wg.push({
                    values: v,
                    keys: k,
                    label: lbl
                });
            }

            function step(v, st, min, max) {
                return Math.min(max, Math.floor(v / st) * st + min);
            }

            function getYear(d) {
                return s.getYear(d);
            }

            function getMonth(d) {
                return s.getMonth(d);
            }

            function getDay(d) {
                return s.getDay(d);
            }

            function getHour(d) {
                var hour = d.getHours();
                hour = hampm && hour >= 12 ? hour - 12 : hour;
                return step(hour, stepH, minH, maxH);
            }

            function getMinute(d) {
                return step(d.getMinutes(), stepM, minM, maxM);
            }

            function getSecond(d) {
                return step(d.getSeconds(), stepS, minS, maxS);
            }

            function getMillisecond(d) {
                return d.getMilliseconds();
            }

            function getAmPm(d) {
                return ampm && d.getHours() > 11 ? 1 : 0;
            }

            function getDate(d) {
                if (d === null) {
                    return d;
                }

                var year = get(d, 'y'),
                    month = get(d, 'm'),
                    day = Math.min(get(d, 'd', 1), s.getMaxDayOfMonth(year, month)),
                    hour = get(d, 'h', 0);

                return s.getDate(year, month, day, get(d, 'a', 0) ? hour + 12 : hour, get(d, 'i', 0), get(d, 's', 0), get(d, 'u', 0));
            }

            function getMax(step, min, max) {
                return Math.floor((max - min) / step) * step + min;
            }

            function getClosestValidDate(d, dir) {
                var next,
                    prev,
                    nextValid = false,
                    prevValid = false,
                    up = 0,
                    down = 0;

                // Normalize min and max dates for comparing later (set default values where there are no values from wheels)
                mind = getDate(getArray(mind));
                maxd = getDate(getArray(maxd));

                if (isValid(d)) {
                    return d;
                }

                if (d < mind) {
                    d = mind;
                }

                if (d > maxd) {
                    d = maxd;
                }

                next = d;
                prev = d;

                if (dir !== 2) {
                    nextValid = isValid(next);

                    while (!nextValid && next < maxd) {
                        next = new Date(next.getTime() + 1000 * 60 * 60 * 24);
                        nextValid = isValid(next);
                        up++;
                    }
                }

                if (dir !== 1) {
                    prevValid = isValid(prev);

                    while (!prevValid && prev > mind) {
                        prev = new Date(prev.getTime() - 1000 * 60 * 60 * 24);
                        prevValid = isValid(prev);
                        down++;
                    }
                }

                if (dir === 1 && nextValid) {
                    return next;
                }

                if (dir === 2 && prevValid) {
                    return prev;
                }

                return down <= up && prevValid ? prev : next;
            }

            function isValid(d) {
                if (d < mind) {
                    return false;
                }

                if (d > maxd) {
                    return false;
                }

                if (isInObj(d, valid)) {
                    return true;
                }

                if (isInObj(d, invalid)) {
                    return false;
                }

                return true;
            }

            function isInObj(d, obj) {
                var curr,
                    j,
                    v;

                if (obj) {
                    for (j = 0; j < obj.length; j++) {
                        curr = obj[j];
                        v = curr + '';
                        if (!curr.start) {
                            if (curr.getTime) { // Exact date
                                if (d.getFullYear() == curr.getFullYear() && d.getMonth() == curr.getMonth() && d.getDate() == curr.getDate()) {
                                    return true;
                                }
                            } else if (!v.match(/w/i)) { // Day of month
                                v = v.split('/');
                                if (v[1]) {
                                    if ((v[0] - 1) == d.getMonth() && v[1] == d.getDate()) {
                                        return true;
                                    }
                                } else if (v[0] == d.getDate()) {
                                    return true;
                                }
                            } else { // Day of week
                                v = +v.replace('w', '');
                                if (v == d.getDay()) {
                                    return true;
                                }
                            }
                        }
                    }
                }
                return false;
            }

            function validateDates(obj, y, m, first, maxdays, idx, val) {
                var j, d, v;

                if (obj) {
                    for (j = 0; j < obj.length; j++) {
                        d = obj[j];
                        v = d + '';
                        if (!d.start) {
                            if (d.getTime) { // Exact date
                                if (s.getYear(d) == y && s.getMonth(d) == m) {
                                    idx[s.getDay(d) - 1] = val;
                                }
                            } else if (!v.match(/w/i)) { // Day of month
                                v = v.split('/');
                                if (v[1]) {
                                    if (v[0] - 1 == m) {
                                        idx[v[1] - 1] = val;
                                    }
                                } else {
                                    idx[v[0] - 1] = val;
                                }
                            } else { // Day of week
                                v = +v.replace('w', '');
                                for (k = v - first; k < maxdays; k += 7) {
                                    if (k >= 0) {
                                        idx[k] = val;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            function validateTimes(vobj, i, v, temp, y, m, d, target, valid) {
                var dd, ss, str, parts1, parts2, prop1, prop2, v1, v2, j, i1, i2, add, remove, all, hours1, hours2, hours3,
                    spec = {},
                    steps = { h: stepH, i: stepM, s: stepS, a: 1 },
                    day = s.getDate(y, m, d),
                    w = ['a', 'h', 'i', 's'];

                if (vobj) {
                    $.each(vobj, function (i, obj) {
                        if (obj.start) {
                            obj.apply = false;
                            dd = obj.d;
                            ss = dd + '';
                            str = ss.split('/');
                            if (dd && ((dd.getTime && y == s.getYear(dd) && m == s.getMonth(dd) && d == s.getDay(dd)) || // Exact date
                                (!ss.match(/w/i) && ((str[1] && d == str[1] && m == str[0] - 1) || (!str[1] && d == str[0]))) || // Day of month
                                (ss.match(/w/i) && day.getDay() == +ss.replace('w', '')) // Day of week
                                )) {
                                obj.apply = true;
                                spec[day] = true; // Prevent applying generic rule on day, if specific exists
                            }
                        }
                    });

                    $.each(vobj, function (x, obj) {
                        add = 0;
                        remove = 0;
                        i1 = 0;
                        i2 = undefined;
                        prop1 = true;
                        prop2 = true;
                        all = false;

                        if (obj.start && (obj.apply || (!obj.d && !spec[day]))) {

                            // Define time parts
                            parts1 = obj.start.split(':');
                            parts2 = obj.end.split(':');

                            for (j = 0; j < 3; j++) {
                                if (parts1[j] === undefined) {
                                    parts1[j] = 0;
                                }
                                if (parts2[j] === undefined) {
                                    parts2[j] = 59;
                                }
                                parts1[j] = +parts1[j];
                                parts2[j] = +parts2[j];
                            }

                            parts1.unshift(parts1[0] > 11 ? 1 : 0);
                            parts2.unshift(parts2[0] > 11 ? 1 : 0);

                            if (hampm) {
                                if (parts1[1] >= 12) {
                                    parts1[1] = parts1[1] - 12;
                                }

                                if (parts2[1] >= 12) {
                                    parts2[1] = parts2[1] - 12;
                                }
                            }

                            // Look behind
                            for (j = 0; j < i; j++) {
                                if (validValues[j] !== undefined) {
                                    v1 = step(parts1[j], steps[w[j]], mins[w[j]], maxs[w[j]]);
                                    v2 = step(parts2[j], steps[w[j]], mins[w[j]], maxs[w[j]]);
                                    hours1 = 0;
                                    hours2 = 0;
                                    hours3 = 0;
                                    if (hampm && j == 1) {
                                        hours1 = parts1[0] ? 12 : 0;
                                        hours2 = parts2[0] ? 12 : 0;
                                        hours3 = validValues[0] ? 12 : 0;
                                    }
                                    if (!prop1) {
                                        v1 = 0;
                                    }
                                    if (!prop2) {
                                        v2 = maxs[w[j]];
                                    }
                                    if ((prop1 || prop2) && (v1 + hours1 < validValues[j] + hours3 && validValues[j] + hours3 < v2 + hours2)) {
                                        all = true;
                                    }
                                    if (validValues[j] != v1) {
                                        prop1 = false;
                                    }
                                    if (validValues[j] != v2) {
                                        prop2 = false;
                                    }
                                }
                            }

                            // Look ahead
                            if (!valid) {
                                for (j = i + 1; j < 4; j++) {
                                    if (parts1[j] > 0) {
                                        add = steps[v];
                                    }
                                    if (parts2[j] < maxs[w[j]]) {
                                        remove = steps[v];
                                    }
                                }
                            }
                            
                            if (!all) {
                                // Calculate min and max values
                                v1 = step(parts1[i], steps[v], mins[v], maxs[v]) + add;
                                v2 = step(parts2[i], steps[v], mins[v], maxs[v]) - remove;

                                if (prop1) {
                                    i1 = getValidIndex(target, v1, maxs[v], 0);
                                }

                                if (prop2) {
                                    i2 = getValidIndex(target, v2, maxs[v], 1);
                                }
                            }

                            // Disable values
                            if (prop1 || prop2 || all) {
                                if (valid) {
                                    $('.dw-li', target).slice(i1, i2).addClass('dw-v');
                                } else {
                                    $('.dw-li', target).slice(i1, i2).removeClass('dw-v');
                                }
                            }
                                    
                        }
                    });
                }
            }

            function getIndex(t, v) {
                return $('.dw-li', t).index($('.dw-li[data-val="' + v + '"]', t));
            }

            function getValidIndex(t, v, max, add) {
                if (v < 0) {
                    return 0;
                }
                if (v > max) {
                    return $('.dw-li', t).length;
                }
                return getIndex(t, v) + add;
            }

            function getArray(d, fillInner) {
                var ret = [];

                if (d === null || d === undefined) {
                    return d;
                }

                $.each(['y', 'm', 'd', 'a', 'h', 'i', 's', 'u'], function (x, i) {
                    if (o[i] !== undefined) {
                        ret[o[i]] = f[i](d);
                    }
                    if (fillInner) {
                        innerValues[i] = f[i](d);
                    }
                });

                return ret;
            }

            function convertRanges(arr) {
                var i, v, start,
                    ret = [];

                if (arr) {
                    for (i = 0; i < arr.length; i++) {
                        v = arr[i];
                        if (v.start && v.start.getTime) {
                            start = new Date(v.start);
                            while (start <= v.end) {
                                ret.push(new Date(start.getFullYear(), start.getMonth(), start.getDate()));
                                start.setDate(start.getDate() + 1);
                            }
                        } else {
                            ret.push(v);
                        }
                    }
                    return ret;
                }
                return arr;
            }

            // Extended methods
            // ---

            inst.getVal = function (temp) {
                return inst._hasValue || temp ? getDate(inst.getArrayVal(temp)) : null;
            };

            /**
             * Sets the selected date
             *
             * @param {Date} d Date to select.
             * @param {Boolean} [fill=false] Also set the value of the associated input element. Default is true.
             * @param {Number} [time=0] Animation time to scroll to the selected date.
             * @param {Boolean} [temp=false] Set temporary value only.
             * @param {Boolean} [change=fill] Trigger change on input element.
             */
            inst.setDate = function (d, fill, time, temp, change) {
                inst.setArrayVal(getArray(d), fill, change, temp, time);
            };

            /**
             * Returns the selected date.
             *
             * @param {Boolean} [temp=false] If true, return the currently shown date on the picker, otherwise the last selected one.
             * @return {Date}
             */
            inst.getDate = inst.getVal;

            // ---


            // Initializations
            // --- 

            inst.format = hformat;
            inst.order = o;

            inst.handlers.now = function () { inst.setDate(new Date(), false, 0.3, true, true); };
            inst.buttons.now = { text: s.nowText, handler: 'now' };

            invalid = convertRanges(invalid);
            valid = convertRanges(valid);

            mins = { y: mind.getFullYear(), m: 0, d: 1, h: minH, i: minM, s: minS, a: 0 };
            maxs = { y: maxd.getFullYear(), m: 11, d: 31, h: maxH, i: maxM, s: maxS, a: 1 };

            // ---

            return {
                wheels: wheels,
                headerText: s.headerText ? function () {
                    return datetime.formatDate(hformat, getDate(inst.getArrayVal(true)), s);
                } : false,
                formatValue: function (d) {
                    return datetime.formatDate(format, getDate(d), s);
                },
                parseValue: function (val) {
                    if (!val) {
                        innerValues = {};
                    }
                    return getArray(val ? datetime.parseDate(format, val, s) : (s.defaultValue || new Date()), !!val && !!val.getTime);
                },
                validate: function (dw, i, time, dir) {
                    var validated = getClosestValidDate(getDate(inst.getArrayVal(true)), dir),
                        temp = getArray(validated),
                        y = get(temp, 'y'),
                        m = get(temp, 'm'),
                        minprop = true,
                        maxprop = true;

                    $.each(['y', 'm', 'd', 'a', 'h', 'i', 's'], function (x, i) {
                        if (o[i] !== undefined) {
                            var min = mins[i],
                                max = maxs[i],
                                maxdays = 31,
                                val = get(temp, i),
                                t = $('.dw-ul', dw).eq(o[i]);

                            if (i == 'd') {
                                maxdays = s.getMaxDayOfMonth(y, m);
                                max = maxdays;
                                if (regen) {
                                    $('.dw-li', t).each(function () {
                                        var that = $(this),
                                            d = that.data('val'),
                                            w = s.getDate(y, m, d).getDay(),
                                            str = dord.replace(/[my]/gi, '').replace(/dd/, (d < 10 ? '0' + d : d) + (s.daySuffix || '')).replace(/d/, d + (s.daySuffix || ''));
                                        $('.dw-i', that).html(str.match(/DD/) ? str.replace(/DD/, '<span class="dw-day">' + s.dayNames[w] + '</span>') : str.replace(/D/, '<span class="dw-day">' + s.dayNamesShort[w] + '</span>'));
                                    });
                                }
                            }
                            if (minprop && mind) {
                                min = f[i](mind);
                            }
                            if (maxprop && maxd) {
                                max = f[i](maxd);
                            }
                            if (i != 'y') {
                                var i1 = getIndex(t, min),
                                    i2 = getIndex(t, max);
                                $('.dw-li', t).removeClass('dw-v').slice(i1, i2 + 1).addClass('dw-v');
                                if (i == 'd') { // Hide days not in month
                                    $('.dw-li', t).removeClass('dw-h').slice(maxdays).addClass('dw-h');
                                }
                            }
                            if (val < min) {
                                val = min;
                            }
                            if (val > max) {
                                val = max;
                            }
                            if (minprop) {
                                minprop = val == min;
                            }
                            if (maxprop) {
                                maxprop = val == max;
                            }
                            // Disable some days
                            if (i == 'd') {
                                var first = s.getDate(y, m, 1).getDay(),
                                    idx = {};

                                // Set invalid indexes
                                validateDates(invalid, y, m, first, maxdays, idx, 1);
                                // Delete indexes which are valid 
                                validateDates(valid, y, m, first, maxdays, idx, 0);

                                $.each(idx, function (i, v) {
                                    if (v) {
                                        $('.dw-li', t).eq(i).removeClass('dw-v');
                                    }
                                });
                            }
                        }
                    });

                    // Invalid times
                    if (hasTime) {
                        $.each(['a', 'h', 'i', 's'], function (i, v) {
                            var val = get(temp, v),
                                d = get(temp, 'd'),
                                t = $('.dw-ul', dw).eq(o[v]);

                            if (o[v] !== undefined) {
                                validateTimes(invalid, i, v, temp, y, m, d, t, 0);
                                validateTimes(valid, i, v, temp, y, m, d, t, 1);

                                // Get valid value
                                validValues[i] = +inst.getValidCell(val, t, dir).val;
                            }
                        });
                    }

                    inst._tempWheelArray = temp;
                }
            };
        };

    $.each(['date', 'time', 'datetime'], function (i, v) {
        ms.presets.scroller[v] = preset;
    });

})(jQuery);
;(function ($) {

    $.each(['date', 'time', 'datetime'], function (i, v) {
        $.mobiscroll.presetShort(v);
    });

})(jQuery);
;(function ($, undefined) {

    var ms = $.mobiscroll,
        util = ms.util,
        isString = util.isString,
        defaults = {
            batch: 40,
            inputClass: '',
            invalid: [],
            rtl: false,
            showInput: true,
            groupLabel: 'Groups',
            checkIcon: 'checkmark',
            dataText: 'text',
            dataValue: 'value',
            dataGroup: 'group',
            dataDisabled: 'disabled'
        };

    ms.presetShort('select');

    ms.presets.scroller.select = function (inst) {
        var change,
            group,
            groupArray,
            groupChanged,
            groupTap,
            groupWheelIdx,
            i,
            input,
            optionArray,
            optionWheelIdx,
            option,
            origValues,
            prevGroup,
            timer,
            batchChanged = {},
            batchStart = {},
            batchEnd = {},
            tempBatchStart = {},
            tempBatchEnd = {},
            orig = $.extend({}, inst.settings),
            s = $.extend(inst.settings, defaults, orig),
            batch = s.batch,
            layout = s.layout || (/top|bottom/.test(s.display) ? 'liquid' : ''),
            isLiquid = layout == 'liquid',
            elm = $(this),
            multiple = s.multiple || elm.prop('multiple'),
            id = this.id + '_dummy',
            lbl = $('label[for="' + this.id + '"]').attr('for', id),
            label = s.label !== undefined ? s.label : (lbl.length ? lbl.text() : elm.attr('name')),
            selectedClass = 'dw-msel mbsc-ic mbsc-ic-' + s.checkIcon,
            origReadOnly = s.readonly,
            data = s.data,
            hasData = !!data,
            hasGroups = hasData ? !!s.group : $('optgroup', elm).length,
            defaultValue = hasData ? (data[0] ? data[0][s.dataValue] : null) : $('option', elm).attr('value'),
            groupSetup = s.group,
            groupWheel = hasGroups && groupSetup && groupSetup.groupWheel !== false,
            groupSep = hasGroups && groupSetup && groupWheel && groupSetup.clustered === true,
            groupHdr = hasGroups && (!groupSetup || (groupSetup.header !== false && !groupSep)),
            values = elm.val() || [],
            invalid = [],
            selectedValues = {},
            options = {},
            groups = {};

        function prepareData() {
            var gr,
                lbl,
                opt,
                txt,
                val,
                l = 0,
                c = 0,
                groupIndexes = {};

            optionArray = [];
            groupArray = [];

            if (hasData) {
                $.each(s.data, function (i, v) {
                    txt = v[s.dataText];
                    val = v[s.dataValue];
                    lbl = v[s.dataGroup];
                    opt = {
                        value: val,
                        text: txt,
                        index: i
                    };
                    options[val] = opt;
                    optionArray.push(opt);

                    if (hasGroups) {
                        if (groupIndexes[lbl] === undefined) {
                            gr = { text: lbl, value: c, options: [], index: c };
                            groups[c] = gr;
                            groupIndexes[lbl] = c;
                            groupArray.push(gr);
                            c++;
                        } else {
                            gr = groups[groupIndexes[lbl]];
                        }
                        if (groupSep) {
                            opt.index = gr.options.length;
                        }
                        opt.group = groupIndexes[lbl];
                        gr.options.push(opt);
                    }
                    if (v[s.dataDisabled]) {
                        invalid.push(val);
                    }
                });
            } else {
                if (hasGroups) {
                    $('optgroup', elm).each(function (i) {
                        groups[i] = { text: this.label, value: i, options: [], index: i };
                        groupArray.push(groups[i]);
                        $('option', this).each(function (j) {
                            opt = {
                                value: this.value,
                                text: this.text,
                                index: groupSep ? j : l++,
                                group: i
                            };
                            options[this.value] = opt;
                            optionArray.push(opt);
                            groups[i].options.push(opt);
                            if (this.disabled) {
                                invalid.push(this.value);
                            }
                        });
                    });
                } else {
                    $('option', elm).each(function (i) {
                        opt = {
                            value: this.value,
                            text: this.text,
                            index: i
                        };
                        options[this.value] = opt;
                        optionArray.push(opt);
                        if (this.disabled) {
                            invalid.push(this.value);
                        }
                    });
                }
            }

            if (groupHdr) {
                optionArray = [];
                l = 0;
                $.each(groups, function (i, gr) {
                    val = '__group' + i;
                    opt = {
                        text: gr.text,
                        value: val,
                        group: i,
                        index: l++
                    };
                    options[val] = opt;
                    optionArray.push(opt);
                    invalid.push(opt.value);
                    $.each(gr.options, function (j, opt) {
                        opt.index = l++;
                        optionArray.push(opt);
                    });
                });
            }
        }

        function genValues(w, data, dataMap, value, index, multiple, label) {
            var i,
                wheel,
                keys = [],
                values = [],
                selectedIndex = dataMap[value] !== undefined ? dataMap[value].index : 0,
                start = Math.max(0, selectedIndex - batch),
                end = Math.min(data.length - 1, start + batch * 2);

            if (batchStart[index] !== start || batchEnd[index] !== end) {
                for (i = start; i <= end; i++) {
                    values.push(data[i].text);
                    keys.push(data[i].value);
                }
                batchChanged[index] = true;
                tempBatchStart[index] = start;
                tempBatchEnd[index] = end;

                wheel = {
                    multiple: multiple,
                    values: values,
                    keys: keys,
                    label: label
                };

                if (isLiquid) {
                    w[0][index] = wheel;
                } else {
                    w[index] = [wheel];
                }
            } else {
                batchChanged[index] = false;
            }
        }

        function genGroupWheel(w) {
            genValues(w, groupArray, groups, group, groupWheelIdx, false, s.groupLabel);
        }

        function genOptWheel(w) {
            genValues(w, groupSep ? groups[group].options : optionArray, options, option, optionWheelIdx, multiple, label);
        }

        function genWheels() {
            var w = [[]];

            if (groupWheel) {
                genGroupWheel(w);
            }

            genOptWheel(w);

            return w;
        }

        function getOption(v) {
            if (multiple) {
                if (v && isString(v)) {
                    v = v.split(',');
                }
                if ($.isArray(v)) {
                    v = v[0];
                }
            }

            option = v === undefined || v === null || v === '' ? defaultValue : v;

            if (groupWheel) {
                group = options[option].group;
                prevGroup = group;
            }
        }

        function getVal(temp, group) {
            var val = temp ? inst._tempWheelArray : (inst._hasValue ? inst._wheelArray : null);
            return val ? (s.group && group ? val : val[optionWheelIdx]) : null;
        }

        function onFill() {
            var txt,
                val,
                sel = [],
                i = 0;

            if (multiple) {
                val = [];

                for (i in selectedValues) {
                    sel.push(options[i] ? options[i].text : '');
                    val.push(i);
                }

                txt = sel.join(', ');
            } else {
                val = option;
                txt = options[option] ? options[option].text : '';
            }
            
            inst._tempValue = val;

            input.val(txt);
            elm.val(val);
        }

        function onTap(li) {
            var val = li.attr('data-val'),
                selected = li.hasClass('dw-msel');

            if (multiple && li.closest('.dwwl').hasClass('dwwms')) {
                if (li.hasClass('dw-v')) {
                    if (selected) {
                        li.removeClass(selectedClass).removeAttr('aria-selected');
                        delete selectedValues[val];
                    } else {
                        li.addClass(selectedClass).attr('aria-selected', 'true');
                        selectedValues[val] = val;
                    }
                }
                return false;
            } else if (li.hasClass('dw-w-gr')) {
                groupTap = li.attr('data-val');
            }
        }

        if (!s.invalid.length) {
            s.invalid = invalid;
        }

        if (groupWheel) {
            groupWheelIdx = 0;
            optionWheelIdx = 1;
        } else {
            groupWheelIdx = -1;
            optionWheelIdx = 0;
        }

        if (multiple) {
            elm.prop('multiple', true);

            if (values && isString(values)) {
                values = values.split(',');
            }
            for (i = 0; i < values.length; i++) {
                selectedValues[values[i]] = values[i];
            }
        }

        prepareData();

        getOption(elm.val());

        $('#' + id).remove();

        input = $('<input type="text" id="' + id + '" class="' + s.inputClass + '" placeholder="' + (s.placeholder || '') + '" readonly />');

        if (s.showInput) {
            input.insertBefore(elm);
        }

        inst.attachShow(input);

        elm.addClass('dw-hsel').attr('tabindex', -1).closest('.ui-field-contain').trigger('create');

        onFill();

        // Extended methods
        // ---

        inst.setVal = function (val, fill, change, temp, time) {
            if (multiple) {
                if (val && isString(val)) {
                    val = val.split(',');
                }
                selectedValues = util.arrayToObject(val);
                val = val ? val[0] : null;
            }
            inst._setVal(val, fill, change, temp, time);
        };

        inst.getVal = function (temp, group) {
            if (multiple) {
                return util.objectToArray(selectedValues);
            }
            return getVal(temp, group);
        };

        inst.refresh = function () {

            prepareData();

            batchStart = {};
            batchEnd = {};

            s.wheels = genWheels();

            batchStart[groupWheelIdx] = tempBatchStart[groupWheelIdx];
            batchEnd[groupWheelIdx] = tempBatchEnd[groupWheelIdx];
            batchStart[optionWheelIdx] = tempBatchStart[optionWheelIdx];
            batchEnd[optionWheelIdx] = tempBatchEnd[optionWheelIdx];

            // Prevent wheel generation on initial validation
            change = true;

            if (inst._isVisible) {
                inst.changeWheel(groupWheel ? [groupWheelIdx, optionWheelIdx] : [optionWheelIdx]);
            }
        };

        // @deprecated since 2.14.0, backward compatibility code
        // ---
        inst.getValues = inst.getVal;

        inst.getValue = getVal;
        // ---

        // ---

        return {
            width: 50,
            layout: layout,
            headerText: false,
            anchor: input,
            confirmOnTap: groupWheel ? [false, true] : true,
            formatValue: function (d) {
                var i,
                    opt,
                    sel = [];

                if (multiple) {
                    for (i in selectedValues) {
                        sel.push(options[i] ? options[i].text : '');
                    }
                    return sel.join(', ');
                }

                opt = d[optionWheelIdx];

                return options[opt] ? options[opt].text : '';
            },
            parseValue: function (val) {
                getOption(val === undefined ? elm.val() : val);
                return groupWheel ? [group, option] : [option];
            },
            onValueTap: onTap,
            onValueFill: onFill,
            onBeforeShow: function () {
                if (multiple && s.counter) {
                    s.headerText = function () {
                        var length = 0;
                        $.each(selectedValues, function () {
                            length++;
                        });
                        return length + ' ' + s.selectedText;
                    };
                }

                getOption(elm.val());

                if (groupWheel) {
                    inst._tempWheelArray = [group, option];
                }

                inst.refresh();
            },
            onMarkupReady: function (dw) {
                dw.addClass('dw-select');

                $('.dwwl' + groupWheelIdx, dw).on('mousedown touchstart', function () {
                    clearTimeout(timer);
                });

                $('.dwwl' + optionWheelIdx, dw).on('mousedown touchstart', function () {
                    if (!groupChanged) {
                        clearTimeout(timer);
                    }
                });

                if (groupHdr) {
                    $('.dwwl' + optionWheelIdx, dw).addClass('dw-select-gr');
                }

                if (multiple) {
                    dw.addClass('dwms');

                    $('.dwwl', dw).on('keydown', function (e) {
                        if (e.keyCode == 32) { // Space
                            e.preventDefault();
                            e.stopPropagation();
                            onTap($('.dw-sel', this));
                        }
                    }).eq(optionWheelIdx).addClass('dwwms').attr('aria-multiselectable', 'true');

                    origValues = $.extend({}, selectedValues);
                }
            },
            validate: function (dw, i, time, dir) {
                var j,
                    v,
                    changes = [],
                    temp = inst.getArrayVal(true),
                    tempGr = temp[groupWheelIdx],
                    tempOpt = temp[optionWheelIdx],
                    t1 = $('.dw-ul', dw).eq(groupWheelIdx),
                    t2 = $('.dw-ul', dw).eq(optionWheelIdx);

                if (batchStart[groupWheelIdx] > 1) {
                    $('.dw-li', t1).slice(0, 2).removeClass('dw-v').addClass('dw-fv');
                }

                if (batchEnd[groupWheelIdx] < groupArray.length - 2) {
                    $('.dw-li', t1).slice(-2).removeClass('dw-v').addClass('dw-fv');
                }

                if (batchStart[optionWheelIdx] > 1) {
                    $('.dw-li', t2).slice(0, 2).removeClass('dw-v').addClass('dw-fv');
                }

                if (batchEnd[optionWheelIdx] < (groupSep ? groups[tempGr].options : optionArray).length - 2) {
                    $('.dw-li', t2).slice(-2).removeClass('dw-v').addClass('dw-fv');
                }

                if (!change) {

                    option = tempOpt;

                    if (groupWheel) {

                        group = options[option].group;

                        // If group changed, load group options
                        if (i === undefined || i === groupWheelIdx) {
                            group = +temp[groupWheelIdx];
                            groupChanged = false;
                            if (group !== prevGroup) {
                                option = groups[group].options[0].value;
                                batchStart[optionWheelIdx] = null;
                                batchEnd[optionWheelIdx] = null;
                                groupChanged = true;
                                s.readonly = [false, true];
                            } else {
                                s.readonly = origReadOnly;
                            }
                        }
                    }

                    // Adjust value to the first group option if group header was selected
                    if (hasGroups && (/__group/.test(option) || groupTap)) {
                        option = groups[options[groupTap || option].group].options[0].value;
                        tempOpt = option;
                        groupTap = false;
                    }

                    // Update values if changed
                    // Don't set the new option yet (if group changed), because it's not on the wheel yet 
                    inst._tempWheelArray = groupWheel ? [tempGr, tempOpt] : [tempOpt];

                    // Generate new wheel batches
                    if (groupWheel) {
                        genGroupWheel(s.wheels);

                        if (batchChanged[groupWheelIdx]) {
                            changes.push(groupWheelIdx);
                        }
                    }

                    genOptWheel(s.wheels);

                    if (batchChanged[optionWheelIdx]) {
                        changes.push(optionWheelIdx);
                    }

                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        if (changes.length) {
                            change = true;
                            groupChanged = false;
                            prevGroup = group;

                            // Save current batch boundaries
                            batchStart[groupWheelIdx] = tempBatchStart[groupWheelIdx];
                            batchEnd[groupWheelIdx] = tempBatchEnd[groupWheelIdx];
                            batchStart[optionWheelIdx] = tempBatchStart[optionWheelIdx];
                            batchEnd[optionWheelIdx] = tempBatchEnd[optionWheelIdx];

                            // Set the updated values
                            inst._tempWheelArray = groupWheel ? [tempGr, option] : [option];

                            // Change the wheels
                            inst.changeWheel(changes, 0, i !== undefined);
                        }

                        if (groupWheel) {
                            if (i === optionWheelIdx) {
                                inst.scroll(t1, groupWheelIdx, inst.getValidCell(group, t1, dir, false, true).v, 0.1);
                            }
                            inst._tempWheelArray[groupWheelIdx] = group;
                        }

                        // Restore readonly status
                        s.readonly = origReadOnly;
                            
                    }, i === undefined ? 100 : time * 1000);

                    if (changes.length) {
                        return groupChanged ? false : true;
                    }
                }

                // Add selected styling to selected elements in case of multiselect
                if (i === undefined && multiple) {
                    v = selectedValues;
                    j = 0;

                    $('.dwwl' + optionWheelIdx + ' .dw-li', dw).removeClass(selectedClass).removeAttr('aria-selected');

                    for (j in v) {
                        $('.dwwl' + optionWheelIdx + ' .dw-li[data-val="' + v[j] + '"]', dw).addClass(selectedClass).attr('aria-selected', 'true');
                    }
                }

                // Add styling to group headers
                if (groupHdr) {
                    $('.dw-li[data-val^="__group"]', dw).addClass('dw-w-gr');
                }

                // Disable invalid options
                $.each(s.invalid, function (i, v) {
                    $('.dw-li[data-val="' + v + '"]', t2).removeClass('dw-v dw-fv');
                });

                change = false;
            },
            onClear: function (dw) {
                selectedValues = {};
                input.val('');
                $('.dwwl' + optionWheelIdx + ' .dw-li', dw).removeClass(selectedClass).removeAttr('aria-selected');
            },
            onCancel: function () {
                if (!inst.live && multiple) {
                    selectedValues = $.extend({}, origValues);
                }
            },
            onDestroy: function () {
                input.remove();
                elm.removeClass('dw-hsel').removeAttr('tabindex');
            }
        };
    };

})(jQuery);
;(function ($, undefined) {
    var ms = $.mobiscroll,
        defaults = {
            invalid: [],
            showInput: true,
            inputClass: ''
        };

    ms.presets.scroller.list = function (inst) {            
        var orig = $.extend({}, inst.settings),
            s = $.extend(inst.settings, defaults, orig),
            layout = s.layout || (/top|bottom/.test(s.display) ? 'liquid' : ''),
            isLiquid = layout == 'liquid',
            origReadOnly = s.readonly,
            elm = $(this),
            input,
            prevent,
            id = this.id + '_dummy',
            lvl = 0,
            ilvl = 0,
            timer = {},
            currLevel,
            currWheelVector = [],
            wa = s.wheelArray || createWheelArray(elm),
            labels = generateLabels(lvl),
            fwv = firstWheelVector(wa),
            w = generateWheelsFromVector(fwv, lvl);
        
        /**
            * Disables the invalid items on the wheels
            * @param {Object} dw - the jQuery mobiscroll object
            * @param {Number} nrWheels - the number of the current wheels
            * @param {Array} whArray - The wheel array objects containing the wheel tree
            * @param {Array} whVector - the wheel vector containing the current keys
            */
        function setDisabled(dw, nrWheels, whArray, whVector) {
            var j,
                i = 0;

            while (i < nrWheels) {
                var currWh = $('.dwwl' + i, dw),
                    inv = getInvalidKeys(whVector, i, whArray);

                for (j = 0; j < inv.length; j++) {
                    $('.dw-li[data-val="' + inv[j] + '"]', currWh).removeClass('dw-v');
                }
                i++;
            }
        }

        /**
            * Returns the invalid keys of one wheel as an array
            * @param {Array} whVector - the wheel vector used to search for the wheel in the wheel array
            * @param {Number} index - index of the wheel in the wheel vector, that we are interested in
            * @param {Array} whArray - the wheel array we are searching in
            * @return {Array} - list of invalid keys
            */
        function getInvalidKeys(whVector, index, whArray) {
            var i = 0,
                n,
                whObjA = whArray,
                invalids = [];

            while (i < index) {
                var ii = whVector[i];
                //whObjA = whObjA[ii].children;
                for (n in whObjA) {
                    if (whObjA[n].key == ii) {
                        whObjA = whObjA[n].children;
                        break;
                    }
                }
                i++;
            }
            i = 0;
            while (i < whObjA.length) {
                if (whObjA[i].invalid) {
                    invalids.push(whObjA[i].key);
                }
                i++;
            }
            return invalids;
        }

        /**
            * Creates a Boolean vector with true values (except one) that can be used as the readonly vector
            * n - the length of the vector
            * i - the index of the value that's going to be false
            */
        function createROVector(n, i) {
            var a = [];
            while (n) {
                a[--n] = true;
            }
            a[i] = false;
            return a;
        }

        /**
            * Creates a labels vector, from values if they are defined, otherwise from numbers
            * l - the length of the vector
            */
        function generateLabels(l) {
            var a = [],
                i;
            for (i = 0; i < l; i++) {
                a[i] = s.labels && s.labels[i] ? s.labels[i] : i;
            }
            return a;
        }

        /**
            * Creates the wheel array from the vector provided
            * wv - wheel vector containing the values that should be selected on the wheels
            * l - the length of the wheel array
            */
        function generateWheelsFromVector(wv, l, index) {
            var i = 0, j, obj, chInd,
                w = [[]],
                wtObjA = wa;

            if (l) { // if length is defined we need to generate that many wheels (even if they are empty)
                for (j = 0; j < l; j++) {
                    if (isLiquid) {
                        w[0][j] = {};
                    } else {
                        w[j] = [{}];
                    }
                }
            }
            while (i < wv.length) { // we generate the wheels until the length of the wheel vector
                if (isLiquid) {
                    w[0][i] = getWheelFromObjA(wtObjA, labels[i]);
                } else {
                    w[i] = [getWheelFromObjA(wtObjA, labels[i])];
                }

                j = 0;
                chInd = undefined;

                while (j < wtObjA.length && chInd === undefined) {
                    if (wtObjA[j].key == wv[i] && ((index !== undefined && i <= index) || index === undefined)) {
                        chInd = j;
                    }
                    j++;
                }

                if (chInd !== undefined && wtObjA[chInd].children) {
                    i++;
                    wtObjA = wtObjA[chInd].children;
                } else if ((obj = getFirstValidItemObjOrInd(wtObjA)) && obj.children) {
                    i++;
                    wtObjA = obj.children;
                } else {
                    return w;
                }
            }
            return w;
        }

        /**
            * Returns the first valid Wheel Node Object or its index from a Wheel Node Object Array
            * getInd - if it is true then the return value is going to be the index, otherwise the object itself
            */
        function getFirstValidItemObjOrInd(wtObjA, getInd) {
            if (!wtObjA) {
                return false;
            }

            var i = 0,
                obj;

            while (i < wtObjA.length) {
                if (!(obj = wtObjA[i++]).invalid) {
                    return getInd ? i - 1 : obj;
                }
            }
            return false;
        }

        function getWheelFromObjA(objA, lbl) {
            var wheel = {
                    keys: [],
                    values: [],
                    label: lbl
                },
                j = 0;

            while (j < objA.length) {
                wheel.values.push(objA[j].value);
                wheel.keys.push(objA[j].key);
                j++;
            }
            return wheel;
        }

        /**
            * Hides the last i number of wheels
            * i - the last number of wheels that has to be hidden
            */
        function hideWheels(dw, i) {
            $('.dwfl', dw).css('display', '').slice(i).hide();
        }

        /**
            * Generates the first wheel vector from the wheeltree
            * wt - the wheel tree object
            * uses the lvl global variable to determine the length of the vector
            */
        function firstWheelVector(wa) {
            var t = [],
                ndObjA = wa,
                obj,
                ok = true,
                i = 0;

            while (ok) {
                obj = getFirstValidItemObjOrInd(ndObjA);
                t[i++] = obj.key;
                ok = obj.children;
                if (ok) {
                    ndObjA = ok;
                }
            }
            return t;
        }

        /**
            * Calculates the level of a wheel vector and the new wheel vector, depending on current wheel vector and the index of the changed wheel
            * wv - current wheel vector
            * index - index of the changed wheel
            */
        function calcLevelOfVector2(wv, index) {
            var t = [],
                ndObjA = wa,
                lvl = 0,
                next = false,
                i,
                childName,
                chInd;

            if (wv[lvl] !== undefined && lvl <= index) {
                i = 0;

                childName = wv[lvl];
                chInd = undefined;

                while (i < ndObjA.length && chInd === undefined) {
                    if (ndObjA[i].key == wv[lvl] && !ndObjA[i].invalid) {
                        chInd = i;
                    }
                    i++;
                }
            } else {
                chInd = getFirstValidItemObjOrInd(ndObjA, true);
                childName = ndObjA[chInd].key;
            }

            next = chInd !== undefined ? ndObjA[chInd].children : false;

            t[lvl] = childName;

            while (next) {
                ndObjA = ndObjA[chInd].children;
                lvl++;
                next = false;
                chInd = undefined;

                if (wv[lvl] !== undefined && lvl <= index) {
                    i = 0;

                    childName = wv[lvl];
                    chInd = undefined;

                    while (i < ndObjA.length && chInd === undefined) {
                        if (ndObjA[i].key == wv[lvl] && !ndObjA[i].invalid) {
                            chInd = i;
                        }
                        i++;
                    }
                } else {
                    chInd = getFirstValidItemObjOrInd(ndObjA, true);
                    chInd = chInd === false ? undefined : chInd;
                    childName = ndObjA[chInd].key;
                }
                next = chInd !== undefined && getFirstValidItemObjOrInd(ndObjA[chInd].children) ? ndObjA[chInd].children : false;
                t[lvl] = childName;
            }
            return {
                lvl: lvl + 1,
                nVector: t
            }; // return the calculated level and the wheel vector as an object
        }

        function createWheelArray(ul) {
            var wheelArray = [];

            lvl = lvl > ilvl++ ? lvl : ilvl;

            ul.children('li').each(function (index) {
                var that = $(this),
                    c = that.clone();

                c.children('ul,ol').remove();

                var v = inst._processMarkup ? inst._processMarkup(c) : c.html().replace(/^\s\s*/, '').replace(/\s\s*$/, ''),
                    inv = that.attr('data-invalid') ? true : false,
                    wheelObj = {
                        key: that.attr('data-val') === undefined || that.attr('data-val') === null ? index : that.attr('data-val'),
                        value: v,
                        invalid: inv,
                        children: null
                    },
                    nest = that.children('ul,ol');

                if (nest.length) {
                    wheelObj.children = createWheelArray(nest);
                }

                wheelArray.push(wheelObj);
            });

            ilvl--;
            return wheelArray;
        }

        $('#' + id).remove(); // Remove input if exists

        if (s.showInput) {
            input = $('<input type="text" id="' + id + '" value="" class="' + s.inputClass + '" placeholder="' + (s.placeholder || '') + '" readonly />').insertBefore(elm);
            s.anchor = input; // give the core the input element for the bubble positioning
            inst.attachShow(input);
        }

        if (!s.wheelArray) {
            elm.hide().closest('.ui-field-contain').trigger('create');
        }

        return {
            width: 50,
            wheels: w,
            layout: layout,
            headerText: false,
            formatValue: function (d) {
                if (currLevel === undefined) {
                    currLevel = calcLevelOfVector2(d, d.length).lvl;
                }
                return d.slice(0, currLevel).join(' ');
            },
            parseValue: function (value) {
                return value ? (value + '').split(' ') : (s.defaultValue || fwv).slice(0);
            },
            onBeforeShow: function () {
                var t = inst.getArrayVal(true);
                currWheelVector = t.slice(0);
                s.wheels = generateWheelsFromVector(t, lvl, lvl);
                prevent = true;
            },
            onValueFill: function (v) {
                currLevel = undefined;
                if (input) {
                    input.val(v);
                }
            },
            onShow: function (dw) {
                $('.dwwl', dw).on('mousedown touchstart', function () {
                    clearTimeout(timer[$('.dwwl', dw).index(this)]);
                });
            },
            onDestroy: function () {
                if (input) {
                    input.remove();
                }
                elm.show();
            },
            validate: function (dw, index, time) {
                var args = [],
                    t = inst.getArrayVal(true),
                    i = (index || 0) + 1,
                    j,
                    o;

                if ((index !== undefined && currWheelVector[index] != t[index]) || (index === undefined && !prevent)) {
                    s.wheels = generateWheelsFromVector(t, null, index);
                    o = calcLevelOfVector2(t, index === undefined ? t.length : index);
                    currLevel = o.lvl;

                    for (j = 0; j < t.length; j++) {
                        t[j] = o.nVector[j] || 0;
                    }

                    while (i < o.lvl) {
                        args.push(i++);
                    }

                    if (args.length) {
                        s.readonly = createROVector(lvl, index);
                        clearTimeout(timer[index]);
                        timer[index] = setTimeout(function () {
                            prevent = true;
                            hideWheels(dw, o.lvl);
                            currWheelVector = t.slice(0);
                            inst.changeWheel(args, index === undefined ? time : 0, index !== undefined);
                            s.readonly = origReadOnly;
                        }, index === undefined ? 0 : time * 1000);
                        return false;
                    }
                } else {
                    o = calcLevelOfVector2(t, t.length);
                    currLevel = o.lvl;
                }

                currWheelVector = t.slice(0);
                setDisabled(dw, o.lvl, wa, t);
                hideWheels(dw, o.lvl);

                prevent = false;
            }
        };
    };
})(jQuery);
;(function ($) {
    var ms = $.mobiscroll,
        presets = ms.presets.scroller;

    ms.presetShort('image');
    
    presets.image = function (inst) {

        if (inst.settings.enhance) {
            inst._processMarkup =  function (li) {
                var hasIcon = li.attr('data-icon');
               
                li.children().each(function (i, v) {
                    v = $(v);
                    if (v.is('img')) {
                        $('<div class="mbsc-img-c"></div>').insertAfter(v).append(v.addClass('mbsc-img'));
                    } else if (v.is('p')) {
                        v.addClass('mbsc-img-txt');
                    }
                });
                
                if (hasIcon) {
                    li.prepend('<div class="mbsc-ic mbsc-ic-' + hasIcon + '"></div');
                }
                
                li.html('<div class="mbsc-img-w">' + li.html() + '</div>');

                return li.html();
            };
        }
        
        return presets.list.call(this, inst);
    };
    
})(jQuery);
;(function ($) {
    var ms = $.mobiscroll,
        presets = ms.presets.scroller;

    presets.treelist = presets.list;

    ms.presetShort('list');
    ms.presetShort('treelist');

})(jQuery);;(function ($) {
    $.mobiscroll.i18n.zh = $.extend($.mobiscroll.i18n.zh, {
        // Core
        setText: '确定',
        cancelText: '取消',
        clearText: '明确',
        selectedText: '选',
        // Datetime component
        dateFormat: 'yy/mm/dd',
        dateOrder: 'yymmdd',
        dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        dayText: '日',
        hourText: '时',
        minuteText: '分',
        monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        monthText: '月',
        secText: '秒',
        timeFormat: 'HH:ii',
        timeWheels: 'HHii',
        yearText: '年',
        nowText: '当前',
        pmText: '下午',
        amText: '上午',
        // Calendar component
        dateText: '日',
        timeText: '时间',
        calendarText: '日历',
        closeText: '关闭',
        // Daterange component
        fromText: '开始时间',
        toText: '结束时间',
        // Measurement components
        wholeText: '合计',
        fractionText: '分数',
        unitText: '单位',
        // Time / Timespan component
        labels: ['年', '月', '日', '小时', '分钟', '秒', ''],
        labelsShort: ['年', '月', '日', '点', '分', '秒', ''],
        // Timer component
        startText: '开始',
        stopText: '停止',
        resetText: '重置',
        lapText: '圈',
        hideText: '隐藏',
        // Listview
        backText: '背部',
        undoText: '复原'
    });
})(jQuery);/**
 * Swiper 3.1.2
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 *
 * http://www.idangero.us/swiper/
 *
 * Copyright 2015, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 *
 * Licensed under MIT
 *
 * Released on: August 22, 2015
 */
!function(){"use strict";function e(e){e.fn.swiper=function(a){var s;return e(this).each(function(){var e=new t(this,a);s||(s=e)}),s}}var a,t=function(e,s){function r(){return"horizontal"===v.params.direction}function i(e){return Math.floor(e)}function n(){v.autoplayTimeoutId=setTimeout(function(){v.params.loop?(v.fixLoop(),v._slideNext()):v.isEnd?s.autoplayStopOnLast?v.stopAutoplay():v._slideTo(0):v._slideNext()},v.params.autoplay)}function o(e,t){var s=a(e.target);if(!s.is(t))if("string"==typeof t)s=s.parents(t);else if(t.nodeType){var r;return s.parents().each(function(e,a){a===t&&(r=t)}),r?t:void 0}return 0===s.length?void 0:s[0]}function l(e,a){a=a||{};var t=window.MutationObserver||window.WebkitMutationObserver,s=new t(function(e){e.forEach(function(e){v.onResize(!0),v.emit("onObserverUpdate",v,e)})});s.observe(e,{attributes:"undefined"==typeof a.attributes?!0:a.attributes,childList:"undefined"==typeof a.childList?!0:a.childList,characterData:"undefined"==typeof a.characterData?!0:a.characterData}),v.observers.push(s)}function p(e){e.originalEvent&&(e=e.originalEvent);var a=e.keyCode||e.charCode;if(!v.params.allowSwipeToNext&&(r()&&39===a||!r()&&40===a))return!1;if(!v.params.allowSwipeToPrev&&(r()&&37===a||!r()&&38===a))return!1;if(!(e.shiftKey||e.altKey||e.ctrlKey||e.metaKey||document.activeElement&&document.activeElement.nodeName&&("input"===document.activeElement.nodeName.toLowerCase()||"textarea"===document.activeElement.nodeName.toLowerCase()))){if(37===a||39===a||38===a||40===a){var t=!1;if(v.container.parents(".swiper-slide").length>0&&0===v.container.parents(".swiper-slide-active").length)return;var s={left:window.pageXOffset,top:window.pageYOffset},i=window.innerWidth,n=window.innerHeight,o=v.container.offset();v.rtl&&(o.left=o.left-v.container[0].scrollLeft);for(var l=[[o.left,o.top],[o.left+v.width,o.top],[o.left,o.top+v.height],[o.left+v.width,o.top+v.height]],p=0;p<l.length;p++){var d=l[p];d[0]>=s.left&&d[0]<=s.left+i&&d[1]>=s.top&&d[1]<=s.top+n&&(t=!0)}if(!t)return}r()?((37===a||39===a)&&(e.preventDefault?e.preventDefault():e.returnValue=!1),(39===a&&!v.rtl||37===a&&v.rtl)&&v.slideNext(),(37===a&&!v.rtl||39===a&&v.rtl)&&v.slidePrev()):((38===a||40===a)&&(e.preventDefault?e.preventDefault():e.returnValue=!1),40===a&&v.slideNext(),38===a&&v.slidePrev())}}function d(e){e.originalEvent&&(e=e.originalEvent);var a=v.mousewheel.event,t=0;if(e.detail)t=-e.detail;else if("mousewheel"===a)if(v.params.mousewheelForceToAxis)if(r()){if(!(Math.abs(e.wheelDeltaX)>Math.abs(e.wheelDeltaY)))return;t=e.wheelDeltaX}else{if(!(Math.abs(e.wheelDeltaY)>Math.abs(e.wheelDeltaX)))return;t=e.wheelDeltaY}else t=e.wheelDelta;else if("DOMMouseScroll"===a)t=-e.detail;else if("wheel"===a)if(v.params.mousewheelForceToAxis)if(r()){if(!(Math.abs(e.deltaX)>Math.abs(e.deltaY)))return;t=-e.deltaX}else{if(!(Math.abs(e.deltaY)>Math.abs(e.deltaX)))return;t=-e.deltaY}else t=Math.abs(e.deltaX)>Math.abs(e.deltaY)?-e.deltaX:-e.deltaY;if(v.params.mousewheelInvert&&(t=-t),v.params.freeMode){var s=v.getWrapperTranslate()+t*v.params.mousewheelSensitivity;if(s>0&&(s=0),s<v.maxTranslate()&&(s=v.maxTranslate()),v.setWrapperTransition(0),v.setWrapperTranslate(s),v.updateProgress(),v.updateActiveIndex(),v.params.freeModeSticky&&(clearTimeout(v.mousewheel.timeout),v.mousewheel.timeout=setTimeout(function(){v.slideReset()},300)),0===s||s===v.maxTranslate())return}else{if((new window.Date).getTime()-v.mousewheel.lastScrollTime>60)if(0>t)if(v.isEnd&&!v.params.loop||v.animating){if(v.params.mousewheelReleaseOnEdges)return!0}else v.slideNext();else if(v.isBeginning&&!v.params.loop||v.animating){if(v.params.mousewheelReleaseOnEdges)return!0}else v.slidePrev();v.mousewheel.lastScrollTime=(new window.Date).getTime()}return v.params.autoplay&&v.stopAutoplay(),e.preventDefault?e.preventDefault():e.returnValue=!1,!1}function u(e,t){e=a(e);var s,i,n;s=e.attr("data-swiper-parallax")||"0",i=e.attr("data-swiper-parallax-x"),n=e.attr("data-swiper-parallax-y"),i||n?(i=i||"0",n=n||"0"):r()?(i=s,n="0"):(n=s,i="0"),i=i.indexOf("%")>=0?parseInt(i,10)*t+"%":i*t+"px",n=n.indexOf("%")>=0?parseInt(n,10)*t+"%":n*t+"px",e.transform("translate3d("+i+", "+n+",0px)")}function c(e){return 0!==e.indexOf("on")&&(e=e[0]!==e[0].toUpperCase()?"on"+e[0].toUpperCase()+e.substring(1):"on"+e),e}if(!(this instanceof t))return new t(e,s);var m={direction:"horizontal",touchEventsTarget:"container",initialSlide:0,speed:300,autoplay:!1,autoplayDisableOnInteraction:!0,iOSEdgeSwipeDetection:!1,iOSEdgeSwipeThreshold:20,freeMode:!1,freeModeMomentum:!0,freeModeMomentumRatio:1,freeModeMomentumBounce:!0,freeModeMomentumBounceRatio:1,freeModeSticky:!1,setWrapperSize:!1,virtualTranslate:!1,effect:"slide",coverflow:{rotate:50,stretch:0,depth:100,modifier:1,slideShadows:!0},cube:{slideShadows:!0,shadow:!0,shadowOffset:20,shadowScale:.94},fade:{crossFade:!1},parallax:!1,scrollbar:null,scrollbarHide:!0,keyboardControl:!1,mousewheelControl:!1,mousewheelReleaseOnEdges:!1,mousewheelInvert:!1,mousewheelForceToAxis:!1,mousewheelSensitivity:1,hashnav:!1,spaceBetween:0,slidesPerView:1,slidesPerColumn:1,slidesPerColumnFill:"column",slidesPerGroup:1,centeredSlides:!1,slidesOffsetBefore:0,slidesOffsetAfter:0,roundLengths:!1,touchRatio:1,touchAngle:45,simulateTouch:!0,shortSwipes:!0,longSwipes:!0,longSwipesRatio:.5,longSwipesMs:300,followFinger:!0,onlyExternal:!1,threshold:0,touchMoveStopPropagation:!0,pagination:null,paginationElement:"span",paginationClickable:!1,paginationHide:!1,paginationBulletRender:null,resistance:!0,resistanceRatio:.85,nextButton:null,prevButton:null,watchSlidesProgress:!1,watchSlidesVisibility:!1,grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slideToClickedSlide:!1,lazyLoading:!1,lazyLoadingInPrevNext:!1,lazyLoadingOnTransitionStart:!1,preloadImages:!0,updateOnImagesReady:!0,loop:!1,loopAdditionalSlides:0,loopedSlides:null,control:void 0,controlInverse:!1,controlBy:"slide",allowSwipeToPrev:!0,allowSwipeToNext:!0,swipeHandler:null,noSwiping:!0,noSwipingClass:"swiper-no-swiping",slideClass:"swiper-slide",slideActiveClass:"swiper-slide-active",slideVisibleClass:"swiper-slide-visible",slideDuplicateClass:"swiper-slide-duplicate",slideNextClass:"swiper-slide-next",slidePrevClass:"swiper-slide-prev",wrapperClass:"swiper-wrapper",bulletClass:"swiper-pagination-bullet",bulletActiveClass:"swiper-pagination-bullet-active",buttonDisabledClass:"swiper-button-disabled",paginationHiddenClass:"swiper-pagination-hidden",observer:!1,observeParents:!1,a11y:!1,prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide",firstSlideMessage:"This is the first slide",lastSlideMessage:"This is the last slide",paginationBulletMessage:"Go to slide {{index}}",runCallbacksOnInit:!0},f=s&&s.virtualTranslate;s=s||{};for(var h in m)if("undefined"==typeof s[h])s[h]=m[h];else if("object"==typeof s[h])for(var g in m[h])"undefined"==typeof s[h][g]&&(s[h][g]=m[h][g]);var v=this;if(v.version="3.1.0",v.params=s,v.classNames=[],"undefined"!=typeof a&&"undefined"!=typeof Dom7&&(a=Dom7),("undefined"!=typeof a||(a="undefined"==typeof Dom7?window.Dom7||window.Zepto||window.jQuery:Dom7))&&(v.$=a,v.container=a(e),0!==v.container.length)){if(v.container.length>1)return void v.container.each(function(){new t(this,s)});v.container[0].swiper=v,v.container.data("swiper",v),v.classNames.push("swiper-container-"+v.params.direction),v.params.freeMode&&v.classNames.push("swiper-container-free-mode"),v.support.flexbox||(v.classNames.push("swiper-container-no-flexbox"),v.params.slidesPerColumn=1),(v.params.parallax||v.params.watchSlidesVisibility)&&(v.params.watchSlidesProgress=!0),["cube","coverflow"].indexOf(v.params.effect)>=0&&(v.support.transforms3d?(v.params.watchSlidesProgress=!0,v.classNames.push("swiper-container-3d")):v.params.effect="slide"),"slide"!==v.params.effect&&v.classNames.push("swiper-container-"+v.params.effect),"cube"===v.params.effect&&(v.params.resistanceRatio=0,v.params.slidesPerView=1,v.params.slidesPerColumn=1,v.params.slidesPerGroup=1,v.params.centeredSlides=!1,v.params.spaceBetween=0,v.params.virtualTranslate=!0,v.params.setWrapperSize=!1),"fade"===v.params.effect&&(v.params.slidesPerView=1,v.params.slidesPerColumn=1,v.params.slidesPerGroup=1,v.params.watchSlidesProgress=!0,v.params.spaceBetween=0,"undefined"==typeof f&&(v.params.virtualTranslate=!0)),v.params.grabCursor&&v.support.touch&&(v.params.grabCursor=!1),v.wrapper=v.container.children("."+v.params.wrapperClass),v.params.pagination&&(v.paginationContainer=a(v.params.pagination),v.params.paginationClickable&&v.paginationContainer.addClass("swiper-pagination-clickable")),v.rtl=r()&&("rtl"===v.container[0].dir.toLowerCase()||"rtl"===v.container.css("direction")),v.rtl&&v.classNames.push("swiper-container-rtl"),v.rtl&&(v.wrongRTL="-webkit-box"===v.wrapper.css("display")),v.params.slidesPerColumn>1&&v.classNames.push("swiper-container-multirow"),v.device.android&&v.classNames.push("swiper-container-android"),v.container.addClass(v.classNames.join(" ")),v.translate=0,v.progress=0,v.velocity=0,v.lockSwipeToNext=function(){v.params.allowSwipeToNext=!1},v.lockSwipeToPrev=function(){v.params.allowSwipeToPrev=!1},v.lockSwipes=function(){v.params.allowSwipeToNext=v.params.allowSwipeToPrev=!1},v.unlockSwipeToNext=function(){v.params.allowSwipeToNext=!0},v.unlockSwipeToPrev=function(){v.params.allowSwipeToPrev=!0},v.unlockSwipes=function(){v.params.allowSwipeToNext=v.params.allowSwipeToPrev=!0},v.params.grabCursor&&(v.container[0].style.cursor="move",v.container[0].style.cursor="-webkit-grab",v.container[0].style.cursor="-moz-grab",v.container[0].style.cursor="grab"),v.imagesToLoad=[],v.imagesLoaded=0,v.loadImage=function(e,a,t,s){function r(){s&&s()}var i;e.complete&&t?r():a?(i=new window.Image,i.onload=r,i.onerror=r,i.src=a):r()},v.preloadImages=function(){function e(){"undefined"!=typeof v&&null!==v&&(void 0!==v.imagesLoaded&&v.imagesLoaded++,v.imagesLoaded===v.imagesToLoad.length&&(v.params.updateOnImagesReady&&v.update(),v.emit("onImagesReady",v)))}v.imagesToLoad=v.container.find("img");for(var a=0;a<v.imagesToLoad.length;a++)v.loadImage(v.imagesToLoad[a],v.imagesToLoad[a].currentSrc||v.imagesToLoad[a].getAttribute("src"),!0,e)},v.autoplayTimeoutId=void 0,v.autoplaying=!1,v.autoplayPaused=!1,v.startAutoplay=function(){return"undefined"!=typeof v.autoplayTimeoutId?!1:v.params.autoplay?v.autoplaying?!1:(v.autoplaying=!0,v.emit("onAutoplayStart",v),void n()):!1},v.stopAutoplay=function(e){v.autoplayTimeoutId&&(v.autoplayTimeoutId&&clearTimeout(v.autoplayTimeoutId),v.autoplaying=!1,v.autoplayTimeoutId=void 0,v.emit("onAutoplayStop",v))},v.pauseAutoplay=function(e){v.autoplayPaused||(v.autoplayTimeoutId&&clearTimeout(v.autoplayTimeoutId),v.autoplayPaused=!0,0===e?(v.autoplayPaused=!1,n()):v.wrapper.transitionEnd(function(){v&&(v.autoplayPaused=!1,v.autoplaying?n():v.stopAutoplay())}))},v.minTranslate=function(){return-v.snapGrid[0]},v.maxTranslate=function(){return-v.snapGrid[v.snapGrid.length-1]},v.updateContainerSize=function(){var e,a;e="undefined"!=typeof v.params.width?v.params.width:v.container[0].clientWidth,a="undefined"!=typeof v.params.height?v.params.height:v.container[0].clientHeight,0===e&&r()||0===a&&!r()||(e=e-parseInt(v.container.css("padding-left"),10)-parseInt(v.container.css("padding-right"),10),a=a-parseInt(v.container.css("padding-top"),10)-parseInt(v.container.css("padding-bottom"),10),v.width=e,v.height=a,v.size=r()?v.width:v.height)},v.updateSlidesSize=function(){v.slides=v.wrapper.children("."+v.params.slideClass),v.snapGrid=[],v.slidesGrid=[],v.slidesSizesGrid=[];var e,a=v.params.spaceBetween,t=-v.params.slidesOffsetBefore,s=0,n=0;"string"==typeof a&&a.indexOf("%")>=0&&(a=parseFloat(a.replace("%",""))/100*v.size),v.virtualSize=-a,v.slides.css(v.rtl?{marginLeft:"",marginTop:""}:{marginRight:"",marginBottom:""});var o;v.params.slidesPerColumn>1&&(o=Math.floor(v.slides.length/v.params.slidesPerColumn)===v.slides.length/v.params.slidesPerColumn?v.slides.length:Math.ceil(v.slides.length/v.params.slidesPerColumn)*v.params.slidesPerColumn);var l,p=v.params.slidesPerColumn,d=o/p,u=d-(v.params.slidesPerColumn*d-v.slides.length);for(e=0;e<v.slides.length;e++){l=0;var c=v.slides.eq(e);if(v.params.slidesPerColumn>1){var m,f,h;"column"===v.params.slidesPerColumnFill?(f=Math.floor(e/p),h=e-f*p,(f>u||f===u&&h===p-1)&&++h>=p&&(h=0,f++),m=f+h*o/p,c.css({"-webkit-box-ordinal-group":m,"-moz-box-ordinal-group":m,"-ms-flex-order":m,"-webkit-order":m,order:m})):(h=Math.floor(e/d),f=e-h*d),c.css({"margin-top":0!==h&&v.params.spaceBetween&&v.params.spaceBetween+"px"}).attr("data-swiper-column",f).attr("data-swiper-row",h)}"none"!==c.css("display")&&("auto"===v.params.slidesPerView?(l=r()?c.outerWidth(!0):c.outerHeight(!0),v.params.roundLengths&&(l=i(l))):(l=(v.size-(v.params.slidesPerView-1)*a)/v.params.slidesPerView,v.params.roundLengths&&(l=i(l)),r()?v.slides[e].style.width=l+"px":v.slides[e].style.height=l+"px"),v.slides[e].swiperSlideSize=l,v.slidesSizesGrid.push(l),v.params.centeredSlides?(t=t+l/2+s/2+a,0===e&&(t=t-v.size/2-a),Math.abs(t)<.001&&(t=0),n%v.params.slidesPerGroup===0&&v.snapGrid.push(t),v.slidesGrid.push(t)):(n%v.params.slidesPerGroup===0&&v.snapGrid.push(t),v.slidesGrid.push(t),t=t+l+a),v.virtualSize+=l+a,s=l,n++)}v.virtualSize=Math.max(v.virtualSize,v.size)+v.params.slidesOffsetAfter;var g;if(v.rtl&&v.wrongRTL&&("slide"===v.params.effect||"coverflow"===v.params.effect)&&v.wrapper.css({width:v.virtualSize+v.params.spaceBetween+"px"}),(!v.support.flexbox||v.params.setWrapperSize)&&v.wrapper.css(r()?{width:v.virtualSize+v.params.spaceBetween+"px"}:{height:v.virtualSize+v.params.spaceBetween+"px"}),v.params.slidesPerColumn>1&&(v.virtualSize=(l+v.params.spaceBetween)*o,v.virtualSize=Math.ceil(v.virtualSize/v.params.slidesPerColumn)-v.params.spaceBetween,v.wrapper.css({width:v.virtualSize+v.params.spaceBetween+"px"}),v.params.centeredSlides)){for(g=[],e=0;e<v.snapGrid.length;e++)v.snapGrid[e]<v.virtualSize+v.snapGrid[0]&&g.push(v.snapGrid[e]);v.snapGrid=g}if(!v.params.centeredSlides){for(g=[],e=0;e<v.snapGrid.length;e++)v.snapGrid[e]<=v.virtualSize-v.size&&g.push(v.snapGrid[e]);v.snapGrid=g,Math.floor(v.virtualSize-v.size)>Math.floor(v.snapGrid[v.snapGrid.length-1])&&v.snapGrid.push(v.virtualSize-v.size)}0===v.snapGrid.length&&(v.snapGrid=[0]),0!==v.params.spaceBetween&&v.slides.css(r()?v.rtl?{marginLeft:a+"px"}:{marginRight:a+"px"}:{marginBottom:a+"px"}),v.params.watchSlidesProgress&&v.updateSlidesOffset()},v.updateSlidesOffset=function(){for(var e=0;e<v.slides.length;e++)v.slides[e].swiperSlideOffset=r()?v.slides[e].offsetLeft:v.slides[e].offsetTop},v.updateSlidesProgress=function(e){if("undefined"==typeof e&&(e=v.translate||0),0!==v.slides.length){"undefined"==typeof v.slides[0].swiperSlideOffset&&v.updateSlidesOffset();var a=-e;v.rtl&&(a=e);{v.container[0].getBoundingClientRect(),r()?"left":"top",r()?"right":"bottom"}v.slides.removeClass(v.params.slideVisibleClass);for(var t=0;t<v.slides.length;t++){var s=v.slides[t],i=(a-s.swiperSlideOffset)/(s.swiperSlideSize+v.params.spaceBetween);if(v.params.watchSlidesVisibility){var n=-(a-s.swiperSlideOffset),o=n+v.slidesSizesGrid[t],l=n>=0&&n<v.size||o>0&&o<=v.size||0>=n&&o>=v.size;l&&v.slides.eq(t).addClass(v.params.slideVisibleClass)}s.progress=v.rtl?-i:i}}},v.updateProgress=function(e){"undefined"==typeof e&&(e=v.translate||0);var a=v.maxTranslate()-v.minTranslate();0===a?(v.progress=0,v.isBeginning=v.isEnd=!0):(v.progress=(e-v.minTranslate())/a,v.isBeginning=v.progress<=0,v.isEnd=v.progress>=1),v.isBeginning&&v.emit("onReachBeginning",v),v.isEnd&&v.emit("onReachEnd",v),v.params.watchSlidesProgress&&v.updateSlidesProgress(e),v.emit("onProgress",v,v.progress)},v.updateActiveIndex=function(){var e,a,t,s=v.rtl?v.translate:-v.translate;for(a=0;a<v.slidesGrid.length;a++)"undefined"!=typeof v.slidesGrid[a+1]?s>=v.slidesGrid[a]&&s<v.slidesGrid[a+1]-(v.slidesGrid[a+1]-v.slidesGrid[a])/2?e=a:s>=v.slidesGrid[a]&&s<v.slidesGrid[a+1]&&(e=a+1):s>=v.slidesGrid[a]&&(e=a);(0>e||"undefined"==typeof e)&&(e=0),t=Math.floor(e/v.params.slidesPerGroup),t>=v.snapGrid.length&&(t=v.snapGrid.length-1),e!==v.activeIndex&&(v.snapIndex=t,v.previousIndex=v.activeIndex,v.activeIndex=e,v.updateClasses())},v.updateClasses=function(){v.slides.removeClass(v.params.slideActiveClass+" "+v.params.slideNextClass+" "+v.params.slidePrevClass);var e=v.slides.eq(v.activeIndex);if(e.addClass(v.params.slideActiveClass),e.next("."+v.params.slideClass).addClass(v.params.slideNextClass),e.prev("."+v.params.slideClass).addClass(v.params.slidePrevClass),v.bullets&&v.bullets.length>0){v.bullets.removeClass(v.params.bulletActiveClass);var t;v.params.loop?(t=Math.ceil(v.activeIndex-v.loopedSlides)/v.params.slidesPerGroup,t>v.slides.length-1-2*v.loopedSlides&&(t-=v.slides.length-2*v.loopedSlides),t>v.bullets.length-1&&(t-=v.bullets.length)):t="undefined"!=typeof v.snapIndex?v.snapIndex:v.activeIndex||0,v.paginationContainer.length>1?v.bullets.each(function(){a(this).index()===t&&a(this).addClass(v.params.bulletActiveClass)}):v.bullets.eq(t).addClass(v.params.bulletActiveClass)}v.params.loop||(v.params.prevButton&&(v.isBeginning?(a(v.params.prevButton).addClass(v.params.buttonDisabledClass),v.params.a11y&&v.a11y&&v.a11y.disable(a(v.params.prevButton))):(a(v.params.prevButton).removeClass(v.params.buttonDisabledClass),v.params.a11y&&v.a11y&&v.a11y.enable(a(v.params.prevButton)))),v.params.nextButton&&(v.isEnd?(a(v.params.nextButton).addClass(v.params.buttonDisabledClass),v.params.a11y&&v.a11y&&v.a11y.disable(a(v.params.nextButton))):(a(v.params.nextButton).removeClass(v.params.buttonDisabledClass),v.params.a11y&&v.a11y&&v.a11y.enable(a(v.params.nextButton)))))},v.updatePagination=function(){if(v.params.pagination&&v.paginationContainer&&v.paginationContainer.length>0){for(var e="",a=v.params.loop?Math.ceil((v.slides.length-2*v.loopedSlides)/v.params.slidesPerGroup):v.snapGrid.length,t=0;a>t;t++)e+=v.params.paginationBulletRender?v.params.paginationBulletRender(t,v.params.bulletClass):"<"+v.params.paginationElement+' class="'+v.params.bulletClass+'"></'+v.params.paginationElement+">";v.paginationContainer.html(e),v.bullets=v.paginationContainer.find("."+v.params.bulletClass),v.params.paginationClickable&&v.params.a11y&&v.a11y&&v.a11y.initPagination()}},v.update=function(e){function a(){s=Math.min(Math.max(v.translate,v.maxTranslate()),v.minTranslate()),v.setWrapperTranslate(s),v.updateActiveIndex(),v.updateClasses()}if(v.updateContainerSize(),v.updateSlidesSize(),v.updateProgress(),v.updatePagination(),v.updateClasses(),v.params.scrollbar&&v.scrollbar&&v.scrollbar.set(),e){var t,s;v.controller&&v.controller.spline&&(v.controller.spline=void 0),v.params.freeMode?a():(t=("auto"===v.params.slidesPerView||v.params.slidesPerView>1)&&v.isEnd&&!v.params.centeredSlides?v.slideTo(v.slides.length-1,0,!1,!0):v.slideTo(v.activeIndex,0,!1,!0),t||a())}},v.onResize=function(e){var a=v.params.allowSwipeToPrev,t=v.params.allowSwipeToNext;if(v.params.allowSwipeToPrev=v.params.allowSwipeToNext=!0,v.updateContainerSize(),v.updateSlidesSize(),("auto"===v.params.slidesPerView||v.params.freeMode||e)&&v.updatePagination(),v.params.scrollbar&&v.scrollbar&&v.scrollbar.set(),v.controller&&v.controller.spline&&(v.controller.spline=void 0),v.params.freeMode){var s=Math.min(Math.max(v.translate,v.maxTranslate()),v.minTranslate());v.setWrapperTranslate(s),v.updateActiveIndex(),v.updateClasses()}else v.updateClasses(),("auto"===v.params.slidesPerView||v.params.slidesPerView>1)&&v.isEnd&&!v.params.centeredSlides?v.slideTo(v.slides.length-1,0,!1,!0):v.slideTo(v.activeIndex,0,!1,!0);v.params.allowSwipeToPrev=a,v.params.allowSwipeToNext=t};var w=["mousedown","mousemove","mouseup"];window.navigator.pointerEnabled?w=["pointerdown","pointermove","pointerup"]:window.navigator.msPointerEnabled&&(w=["MSPointerDown","MSPointerMove","MSPointerUp"]),v.touchEvents={start:v.support.touch||!v.params.simulateTouch?"touchstart":w[0],move:v.support.touch||!v.params.simulateTouch?"touchmove":w[1],end:v.support.touch||!v.params.simulateTouch?"touchend":w[2]},(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&("container"===v.params.touchEventsTarget?v.container:v.wrapper).addClass("swiper-wp8-"+v.params.direction),v.initEvents=function(e){var t=e?"off":"on",r=e?"removeEventListener":"addEventListener",i="container"===v.params.touchEventsTarget?v.container[0]:v.wrapper[0],n=v.support.touch?i:document,o=v.params.nested?!0:!1;v.browser.ie?(i[r](v.touchEvents.start,v.onTouchStart,!1),n[r](v.touchEvents.move,v.onTouchMove,o),n[r](v.touchEvents.end,v.onTouchEnd,!1)):(v.support.touch&&(i[r](v.touchEvents.start,v.onTouchStart,!1),i[r](v.touchEvents.move,v.onTouchMove,o),i[r](v.touchEvents.end,v.onTouchEnd,!1)),!s.simulateTouch||v.device.ios||v.device.android||(i[r]("mousedown",v.onTouchStart,!1),document[r]("mousemove",v.onTouchMove,o),document[r]("mouseup",v.onTouchEnd,!1))),window[r]("resize",v.onResize),v.params.nextButton&&(a(v.params.nextButton)[t]("click",v.onClickNext),v.params.a11y&&v.a11y&&a(v.params.nextButton)[t]("keydown",v.a11y.onEnterKey)),v.params.prevButton&&(a(v.params.prevButton)[t]("click",v.onClickPrev),v.params.a11y&&v.a11y&&a(v.params.prevButton)[t]("keydown",v.a11y.onEnterKey)),v.params.pagination&&v.params.paginationClickable&&(a(v.paginationContainer)[t]("click","."+v.params.bulletClass,v.onClickIndex),v.params.a11y&&v.a11y&&a(v.paginationContainer)[t]("keydown","."+v.params.bulletClass,v.a11y.onEnterKey)),(v.params.preventClicks||v.params.preventClicksPropagation)&&i[r]("click",v.preventClicks,!0)},v.attachEvents=function(e){v.initEvents()},v.detachEvents=function(){v.initEvents(!0)},v.allowClick=!0,v.preventClicks=function(e){v.allowClick||(v.params.preventClicks&&e.preventDefault(),v.params.preventClicksPropagation&&v.animating&&(e.stopPropagation(),e.stopImmediatePropagation()))},v.onClickNext=function(e){e.preventDefault(),(!v.isEnd||v.params.loop)&&v.slideNext()},v.onClickPrev=function(e){e.preventDefault(),(!v.isBeginning||v.params.loop)&&v.slidePrev()},v.onClickIndex=function(e){e.preventDefault();var t=a(this).index()*v.params.slidesPerGroup;v.params.loop&&(t+=v.loopedSlides),v.slideTo(t)},v.updateClickedSlide=function(e){var t=o(e,"."+v.params.slideClass),s=!1;if(t)for(var r=0;r<v.slides.length;r++)v.slides[r]===t&&(s=!0);if(!t||!s)return v.clickedSlide=void 0,void(v.clickedIndex=void 0);if(v.clickedSlide=t,v.clickedIndex=a(t).index(),v.params.slideToClickedSlide&&void 0!==v.clickedIndex&&v.clickedIndex!==v.activeIndex){var i,n=v.clickedIndex;if(v.params.loop)if(i=a(v.clickedSlide).attr("data-swiper-slide-index"),n>v.slides.length-v.params.slidesPerView)v.fixLoop(),n=v.wrapper.children("."+v.params.slideClass+'[data-swiper-slide-index="'+i+'"]').eq(0).index(),setTimeout(function(){v.slideTo(n)},0);else if(n<v.params.slidesPerView-1){v.fixLoop();var l=v.wrapper.children("."+v.params.slideClass+'[data-swiper-slide-index="'+i+'"]');n=l.eq(l.length-1).index(),setTimeout(function(){v.slideTo(n)},0)}else v.slideTo(n);else v.slideTo(n)}};var y,x,b,T,S,C,M,P,z,I="input, select, textarea, button",E=Date.now(),k=[];v.animating=!1,v.touches={startX:0,startY:0,currentX:0,currentY:0,diff:0};var D,G;if(v.onTouchStart=function(e){if(e.originalEvent&&(e=e.originalEvent),D="touchstart"===e.type,D||!("which"in e)||3!==e.which){if(v.params.noSwiping&&o(e,"."+v.params.noSwipingClass))return void(v.allowClick=!0);if(!v.params.swipeHandler||o(e,v.params.swipeHandler)){var t=v.touches.currentX="touchstart"===e.type?e.targetTouches[0].pageX:e.pageX,s=v.touches.currentY="touchstart"===e.type?e.targetTouches[0].pageY:e.pageY;if(!(v.device.ios&&v.params.iOSEdgeSwipeDetection&&t<=v.params.iOSEdgeSwipeThreshold)){if(y=!0,x=!1,T=void 0,G=void 0,v.touches.startX=t,v.touches.startY=s,b=Date.now(),v.allowClick=!0,v.updateContainerSize(),v.swipeDirection=void 0,v.params.threshold>0&&(M=!1),"touchstart"!==e.type){var r=!0;a(e.target).is(I)&&(r=!1),document.activeElement&&a(document.activeElement).is(I)&&document.activeElement.blur(),r&&e.preventDefault()}v.emit("onTouchStart",v,e)}}}},v.onTouchMove=function(e){if(e.originalEvent&&(e=e.originalEvent),!(D&&"mousemove"===e.type||e.preventedByNestedSwiper)){if(v.params.onlyExternal)return v.allowClick=!1,void(y&&(v.touches.startX=v.touches.currentX="touchmove"===e.type?e.targetTouches[0].pageX:e.pageX,v.touches.startY=v.touches.currentY="touchmove"===e.type?e.targetTouches[0].pageY:e.pageY,b=Date.now()));if(D&&document.activeElement&&e.target===document.activeElement&&a(e.target).is(I))return x=!0,void(v.allowClick=!1);if(v.emit("onTouchMove",v,e),!(e.targetTouches&&e.targetTouches.length>1)){if(v.touches.currentX="touchmove"===e.type?e.targetTouches[0].pageX:e.pageX,v.touches.currentY="touchmove"===e.type?e.targetTouches[0].pageY:e.pageY,"undefined"==typeof T){var t=180*Math.atan2(Math.abs(v.touches.currentY-v.touches.startY),Math.abs(v.touches.currentX-v.touches.startX))/Math.PI;T=r()?t>v.params.touchAngle:90-t>v.params.touchAngle}if(T&&v.emit("onTouchMoveOpposite",v,e),"undefined"==typeof G&&v.browser.ieTouch&&(v.touches.currentX!==v.touches.startX||v.touches.currentY!==v.touches.startY)&&(G=!0),y){if(T)return void(y=!1);if(G||!v.browser.ieTouch){v.allowClick=!1,v.emit("onSliderMove",v,e),e.preventDefault(),v.params.touchMoveStopPropagation&&!v.params.nested&&e.stopPropagation(),x||(s.loop&&v.fixLoop(),C=v.getWrapperTranslate(),v.setWrapperTransition(0),v.animating&&v.wrapper.trigger("webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd"),v.params.autoplay&&v.autoplaying&&(v.params.autoplayDisableOnInteraction?v.stopAutoplay():v.pauseAutoplay()),z=!1,v.params.grabCursor&&(v.container[0].style.cursor="move",v.container[0].style.cursor="-webkit-grabbing",v.container[0].style.cursor="-moz-grabbin",v.container[0].style.cursor="grabbing")),x=!0;var i=v.touches.diff=r()?v.touches.currentX-v.touches.startX:v.touches.currentY-v.touches.startY;i*=v.params.touchRatio,v.rtl&&(i=-i),v.swipeDirection=i>0?"prev":"next",S=i+C;var n=!0;if(i>0&&S>v.minTranslate()?(n=!1,v.params.resistance&&(S=v.minTranslate()-1+Math.pow(-v.minTranslate()+C+i,v.params.resistanceRatio))):0>i&&S<v.maxTranslate()&&(n=!1,v.params.resistance&&(S=v.maxTranslate()+1-Math.pow(v.maxTranslate()-C-i,v.params.resistanceRatio))),n&&(e.preventedByNestedSwiper=!0),!v.params.allowSwipeToNext&&"next"===v.swipeDirection&&C>S&&(S=C),!v.params.allowSwipeToPrev&&"prev"===v.swipeDirection&&S>C&&(S=C),v.params.followFinger){if(v.params.threshold>0){if(!(Math.abs(i)>v.params.threshold||M))return void(S=C);if(!M)return M=!0,v.touches.startX=v.touches.currentX,v.touches.startY=v.touches.currentY,S=C,void(v.touches.diff=r()?v.touches.currentX-v.touches.startX:v.touches.currentY-v.touches.startY)}(v.params.freeMode||v.params.watchSlidesProgress)&&v.updateActiveIndex(),v.params.freeMode&&(0===k.length&&k.push({position:v.touches[r()?"startX":"startY"],time:b}),k.push({position:v.touches[r()?"currentX":"currentY"],time:(new window.Date).getTime()})),v.updateProgress(S),v.setWrapperTranslate(S)}}}}}},v.onTouchEnd=function(e){if(e.originalEvent&&(e=e.originalEvent),v.emit("onTouchEnd",v,e),y){v.params.grabCursor&&x&&y&&(v.container[0].style.cursor="move",v.container[0].style.cursor="-webkit-grab",v.container[0].style.cursor="-moz-grab",v.container[0].style.cursor="grab");var t=Date.now(),s=t-b;if(v.allowClick&&(v.updateClickedSlide(e),v.emit("onTap",v,e),300>s&&t-E>300&&(P&&clearTimeout(P),P=setTimeout(function(){v&&(v.params.paginationHide&&v.paginationContainer.length>0&&!a(e.target).hasClass(v.params.bulletClass)&&v.paginationContainer.toggleClass(v.params.paginationHiddenClass),v.emit("onClick",v,e))},300)),300>s&&300>t-E&&(P&&clearTimeout(P),v.emit("onDoubleTap",v,e))),E=Date.now(),setTimeout(function(){v&&(v.allowClick=!0)},0),!y||!x||!v.swipeDirection||0===v.touches.diff||S===C)return void(y=x=!1);y=x=!1;var r;if(r=v.params.followFinger?v.rtl?v.translate:-v.translate:-S,v.params.freeMode){if(r<-v.minTranslate())return void v.slideTo(v.activeIndex);if(r>-v.maxTranslate())return void v.slideTo(v.slides.length<v.snapGrid.length?v.snapGrid.length-1:v.slides.length-1);if(v.params.freeModeMomentum){if(k.length>1){var i=k.pop(),n=k.pop(),o=i.position-n.position,l=i.time-n.time;v.velocity=o/l,v.velocity=v.velocity/2,Math.abs(v.velocity)<.02&&(v.velocity=0),(l>150||(new window.Date).getTime()-i.time>300)&&(v.velocity=0)}else v.velocity=0;k.length=0;var p=1e3*v.params.freeModeMomentumRatio,d=v.velocity*p,u=v.translate+d;v.rtl&&(u=-u);var c,m=!1,f=20*Math.abs(v.velocity)*v.params.freeModeMomentumBounceRatio;if(u<v.maxTranslate())v.params.freeModeMomentumBounce?(u+v.maxTranslate()<-f&&(u=v.maxTranslate()-f),c=v.maxTranslate(),m=!0,z=!0):u=v.maxTranslate();else if(u>v.minTranslate())v.params.freeModeMomentumBounce?(u-v.minTranslate()>f&&(u=v.minTranslate()+f),c=v.minTranslate(),m=!0,z=!0):u=v.minTranslate();else if(v.params.freeModeSticky){var h,g=0;for(g=0;g<v.snapGrid.length;g+=1)if(v.snapGrid[g]>-u){h=g;break}u=Math.abs(v.snapGrid[h]-u)<Math.abs(v.snapGrid[h-1]-u)||"next"===v.swipeDirection?v.snapGrid[h]:v.snapGrid[h-1],v.rtl||(u=-u)}if(0!==v.velocity)p=Math.abs(v.rtl?(-u-v.translate)/v.velocity:(u-v.translate)/v.velocity);else if(v.params.freeModeSticky)return void v.slideReset();v.params.freeModeMomentumBounce&&m?(v.updateProgress(c),v.setWrapperTransition(p),v.setWrapperTranslate(u),v.onTransitionStart(),v.animating=!0,v.wrapper.transitionEnd(function(){v&&z&&(v.emit("onMomentumBounce",v),v.setWrapperTransition(v.params.speed),v.setWrapperTranslate(c),v.wrapper.transitionEnd(function(){v&&v.onTransitionEnd()}))})):v.velocity?(v.updateProgress(u),v.setWrapperTransition(p),v.setWrapperTranslate(u),v.onTransitionStart(),v.animating||(v.animating=!0,v.wrapper.transitionEnd(function(){v&&v.onTransitionEnd()}))):v.updateProgress(u),v.updateActiveIndex()}return void((!v.params.freeModeMomentum||s>=v.params.longSwipesMs)&&(v.updateProgress(),v.updateActiveIndex()))}var w,T=0,M=v.slidesSizesGrid[0];for(w=0;w<v.slidesGrid.length;w+=v.params.slidesPerGroup)"undefined"!=typeof v.slidesGrid[w+v.params.slidesPerGroup]?r>=v.slidesGrid[w]&&r<v.slidesGrid[w+v.params.slidesPerGroup]&&(T=w,M=v.slidesGrid[w+v.params.slidesPerGroup]-v.slidesGrid[w]):r>=v.slidesGrid[w]&&(T=w,M=v.slidesGrid[v.slidesGrid.length-1]-v.slidesGrid[v.slidesGrid.length-2]);var I=(r-v.slidesGrid[T])/M;if(s>v.params.longSwipesMs){if(!v.params.longSwipes)return void v.slideTo(v.activeIndex);"next"===v.swipeDirection&&v.slideTo(I>=v.params.longSwipesRatio?T+v.params.slidesPerGroup:T),"prev"===v.swipeDirection&&v.slideTo(I>1-v.params.longSwipesRatio?T+v.params.slidesPerGroup:T)}else{if(!v.params.shortSwipes)return void v.slideTo(v.activeIndex);"next"===v.swipeDirection&&v.slideTo(T+v.params.slidesPerGroup),"prev"===v.swipeDirection&&v.slideTo(T)}}},v._slideTo=function(e,a){return v.slideTo(e,a,!0,!0)},v.slideTo=function(e,a,t,s){"undefined"==typeof t&&(t=!0),"undefined"==typeof e&&(e=0),0>e&&(e=0),v.snapIndex=Math.floor(e/v.params.slidesPerGroup),v.snapIndex>=v.snapGrid.length&&(v.snapIndex=v.snapGrid.length-1);var i=-v.snapGrid[v.snapIndex];v.params.autoplay&&v.autoplaying&&(s||!v.params.autoplayDisableOnInteraction?v.pauseAutoplay(a):v.stopAutoplay()),v.updateProgress(i);for(var n=0;n<v.slidesGrid.length;n++)-Math.floor(100*i)>=Math.floor(100*v.slidesGrid[n])&&(e=n);if(!v.params.allowSwipeToNext&&i<v.translate&&i<v.minTranslate())return!1;if(!v.params.allowSwipeToPrev&&i>v.translate&&i>v.maxTranslate()&&(v.activeIndex||0)!==e)return!1;if("undefined"==typeof a&&(a=v.params.speed),v.previousIndex=v.activeIndex||0,v.activeIndex=e,i===v.translate)return v.updateClasses(),!1;v.updateClasses(),v.onTransitionStart(t);r()?i:0,r()?0:i;return 0===a?(v.setWrapperTransition(0),v.setWrapperTranslate(i),v.onTransitionEnd(t)):(v.setWrapperTransition(a),v.setWrapperTranslate(i),v.animating||(v.animating=!0,v.wrapper.transitionEnd(function(){v&&v.onTransitionEnd(t)}))),!0},v.onTransitionStart=function(e){"undefined"==typeof e&&(e=!0),
  v.lazy&&v.lazy.onTransitionStart(),e&&(v.emit("onTransitionStart",v),v.activeIndex!==v.previousIndex&&v.emit("onSlideChangeStart",v))},v.onTransitionEnd=function(e){v.animating=!1,v.setWrapperTransition(0),"undefined"==typeof e&&(e=!0),v.lazy&&v.lazy.onTransitionEnd(),e&&(v.emit("onTransitionEnd",v),v.activeIndex!==v.previousIndex&&v.emit("onSlideChangeEnd",v)),v.params.hashnav&&v.hashnav&&v.hashnav.setHash()},v.slideNext=function(e,a,t){if(v.params.loop){if(v.animating)return!1;v.fixLoop();{v.container[0].clientLeft}return v.slideTo(v.activeIndex+v.params.slidesPerGroup,a,e,t)}return v.slideTo(v.activeIndex+v.params.slidesPerGroup,a,e,t)},v._slideNext=function(e){return v.slideNext(!0,e,!0)},v.slidePrev=function(e,a,t){if(v.params.loop){if(v.animating)return!1;v.fixLoop();{v.container[0].clientLeft}return v.slideTo(v.activeIndex-1,a,e,t)}return v.slideTo(v.activeIndex-1,a,e,t)},v._slidePrev=function(e){return v.slidePrev(!0,e,!0)},v.slideReset=function(e,a,t){return v.slideTo(v.activeIndex,a,e)},v.setWrapperTransition=function(e,a){v.wrapper.transition(e),"slide"!==v.params.effect&&v.effects[v.params.effect]&&v.effects[v.params.effect].setTransition(e),v.params.parallax&&v.parallax&&v.parallax.setTransition(e),v.params.scrollbar&&v.scrollbar&&v.scrollbar.setTransition(e),v.params.control&&v.controller&&v.controller.setTransition(e,a),v.emit("onSetTransition",v,e)},v.setWrapperTranslate=function(e,a,t){var s=0,i=0,n=0;r()?s=v.rtl?-e:e:i=e,v.params.virtualTranslate||v.wrapper.transform(v.support.transforms3d?"translate3d("+s+"px, "+i+"px, "+n+"px)":"translate("+s+"px, "+i+"px)"),v.translate=r()?s:i,a&&v.updateActiveIndex(),"slide"!==v.params.effect&&v.effects[v.params.effect]&&v.effects[v.params.effect].setTranslate(v.translate),v.params.parallax&&v.parallax&&v.parallax.setTranslate(v.translate),v.params.scrollbar&&v.scrollbar&&v.scrollbar.setTranslate(v.translate),v.params.control&&v.controller&&v.controller.setTranslate(v.translate,t),v.emit("onSetTranslate",v,v.translate)},v.getTranslate=function(e,a){var t,s,r,i;return"undefined"==typeof a&&(a="x"),v.params.virtualTranslate?v.rtl?-v.translate:v.translate:(r=window.getComputedStyle(e,null),window.WebKitCSSMatrix?i=new window.WebKitCSSMatrix("none"===r.webkitTransform?"":r.webkitTransform):(i=r.MozTransform||r.OTransform||r.MsTransform||r.msTransform||r.transform||r.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,"),t=i.toString().split(",")),"x"===a&&(s=window.WebKitCSSMatrix?i.m41:parseFloat(16===t.length?t[12]:t[4])),"y"===a&&(s=window.WebKitCSSMatrix?i.m42:parseFloat(16===t.length?t[13]:t[5])),v.rtl&&s&&(s=-s),s||0)},v.getWrapperTranslate=function(e){return"undefined"==typeof e&&(e=r()?"x":"y"),v.getTranslate(v.wrapper[0],e)},v.observers=[],v.initObservers=function(){if(v.params.observeParents)for(var e=v.container.parents(),a=0;a<e.length;a++)l(e[a]);l(v.container[0],{childList:!1}),l(v.wrapper[0],{attributes:!1})},v.disconnectObservers=function(){for(var e=0;e<v.observers.length;e++)v.observers[e].disconnect();v.observers=[]},v.createLoop=function(){v.wrapper.children("."+v.params.slideClass+"."+v.params.slideDuplicateClass).remove();var e=v.wrapper.children("."+v.params.slideClass);"auto"!==v.params.slidesPerView||v.params.loopedSlides||(v.params.loopedSlides=e.length),v.loopedSlides=parseInt(v.params.loopedSlides||v.params.slidesPerView,10),v.loopedSlides=v.loopedSlides+v.params.loopAdditionalSlides,v.loopedSlides>e.length&&(v.loopedSlides=e.length);var t,s=[],r=[];for(e.each(function(t,i){var n=a(this);t<v.loopedSlides&&r.push(i),t<e.length&&t>=e.length-v.loopedSlides&&s.push(i),n.attr("data-swiper-slide-index",t)}),t=0;t<r.length;t++)v.wrapper.append(a(r[t].cloneNode(!0)).addClass(v.params.slideDuplicateClass));for(t=s.length-1;t>=0;t--)v.wrapper.prepend(a(s[t].cloneNode(!0)).addClass(v.params.slideDuplicateClass))},v.destroyLoop=function(){v.wrapper.children("."+v.params.slideClass+"."+v.params.slideDuplicateClass).remove(),v.slides.removeAttr("data-swiper-slide-index")},v.fixLoop=function(){var e;v.activeIndex<v.loopedSlides?(e=v.slides.length-3*v.loopedSlides+v.activeIndex,e+=v.loopedSlides,v.slideTo(e,0,!1,!0)):("auto"===v.params.slidesPerView&&v.activeIndex>=2*v.loopedSlides||v.activeIndex>v.slides.length-2*v.params.slidesPerView)&&(e=-v.slides.length+v.activeIndex+v.loopedSlides,e+=v.loopedSlides,v.slideTo(e,0,!1,!0))},v.appendSlide=function(e){if(v.params.loop&&v.destroyLoop(),"object"==typeof e&&e.length)for(var a=0;a<e.length;a++)e[a]&&v.wrapper.append(e[a]);else v.wrapper.append(e);v.params.loop&&v.createLoop(),v.params.observer&&v.support.observer||v.update(!0)},v.prependSlide=function(e){v.params.loop&&v.destroyLoop();var a=v.activeIndex+1;if("object"==typeof e&&e.length){for(var t=0;t<e.length;t++)e[t]&&v.wrapper.prepend(e[t]);a=v.activeIndex+e.length}else v.wrapper.prepend(e);v.params.loop&&v.createLoop(),v.params.observer&&v.support.observer||v.update(!0),v.slideTo(a,0,!1)},v.removeSlide=function(e){v.params.loop&&(v.destroyLoop(),v.slides=v.wrapper.children("."+v.params.slideClass));var a,t=v.activeIndex;if("object"==typeof e&&e.length){for(var s=0;s<e.length;s++)a=e[s],v.slides[a]&&v.slides.eq(a).remove(),t>a&&t--;t=Math.max(t,0)}else a=e,v.slides[a]&&v.slides.eq(a).remove(),t>a&&t--,t=Math.max(t,0);v.params.loop&&v.createLoop(),v.params.observer&&v.support.observer||v.update(!0),v.params.loop?v.slideTo(t+v.loopedSlides,0,!1):v.slideTo(t,0,!1)},v.removeAllSlides=function(){for(var e=[],a=0;a<v.slides.length;a++)e.push(a);v.removeSlide(e)},v.effects={fade:{setTranslate:function(){for(var e=0;e<v.slides.length;e++){var a=v.slides.eq(e),t=a[0].swiperSlideOffset,s=-t;v.params.virtualTranslate||(s-=v.translate);var i=0;r()||(i=s,s=0);var n=v.params.fade.crossFade?Math.max(1-Math.abs(a[0].progress),0):1+Math.min(Math.max(a[0].progress,-1),0);a.css({opacity:n}).transform("translate3d("+s+"px, "+i+"px, 0px)")}},setTransition:function(e){if(v.slides.transition(e),v.params.virtualTranslate&&0!==e){var a=!1;v.slides.transitionEnd(function(){if(!a&&v){a=!0,v.animating=!1;for(var e=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],t=0;t<e.length;t++)v.wrapper.trigger(e[t])}})}}},cube:{setTranslate:function(){var e,t=0;v.params.cube.shadow&&(r()?(e=v.wrapper.find(".swiper-cube-shadow"),0===e.length&&(e=a('<div class="swiper-cube-shadow"></div>'),v.wrapper.append(e)),e.css({height:v.width+"px"})):(e=v.container.find(".swiper-cube-shadow"),0===e.length&&(e=a('<div class="swiper-cube-shadow"></div>'),v.container.append(e))));for(var s=0;s<v.slides.length;s++){var i=v.slides.eq(s),n=90*s,o=Math.floor(n/360);v.rtl&&(n=-n,o=Math.floor(-n/360));var l=Math.max(Math.min(i[0].progress,1),-1),p=0,d=0,u=0;s%4===0?(p=4*-o*v.size,u=0):(s-1)%4===0?(p=0,u=4*-o*v.size):(s-2)%4===0?(p=v.size+4*o*v.size,u=v.size):(s-3)%4===0&&(p=-v.size,u=3*v.size+4*v.size*o),v.rtl&&(p=-p),r()||(d=p,p=0);var c="rotateX("+(r()?0:-n)+"deg) rotateY("+(r()?n:0)+"deg) translate3d("+p+"px, "+d+"px, "+u+"px)";if(1>=l&&l>-1&&(t=90*s+90*l,v.rtl&&(t=90*-s-90*l)),i.transform(c),v.params.cube.slideShadows){var m=i.find(r()?".swiper-slide-shadow-left":".swiper-slide-shadow-top"),f=i.find(r()?".swiper-slide-shadow-right":".swiper-slide-shadow-bottom");0===m.length&&(m=a('<div class="swiper-slide-shadow-'+(r()?"left":"top")+'"></div>'),i.append(m)),0===f.length&&(f=a('<div class="swiper-slide-shadow-'+(r()?"right":"bottom")+'"></div>'),i.append(f));{i[0].progress}m.length&&(m[0].style.opacity=-i[0].progress),f.length&&(f[0].style.opacity=i[0].progress)}}if(v.wrapper.css({"-webkit-transform-origin":"50% 50% -"+v.size/2+"px","-moz-transform-origin":"50% 50% -"+v.size/2+"px","-ms-transform-origin":"50% 50% -"+v.size/2+"px","transform-origin":"50% 50% -"+v.size/2+"px"}),v.params.cube.shadow)if(r())e.transform("translate3d(0px, "+(v.width/2+v.params.cube.shadowOffset)+"px, "+-v.width/2+"px) rotateX(90deg) rotateZ(0deg) scale("+v.params.cube.shadowScale+")");else{var h=Math.abs(t)-90*Math.floor(Math.abs(t)/90),g=1.5-(Math.sin(2*h*Math.PI/360)/2+Math.cos(2*h*Math.PI/360)/2),w=v.params.cube.shadowScale,y=v.params.cube.shadowScale/g,x=v.params.cube.shadowOffset;e.transform("scale3d("+w+", 1, "+y+") translate3d(0px, "+(v.height/2+x)+"px, "+-v.height/2/y+"px) rotateX(-90deg)")}var b=v.isSafari||v.isUiWebView?-v.size/2:0;v.wrapper.transform("translate3d(0px,0,"+b+"px) rotateX("+(r()?0:t)+"deg) rotateY("+(r()?-t:0)+"deg)")},setTransition:function(e){v.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),v.params.cube.shadow&&!r()&&v.container.find(".swiper-cube-shadow").transition(e)}},coverflow:{setTranslate:function(){for(var e=v.translate,t=r()?-e+v.width/2:-e+v.height/2,s=r()?v.params.coverflow.rotate:-v.params.coverflow.rotate,i=v.params.coverflow.depth,n=0,o=v.slides.length;o>n;n++){var l=v.slides.eq(n),p=v.slidesSizesGrid[n],d=l[0].swiperSlideOffset,u=(t-d-p/2)/p*v.params.coverflow.modifier,c=r()?s*u:0,m=r()?0:s*u,f=-i*Math.abs(u),h=r()?0:v.params.coverflow.stretch*u,g=r()?v.params.coverflow.stretch*u:0;Math.abs(g)<.001&&(g=0),Math.abs(h)<.001&&(h=0),Math.abs(f)<.001&&(f=0),Math.abs(c)<.001&&(c=0),Math.abs(m)<.001&&(m=0);var w="translate3d("+g+"px,"+h+"px,"+f+"px)  rotateX("+m+"deg) rotateY("+c+"deg)";if(l.transform(w),l[0].style.zIndex=-Math.abs(Math.round(u))+1,v.params.coverflow.slideShadows){var y=l.find(r()?".swiper-slide-shadow-left":".swiper-slide-shadow-top"),x=l.find(r()?".swiper-slide-shadow-right":".swiper-slide-shadow-bottom");0===y.length&&(y=a('<div class="swiper-slide-shadow-'+(r()?"left":"top")+'"></div>'),l.append(y)),0===x.length&&(x=a('<div class="swiper-slide-shadow-'+(r()?"right":"bottom")+'"></div>'),l.append(x)),y.length&&(y[0].style.opacity=u>0?u:0),x.length&&(x[0].style.opacity=-u>0?-u:0)}}if(v.browser.ie){var b=v.wrapper[0].style;b.perspectiveOrigin=t+"px 50%"}},setTransition:function(e){v.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)}}},v.lazy={initialImageLoaded:!1,loadImageInSlide:function(e,t){if("undefined"!=typeof e&&("undefined"==typeof t&&(t=!0),0!==v.slides.length)){var s=v.slides.eq(e),r=s.find(".swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)");!s.hasClass("swiper-lazy")||s.hasClass("swiper-lazy-loaded")||s.hasClass("swiper-lazy-loading")||r.add(s[0]),0!==r.length&&r.each(function(){var e=a(this);e.addClass("swiper-lazy-loading");var r=e.attr("data-background"),i=e.attr("data-src");v.loadImage(e[0],i||r,!1,function(){if(r?(e.css("background-image","url("+r+")"),e.removeAttr("data-background")):(e.attr("src",i),e.removeAttr("data-src")),e.addClass("swiper-lazy-loaded").removeClass("swiper-lazy-loading"),s.find(".swiper-lazy-preloader, .preloader").remove(),v.params.loop&&t){var a=s.attr("data-swiper-slide-index");if(s.hasClass(v.params.slideDuplicateClass)){var n=v.wrapper.children('[data-swiper-slide-index="'+a+'"]:not(.'+v.params.slideDuplicateClass+")");v.lazy.loadImageInSlide(n.index(),!1)}else{var o=v.wrapper.children("."+v.params.slideDuplicateClass+'[data-swiper-slide-index="'+a+'"]');v.lazy.loadImageInSlide(o.index(),!1)}}v.emit("onLazyImageReady",v,s[0],e[0])}),v.emit("onLazyImageLoad",v,s[0],e[0])})}},load:function(){var e;if(v.params.watchSlidesVisibility)v.wrapper.children("."+v.params.slideVisibleClass).each(function(){v.lazy.loadImageInSlide(a(this).index())});else if(v.params.slidesPerView>1)for(e=v.activeIndex;e<v.activeIndex+v.params.slidesPerView;e++)v.slides[e]&&v.lazy.loadImageInSlide(e);else v.lazy.loadImageInSlide(v.activeIndex);if(v.params.lazyLoadingInPrevNext)if(v.params.slidesPerView>1){for(e=v.activeIndex+v.params.slidesPerView;e<v.activeIndex+v.params.slidesPerView+v.params.slidesPerView;e++)v.slides[e]&&v.lazy.loadImageInSlide(e);for(e=v.activeIndex-v.params.slidesPerView;e<v.activeIndex;e++)v.slides[e]&&v.lazy.loadImageInSlide(e)}else{var t=v.wrapper.children("."+v.params.slideNextClass);t.length>0&&v.lazy.loadImageInSlide(t.index());var s=v.wrapper.children("."+v.params.slidePrevClass);s.length>0&&v.lazy.loadImageInSlide(s.index())}},onTransitionStart:function(){v.params.lazyLoading&&(v.params.lazyLoadingOnTransitionStart||!v.params.lazyLoadingOnTransitionStart&&!v.lazy.initialImageLoaded)&&v.lazy.load()},onTransitionEnd:function(){v.params.lazyLoading&&!v.params.lazyLoadingOnTransitionStart&&v.lazy.load()}},v.scrollbar={set:function(){if(v.params.scrollbar){var e=v.scrollbar;e.track=a(v.params.scrollbar),e.drag=e.track.find(".swiper-scrollbar-drag"),0===e.drag.length&&(e.drag=a('<div class="swiper-scrollbar-drag"></div>'),e.track.append(e.drag)),e.drag[0].style.width="",e.drag[0].style.height="",e.trackSize=r()?e.track[0].offsetWidth:e.track[0].offsetHeight,e.divider=v.size/v.virtualSize,e.moveDivider=e.divider*(e.trackSize/v.size),e.dragSize=e.trackSize*e.divider,r()?e.drag[0].style.width=e.dragSize+"px":e.drag[0].style.height=e.dragSize+"px",e.track[0].style.display=e.divider>=1?"none":"",v.params.scrollbarHide&&(e.track[0].style.opacity=0)}},setTranslate:function(){if(v.params.scrollbar){var e,a=v.scrollbar,t=(v.translate||0,a.dragSize);e=(a.trackSize-a.dragSize)*v.progress,v.rtl&&r()?(e=-e,e>0?(t=a.dragSize-e,e=0):-e+a.dragSize>a.trackSize&&(t=a.trackSize+e)):0>e?(t=a.dragSize+e,e=0):e+a.dragSize>a.trackSize&&(t=a.trackSize-e),r()?(a.drag.transform(v.support.transforms3d?"translate3d("+e+"px, 0, 0)":"translateX("+e+"px)"),a.drag[0].style.width=t+"px"):(a.drag.transform(v.support.transforms3d?"translate3d(0px, "+e+"px, 0)":"translateY("+e+"px)"),a.drag[0].style.height=t+"px"),v.params.scrollbarHide&&(clearTimeout(a.timeout),a.track[0].style.opacity=1,a.timeout=setTimeout(function(){a.track[0].style.opacity=0,a.track.transition(400)},1e3))}},setTransition:function(e){v.params.scrollbar&&v.scrollbar.drag.transition(e)}},v.controller={LinearSpline:function(e,a){this.x=e,this.y=a,this.lastIndex=e.length-1;{var t,s;this.x.length}this.interpolate=function(e){return e?(s=r(this.x,e),t=s-1,(e-this.x[t])*(this.y[s]-this.y[t])/(this.x[s]-this.x[t])+this.y[t]):0};var r=function(){var e,a,t;return function(s,r){for(a=-1,e=s.length;e-a>1;)s[t=e+a>>1]<=r?a=t:e=t;return e}}()},getInterpolateFunction:function(e){v.controller.spline||(v.controller.spline=v.params.loop?new v.controller.LinearSpline(v.slidesGrid,e.slidesGrid):new v.controller.LinearSpline(v.snapGrid,e.snapGrid))},setTranslate:function(e,a){function s(a){e=a.rtl&&"horizontal"===a.params.direction?-v.translate:v.translate,"slide"===v.params.controlBy&&(v.controller.getInterpolateFunction(a),i=-v.controller.spline.interpolate(-e)),i&&"container"!==v.params.controlBy||(r=(a.maxTranslate()-a.minTranslate())/(v.maxTranslate()-v.minTranslate()),i=(e-v.minTranslate())*r+a.minTranslate()),v.params.controlInverse&&(i=a.maxTranslate()-i),a.updateProgress(i),a.setWrapperTranslate(i,!1,v),a.updateActiveIndex()}var r,i,n=v.params.control;if(v.isArray(n))for(var o=0;o<n.length;o++)n[o]!==a&&n[o]instanceof t&&s(n[o]);else n instanceof t&&a!==n&&s(n)},setTransition:function(e,a){function s(a){a.setWrapperTransition(e,v),0!==e&&(a.onTransitionStart(),a.wrapper.transitionEnd(function(){i&&(a.params.loop&&"slide"===v.params.controlBy&&a.fixLoop(),a.onTransitionEnd())}))}var r,i=v.params.control;if(v.isArray(i))for(r=0;r<i.length;r++)i[r]!==a&&i[r]instanceof t&&s(i[r]);else i instanceof t&&a!==i&&s(i)}},v.hashnav={init:function(){if(v.params.hashnav){v.hashnav.initialized=!0;var e=document.location.hash.replace("#","");if(e)for(var a=0,t=0,s=v.slides.length;s>t;t++){var r=v.slides.eq(t),i=r.attr("data-hash");if(i===e&&!r.hasClass(v.params.slideDuplicateClass)){var n=r.index();v.slideTo(n,a,v.params.runCallbacksOnInit,!0)}}}},setHash:function(){v.hashnav.initialized&&v.params.hashnav&&(document.location.hash=v.slides.eq(v.activeIndex).attr("data-hash")||"")}},v.disableKeyboardControl=function(){a(document).off("keydown",p)},v.enableKeyboardControl=function(){a(document).on("keydown",p)},v.mousewheel={event:!1,lastScrollTime:(new window.Date).getTime()},v.params.mousewheelControl){try{new window.WheelEvent("wheel"),v.mousewheel.event="wheel"}catch(L){}v.mousewheel.event||void 0===document.onmousewheel||(v.mousewheel.event="mousewheel"),v.mousewheel.event||(v.mousewheel.event="DOMMouseScroll")}v.disableMousewheelControl=function(){return v.mousewheel.event?(v.container.off(v.mousewheel.event,d),!0):!1},v.enableMousewheelControl=function(){return v.mousewheel.event?(v.container.on(v.mousewheel.event,d),!0):!1},v.parallax={setTranslate:function(){v.container.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(){u(this,v.progress)}),v.slides.each(function(){var e=a(this);e.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(){var a=Math.min(Math.max(e[0].progress,-1),1);u(this,a)})})},setTransition:function(e){"undefined"==typeof e&&(e=v.params.speed),v.container.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(){var t=a(this),s=parseInt(t.attr("data-swiper-parallax-duration"),10)||e;0===e&&(s=0),t.transition(s)})}},v._plugins=[];for(var B in v.plugins){var O=v.plugins[B](v,v.params[B]);O&&v._plugins.push(O)}return v.callPlugins=function(e){for(var a=0;a<v._plugins.length;a++)e in v._plugins[a]&&v._plugins[a][e](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5])},v.emitterEventListeners={},v.emit=function(e){v.params[e]&&v.params[e](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);var a;if(v.emitterEventListeners[e])for(a=0;a<v.emitterEventListeners[e].length;a++)v.emitterEventListeners[e][a](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);v.callPlugins&&v.callPlugins(e,arguments[1],arguments[2],arguments[3],arguments[4],arguments[5])},v.on=function(e,a){return e=c(e),v.emitterEventListeners[e]||(v.emitterEventListeners[e]=[]),v.emitterEventListeners[e].push(a),v},v.off=function(e,a){var t;if(e=c(e),"undefined"==typeof a)return v.emitterEventListeners[e]=[],v;if(v.emitterEventListeners[e]&&0!==v.emitterEventListeners[e].length){for(t=0;t<v.emitterEventListeners[e].length;t++)v.emitterEventListeners[e][t]===a&&v.emitterEventListeners[e].splice(t,1);return v}},v.once=function(e,a){e=c(e);var t=function(){a(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]),v.off(e,t)};return v.on(e,t),v},v.a11y={makeFocusable:function(e){return e.attr("tabIndex","0"),e},addRole:function(e,a){return e.attr("role",a),e},addLabel:function(e,a){return e.attr("aria-label",a),e},disable:function(e){return e.attr("aria-disabled",!0),e},enable:function(e){return e.attr("aria-disabled",!1),e},onEnterKey:function(e){13===e.keyCode&&(a(e.target).is(v.params.nextButton)?(v.onClickNext(e),v.a11y.notify(v.isEnd?v.params.lastSlideMessage:v.params.nextSlideMessage)):a(e.target).is(v.params.prevButton)&&(v.onClickPrev(e),v.a11y.notify(v.isBeginning?v.params.firstSlideMessage:v.params.prevSlideMessage)),a(e.target).is("."+v.params.bulletClass)&&a(e.target)[0].click())},liveRegion:a('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),notify:function(e){var a=v.a11y.liveRegion;0!==a.length&&(a.html(""),a.html(e))},init:function(){if(v.params.nextButton){var e=a(v.params.nextButton);v.a11y.makeFocusable(e),v.a11y.addRole(e,"button"),v.a11y.addLabel(e,v.params.nextSlideMessage)}if(v.params.prevButton){var t=a(v.params.prevButton);v.a11y.makeFocusable(t),v.a11y.addRole(t,"button"),v.a11y.addLabel(t,v.params.prevSlideMessage)}a(v.container).append(v.a11y.liveRegion)},initPagination:function(){v.params.pagination&&v.params.paginationClickable&&v.bullets&&v.bullets.length&&v.bullets.each(function(){var e=a(this);v.a11y.makeFocusable(e),v.a11y.addRole(e,"button"),v.a11y.addLabel(e,v.params.paginationBulletMessage.replace(/{{index}}/,e.index()+1))})},destroy:function(){v.a11y.liveRegion&&v.a11y.liveRegion.length>0&&v.a11y.liveRegion.remove()}},v.init=function(){v.params.loop&&v.createLoop(),v.updateContainerSize(),v.updateSlidesSize(),v.updatePagination(),v.params.scrollbar&&v.scrollbar&&v.scrollbar.set(),"slide"!==v.params.effect&&v.effects[v.params.effect]&&(v.params.loop||v.updateProgress(),v.effects[v.params.effect].setTranslate()),v.params.loop?v.slideTo(v.params.initialSlide+v.loopedSlides,0,v.params.runCallbacksOnInit):(v.slideTo(v.params.initialSlide,0,v.params.runCallbacksOnInit),0===v.params.initialSlide&&(v.parallax&&v.params.parallax&&v.parallax.setTranslate(),v.lazy&&v.params.lazyLoading&&(v.lazy.load(),v.lazy.initialImageLoaded=!0))),v.attachEvents(),v.params.observer&&v.support.observer&&v.initObservers(),v.params.preloadImages&&!v.params.lazyLoading&&v.preloadImages(),v.params.autoplay&&v.startAutoplay(),v.params.keyboardControl&&v.enableKeyboardControl&&v.enableKeyboardControl(),v.params.mousewheelControl&&v.enableMousewheelControl&&v.enableMousewheelControl(),v.params.hashnav&&v.hashnav&&v.hashnav.init(),v.params.a11y&&v.a11y&&v.a11y.init(),v.emit("onInit",v)},v.cleanupStyles=function(){v.container.removeClass(v.classNames.join(" ")).removeAttr("style"),v.wrapper.removeAttr("style"),v.slides&&v.slides.length&&v.slides.removeClass([v.params.slideVisibleClass,v.params.slideActiveClass,v.params.slideNextClass,v.params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-column").removeAttr("data-swiper-row"),v.paginationContainer&&v.paginationContainer.length&&v.paginationContainer.removeClass(v.params.paginationHiddenClass),v.bullets&&v.bullets.length&&v.bullets.removeClass(v.params.bulletActiveClass),v.params.prevButton&&a(v.params.prevButton).removeClass(v.params.buttonDisabledClass),v.params.nextButton&&a(v.params.nextButton).removeClass(v.params.buttonDisabledClass),v.params.scrollbar&&v.scrollbar&&(v.scrollbar.track&&v.scrollbar.track.length&&v.scrollbar.track.removeAttr("style"),v.scrollbar.drag&&v.scrollbar.drag.length&&v.scrollbar.drag.removeAttr("style"))},v.destroy=function(e,a){v.detachEvents(),v.stopAutoplay(),v.params.loop&&v.destroyLoop(),a&&v.cleanupStyles(),v.disconnectObservers(),v.params.keyboardControl&&v.disableKeyboardControl&&v.disableKeyboardControl(),v.params.mousewheelControl&&v.disableMousewheelControl&&v.disableMousewheelControl(),v.params.a11y&&v.a11y&&v.a11y.destroy(),v.emit("onDestroy"),e!==!1&&(v=null)},v.init(),v}};t.prototype={isSafari:function(){var e=navigator.userAgent.toLowerCase();return e.indexOf("safari")>=0&&e.indexOf("chrome")<0&&e.indexOf("android")<0}(),isUiWebView:/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),isArray:function(e){return"[object Array]"===Object.prototype.toString.apply(e)},browser:{ie:window.navigator.pointerEnabled||window.navigator.msPointerEnabled,ieTouch:window.navigator.msPointerEnabled&&window.navigator.msMaxTouchPoints>1||window.navigator.pointerEnabled&&window.navigator.maxTouchPoints>1},device:function(){var e=navigator.userAgent,a=e.match(/(Android);?[\s\/]+([\d.]+)?/),t=e.match(/(iPad).*OS\s([\d_]+)/),s=e.match(/(iPod)(.*OS\s([\d_]+))?/),r=!t&&e.match(/(iPhone\sOS)\s([\d_]+)/);return{ios:t||r||s,android:a}}(),support:{touch:window.Modernizr&&Modernizr.touch===!0||function(){return!!("ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch)}(),transforms3d:window.Modernizr&&Modernizr.csstransforms3d===!0||function(){var e=document.createElement("div").style;return"webkitPerspective"in e||"MozPerspective"in e||"OPerspective"in e||"MsPerspective"in e||"perspective"in e}(),flexbox:function(){for(var e=document.createElement("div").style,a="alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" "),t=0;t<a.length;t++)if(a[t]in e)return!0}(),observer:function(){return"MutationObserver"in window||"WebkitMutationObserver"in window}()},plugins:{}};for(var s=["jQuery","Zepto","Dom7"],r=0;r<s.length;r++)window[s[r]]&&e(window[s[r]]);var i;i="undefined"==typeof Dom7?window.Dom7||window.Zepto||window.jQuery:Dom7,i&&("transitionEnd"in i.fn||(i.fn.transitionEnd=function(e){function a(i){if(i.target===this)for(e.call(this,i),t=0;t<s.length;t++)r.off(s[t],a)}var t,s=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],r=this;if(e)for(t=0;t<s.length;t++)r.on(s[t],a);return this}),"transform"in i.fn||(i.fn.transform=function(e){for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransform=t.MsTransform=t.msTransform=t.MozTransform=t.OTransform=t.transform=e}return this}),"transition"in i.fn||(i.fn.transition=function(e){"string"!=typeof e&&(e+="ms");for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransitionDuration=t.MsTransitionDuration=t.msTransitionDuration=t.MozTransitionDuration=t.OTransitionDuration=t.transitionDuration=e}return this})),window.Swiper=t}(),"undefined"!=typeof module?module.exports=window.Swiper:"function"==typeof define&&define.amd&&define([],function(){"use strict";return window.Swiper});
//# sourceMappingURL=maps/swiper.jquery.min.js.map