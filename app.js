var budgetController=(function(){var Expense=function(id,description,value){this.id=id;this.description=description;this.value=value;this.percentage=-1};Expense.prototype.calcPercentage=function(totalIncome){if(totalIncome>0){this.percentage=Math.round((this.value/totalIncome)*100)}else{this.percentage=-1}};Expense.prototype.getPercentage=function(){return this.percentage};var Income=function(id,description,value){this.id=id;this.description=description;this.value=value};var data={allItems:{exp:[],inc:[]},totals:{exp:0,inc:0},budget:0,percentage:-1};var calculateTotal=function(type){var sum=0;data.allItems[type].forEach(function(cur){sum=sum+cur.value});data.totals[type]=sum};return{addItem:function(type,des,val){var newItem,ID;if(data.allItems[type].length>0){ID=data.allItems[type][data.allItems[type].length-1].id+1}else{ID=0}
if(type==='exp'){newItem=new Expense(ID,des,val)}else if(type==='inc'){newItem=new Income(ID,des,val)}
data.allItems[type].push(newItem);return newItem},getData:function(){return JSON.stringify(data)},setData:function(dataFromLocal){data=dataFromLocal},deleteItem:function(type,id){var ids,index;ids=data.allItems[type].map(function(current){return current.id});index=ids.indexOf(id);if(index!==-1){data.allItems[type].splice(index,1)}},testing:function(){console.log(data)},calculateBudget:function(){calculateTotal('exp');calculateTotal('inc');data.budget=data.totals.inc-data.totals.exp;if(data.totals.inc>0){data.percentage=Math.round((data.totals.exp/data.totals.inc)*100)}else{data.percentage=-1}},calculatePercentages:function(){var totalIncome=data.totals.inc;data.allItems.exp.forEach(function(cur){cur.calcPercentage(totalIncome)})},getPercentages:function(){var allPerc=data.allItems.exp.map(function(cur){return cur.getPercentage()});return allPerc},getBudget:function(){return{budget:data.budget,totalInc:data.totals.inc,totalExp:data.totals.exp,percentage:data.percentage}}}})();var UIController=(function(){var DOMstrings={inputType:'add__type',inputDescription:'add__description',inputValue:'add__value',inputBtn:'add__btn',incomeContainer:'income__list',expenseContainer:'expenses__list',historyContainer:'history__list',budgetLabel:'budget__value',incomeLabel:'budget__income--value',expenseLabel:'budget__expenses--value',percentageLabel:'budget__expenses--percentage',container:'container',expensesPercLabel:'.item__percentage',dateLabel:'budget__title--month',historyTogBtn:'history-toggle__btn',history:'history',income:'income',expense:'expenses',saveBtn:'save__btn',downloadBtn:'download__btn'};var formatNumber=function(num,type){var numSplit,int,dec,sign;num=Math.abs(num);num=num.toFixed(2);numSplit=num.split('.');int=numSplit[0];dec=numSplit[1];if(int.length>3){int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3)}
dec=numSplit[1];sign=type==='exp'?'-':'+';return sign+''+int+'.'+dec};var nodeListForEach=function(list,callback){for(var i=0;i<list.length;i++){callback(list[i],i)}};var getMonthYear=function(){var now,year,month,months;now=new Date();year=now.getFullYear();month=now.getMonth();months=['January','February','March','April','May','June','July','August','September','October','November','December'];return months[month]+' '+year};return{getInput:function(){return{type:document.getElementsByClassName(DOMstrings.inputType)[0].value,description:document.getElementsByClassName(DOMstrings.inputDescription)[0].value,value:parseFloat(document.getElementsByClassName(DOMstrings.inputValue)[0].value)}},getDomstrings:function(){return DOMstrings},addListItem:function(obj,type){var html,newHtml,element;if(type==='inc'){element=DOMstrings.incomeContainer;html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'}else if(type==='exp'){element=DOMstrings.expenseContainer;html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'}
newHtml=html.replace('%id%',obj.id);newHtml=newHtml.replace('%description%',obj.description);newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));document.getElementsByClassName(element)[0].insertAdjacentHTML('beforeend',newHtml)},addHistoryItem:function(key){var element,html,newHtml;element=DOMstrings.historyContainer;html='<div class="item clearfix" id="%date%"><div class="item__description">%date%</div><div class="right clearfix"><div class="item__delete"><button class="item__delete--history--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';newHtml=html.replace('%date%',key);newHtml=newHtml.replace('%date%',key);document.getElementsByClassName(element)[0].insertAdjacentHTML('beforeend',newHtml)},deleteListItem:function(selectorID){var el=document.getElementById(selectorID);el.parentNode.removeChild(el)},clearFields:function(){var fields;fields=document.querySelectorAll('.'+DOMstrings.inputDescription+', .'+DOMstrings.inputValue);fieldsArr=Array.prototype.slice.call(fields);fieldsArr.forEach(function(current,index,array){current.value=""});fieldsArr[0].focus()},displayBudget:function(obj){var type=obj.budget>0?'inc':'exp';document.getElementsByClassName(DOMstrings.budgetLabel)[0].textContent=formatNumber(obj.budget,type);document.getElementsByClassName(DOMstrings.incomeLabel)[0].textContent=formatNumber(obj.totalInc,'inc');document.getElementsByClassName(DOMstrings.expenseLabel)[0].textContent=formatNumber(obj.totalExp,'exp');document.getElementsByClassName(DOMstrings.percentageLabel)[0].textContent=obj.percentage!==-1?obj.percentage+"%":"---"},displayPercentages:function(percentages){var fields=document.querySelectorAll(DOMstrings.expensesPercLabel);nodeListForEach(fields,function(current,index){if(percentages[index]>0){current.textContent=percentages[index]+'%'}else{current.textContent="---"}})},displayMonthYear:function(){document.getElementsByClassName(DOMstrings.dateLabel)[0].textContent=getMonthYear()},getDate:function(){return getMonthYear()},changedType:function(){var fields=document.querySelectorAll('.'+DOMstrings.inputType+',.'+DOMstrings.inputValue+',.'+DOMstrings.inputDescription);nodeListForEach(fields,function(cur){cur.classList.toggle('red-focus')});document.getElementsByClassName(DOMstrings.inputBtn)[0].classList.toggle('red')},toggle_visibility:function(){var history,fields,historyBtn;historyBtn=document.getElementsByClassName(DOMstrings.historyTogBtn)[0];historyBtn.childNodes[0].classList.toggle('ion-toggle');historyBtn.childNodes[0].classList.toggle('ion-toggle-filled');history=document.getElementsByClassName(DOMstrings.history)[0];history.classList.toggle('toggle_display');fields=document.querySelectorAll('.'+DOMstrings.income+',.'+DOMstrings.expense);nodeListForEach(fields,function(cur){cur.classList.toggle('condense')})},showAlert:function(type,notification){alertify.set({delay:2000});if(type==='inc'){alertify.log(notification,"success")}else{alertify.log(notification,"error")}},alreadyEntered:function(listcontainer,current){var list,listItem;list=document.getElementsByClassName(listcontainer)[0];for(var entry=0;entry<list.childElementCount;entry++){listItem=list.children[entry].children[0].textContent;if(listItem===current){return!0}}
return!1}}})();var controller=(function(budgetCtrl,UICtrl){var DOM=UICtrl.getDomstrings();var updateBudget=function(){budgetCtrl.calculateBudget();var budget=budgetCtrl.getBudget();UICtrl.displayBudget(budget)};var updatePercentages=function(){budgetCtrl.calculatePercentages();var percentages=budgetCtrl.getPercentages();UICtrl.displayPercentages(percentages)};var ctrlAddItem=function(){var input,newItem,listcontainer,targetElement;input=UICtrl.getInput();listcontainer=input.type==='inc'?DOM.incomeContainer:DOM.expenseContainer;if(input.description!==""&&!isNaN(input.value)&&input.value>0&&!UICtrl.alreadyEntered(listcontainer,input.description)){newItem=budgetCtrl.addItem(input.type,input.description,input.value);UICtrl.addListItem(newItem,input.type);UICtrl.clearFields();updateBudget();updatePercentages();saveBtn=document.getElementsByClassName(DOM.saveBtn)[0];saveBtn.childNodes[0].classList.add('ion-ios-cloud-upload-outline');if(event){if(event.target.classList.value!=='item__description'){UICtrl.showAlert(input.type,"Added...")}}}else{UICtrl.showAlert('exp',"Please fill in all fields...")}};var ctrlDeleteItem=function(event){var itemID,splitID,type,ID;itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;if(itemID){splitID=itemID.split('-');type=splitID[0];ID=splitID[1];budgetCtrl.deleteItem(type,parseInt(ID));UICtrl.deleteListItem(itemID);updateBudget();updatePercentages();saveBtn=document.getElementsByClassName(DOM.saveBtn)[0];saveBtn.childNodes[0].classList.add('ion-ios-cloud-upload-outline');saveBtn.childNodes[0].classList.remove('ion-ios-cloud-upload');UICtrl.showAlert("exp","Removed")}};var saveBudget=function(){var incomeList,expensesList,saveBtn,currentMonthYear;currentMonthYear=document.getElementsByClassName(DOM.dateLabel)[0].textContent;if(typeof(Storage)!=="undefined"){incomeList=document.getElementsByClassName(DOM.incomeContainer)[0];expensesList=document.getElementsByClassName(DOM.expenseContainer)[0];if(incomeList.childElementCount>0||expensesList.childElementCount>0){localStorage.setItem(currentMonthYear,budgetCtrl.getData());if(!UICtrl.alreadyEntered(DOM.historyContainer,currentMonthYear)){UICtrl.addHistoryItem(currentMonthYear)}
saveBtn=document.getElementsByClassName(DOM.saveBtn)[0];saveBtn.childNodes[0].classList.remove('ion-ios-cloud-upload-outline');saveBtn.childNodes[0].classList.add('ion-ios-cloud-upload');UICtrl.showAlert("inc","Saved...")}else{UICtrl.showAlert("exp","Nothing to Save...");localStorage.removeItem(currentMonthYear);UICtrl.deleteListItem(currentMonthYear)}}else{alert("Sorry, your browser does not support Web Storage...")}};var downloadBudget=function(){var history,fields,currentMonthYear;scroll(0,0);historyBtn=document.getElementsByClassName(DOM.historyTogBtn)[0];historyBtn.childNodes[0].classList.remove('ion-toggle');historyBtn.childNodes[0].classList.add('ion-toggle-filled');history=document.getElementsByClassName(DOM.history)[0];history.classList.remove('toggle_display');fields=document.querySelectorAll('.'+DOM.income+',.'+DOM.expense);nodeListForEach(fields,function(cur){cur.classList.remove('condense')});var pdf=new jsPDF();var options={format:"PNG",background:"#ffffff"};currentMonthYear=document.getElementsByClassName(DOM.dateLabel)[0].textContent;pdf.addHTML(document.body,options,function(){pdf.save(currentMonthYear+'.pdf')});UICtrl.showAlert("inc","Downloading Please Wait...")};var nodeListForEach=function(list,callback){for(var i=0;i<list.length;i++){callback(list[i],i)}};var resetUI=function(event){var incomeList,expenseList;UICtrl.displayBudget({budget:0,totalInc:0,totalExp:0,percentage:-1});budgetCtrl.setData({allItems:{exp:[],inc:[]},totals:{exp:0,inc:0},budget:0,percentage:-1});incomeList=document.getElementsByClassName(DOM.incomeContainer)[0];expenseList=document.getElementsByClassName(DOM.expenseContainer)[0];while(incomeList.firstChild){incomeList.removeChild(incomeList.firstChild)}
while(expenseList.firstChild){expenseList.removeChild(expenseList.firstChild)}};var ctrlHistoryItem=function(event){var itemID,historylist;if(event.target.classList.value==='item__description'){UICtrl.showAlert("inc","Loading...");resetUI();retrieveParticularMonth(event.target.textContent)}else if(event.target.classList.value==='ion-ios-close-outline'){alertify.confirm("Click OK to Delete",function(e){if(e){itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;if(itemID){UICtrl.deleteListItem(itemID);localStorage.removeItem(itemID);if(itemID===UICtrl.getDate()){resetUI();UICtrl.showAlert("exp","Deleted from Storage");saveBtn=document.getElementsByClassName(DOM.saveBtn)[0];saveBtn.childNodes[0].classList.add('ion-ios-cloud-upload-outline');saveBtn.childNodes[0].classList.remove('ion-ios-cloud-upload');document.getElementsByClassName(DOM.inputDescription)[0].focus()}else{resetUI();historylist=document.getElementsByClassName('history__list')[0];for(var i=0;i<historylist.childElementCount;i++){if(historylist.children[i].id===UICtrl.getDate()){retrieveParticularMonth(historylist.children[i].id);break}}
UICtrl.showAlert("exp","Deleted from Storage")}}}else{}})}
event.stopPropagation()};var retrieveParticularMonth=function(monthYear){var value,type,inputType,inputDescription,inputValue,saveBtn,fields;document.getElementsByClassName(DOM.dateLabel)[0].textContent=monthYear;value=JSON.parse(localStorage.getItem(monthYear));inputType=document.getElementsByClassName(DOM.inputType)[0];inputDescription=document.getElementsByClassName(DOM.inputDescription)[0];inputValue=document.getElementsByClassName(DOM.inputValue)[0];type='inc';for(var income in value.allItems[type]){inputType.value=type;inputDescription.value=value.allItems[type][income].description;inputValue.value=value.allItems[type][income].value;ctrlAddItem()}
type='exp';for(var expense in value.allItems[type]){inputType.value=type;inputDescription.value=value.allItems[type][expense].description;inputValue.value=value.allItems[type][expense].value;ctrlAddItem()}
inputType.value='inc';fields=document.querySelectorAll('.'+DOM.inputType+',.'+DOM.inputValue+',.'+DOM.inputDescription);nodeListForEach(fields,function(cur){cur.classList.remove('red-focus')});document.getElementsByClassName(DOM.inputBtn)[0].classList.remove('red');saveBtn=document.getElementsByClassName(DOM.saveBtn)[0];saveBtn.childNodes[0].classList.remove('ion-ios-cloud-upload-outline');saveBtn.childNodes[0].classList.add('ion-ios-cloud-upload');document.getElementsByClassName(DOM.inputDescription)[0].focus()};var retrieveLocalStorage=function(){var key;for(var i=0,len=localStorage.length;i<len;++i){key=localStorage.key(i);UICtrl.addHistoryItem(key);if(key===UICtrl.getDate()){retrieveParticularMonth(key)}else{UICtrl.displayBudget({budget:0,totalInc:0,totalExp:0,percentage:-1})}}};var setupEventListeners=function(){document.getElementsByClassName(DOM.inputBtn)[0].addEventListener('click',ctrlAddItem);document.addEventListener('keypress',function(event){if(event.keyCode===13||event.which===13)
ctrlAddItem()});document.getElementsByClassName(DOM.container)[0].addEventListener('click',ctrlDeleteItem);document.getElementsByClassName(DOM.historyContainer)[0].addEventListener('click',ctrlHistoryItem);document.querySelector('.'+DOM.inputType).addEventListener('change',UICtrl.changedType);document.getElementsByClassName(DOM.historyTogBtn)[0].addEventListener('click',UICtrl.toggle_visibility);document.getElementsByClassName(DOM.saveBtn)[0].addEventListener('click',saveBudget);document.getElementsByClassName(DOM.downloadBtn)[0].addEventListener('click',downloadBudget)};return{init:function(){UICtrl.showAlert("inc","Loading...");if(localStorage.length>0){retrieveLocalStorage()}else{UICtrl.displayBudget({budget:0,totalInc:0,totalExp:0,percentage:-1})}
UICtrl.displayMonthYear();setupEventListeners();console.log('Application has started.')}}})(budgetController,UIController);controller.init()