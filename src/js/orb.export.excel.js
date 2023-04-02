/**
 * @fileOverview Pivot Grid export to Excel
 * @author Najmeddine Nouri <najmno@gmail.com>
 */

 'use strict';

 /* global module, require */
 /*jshint eqnull: true*/

var utils = require('./orb.utils');
var uiheaders = require('./orb.ui.header');
var themeManager = require('./orb.themes');

var uriHeader = 'data:application/vnd.ms-excel;base64,';
var docHeader = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
 	'<head>' +
 	'<meta http-equiv=Content-Type content="text/html; charset=UTF-8">' +
 	'<!--[if gte mso 9]><xml>' +
 	' <x:ExcelWorkbook>' +
 	'  <x:ExcelWorksheets>' +
 	'   <x:ExcelWorksheet>' +
 	'    <x:Name>###sheetname###</x:Name>' +
 	'    <x:WorksheetOptions>' +
 	'     <x:ProtectContents>False</x:ProtectContents>' +
 	'     <x:ProtectObjects>False</x:ProtectObjects>' +
 	'     <x:ProtectScenarios>False</x:ProtectScenarios>' +
 	'    </x:WorksheetOptions>' +
 	'   </x:ExcelWorksheet>' +
 	'  </x:ExcelWorksheets>' +
 	'  <x:ProtectStructure>False</x:ProtectStructure>' +
 	'  <x:ProtectWindows>False</x:ProtectWindows>' +
 	' </x:ExcelWorkbook>' +
 	'</xml><![endif]-->' +
 	'</head>' +
 	'<body>';
var docFooter = '</body></html>';

/**
 * Creates a new instance of rows ui properties.
 * @class
 * @memberOf orb.ui
 * @param  {orb.axe} rowsAxe - axe containing all rows dimensions.
 */

// FIX 005 FIX START
            
// Double click  on aggregation data cell opens a table, but it's data can not be exported
// An icon added on top of table.
// defaultToolbarConfig.exportToExcel() called with pivot object and data as parameters
// Added data as additional parameter to module.exports()

// Replaced below line by next line
 //module.exports = function(pgridwidget) {
 module.exports = function(pgridwidget, data) { 
  
// FIX 005 END
  
 	var config = pgridwidget.pgrid.config;

 	var currTheme = themeManager.current();
 	currTheme = currTheme === 'bootstrap' ? 'white' : currTheme;
 	var override = currTheme === 'white';

 	var buttonTextColor = override ? 'black' : 'white';
 	var themeColor = themeManager.themes[currTheme];
 	var themeFadeout = themeManager.utils.fadeoutColor(themeColor, 0.1);    

 	var buttonStyle = 'style="font-weight: bold; color: ' + buttonTextColor + '; background-color: ' + themeColor + ';" bgcolor="' + themeColor + '"';
 	var headerStyle = 'style="background-color: ' + themeFadeout + ';" bgcolor="' + themeFadeout + '"';

 	function createButtonCell(caption) {
 		return '<td ' + buttonStyle + '><font color="' + buttonTextColor + '">' + caption + '</font></td>';
 	}

 	function createButtons(buttons, cellsCountBefore, cellsCountAfter, prefix) {
 		var i;
 		var str = prefix || '<tr>';
 		for(i = 0; i < cellsCountBefore; i++) {
 			str += '<td></td>';
 		}

 		str += buttons.reduce(function(tr, field) {
 			return (tr += createButtonCell(field.caption));
 		}, '');

 		for(i = 0; i < cellsCountAfter; i++) {
 			str += '<td></td>';
 		}
 		return str + '</tr>';
 	}

 	var cellsHorizontalCount = Math.max(config.dataFields.length + 1, pgridwidget.layout.pivotTable.width);

 	var dataFields = createButtons(config.dataFields, 
 		0,
 		cellsHorizontalCount - config.dataFields.length,
 		'<tr><td><font color="#ccc">Data</font></td>'
 	);

 	var sep = '<tr><td style="height: 22px;" colspan="' + cellsHorizontalCount + '"></td></tr>';

 	var columnFields = createButtons(config.columnFields,
 		pgridwidget.layout.rowHeaders.width,
 		cellsHorizontalCount - (pgridwidget.layout.rowHeaders.width + config.columnFields.length)
 	);

 	var columnHeaders = (function() {
 		var str = '';
 		var j;
 		for(var i = 0; i < pgridwidget.columns.headers.length; i++) {
 			var currRow = pgridwidget.columns.headers[i];
 			var rowStr = '<tr>';
 			if(i < pgridwidget.columns.headers.length - 1) {
 				for(j = 0; j < pgridwidget.layout.rowHeaders.width; j++) {
 					rowStr += '<td></td>';
 				}
 			} else {
 				rowStr += config.rowFields.reduce(function(tr, field) {
 					return (tr += createButtonCell(field.caption));
 				}, '');
 			}

 			rowStr += currRow.reduce(function(tr, header) {
 				var value = header.type === uiheaders.HeaderType.DATA_HEADER ? header.value.caption : header.value;
 				return (tr += '<td ' + headerStyle + ' colspan="' + header.hspan(true) + '" rowspan="' + header.vspan(true) + '">' + value + '</td>');
 			}, '');
 			str += rowStr + '</tr>';
 		}
 		return str;
 	}());

 	var rowHeadersAndDataCells = (function() {
 		var str = '';
 		var j;
 		for(var i = 0; i < pgridwidget.rows.headers.length; i++) {
 			var currRow = pgridwidget.rows.headers[i];
 			var rowStr = '<tr>';
 			rowStr += currRow.reduce(function(tr, header) {
 				return (tr += '<td ' + headerStyle + ' colspan="' + header.hspan(true) + '" rowspan="' + header.vspan(true) + '">' + header.value + '</td>');
 			}, '');
 			var dataRow = pgridwidget.dataRows[i];
 			rowStr += dataRow.reduce(function(tr, dataCell, index) {
 				var formatFunc = config.dataFields[index = index % config.dataFields.length].formatFunc;
 				var value = dataCell.value == null ? '' : formatFunc ? formatFunc()(dataCell.value) : dataCell.value;
 				return (tr += '<td>' + value + '</td>');
 			}, '');
 			str += rowStr + '</tr>';
 		}
 		return str;
 	}());

 	function toBase64(str) {
 		return utils.btoa(unescape(encodeURIComponent(str)));
 	}
  
  // FIX 005 FIX START
            
  // Double click  on aggregation data cell opens a table, but it's data can not be exported
  // An icon added on top of table.
  // defaultToolbarConfig.exportToExcel() called with pivot object and data as parameters
  // Added data as additional parameter to module.exports()

   // If data is passed, it means it is the table data from data parameter, not the pivot data, is to has to be exported
   if(data)
   {
       // Reset the variables which are not required
       dataFields = sep = columnFields = "";
       var keys = Object.keys(data[0]);
       // Get the headers as table row. Find the caption from all fields data with matching name. If key name does not match then use name as is
       columnHeaders = "<tr>";
	   var i = 0;
	   var j = 0;
       for(i = 0; i < keys.length; i++)
       {
           // Search field for matching name and then use it;s caption
           for(j = 0; j < config.allFields.length; j++)
           {
               if(config.allFields[j].name === keys[i])
               {
                   columnHeaders += createButtonCell(config.allFields[j].caption);
                   break;
               }
           }
           // If caption not found, then use the name
           if(j === config.allFields.length)
               columnHeaders += createButtonCell(keys[i]);
       }
       columnHeaders += "</tr>";
       // Get the data as table row.
       rowHeadersAndDataCells = "";
       for(j = 0; j < data.length; j++)
       {
           rowHeadersAndDataCells += "<tr>";
           for(i = 0; i < keys.length; i++)
               rowHeadersAndDataCells += "<td>"+data[j][keys[i]]+"</td>";
           rowHeadersAndDataCells += "</tr>";
       }
   }

  // FIX 005 END  

 	return uriHeader +
 		toBase64(docHeader +
 				'<table>' + dataFields + sep + columnFields + columnHeaders + rowHeadersAndDataCells + '</table>' +
 				docFooter);
 };
