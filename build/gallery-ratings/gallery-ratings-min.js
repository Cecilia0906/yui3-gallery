YUI.add("gallery-ratings",function(b){var a=b.Lang;b.Ratings=b.Base.create("gallery-ratings",b.Widget,[],{CURRENT_RATING_TEMPLATE:'<li class="yui3-gallery-ratings-current" style="width:{width};">{value}</li>',ITEM_TEMPLATE:'<a href="#" title="{title}" class="{className}">{value}</a>',BOUNDING_TEMPLATE:'<div><div><ul class="yui3-gallery-ratings-star-list"></ul></div></div>',initializer:function(){this.after("ratingChange",this.afterRatingChange,this);this.after("allowClearRatingChange",this.renderList,this);this.after("skinChange",this.renderList,this);this.after("iconWidthChange",this.renderList,this);this.after("maxChange",this.renderList,this);this.after("titlesChange",this.renderList,this);this.after("inlineChange",this.renderList,this);},validateRating:function(c){return a.isNumber(c)&&c<=this.get("max")&&c>=this.get("min");},validateSkin:function(c){return a.isString(c)&&(c==="default"||c==="small");},getRatingWidth:function(){return Math.floor(this.get("rating")/this.get("max")*100)+"%";},getRatingString:function(){return"Currently "+this.get("rating")+"/"+this.get("max")+" Stars.";},renderList:function(){var k=this.get("boundingBox"),d=k.one("div"),g=k.one("ul"),f=1,c=this.get("max"),j=this.get("titles"),h,e;if(this.get("skin")==="small"){d.addClass("yui3-gallery-ratings-small-star");this.set("iconWidth",10);}else{d.removeClass("yui3-gallery-ratings-small-star");this.set("iconWidth",25);}if(this.get("inline")){d.addClass("yui3-gallery-ratings-inline");}else{d.removeClass("yui3-gallery-ratings-inline");}g.setStyle("width",this.get("iconWidth")*this.get("max")+"px");g.empty();if(this.get("allowClearRating")&&!d.one(".clearRating")){g.insert(b.Node.create(a.sub(this.ITEM_TEMPLATE,{title:"Clear Rating",className:"clearRating",value:0})),"before");}else{if(d.one(".clearRating")){d.one(".clearRating").destroy();}}g.append(b.Node.create(a.sub(this.CURRENT_RATING_TEMPLATE,{width:this.getRatingWidth(),value:this.getRatingString()})));for(f;f<=c;f+=1){h=b.Node.create(a.sub("<li>"+this.ITEM_TEMPLATE+"</li>",{title:j[f-1]||f+" of "+c+" stars",className:"yui3-gallery-ratings-star",value:f}));e=h.one("a");e.setStyle("width",f*this.get("iconWidth")+"px");e.setStyle("zIndex",this.get("max")-(f-1));g.append(h);}},afterRatingChange:function(c){this.uiSetRating(c.newVal);},onRatingClick:function(c){c.preventDefault();var d=parseFloat(c.currentTarget.get("innerHTML"));this.fire("ratingClick",d);this.set("rating",d);},uiSetRating:function(d){var e=this.get("boundingBox").one(".yui3-gallery-ratings-current"),c=this.get("srcNode");if(e){e.setStyle("width",this.getRatingWidth());e.set("innerHTML",this.getRatingString());}if(c.get("tagName")==="INPUT"){c.set("value",d);}else{c.set("innerHTML",d);}},renderUI:function(){this.renderList();},bindUI:function(){this.get("boundingBox").delegate("click",this.onRatingClick,"a",this);},syncUI:function(){this.uiSetRating(this.get("rating"));}},{ATTRS:{rating:{value:0,broadcast:1,validator:"validateRating"},min:{value:0,validator:a.isNumber,readOnly:true},max:{value:5,validator:a.isNumber},inline:{value:false,validator:a.isBoolean},skin:{value:"default",validator:"validateSkin"},allowClearRating:{value:false,validator:a.isBoolean},render:{value:true},titles:{value:[],validator:a.isArray},iconWidth:{value:25,validator:a.isNumber}},HTML_PARSER:{rating:function(c){var d;if(c.get("tagName")==="INPUT"){d=parseFloat(c.get("value"),10);}else{d=parseFloat(c.get("innerHTML"),10);}return a.isNumber(d)?d:0;}}});},"gallery-2011.10.20-23-28",{requires:["base","widget"],skinnable:true});