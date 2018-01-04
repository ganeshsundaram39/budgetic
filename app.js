// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {

        if (totalIncome > 0) {

            this.percentage = Math.round((this.value / totalIncome) * 100);

        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;

    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    //data structure
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum = sum + cur.value;
        });
        data.totals[type] = sum;
    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new ITEM based on 'inc' or'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);

            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // PUsh it into our data struture

            data.allItems[type].push(newItem);

            // return the new element
            return newItem;
        },
        deleteItem: function(type, id) {
            var ids, index;
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);

            }
        },
        testing: function() {
            console.log(data);
        },

        calculateBudget: function() {
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }


        },
        calculatePercentages: function() {
            var totalIncome = data.totals.inc;
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(totalIncome);
            });

        },
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        }

    };

})();

//UI CONTROLLER
var UIController = (function() {

    var DOMstrings = {
        inputType: 'add__type',
        inputDescription: 'add__description',
        inputValue: 'add__value',
        inputBtn: 'add__btn',
        incomeContainer: 'income__list',
        expenseContainer: 'expenses__list',
        budgetLabel: 'budget__value',
        incomeLabel: 'budget__income--value',
        expenseLabel: 'budget__expenses--value',
        percentageLabel: 'budget__expenses--percentage',
        container: 'container',
        expensesPercLabel: '.item__percentage',
        dateLabel: 'budget__title--month'
    };


    var formatNumber = function(num, type) {
        var numSplit, int, dec, sign;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];
        sign = type === 'exp' ? '-' : '+';
        return sign + '' + int + '.' + dec;



    };
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }

    };

    return {
        getInput: function() {
            return {
                type: document.getElementsByClassName(DOMstrings.inputType)[0].value, //Will be either inc or exp
                description: document.getElementsByClassName(DOMstrings.inputDescription)[0].value,
                value: parseFloat(document.getElementsByClassName(DOMstrings.inputValue)[0].value)
            };
        },
        getDomstrings: function() {
            return DOMstrings;
        },
        addListItem: function(obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


            //INsert the HTML into the DOM
            document.getElementsByClassName(element)[0].insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFields: function() {
            var fields;

            fields = document.querySelectorAll('.' + DOMstrings.inputDescription + ', .' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            fieldsArr[0].focus();

        },
        displayBudget: function(obj) {
            var type = obj.budget > 0 ? 'inc' : 'exp';

            document.getElementsByClassName(DOMstrings.budgetLabel)[0].textContent = formatNumber(obj.budget, type);
            document.getElementsByClassName(DOMstrings.incomeLabel)[0].textContent = formatNumber(obj.totalInc, 'inc');
            document.getElementsByClassName(DOMstrings.expenseLabel)[0].textContent = formatNumber(obj.totalExp, 'exp');
            document.getElementsByClassName(DOMstrings.percentageLabel)[0].textContent = obj.percentage !== -1 ? obj.percentage + "%" : "---";
        },
        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = "---";
                }
            });


        },
        displayMonth: function() {
            var now, year, month, months;
            now = new Date();

            year = now.getFullYear();
            month = now.getMonth();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


            document.getElementsByClassName(DOMstrings.dateLabel)[0].textContent = months[month] + ' ' + year;

        },
        changedType: function() {
            var fields = document.querySelectorAll('.' + DOMstrings.inputType + ',.' + DOMstrings.inputValue + ',.' + DOMstrings.inputDescription);
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });
            document.getElementsByClassName(DOMstrings.inputBtn)[0].classList.toggle('red');
        }

    };
})();


// GlOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
    var input, newItem;
    var DOM = UICtrl.getDomstrings();

    var updateBudget = function() {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the Budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };


    var ctrlAddItem = function() {

        // 1. Get the filed input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the field
            UICtrl.clearFields();

            // 5. calculate and update budget
            updateBudget();

            //4. Calculate and update the percentages
            updatePercentages();
        }
    };
    var updatePercentages = function() {
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages  
        UICtrl.displayPercentages(percentages);
    };

    var setupEventListeners = function() {
        document.getElementsByClassName(DOM.inputBtn)[0].addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13)
                ctrlAddItem();
        });
        document.getElementsByClassName(DOM.container)[0].addEventListener('click', ctrlDeleteItem);
        document.querySelector('.' + DOM.inputType).addEventListener('change', UICtrl.changedType);
    };
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = splitID[1];

            // 1. delete the item from the data struture
            budgetCtrl.deleteItem(type, parseInt(ID));


            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);


            //3. Update and show the new budget
            updateBudget();

            //4. Calculate and update the percentages
            updatePercentages();
        }
    };

    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1

            });
            UICtrl.displayMonth();
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();