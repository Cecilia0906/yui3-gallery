YUI.add("gallery-bootstrap",function(b){var a=b.namespace("Bootstrap");a.initializer=function(c){a.dropdown_delegation();a.alert_delegation();a.expandable_delegation();b.all("*[data-provide=typeahead]").plug(a.Typeahead);b.all("*[data-toggle=tab]").each(function(d){var e=new a.TabView({node:d});});b.one("body").delegate("click",function(j){var i=j.currentTarget,f=i.getData(),h=f.slide,d,g;d=b.one(this.getData("target"));if(!d){d=this.get("href");if(d){d=d.replace(/.*(?=#[^\s]+$)/,"");g=b.one(d);}}if(g){j.preventDefault();if(!g.carousel){g.plug(a.Carousel,f);}g.carousel[h]();}},"*[data-slide]");b.one("body").delegate("click",function(i){var h=i.currentTarget,d=h.getData(),j,g,f="modal";j=b.one(this.getData("target"));if(!j){j=this.get("href");if(j){j=j.replace(/.*(?=#[^\s]+$)/,"");g=b.one(j);}}if(g){i.preventDefault();if(!g[f]){g.plug(a.Modal,d);}g[f].show();}},"*[data-toggle=modal]");};b.on("domready",a.initializer);},"@VERSION@",{requires:["gallery-bootstrap-misc","gallery-bootstrap-tooltip"]});