var TabBlock = {
  s: {
    animLen: 200
  },
  
  init: function() {
    TabBlock.bindUIActions();
    TabBlock.hideInactive();
  },
  
  bindUIActions: function() {
    $('.tabBlock-tabs').on('click', '.tabBlock-tab', function(){
      TabBlock.switchTab($(this));
    });
  },
  
  hideInactive: function() {
    var $tabBlocks = $('.tabBlock');
    
    $tabBlocks.each(function(i) {
      var 
        $tabBlock = $($tabBlocks[i]),
        $panes = $tabBlock.find('.tabBlock-pane'),
        $activeTab = $tabBlock.find('.tabBlock-tab.is-active');
      
      $panes.hide();
      $($panes[$activeTab.index()]).show();
    });
  },
  
  switchTab: function($tab) {
    var $context = $tab.closest('.tabBlock');
    //alert($tab.index())
    //alert($tab.siblings(".is-active").index())//获取前一个激活状态的tab的index
    //alert($tab.hasClass('is-active').index())
    if (!$tab.hasClass('is-active')&&$tab.siblings(".is-active").index()>$tab.index()) {
      $tab.siblings().removeClass('is-active');
      $tab.addClass('is-active');
   
      TabBlock.showPane($tab.index(), $context);
    if($tab.index()!==4){
      var myDiv=document.getElementById('submit-button-div');
      myDiv.innerHTML='<button id="next" class="btn btn-block btn-large btn-success" type="button" onclick="submit($(\'.tabBlock-tabs\'))">>></button>';
    }
    else {
      document.getElementById('next').innerText='保存此条数据';
      document.getElementById('next').onclick=function ( ) {
        submit($tab);
        sendStatus();
      }
      var myDiv=document.getElementById('submit-button-div');
      var button1 = '<button id="nextData" class="btn btn-block btn-large btn-success" type="button" onclick=getNextData()>下一项</button>'
      myDiv.innerHTML+=button1;
    }
    }
   },
  
  showPane: function(i, $context) {
    var $panes = $context.find('.tabBlock-pane');
   
    // Normally I'd frown at using jQuery over CSS animations, but we can't transition between unspecified variable heights, right? If you know a better way, I'd love a read it in the comments or on Twitter @johndjameson
    $panes.slideUp(TabBlock.s.animLen);
    $($panes[i]).slideDown(TabBlock.s.animLen);
  }
};

$(function() {
  TabBlock.init();
});