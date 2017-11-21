/* Copyright (c) 2012-2013 Casewise Systems Ltd (UK) - All rights reserved */
/*global cwAPI, jQuery, jvm */
(function(cwApi, $) {
  "use strict";
  
  var MAX_REGION_COLOR = '#004488', cwLayoutMap;

  cwLayoutMap = function(options, viewSchema) {
    cwApi.extend(this, cwApi.cwLayouts.CwLayout, options, viewSchema);
    this.hasTooltip = true;
    cwApi.registerLayoutForJSActions(this);
    this.init = true;
  };

  function getInialMap(object, layout){
    var staticMapPt = layout.options.CustomOptions['initial-map'],
    mapPt = layout.options.CustomOptions['initial-map-scriptname'], 
    availableMaps = ['world_merc_en', 'us_merc_en', 'unitedkingdom_merc_en', 'switzerland_merc_en', 'southafrica_merc_en', 'philippines_regions_merc_en',
        'netherlands_merc_en', 'italy_merc_en', 'india_merc_en', 'france_merc_en', 'europe_merc_en', 'canada_merc_en', 'belgium_merc_en'];
    if (object.properties && object.properties.hasOwnProperty(mapPt)){
      if (availableMaps.indexOf(object.properties[mapPt]) !== -1){
        return object.properties[mapPt];
      }        
    }
    return staticMapPt;
  }

  cwLayoutMap.prototype.drawAssociations = function(output, associationTitleText, object) {
    var objectId, associationTargetNode, res, i, item,
      itemsMapping, markersMapping, markersValues, regionsValues, items, markers, content,
      isocode, latlng, latlngArray, 
      isoProperty = this.options.CustomOptions['iso-code-pt'], 
      latlngProperty = this.options.CustomOptions['lat-lng-pt'];

      this.intialMap = getInialMap(object, this);
    if (cwApi.isUndefinedOrNull(object) || cwApi.isUndefined(object.associations)) {
      // Is a creation page therefore a real object does not exist
      if (!cwApi.isUndefined(this.mmNode.AssociationsTargetObjectTypes[this.nodeID])) {
        objectId = 0;
        associationTargetNode = this.mmNode.AssociationsTargetObjectTypes[this.nodeID];
      } else {
        return;
      }
    } else {
      if (!cwApi.isUndefined(object.associations[this.nodeID])) {
        objectId = object.object_id;
        associationTargetNode = object.associations[this.nodeID];
      } else {
        return;
      }
    }
    res = {};
    content = associationTargetNode;

    itemsMapping = {};
    markersMapping = {};
    regionsValues = [];
    markersValues = [];
    items = {};
    markers = [];



    for (i = 0; i < content.length; i += 1) {
      item = content[i];
      if(isoProperty !== ''){
        isocode = item.properties[isoProperty];
        if (isocode !== ''){
          isocode = isocode.toUpperCase();
          items[isocode] = 0;
          itemsMapping[isocode] = item;
        }
      }
      regionsValues.push(0);

      if (latlngProperty !== ''){
        latlng = item.properties[latlngProperty];
        if (latlng !== '') {
            latlngArray = latlng.split(',');
            markersMapping[markers.length] = item;
            markers.push([parseFloat(latlngArray[0]), parseFloat(latlngArray[1])]);
            markersValues.push(0);
        }
      }
    }


    res.regions = items;
    res.markers = markers;
    res.regionsMapping = itemsMapping;
    res.markersMapping = markersMapping;
    res.markersValues = markersValues;
    res.regionsValues = regionsValues;
    output.push('<div class="cwLayoutMap cw-visible cwLayoutMap-', this.nodeID, '" id="cw-map-', this.nodeID, '"></div>');
    this.data = res;
  };

  cwLayoutMap.prototype.applyJavaScript = function() {
    var that = this, libsToLoad;
    if (cwApi.isUndefined(this.data)) {
      return;
    }
    if (this.init) {
      $('#cw-map-'+this.nodeID).parents('.popout').toggleClass('popout-cw-map');
      this.init = false;
      if (!this.data) {
        return undefined;
      }
      
      libsToLoad = ['modules/jvectormap/jvectormap.min.js'];
      // AsyncLoad
      cwApi.customLibs.aSyncLayoutLoader.loadUrls(libsToLoad, function(error) {
        if (error === null) {
          that.createMap();
        } else {
          cwAPI.Log.Error(error);
        }
      });
    }
  };

  cwLayoutMap.prototype.createMap = function(){
    var that = this, data = that.data, map, goToPage, setTooltip;

    setTooltip = function(label, item){
      var o;
      if (cwApi.isUndefined(item)) {
          return;
      }
      o = [that.getDisplayItem(item, false)];
      label.html(o.join(''));
    };

    goToPage = function (item) {
      if (!cwApi.isUndefined(item)) {
        var hash;
        if (that.options.HasLink === true){
          hash = cwApi.getSingleViewHash(item.objectTypeScriptName, item.object_id);
          $('.jvectormap-label').remove();
          cwApi.updateURLHash(hash);
        }
      }
    };


    $('#cw-map-'+this.nodeID).css('height', cwApi.getFullScreenHeight());

    map = new jvm.WorldMap({
      container: $('#cw-map-'+that.nodeID),
      map: that.intialMap,
      regionsSelectable: false,
      backgroundColor: 'transparent',
      zoomMax: 60,
      markerStyle: {
        initial: {
          fill: '#AAAAAA'
        },
        selected: {
          fill: '#004488'
        }
      },
      regionStyle: {
        initial: {
          fill: '#DDDDDD'
        },
        selected: {
          fill: MAX_REGION_COLOR
        }
      },
      series: {
        regions: [{
          attribute: 'fill',
          scale: ['#66A8FE', '#004488'],
          values: data.regions,
          min: jvm.min(data.regionsValues),
          max: jvm.max(data.regionsValues)
        }],
        markers: [{
          attribute: 'fill',
          scale: ['#FFFFFF', '#004488'],
          values: data.markersValues,
          min: jvm.min(data.markersValues),
          max: jvm.max(data.markersValues)
        }, {
          attribute: 'r',
          scale: [5, 12],
          values: data.markersValues,
          min: jvm.min(data.markersValues),
          max: jvm.max(data.markersValues)
        }]
      },
      onRegionClick: function (e, code) {
        var item = data.regionsMapping[code];
        goToPage(item);
        return e;
      },
      onMarkerClick: function (e, code) {
        var item = data.markersMapping[code];
        goToPage(item);
        return e;
      },
      markers: data.markers,
      onRegionLabelShow: function (e, label, code) {
        var item = data.regionsMapping[code];
        setTooltip(label, item);
        return e;
      },
      onMarkerLabelShow: function (e, label, code) {
        var item = data.markersMapping[code];
        setTooltip(label, item);
        return e;
      }
    });

    setTimeout(function () {
      map.setSize();
    }, 200); // Wait for menu to disappear then reset the size.

  };

  cwApi.cwLayouts.cwLayoutMap = cwLayoutMap;
}(cwAPI, jQuery));