function newGem() {
			swal({
			  title: "Reveal your gem!",
			  text: "Name your Gem",
			  type: "input",
			  showCancelButton: true,
			  closeOnConfirm: false,
			  animation: "slide-from-top",
			  inputPlaceholder: "Name"
			},
			function(inputValue){
			  if (inputValue === false) return false;
			  
			  if (inputValue === "") {
			    swal.showInputError("[!] You left a nox empty!");
			    return false
			  }
	  
				swal("Nice!", "You wrote: " + inputValue, "success");
			});
		}

function GemName() {
	var name = prompt("Name your Gem");
	return name;
}
function GemDescription () {
	var Descrition = prompt("Tell us about your gem");
	return Descrition;
}
function GemPhoto () {
	var photo = prompt("<h2>test</h2>");
	return photo;
}

