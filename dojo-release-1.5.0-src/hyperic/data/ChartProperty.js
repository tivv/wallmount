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

dojo.provide("hyperic.data.ChartProperty");

dojo.declare("hyperic.data.ChartProperty",null,{

    // chartType: String
    //     Type of chart. Either Lines or Bars.
    chartType: "Lines",
    
    // theme: String
    //     Used chart theme.
    chartTheme: "simple",
    
    // timeScale: String
    //     Defines chart time window. One of 1h, 8h, 1d, 1w, 1m, 1y
    chartTimeScale: "8h",

    // chartColors: Array
    //     Defines chart main colors
    chartColors: null,


    constructor: function(){
    	this.chartColors = ['#228b22'];
    },
    
    getChartType: function(){
        return this.chartType;
    },
    
    _setChartTypeAttr: function(value){
        this.chartType = value;
    },

    getChartTheme: function(){
        return this.chartTheme;
    },
    
    _setChartThemeAttr: function(value){
        this.chartTheme = value;
    },

    getChartTimeScale: function(){
        return this.chartTimeScale;
    },
    
    _setChartTimeScaleAttr: function(value){
        this.chartTimeScale = value;
    },

    getChartColors: function(){
        return this.chartColors;
    },
    
    _setChartColorsAttr: function(value){
        this.chartColors = value;
    }
    
});