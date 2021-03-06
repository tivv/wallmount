/**
 * NOTE: This copyright does *not* cover user programs that use HQ
 * program services by normal system calls through the application
 * program interfaces provided as part of the Hyperic Plug-in Development
 * Kit or the Hyperic Client Development Kit - this is merely considered
 * normal use of the program, and does *not* fall under the heading of
 *  "derived work".
 *
 *  Copyright (C) [2011], VMware, Inc.
 *  This file is part of HQ.
 *
 *  HQ is free software; you can redistribute it and/or modify
 *  it under the terms version 2 of the GNU General Public License as
 *  published by the Free Software Foundation. This program is distributed
 *  in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 *  even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 *  PARTICULAR PURPOSE. See the GNU General Public License for more
 *  details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
 *  USA.
 *
 */

dojo.provide("hyperic.unit.BinaryFormatter");

dojo.require("dojo.number");
dojo.require("hyperic.unit.UnitsUtil");
dojo.require("hyperic.unit.UnitsConstants");

dojo.declare("hyperic.unit.BinaryFormatter",
    null,{
        
    format: function(/*Object*/val, format) {

        var baseVal = val.getBaseValue();
        var targScale = this.findGoodLookingScale(baseVal);
        var newVal = this.getTargetValue(baseVal, targScale);
        //var fmt = hyperic.unit.UnitsUtil.getNumberFormat(newVal);
        var fmt = dojo.number.format;
        return this.createFormattedValue(newVal, targScale, fmt, format);
    },

    parse: function(/*String*/val, unitType, /*String*/locale){
        // summary:
        var nonIdx = hyperic.unit.UnitsUtil.findNonNumberIdx(val);
        var numberPart = val.substr(0,nonIdx);
        var nonNumberPart = val.substr(nonIdx,val.length);
        return this.parseTag(numberPart,nonNumberPart,nonIdx);
    },

    createFormattedValue: function(value, scale, fmt, format) {
        var tag;

        switch(scale){
            case hyperic.unit.UnitsConstants.SCALE_NONE:
                tag = "";
                break;
            case hyperic.unit.UnitsConstants.SCALE_KILO:
                tag = "K";
                break;
            case hyperic.unit.UnitsConstants.SCALE_MEGA:
                tag = "M";
                break;
            case hyperic.unit.UnitsConstants.SCALE_GIGA:
                tag = "G";
                break;
            case hyperic.unit.UnitsConstants.SCALE_TERA:
                tag = "T";
                break;
            case hyperic.unit.UnitsConstants.SCALE_PETA:
                tag = "P";
                break;
        }
    
        var f = format || {pattern:'#.############'};
        // TODO: this formatting pattern just feels wrong
        return fmt(value,f) + tag + this.getTagName();         
    },
        
    getBaseValue: function(/*double*/value, /*int*/scale){
        // summary:
        //     Get the base value of a value, given its scale.
        //     E.x.:  getBaseValue(1, SCALE_KILO) -> 1024 (bytes being the base unit)
        //
        // value:
        //     Value to get the base of
        // scale:
        //     Scale of the value -- must be valid 
        //     for the formatter unit type
        return value * this.getScaleCoeff(scale);
    },
        
    getScaledValue: function(/*Number*/value, /*int*/targScale){
        // summary:
        //     Get a scaled version of a value.  The value in its
        //     base format, and the target scale are passed.  The return
        //     value will be a number, scaled to the target.
        //     
        //     E.x.:  getScaledValue(1024, SCALE_NONE) -> 1024
        //            getScaledValue(1024, SCALE_KILO) -> 1 (1 kilobyte)
        //
        // value:
        //     Value to scale
        // targScale:
        //     Target scale -- must be valid for the formatter unit type
        return value / this.getScaleCoeff(targScale);
    },
        
//    getTagName: function(){
//        return "";
//    },
        
    findGoodLookingScale: function(val){

        if(val >= hyperic.unit.UnitsUtil.FACT_PETA_BIN) {
            return hyperic.unit.UnitsConstants.SCALE_PETA;
        } else if (val >= hyperic.unit.UnitsUtil.FACT_TERA_BIN) {
            return hyperic.unit.UnitsConstants.SCALE_TERA;                
        } else if (val >= hyperic.unit.UnitsUtil.FACT_GIGA_BIN) {
            return hyperic.unit.UnitsConstants.SCALE_GIGA;              
        } else if (val >= hyperic.unit.UnitsUtil.FACT_MEGA_BIN) {
            return hyperic.unit.UnitsConstants.SCALE_MEGA;              
        } else if (val >= hyperic.unit.UnitsUtil.FACT_KILO_BIN) {
            return hyperic.unit.UnitsConstants.SCALE_KILO;              
        } else {
            return hyperic.unit.UnitsConstants.SCALE_NONE;              
        }
                    
    },
        
    getTargetValue: function(/*Number*/baseVal, /*int*/targetScale) {

        var modifier = hyperic.unit.UnitsUtil.FACT_NONE;
        var lateModifier = 1.0;
    
        switch(targetScale){
            case hyperic.unit.UnitsConstants.SCALE_KILO:
                lateModifier = 1 << 10;
                break;
            case hyperic.unit.UnitsConstants.SCALE_MEGA:
                lateModifier = 1 << 20;
                break;
            case hyperic.unit.UnitsConstants.SCALE_GIGA:
                modifier     = hyperic.unit.UnitsUtil.FACT_MEGA_BIN;
                lateModifier = 1 << 10;
                break;
            case hyperic.unit.UnitsConstants.SCALE_TERA:
                modifier     = hyperic.unit.UnitsUtil.FACT_GIGA_BIN;
                lateModifier = 1 << 10;
                break;
            case hyperic.unit.UnitsConstants.SCALE_PETA:
                 modifier     = hyperic.unit.UnitsUtil.FACT_TERA_BIN;
                 lateModifier = 1 << 10;
                 break;
        }
    
        var _baseVal = baseVal / modifier;
        //divide(modifier, BigDecimal.ROUND_HALF_EVEN);
        return _baseVal / lateModifier;

    },
        
    getScaleCoeff: function(/*int*/scale){
        switch(scale){
        case hyperic.unit.UnitsConstants.SCALE_NONE:
            return hyperic.unit.UnitsUtil.FACT_NONE;
        case hyperic.unit.UnitsConstants.SCALE_BIT:
            return hyperic.unit.UnitsUtil.FACT_BIT;
        case hyperic.unit.UnitsConstants.SCALE_KILO:
            return hyperic.unit.UnitsUtil.FACT_KILO_BIN;
        case hyperic.unit.UnitsConstants.SCALE_MEGA:
            return hyperic.unit.UnitsUtil.FACT_MEGA_BIN;
        case hyperic.unit.UnitsConstants.SCALE_GIGA:
            return hyperic.unit.UnitsUtil.FACT_GIGA_BIN;
        case hyperic.unit.UnitsConstants.SCALE_TERA:
            return hyperic.unit.UnitsUtil.FACT_TERA_BIN;
        case hyperic.unit.UnitsConstants.SCALE_PETA:
            return hyperic.unit.UnitsUtil.FACT_PETA_BIN;
        }
    }

});