/* ========================================================================
 * Bootstrap: transition.js v3.1.0
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================
  //动画支持的浏览器事件
  function transitionEnd() {
    var el = document.createElement('bootstrap')  //创建一个新元素用于测试

    /* 元素中可能的存在的事件对象字面量 */
    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd',
      'MozTransition'    : 'transitionend',
      'OTransition'      : 'oTransitionEnd otransitionend',
      'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
      //ie8直接返回false
    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this;

    $(this).one($.support.transition.end, function () { called = true })  //绑定一次性事件
                                  //                  ︽
    var callback = function () { //                   ‖
      if (!called) {            //                   ‖
        $($el).trigger($.support.transition.end)  //触发事件，包括箭头（↑）的方向绑定的函数
      }
    }

    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()  //浏览器所支持的 transitionend 事件对应的名称
  })

}(jQuery);
