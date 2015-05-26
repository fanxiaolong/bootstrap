/* ========================================================================
 * Bootstrap: collapse.js v3.1.0
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  // Collapse类的定义
  var Collapse = function (element, options) {
    this.$element      = $(element)  // 当前折叠区域的元素
    this.options       = $.extend({}, Collapse.DEFAULTS, options)   // 合并参数
    this.transitioning = null  //  是否正在执行显示/隐藏操作

    if (this.options.parent) this.$parent = $(this.options.parent)  // 如果参数里指定了parent，则赋值它
    if (this.options.toggle) this.toggle()  // 如果支持toggle，则直接调用toggle方法
  }

  Collapse.DEFAULTS = {
    toggle: true // 默认值，是否支持折叠区域的显示状态反转
  }

  // 获取折叠区域的显示动画的打开方向，是从左向右(width)，还是从上向下(height)，默认为height
  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')  // 折叠区域元素上是否有width样式
    return hasWidth ? 'width' : 'height' // 有，则返回width，没有，则返回height
  }

  // show方法用于显示折叠区域
  Collapse.prototype.show = function () {

    // 如果正在执行collapse操作，或者该折叠元素已经显示，就不做处理了
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse') // 定义要触发的事件命名空间
    this.$element.trigger(startEvent)  // 在显示之前，先触发show事件
    if (startEvent.isDefaultPrevented()) return  // 如果show事件的回调里阻止了继续操作，则直接返回

    // 如果parent存在(手风琴风格)，则查找所有该元素内已经打开的折叠区域
    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) { // 如果找到的已打开的折叠区域存在
      var hasData = actives.data('bs.collapse')  // 查找该折叠区域上面的实例
      if (hasData && hasData.transitioning) return // 如果实例存在，并且正在执行相关的collapse操作，则直接返回
      actives.collapse('hide') // 关闭所有找到的已打开的折叠区域
      hasData || actives.data('bs.collapse', null) // 并且消除其上面的所有实例
    }

    var dimension = this.dimension() // 获取显示展开元素的方向，默认是height(上下)

    this.$element
      .removeClass('collapse') // 删除折叠区域上的collapse样式
      .addClass('collapsing') // 然后再添加collapsing样式
      [dimension](0) // 将height设置为0，表示上下展开，如果是width，则表示左右展开

    this.transitioning = 1 // 表示正在处理collapse插件的显示工作

    // 回调函数，用于处理完成状态
    var complete = function () {
      this.$element
        .removeClass('collapsing') //删除collapsing样式
        .addClass('collapse in') // 添加in样式，表示已显示
        [dimension]('auto')  // 将height(或width)设置为auto
      this.transitioning = 0 // 表示已经处理完成
      this.$element.trigger('shown.bs.collapse')  // 触发shown事件
    }

    // 如果不支持动画，直接调用complete函数
    if (!$.support.transition) return complete.call(this)

    // 获取表示折叠元素的scroll大小的方向，结果是scrollHeight或者scrollWidth
      console.log($.camelCase)
      debugger;
    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    // 延迟350毫秒才执行动画，动画结束以后，调用complete回调函数
    // 并设置正常的高度或宽度，例如this.$element[height](this.$element[0][scrollHeight])
      console.log(this.$element[0][scrollSize])
    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  // hide方法用于隐藏折叠区域
  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  // toggle方法用于显示/隐藏折叠区域
  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') option = !option
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(jQuery);
