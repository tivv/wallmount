dojo.provide("hyperic.widget.VerticalArrowPipe");

dojo.require("hyperic.widget.arrowpipe._ArrowPipe");
dojo.require("hyperic.util.FontUtil");
dojo.require("hyperic.unit.UnitsConvert");

dojo.declare("hyperic.widget.VerticalArrowPipe",
    [ hyperic.widget.arrowpipe._ArrowPipe ],{

    _arrowTotalLength: function(){
        return this.height / this.getArrowCount();
    },

    _arrowWidth: function(){
        return this.width - 20;
    },
    _shiftArrows: function(rotation){
        // summary:
        var rLength = this._arrowTotalLength();
        var _s = 0 - rLength + (this.reverse ? -this._shift : this._shift);
        for(var i = 0; i < this._arrows.length; i++) {
            if(!this.reverse)
                this._arrows[i].setTransform({dy: _s, xx: 0, xy: 1, yx: 1, yy: 0});
            else
                this._arrows[i].setTransform({dy: _s+2*rLength, xx: 0, xy: 1, yx: -1, yy: 0});
            _s += rLength;
        }
    },
    
    _createArrows: function(rotation){
        // summary:
        //      Creates all arrow shapes used in this
        //      component.
        
        var c0 = new dojo.Color(this.getColor()).toRgba();
        c0[3] = 0.0;
        var c1 = new dojo.Color(this.getColor()).toRgba();
        c1[3] = 1.0;
        
        
        this._fillObj = {
            colors: [
                { offset: 0, color: c0 },
                { offset: 1, color: c1 }
            ]
        };
        
        this._arrows = [];
        var rLength = this._arrowTotalLength();
        this._points = this._createArrowPoints();
        var _s = 0 - rLength;
        for(var i = 0; i <= this.getArrowCount(); i++) {
            var arrow = this.surface.createPolyline(this._points);
                arrow.setFill(dojo.mixin({
                    type: "linear",
                    x1: this._points[0].x, y1: this._points[0].y,
                    x2: this._points[3].x, y2: this._points[0].y
                    }, this._fillObj));
            if(!this.reverse)
                arrow.setTransform({dy: _s, xx: 0, xy: 1, yx: 1, yy: 0});
            else 
                arrow.setTransform({dy: _s+2*rLength, xx: 0, xy: 1, yx: -1, yy: 0});
            this._arrows[i] = arrow;
            _s += rLength;
        }
    },
    
    _drawAxis: function(height){
        var sVal = hyperic.unit.UnitsConvert.convert(this.value, this.format);
        
        var fMax = hyperic.util.FontUtil.findGoodSizeFontByRect(sVal, this.width, height);
        if(this._text) {
            this._text.setShape({text: sVal});
        } else {
            this._text = this.drawText(sVal,0 ,0 , "end", "black", {family:"Helvetica",weight:"bold",size:fMax+'px'}).setTransform({xx: 0, xy: 1, yx: -1, yy: 0, dx: this.width, dy: this.height/2});
        }
        this.inherited(arguments);
    } 

});