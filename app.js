// BUDGET CONTROLLER
var budgetController = (function() {
	// some code
})();

//UI CONTROLLER
var UIController = (function() {

    var DOMstrings = {
        inputType: 'add__type',
        inputDescription: 'add__description',
        inputValue: 'add__value',
        inputBtn: 'add__btn'
    };

    return {
        getInput: function() {
            return {
                type: document.getElementsByClassName(DOMstrings.inputType)[0].value, //Will be either inc or exp
                description: document.getElementsByClassName(DOMstrings.inputDescription)[0].value,
                value: document.getElementsByClassName(DOMstrings.inputValue)[0].value

            };

        },
        getDomstrings: function() {
            return DOMstrings;
        }
    };
})();

// GlOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

	var DOM = UICtrl.getDomstrings();

	var ctrlAddItem = function() {

        // 1. Get the filed input data
        var input = UICtrl.getInput();

        // 2. Add the item to the budget controller

        // 3. Add the item to the UI

        // 4. Calculate the budget 

        // 5. Display the budget on the UI
    };
    
    var setupEventListeners = function() {
        document.getElementsByClassName(DOM.inputBtn)[0].addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13)
                ctrlAddItem();
        });
    };


    return {
    	init: function () {
    		console.log('Application has started.');
    		setupEventListeners();
    	}
    };

})(budgetController, UIController);

controller.init();