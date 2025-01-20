///////////////////INSTRUCTION BOX//////////////////
document.addEventListener('DOMContentLoaded', function() {
    // Get the modal
    var modal = document.getElementById('myModal');

    // Close modal with the space bar
    window.addEventListener('keydown', function(event) {
        if (event.keyCode === 32) { // 32 is the keyCode for the spacebar
            event.preventDefault(); 
            modal.style.display = 'none';
            console.log("Start Game!");
        }
    });
    
    window.addEventListener('keydown', function(event) {
    if (event.key === "I" || event.key === "i") { // Check for 'I' key
        event.preventDefault(); // Stop any default action
        modal.style.display = 'block';
        }
    });

    // Show the modal at the start of the game
    modal.style.display = 'block';
});