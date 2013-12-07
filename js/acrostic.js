
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
	$.fn.exists = function () {
		return this.length !== 0;
	}
})(jQuery);

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

function idVal (idTag) {
	if (!idTag) return 0;
	if ( idTag.indexOf("td")> -1)
		return Number(idTag.substr(3));
	else 
		return Number(idTag.substr(2));
}

function idPrefix( idTag) {
	if (!idTag) return NULL;
	if ( idTag.indexOf("td")> -1)
		return idTag.substr(0,3);
	else return idTag.substr(0,2);
}

function parentTdID( idTag) {
	if (!idTag) return null;
	else 
		return idTag[0]+"td"+idVal(idTag);
}

function inputID( idTag) {
	if (!idTag) return null;
	else 
		return idTag[0]+"i"+idVal(idTag);
}

function inClue(idTag)
{
	if (idTag) return (idTag.indexOf("c") > -1); 
}

function advanceCursor(currentID)
{
	if ( inClue(currentID))	{
		// Get the container parent
		var $parentTd = $("#"+ parentTdID(currentID));
		var $next = $parentTd.next();
		if ( $next.exists() ) return $next.find("input").first().attr("id");
		else { // Go to the next clue	
			var $nextParent = $parentTd.closest("div.clue").next();
			if ($nextParent.exists)
					return $nextParent.find("input").first().attr("id");
			else return currentID;
		}
	}
	else {
		// For the inputs in quote, we can simply calculate the value of the next element
		// Alternatively, it could have been calculated using the parent TD as well. I'm
		// not sure which is the better approach
		return 	idPrefix(currentID) + Math.min( idVal(currentID)+1,Solution().length-1);
	}
}
function backspaceCursor(currentID)
{
	if ( inClue(currentID))	{
		var $parentTd = $("#"+parentTdID(currentID));
		var $prev = $parentTd.prev();
		if ( $prev.exists() ) return $prev.find("input").first().attr("id");
		else { // Go to the prev clue
			var $prevParentDiv = $parentTd.closest("div.clue").prev();
			if ($prevParentDiv.exists)
					return $prevParentDiv.find("input").last().attr("id");
			else return currentID;
		}
	}
	else {
		// For the inputs in quote, we can simply calculate the value of the next element
		// Alternatively, it could have been calculated using the parent TD as well. I'm
		// not sure which is the better approach
		return idPrefix(currentID) + Math.max( idVal(currentID)-1,1);
		
	}
}
function moveUp(currentID)
{
	var $parentTd = $("#"+parentTdID( currentID ));
	var currentIndex = $parentTd.index();
	var newID;
	if ( inClue(currentID) )
	{
		$priorClue = $parentTd.closest("div.clue").prev();
		if ($priorClue.exists()) {
			console.log("got prior clue");
			// get the id of the TD element to be consistent with the other case
			newID = $priorClue.find("td").first().attr("id");
			console.log("newID="+newID);
		}		
	
	}
	else {
		// move up a row in the quote (but will only work if there is an input field)
		var $priorRow = $parentTd.closest("tr").prev();
		if ($priorRow.exists())
		{
			console.log("index ="+currentIndex);
			newID = $priorRow.children().eq(currentIndex).attr("id");		
			
		}
		
	}
	// Returning the id of the TD element to be consistent across both
		if (newID) return inputID(newID);
		else return currentID;		
}
function moveDown(currentID)
{
	var $parentTd = $("#"+parentTdID( currentID ));
	var currentIndex = $parentTd.index();
	var newID;
	if ( inClue(currentID) )
	{
		$nextClue = $parentTd.closest("div.clue").next();
		if ($nextClue.exists()) {
			console.log("got next clue");
			// get the id of the TD element to be consistent with the other case
			newID = $nextClue.find("td").first().attr("id");
			console.log("newID="+newID);
		}		
	
	}
	else {
		// move up a row in the quote (but will only work if there is an input field)
		var $nextRow = $parentTd.closest("tr").next();
		if ($nextRow.exists())
		{
			console.log("index ="+currentIndex);
			newID = $nextRow.children().eq(currentIndex).attr("id");		
			
		}
		
	}
	// Returning the id of the TD element to be consistent across both
		if (newID) return inputID(newID);
		else return currentID;	
}


function updateInputs( startValue, inputValue, id ) {
	console.log("startValue="+startValue);
	var selector = "[id$=i"+idVal(id)+"]";
	var $currentInputs = $("input"+selector);
	//var highlighted = $( "table input.highlight_text");
	// dehighlight previously highlighted texts
	$( "table input.highlight_text").toggleClass("highlight_text",false);
	if (startValue != inputValue) {
		$currentInputs.toggleClass("highlight_text",true);
	} 
	
	$currentInputs.each( function() {
							$(this).val(inputValue);
												});					
}


var startValue;

$(document).ready(function()
{
	
	$("#clues-div a.clue_id").on("click", function() {
		//var selected = $( "table# input.display_bright");
		//selected.toggleClass("display_bright",false);
		// ignore the "clue_"  
		var clueID = $(this).attr("id").substr(5);
		$("table#quote li.link_"+clueID).toggleClass("display_link");
		
		if ( !($(this).hasClass("pressed")) )
		{
			var $pressed = $("a.pressed");
			var isPressed = $pressed.exists();
		}
		$(this).toggleClass("pressed");
		// Only have one button pressed at a time
		if (isPressed)
			$pressed.click();
	});
	$( "table" ).on( {	click: function() {
								this.select();
							},
						focusin: function() {		
							
							console.log("startValue="+startValue);
							//console.log("FOCUSIN: value=["+content+"]");				
							lastCursorPosition($(this).getCursorPosition());
							var id = $(this).attr("id");
							var selector = "[id$=i"+idVal(id)+"]";
							var $currentInputs = $("input"+selector);
							//$(this).toggleClass("highlight");
							$currentInputs.toggleClass("highlight",true);
							/*
							if (content.length > 0)
							{	
								//$(this).get(0).focus();
								$(this).select();
							};*/
						},
						
						focusout: function() {	
							var id = $(this).attr("id");
							var selector = "[id$=i"+idVal(id)+"]";
							var $currentInputs = $("input"+selector);
							$currentInputs.toggleClass("highlight",false);
							console.log("focusout event");
							$(this).css("color","black");
						},
						keyup: function(event) {
						
							var content = $(this)[0].value;
							var whichKey = event.which;
							var cursorPosition = $(this).getCursorPosition();
								// treat character keys as arrows
								
								//if( whichKey >36 && (whichKey < 41) ){
											
							switch (whichKey)
							{
								// After a backspace, go to previous element
								case 8: updateInputs( startValue,"",$(this).attr("id"));
										
								case 37: 
									//if (cursorPosition <= lastCursorPosition()) {
										console.log("Going to previous input");									
										
										previous = "#" +  backspaceCursor($(this).attr("id"));
										console.log("PreviousID="+previous);
										$(previous).select();
										//console.log("SELECT: keywhich[" + whichKey +"]");
									//};
									break;
								case 32:
									// Treat a blank as a way of advancing to the next position. Don't erase the character
									$(this).val(startValue);
								case 39:
									
									
									console.log("Going to next input");
									console.log("SELECT: keywhich[" + whichKey +"]");
									
									next = "#"+advanceCursor($(this).attr("id"));
									$(next).select();
									
									break;
								case 38 :
									var upperTd = "#"+moveUp($(this).attr("id"));
									console.log("upperTD="+upperTd);
									$(upperTd).select();
									break;
								case 40:
									var lowerTd = "#"+moveDown($(this).attr("id"));
									console.log("lowerTD="+lowerTd);
									$(lowerTd).select();
									break;
								
								default:
									var inputValue = $(this).val().toUpperCase();
									
									// Only allow letters to be used as input
									if( cursorPosition>0)	{
										if (whichKey >64 && (whichKey < 91)){
											updateInputs(startValue, inputValue, $(this).attr("id"));
											next = "#"+advanceCursor($(this).attr("id"));
											$(next).select();
										}
										else {
											// Don't allow other characters
											$(this).val(startValue);
											$(this).select();
										}
									}
									// If the cursor is at 0, then it's possible something was deleted
									else updateInputs(startValue, inputValue, $(this).attr("id"));
							} 														
						},
						
						change: function() {
								// First, dehighlight previously highlighted entries
								var selected = $( "table input.display_bright");
								selected.toggleClass("display_bright",false);
								//selected.toggleClass("highlight_text",false);
								var id = $(this).attr("id");
								var selector = "[id$=i"+idVal(id)+"]";
								var $currentInputs = $("input"+selector);
								$currentInputs.toggleClass("display_bright",true);
								//$currentInputs.toggleClass("highlight_text",true);
								
								console.log("change event");
							},
							
						select: function() {
								console.log("SELECT");
								$(this).css("color","#660066");
							},
													
						keydown : function(event) {
							startValue = $(this).val();	
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
						}
						
					}, "input" );	
	
	/*
	$("table#quote,table.clue").on({ 	
							
							
							keyup : function(event) {
								
								
								var content = $(this)[0].value;
								var whichKey = event.which;
								var cursorPosition = $(this).getCursorPosition();
								// treat character keys as arrows
								
								if( whichKey >36 && (whichKey < 41) ){
												
									switch (whichKey)
									{
										
										case 8,37: 
											//if (cursorPosition <= lastCursorPosition()) {
												console.log("Going to previous input");									
												
												previous = "#" +  backspaceCursor($(this).attr("id"));
												console.log("PreviousID="+previous);
												$(previous).select();
												//console.log("SELECT: keywhich[" + whichKey +"]");
											//};
											break;
										case 39:
											//if (cursorPosition == 	lastCursorPosition()) {
												console.log("Going to next input");
												console.log("SELECT: keywhich[" + whichKey +"]");
												//currentKey = $(this).closest("td").attr("id");
												//nextKey=  "#" + currentKey.substring(0,3) + (Number(currentKey.substring(3))+1);
												//$(nextKey + " input").select();
												
												next = "#"+advanceCursor($(this).attr("id"));
												$(next).select();
											//};
											break;
										case 38 :
											//$("#quote input:first").focus();
											var $tr = $(this).closest("tr").prev();
											if ($tr.exists())
											{
												var currentIndex = $(this).closest("td").index();
												console.log("index ="+currentIndex);
												var aboveID = $($tr).children().eq(currentIndex).attr("id");
												
												if (aboveID)
												{	
													console.log("previousID=" + aboveID);
													newID = "#"+aboveID;
													$(newID + " input").select();
												}
												//$(previous + " input").select();
											}
											break;
										case 40:
											//$("#quote input:last").focus();
											var $tr = $(this).closest("tr").next();
											if ($tr.exists())
											{
												var currentIndex = $(this).closest("td").index();
												console.log("index ="+currentIndex);
												var belowID = $($tr).children().eq(currentIndex).attr("id");
												
												if (belowID)
												{	
													console.log("nextID=" + belowID);
													newID = "#" + belowID;
													$(newID + " input").select();
												}
												//$(previous + " input").select();
											}
											break;
									} 							
								}
								else 
								{
									//var keyValue = $(this).val().toUpperCase;
									if(cursorPosition > 0 )
									
									{
											
										if ((whichKey >64 && (whichKey < 91)) || (whichKey > 96 && (whichKey < 123)))
										{
											//lastCursorPosition( -1);
											//$(this).get(0).focus();
											console.log("Go to the next input field");
											//currentID = $(this).closest("td").attr("id");
											nextKey=  "#" + advanceCursor($(this).attr("id"));
											
											$(nextKey).select();							
											
										} 
									
										else {
											// Don't allow other characters
											$(this).value(startValue);
											$(this).select();
										}
									}	
								}
								/*
								if ((content.length > 0) && (cursorPosition == 0))
								{
									$(this).select();
								}
								*/
								
								//console.log("KEYUP: content = <" + content +"> caret = " + $(this).getCursorPosition());	
/*							},
							
							keypress : function(event){
								var whichKey = event.which;
								console.log("KEYPRESS=>keycode["+event.keyCode+"] keywhich[" + whichKey) +"]";
								
							}						
						}, */
						
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
