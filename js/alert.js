/* ========================================================================
 * Bootstrap: alert.js v3.1.0
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================
// alert插件类及原型方法的定义
// 定义选择器，所有符合该自定义属性的元素都可以触发下面的事件
  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
      // 传入元素，如果元素内部有dismiss上设置的自定义属性，则click事件会触发原型上的close方法
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)  // 传入元素，如果元素内部有dismiss上设置的自定义属性，则click事件会触发原型上的close方法
    var selector = $this.attr('data-target')  // 获取自定义属性data-target的值

    if (!selector) { // 如果自定义属性data-target无值，则获取href属性的值
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    // 执行选择器，获取jQuery对象，该对象元素通常就是要被删除的元素
    // $parent名称有点不太合适，但一般都表示包含关闭按钮和alert内容的父元素容器
    // (除非data-target或href有特定值)
    var $parent = $(selector)

    if (e) e.preventDefault()  // 防止冒泡，阻止默认行为，比如按钮或链接的其他行为

    if (!$parent.length) {  // 如果该元素对象不存在，继续判断，以进行特殊处理
        // 被单击的元素如果有alert样式的话，要删除的元素$parent就是自身
        // 如果没有alert样式，就将要删除的元素$parent设置为被单击元素的父元素
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

// 删除元素前执行close事件，可以通过自定义绑定来执行定义代码
    $parent.trigger(e = $.Event('close.bs.alert'))

    // 如果自定义事件里的回调函数调用过e.preventDefault()方法，则返回(避免重复执行)
    if (e.isDefaultPrevented()) return

    $parent.removeClass('in') // 删除$parent元素上的in样式(如果没有，则不做处理)

    function removeElement() { // 通用内部函数，在触发closed事件后，再删除$parent元素
      $parent.trigger('closed.bs.alert').remove()
    }
      // 如果支持动画，并且设置了fade样式，则在执行动画过渡效果后(从有in样式，变化到无in样式),
      // 再删除元素;否则，直接删除元素
    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============
  // 为声明式的HTML绑定单击事件
  // 即在整个document对象上，检测是否有自定义属性data-dismiss="alert"
  // 如果有，则设置：单击的时候，关闭指定的警告框元素
  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
