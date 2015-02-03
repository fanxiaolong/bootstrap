/* ========================================================================
 * Bootstrap: popover.js v3.1.0
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
      // 调用了从tooltip继承过来的原型方法 init，并传入了popover类型
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js') // 如果tooltip没引用，抛错，因为其依赖于tooltip

// 除了继承tooltip的默认值外，下面的默认值覆盖了tooltip的默认值
  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',// 显示位置，默认在右方显示
    trigger: 'click',  // 设置触发popover的事件
    content: '',// 默认显示内容
    template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>' // popover显示的内容模板
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype) // 继承tooltip的原型，含所有原型方法

  Popover.prototype.constructor = Popover // 恢复构造函数，以免使用tooltip的构造函数

// 重载tooltip里的getDefaults方法：获取默认配置
  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

// 重载tooltip里的setContent方法：设置popover要显示的内容
  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title) // 给模板里的popover-title样式的元素添加内容，如果支持HTML，就设置HTML，否则设置text
    $tip.find('.popover-content')[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

      // 正式显示之前，如果有多余的样式，全部删除，后面会根据状态再添加
    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

// 重载tooltip里的hasContent方法：判断popover是否有要显示的内容
  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent() //title和content任何一个有内容，即认为popover有内容
  }

// 重载tooltip里的getContent方法：获取要显示的content内容
  Popover.prototype.getContent = function () {
    var $e = this.$element  // 所单击的触发元素
    var o  = this.options  // 传入的选项

    // 如果data-content属性有值，就使用它作为内容
    // 否则，再判断如果options里的content属性是function，就将其调用结果作为内容
    // 如果上述两者都不是，直接将options里的content属性作为内容返回
    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

// 重载tooltip里的arrow方法：获取显示的小箭头
  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

// 重载tooltip里的tip方法：获取模板内容
  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template) // 如果$tip不存在，则用options里的template模板
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);
