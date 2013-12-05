
function toggleHighlight (el) {
	el.toggleClass("highlight");
};
/*
function Select (input) {
	//var input = document.getElementById ("myText");
	if ('selectionStart' in input) {
		if(input.selectionStart > 0)
		{
			console.log( "caret postion: "+ input.selectionStart );
			input.selectionStart = 0;
			input.selectionEnd = 1;
			input.focus ();
		}
	}
	else {  // Internet Explorer before version 9
		var inputRange = input.createTextRange ();
		inputRange.moveStart ("character", 0);
		inputRange.collapse ();
		inputRange.moveEnd ("character", 1);
		inputRange.select ();
	}
	//var position = window.getSelection().getRangeAt(0).startOffset;
};

function getSelectionStart(o) {
	if (o.createTextRange) {
		var r = document.selection.createRange().duplicate();
		r.moveEnd('character', o.value.length);
		if (r.text == '') return o.value.length;
			return o.value.lastIndexOf(r.text);
	} else return o.selectionStart;
};

function getSelectionEnd(o) {
	if (o.createTextRange) {
		var r = document.selection.createRange().duplicate();
		r.moveStart('character', -o.value.length);
		return r.text.length;
	} else return o.selectionEnd;
};
*/

function lastCursorPosition(pos){
	
	if (!pos) return (this.lastpos || -2);
	else this.lastpos = pos;
	return this.lastpos;
};	

(function($) {
	$.fn.getCursorPosition = function() {
		var input = this.get(0);
		if (!input) return; // No (input) element found
		if (document.selection) {
			// IE
		   input.focus();
		}
		return 'selectionStart' in input ? input.selectionStart:
		'' || Math.abs(document.selection.createRange().moveStart('character', -input.value.length));
	 }
})(jQuery);

function getInputID (element)
{
	return Number(element.attr("id").substr(1));
}



$(document).ready(function()
{
	$("#clues-div a.clue_id").on("click", function() {
		var selected = $( "table input.display_bright");
		selected.toggleClass("display_bright",false);
		// ignore the "clue_"  
		var clueID = $(this).attr("id").substr(5);
		$("table#quote input."+clueID).toggleClass("display_bright",true);
	});
	$( "table" ).on( "focusin", "input", function() {
		//alert( $( this ).text() );
		//$(this).css("background-color","red");
		$(this).toggleClass("highlight");
		console.log("FOCUSIN: value=["+$(this)[0].value+"]");
	});

	$("table#quote").on({ 	click: function() {
								this.select();
							},
							focusin: function() {
								var content = $(this)[0].value;
								lastCursorPosition($(this).getCursorPosition());
								/*
								if (content.length > 0)
								{	
									//$(this).get(0).focus();
									$(this).select();
								};*/
							},
							
							focusout: function() {				
								$(this).toggleClass("highlight");
								//console.log("focusout event");
								$(this).css("color","black");
							},
							change: function() {
								// First, dehighlight previously highlighted entries
								var selected = $( "table input.display_bright");
								selected.toggleClass("display_bright",false);
								$(this).toggleClass("display_bright");
								//$(this).css("background-color","#FFFF66");
								//$(this).fadeout(2000);
								
								console.log("change event");
							},
							select: function() {
								console.log("SELECT");
								$(this).css("color","#660066");
							},
							keyup : function(event) {
								
								
								var content = $(this)[0].value;
								var whichKey = event.which;
								var cursorPosition = $(this).getCursorPosition();
								// treat character keys as arrows
								if( whichKey >36 && (whichKey < 41) ){
									switch (whichKey)
									{
										case 37: 
											if (cursorPosition <= lastCursorPosition()) {
												console.log("Going to previous input");
												currentKey = $(this).closest("td").attr("id");
												prevKey=  "#" + currentKey.substring(0,3) + (Number(currentKey.substring(3))-1);
												$(prevKey + " input").select();
										
												//console.log("SELECT: keywhich[" + whichKey +"]");
											};
											break;
										case 39:
											if (cursorPosition == 	lastCursorPosition()) {
												console.log("Going to next input");
												console.log("SELECT: keywhich[" + whichKey +"]");
												currentKey = $(this).closest("td").attr("id");
												nextKey=  "#" + currentKey.substring(0,3) + (Number(currentKey.substring(3))+1);
												$(nextKey + " input").select();
										
											};
											break;
										case 38 :
											$("#quote input:first").focus();
											break;
										case 40:
											$("#quote input:last").focus();
											break;
									} 							
								}
								else 
								{
									var keyValue = $(this).val().toUpperCase;
									
									if ((whichKey >64 && (whichKey < 91)) || (whichKey > 96 && (whichKey < 123)))
									{
											
										if(cursorPosition > 0 )
										{
											//lastCursorPosition( -1);
											//$(this).get(0).focus();
											console.log("Go to the next input field");
											currentKey = $(this).closest("td").attr("id");
											nextKey=  "#" + currentKey.substring(0,3) + (Number(currentKey.substring(3))+1);
											
											$(nextKey + " input").select();
											
											
										} 
									}
									else (
								}
								/*
								if ((content.length > 0) && (cursorPosition == 0))
								{
									$(this).select();
								}
								*/
								
								//console.log("KEYUP: content = <" + content +"> caret = " + $(this).getCursorPosition());	
							},
							keydown : function(event) {
								var content = $(this)[0].value;
								var whichKey = event.which;
								var cursorPosition = $(this).getCursorPosition();
								
								console.log( "KEYDOWN: content = <" + content +"> caret = <" +  cursorPosition + "> keywhich[" + whichKey +"]");
								//};
								/*
								if (whichKey >64 && (whichKey < 91) )
								{
										
									if(cursorPosition > 0 )
									{
										//lastCursorPosition( -1);
										//$(this).get(0).focus();
										console.log("Go to the next input field");
										currentKey = $(this).closest("td").attr("id");
										nextKey=  "#" + currentKey.substring(0,3) + (Number(currentKey.substring(3))+1);
										$(nextKey + " input").select();
										
										
									} 
									
								}
								*/
								lastCursorPosition(cursorPosition);
							},
							
							keypress : function(event){
								var whichKey = event.which;
								console.log("KEYPRESS=>keycode["+event.keyCode+"] keywhich[" + whichKey) +"]";
								
							}						
						},
						"input");
	
});
			
		
/*
			

divs = document.getElementsByClassName("alain");
for (i=0;i<divs.length;i++) {	
	divs[i].addEventListener("click",function() {
		id = this.id;
		if (id.indexOf("a_") > -1) {
			id = id.replace("a_","");
			x =  document.getElementById(id);
			x.style.backgroundColor = "green";                    
		} else {
			x =  document.getElementById("a_" + id);
			x.style.backgroundColor = "red";
		}
	});
}
*/
