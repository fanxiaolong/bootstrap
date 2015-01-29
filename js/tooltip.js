/* ========================================================================
 * Bootstrap: tooltip.js v3.1.0
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    // 注意：这里传入tooltip，因为popover插件也使用了tooltip的原型方法，所以init提供了一个type参数
    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true, //是否开启动画
    placement: 'top', //显示位置，默认在上方显示。
    selector: false,  //触发器的选择符
    template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',  //tooltiop显示的内容模板
    trigger: 'hover focus',  //设置触发tooltip的事件
    title: '',  //标题
    delay: 0,  //延迟
    html: false,  //tooltip内容是否设置HTML
    container: false   //tooltip容器设置，如果有直接赋值，没有则默认false
  }

  Tooltip.prototype.init = function (type /* popover插件传入的就是popover */ , element, options) {
    this.enabled  = true   //可用状态
    this.type     = type      // 默认是tooltip
    this.$element = $(element)  //当前元素
    this.options  = this.getOptions(options)    //获取配置参数，合并传入的参数

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
          // $.proxy 保持特定上下文
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
          // trigger可能为 hover 或者  focus
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'
        // 给进入事件绑定enter回调，如mouseenter.tooltip
        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        // 移出事件绑定leave回调，如focusout.tooltip
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }
    // 如果指定了内部选择符
    // 则合并原来的options到一个新的_options对象上，并添加trigger和selector两个选项
    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  // 获取配置参数(将传入的参数和默认参数合并)
  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)


    //如果配置参数有delay,并且类型是数字
    if (options.delay && typeof options.delay == 'number') {
      // 表示show和hide的延迟时间都是该数字
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }
  // 手动触发的时候，添加额外的options参数
  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    // 如果obj是当前tooltip的实例就赋值给self
    // 否则就取该元素上的实例(data-bs.tooltip属性)，即：// $('#id').tooltip(options).data
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'    //进入状态
    // 如果delay没提供，后者delay.show没提供，直接返回self.show
    if (!self.options.delay || !self.options.delay.show) return self.show()

    //延迟多少毫秒执行show()方法
    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  //显示tooltip提示语
  Tooltip.prototype.show = function () {

    //相当于定义了一个 show.bs.tooltip 事件对象
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {  //如果有显示的内容，并且tooltip可用
      this.$element.trigger(e)   //触发对外暴露的接口，就是上面定义的 show.bs.tooltip 事件对象

      if (e.isDefaultPrevented()) return  // 如果show回调里阻止了继续操作，则返回
      var that = this;

      var $tip = this.tip()  // 获取tooltip的模板内容

      this.setContent()  // 在模板里设置title内容，以便正式组装tooltip的内容

      if (this.options.animation) $tip.addClass('fade') // 如果设置了动画，则在tooltip上添加fade样式

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      // 如果位置设置里有auto关键字，先删除auto关键字，比如只剩left;如果什么都没剩余，默认为top
      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' }) // 默认左上角块级显示(相对定位)
        .addClass(placement)    // 设置显示方向是left、right、top、bottom中的一种


      // 如果指定了container容器，则将tooltip附加到该容器，否则附加到当前元素的后面(作为当前元素的兄弟元素)
      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition() // 获取tooltip的当前位置
      var actualWidth  = $tip[0].offsetWidth // 指$tip[0]自身的绝对宽度,不包括因 overflow 而未显示的部分，也就是其实际占据的宽度，整型，单位像素。
      var actualHeight = $tip[0].offsetHeight// 指$tip[0]自身的绝对高度,不包括因 overflow 而未显示的部分，也就是其实际占据的高度，整型，单位像素。

      if (autoPlace) {
        var $parent = this.$element.parent()  // 获取触发元素的父元素

        var orgPlacement = placement  // 将原来的方向先临时存到一个临时变量里
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop   // 获取当前页面的距离顶端的top高度
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()   // 获取父元素的整个宽度
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()  // 获取父元素的整个高度
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left   //获取父元素的left值


        // 如果位置是bottom，但是超出了父元素的高度，则使用top
        // 如果位置是top，但是超出了浏览器顶部，则使用bottom
        // 如果位置是right，但是超出了浏览器右边栏，则使用left
        // 如果位置是left，但是超出了浏览器左边栏，则使用right
        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement  // 否则，还使用原来的位置

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      // 计算更新placement样式后的位置
      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.hoverState = null

      var complete = function() {
        that.$element.trigger('shown.bs.' + that.type)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one($.support.transition.end, complete)
          .emulateTransitionEnd(150) :
        complete()
    }
  }
  // 再次应用更新的placement样式和位置
  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }
  // 更新小箭头的位置
  Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '')
  }
  // 在模板里设置title内容，以便正式组装tooltip的内容
  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()
    /*
     *相当于$tip.find('.tooltip-inner').html(title) 或者
     *     $tip.find('.tooltip-inner').text(title)
     */
    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element.trigger('hidden.bs.' + that.type)
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.hoverState = null

    return this
  }
  // 修复title提示，既有title，又有tooltip
  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
      /*
       * getBoundingClientRect()
       * 这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离。
       * var box=document.getElementById('box');         // 获取元素
       * alert(box.getBoundingClientRect().top);         // 元素上边距离页面上边的距离
       * alert(box.getBoundingClientRect().right);       // 元素右边距离页面左边的距离
       * alert(box.getBoundingClientRect().bottom);      // 元素下边距离页面上边的距离
       * alert(box.getBoundingClientRect().left);        // 元素左边距离页面左边的距离
       *
       */
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth,
      height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')   //为什么不用 $e.data(originalTitle)方法呢？
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    clearTimeout(this.timeout)
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);
