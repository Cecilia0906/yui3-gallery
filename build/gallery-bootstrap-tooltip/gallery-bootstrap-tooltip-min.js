YUI.add("gallery-bootstrap-tooltip",function(b){var a=b.namespace("Bootstrap");a.Tooltip=b.Base.create("bootstrapTooltip",b.Widget,[b.WidgetPosition,b.WidgetStack,b.WidgetPositionAlign,b.WidgetPositionConstrain],{eventIn:"mouseover",eventOut:"mouseout",tooltip:null,template:'<div><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',BOUNDING_TEMPLATE:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',initializer:function(){var c=this.get("selector"),e=this.get("trigger"),f=e==="hover"?this.eventIn:"focus",d=e==="hover"?this.eventOut:"blur";this._cssPrefix="tooltip";if(c){b.delegate(f,this._showFn,document.body,c,this);b.delegate(d,this._hideFn,document.body,c,this);}this.after("titleChange",this.setContent,this);this.set("visible",false);this.render();},_showFn:function(g){var f=g.target,c=this.get("delay"),h=f.getAttribute("title"),d=this.get("boundingBox");if(!h){h=f.getAttribute("data-original-title");}else{f.removeAttribute("title");f.setAttribute("data-original-title",h);}this.set("title",h);this._hoverState="in";this._showTimeout=b.later(c,this,this._show,{target:f});},_show:function(f){var e=this.get("boundingBox"),d=this.get("animation"),c=this.get("placement"),g=f.target;if(this._hoverState==="in"){e.show();if(g){this.set("align",{node:g,points:this._getAlignment(c)});}if(d){e.transition({duration:0,opacity:1},function(){e.addClass("fade");});}e.addClass("in");e.addClass(c);}},_hideFn:function(){var c=this.get("delay");this._hoverState="out";this._showTimeout=b.later(c,this,this._hide);},_hide:function(){var d=this.get("boundingBox"),c=this.get("animation");if(this._hoverState==="out"){if(d.hasClass("fade")){d.transition({duration:1,opacity:0},function(){d.removeClass("fade");d.removeClass("in");d.hide();});}else{d.removeClass("fade");d.removeClass("in");}}},_getAlignment:function(c){if(c==="bottom"){return[b.WidgetPositionAlign.TC,b.WidgetPositionAlign.BC];}else{if(c==="left"){return[b.WidgetPositionAlign.RC,b.WidgetPositionAlign.LC];}else{if(c==="right"){return[b.WidgetPositionAlign.LC,b.WidgetPositionAlign.RC];}else{return[b.WidgetPositionAlign.BC,b.WidgetPositionAlign.TC];}}}},_defaultCB:function(){return this.get("boundingBox").one(".tooltip-inner");},setContent:function(d){var f=this.get("title"),c=this.get("contentBox");c.setContent(f);b.Array.each("fade in top bottom left right".split(" "),function(e){c.removeClass(e);});}},{ATTRS:{animation:{value:true},placement:{value:"top"},selector:{value:false},trigger:{value:"hover"},title:{value:""},delay:{value:0},visible:{value:false},}});},"@VERSION@",{requires:["anim","transition","widget","base","widget-position-align","widget-stack","widget-position","widget-position-constrain"]});