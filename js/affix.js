/* ========================================================================
 * Bootstrap: affix.js v3.1.0
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

    // 定义Affix类
  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)  // 合并参数，options优先级高于默认值
    this.$window = $(window)      // 顶级对象window上监控scroll和click事件
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))   // scroll事件发生时，调用checkPosition方法
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))   // click事件发生时，调用checkPositionWithEventLoop方法
    this.$element     = $(element)    // 要固定粘住的元素
    this.affixed      =
    this.unpin        =
    this.pinnedOffset = null
    this.checkPosition()  // 默认调用一次，初始化一下位置
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

    // 获取固定定位元素的offset
  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$window.scrollTop()
    var position  = this.$element.offset()
      console.log(scrollTop,position,position.top - scrollTop);
    return (this.pinnedOffset = position.top - scrollTop)
  }

    // click事件时，调用此方法调整位置
  Affix.prototype.checkPositionWithEventLoop = function () {
      console.log('checkPositionWithEventLoop');
    setTimeout($.proxy(this.checkPosition, this), 1)  // 使用setTimeout的目的，是让事件循环都处理结束(1毫秒)后，才调用checkPosition
  }

    // 重新计算位置的方法
  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return    // 如果元素不可见的话，直接返回

    var scrollHeight = $(document).height()  // 整个文档的高度
    var scrollTop    = this.$window.scrollTop()   // 窗口向上滚动的偏移量(单位像素)
    var position     = this.$element.offset()    // 返回该元素相对滚动条顶部的偏移量(单位像素)
    var offset       = this.options.offset   // 默认的偏移量设置
    var offsetTop    = offset.top    // 顶部top的偏移量设置
    var offsetBottom = offset.bottom   // 底部bottom的偏移量设置

    if (this.affixed == 'top') position.top += scrollTop   // 判断如果affix形式是top，则将scrollTop加到原来的top上

      // 因为offset支持不同的方式传值，所以需要判断它是数字还是对象或函数
    if (typeof offset != 'object')         offsetBottom = offsetTop = offset  // 如果offset不是对象，则表明是一个数字，则将offset赋值于offsetBottom和offsetTop
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)  // 如果offsetTop是函数，就将其执行结果赋值给offsetTop
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)   // 如果offsetBottom是函数，就将其执行结果赋值给offsetBottom

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

      /*上述代码中，最复杂的就是连续嵌套的三目表达式。为了更容易理解，改成if/else代码再来看一下：*/

    /*var affix;  // 如果unpin不为空，计算(屏幕滚动的高度+unpin)，如果其和小于affix元素的top值，则表示不需 要固定位置
    if (this.unpin != null && (
          scrollTop + this.unpin <= position.top
      )) {
      affix = false;
    }
    else {
      // 如果offsetBottom不为空，并且(元素的top值+元素的高度)> = (滚动高度-offsetBottom)
        if (offsetBottom != null && (
                position.top + this.$element.height() >= scrollHeight - offsetBottom
            )) {        // 则表示affix模式为bottom
            affix = "bottom";
        }
    else
      {
          // 如果offsetTop不为空，如果(滚动高度)< = (设置的offsetTop)，则表示affix模式为top
          // (正常模式)
          if (offsetTop != null && (
                  scrollTop <= offsetTop
              )
      )
          {
              affix = "top";
          }
      else
          {
              affix = false;
          }
      }
    }*/

    if (this.affixed === affix) return  // 如果原来的状态和现在计算的状态一致的话，就不需要处理了
    if (this.unpin) this.$element.css('top', '')  // 如果为unpin，就清空top值

    var affixType = 'affix' + (affix ? '-' + affix : '')   // 判断affix类型
    var e         = $.Event(affixType + '.bs.affix')  // 设置要触发的affix事件

    this.$element.trigger(e)  // 触发affix事件

    if (e.isDefaultPrevented()) return

    this.affixed = affix   // 将最新的affix状态赋值给affixed
    this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null    // 如果是bottom模式，则通过getPinnedOffset获取

    this.$element
      .removeClass(Affix.RESET)    // 删除所有的affix样式
      .addClass(affixType)         // 再添加最新的样式，如果affix模式不为空
      .trigger($.Event(affixType.replace('affix', 'affixed')))     // 根据类型，触发相应的affixed事件

      // 如果是bottom模式，则重新设置元素offset里的top值
    if (affix == 'bottom') {
      this.$element.offset({ top: scrollHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix   // 保留其他库的$.fn.affix代码(如果定义的话)，以便在noConflict之后，可以继续使用该老代码

  $.fn.affix = function (option) {
    return this.each(function () {  // 遍历所有符合规则的元素
      var $this   = $(this)    // 当前触发元素的jQuery对象
      var data    = $this.data('bs.affix')   // 获取自定义属性data-bs.affix的值(其实是affix实例)
      var options = typeof option == 'object' && option   // 合并参数

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))    // 如果没有Affix实例，就初始化一个，并传入this和参数
      if (typeof option == 'string') data[option]()    // 如果option是字符串，则表示直接调用该实例上的同名方法
    })
  }

  $.fn.affix.Constructor = Affix    // 并重设插件构造器，可以通过该属性获取插件的真实类函数


  // AFFIX NO CONFLICT
  // =================


    /*　防冲突处理 */
  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

    // 绑定触发事件
  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {    // 遍历所有符合规则的元素
      var $spy = $(this)   // 临时赋值变量
      var data = $spy.data()   // 收集该元素上的自定义属性(data-开头)
      data.offset = data.offset || {}    // 如果设置了offset就使用它，否则传一个默认空值

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)   // 实例化插件(并收集data-参数)，以便自动运行
    })
  })

}(jQuery);
