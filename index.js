import { MOCK_LAPTOPS } from './laptops.mock.js'


function App(laptops) {
  
    this.elLaptops;
    this.lblLaptopDesc;
    this.lblLaptopPrice;
    this.lbldesc;
    this.lblBalance;
    this.lblWorkBalance;
    this.lblCurrency;
    this.imgLaptopImg;
    this.getLoanBtn;
    this.workBtn;
    this.bankBtn;
    this.buyBtn;
  


    this.laptops = laptops;

 
    this.init = function () {

        this.lblBankerName = document.getElementById('banker-name-label');
        this.lblBalance = document.getElementById('balance-label');
        this.loanElementsDiv = document.getElementById('loan-elemenets-div');
        this.lblLoan = document.getElementById('loan-label');
        this.payBtnDiv = document.getElementById('payloan-div');
        this.repayLoanbtn = document.getElementById('repay-button');
        this.getLoanBtn = document.getElementById('get-loan-button');
        this.lblWorkBalance = document.getElementById('work-balance-label');
        this.bankBtn = document.getElementById('bank-button');
        this.workBtn = document.getElementById('work-button');
        this.elLaptops = document.getElementById('laptops-dropdownlist');
        this.lbldesc = document.getElementById('description-label');
        this.lblFeatures = document.getElementById('description-label')
        this.imgLaptopImg = document.getElementById('laptop-img');
        this.lblLaptopDesc = document.getElementById('laptop-description-label');
        this.lblLaptopPrice = document.getElementById('price-label');
        this.buyBtn = document.getElementById('buy-button');

        this.renderDDL();
        this.renderLaptopSpec();
    }


    this.renderDDL = function () {
        
        for (let i = 0; i < this.laptops.length; i++) {
            const elListItem = document.createElement('option');
            elListItem.value = this.laptops[i].id;
            elListItem.innerText = this.laptops[i].name;
            this.elLaptops.appendChild(elListItem);

        }
    }

    this.renderLaptopSpec = function () {
        let selectedItem = parseInt(this.elLaptops.value);

        const laptop = this.laptops.find(item => item.id === selectedItem)

        this.lblFeatures.innerText = laptop.features;
        this.lblLaptopDesc.innerText = laptop.description;
        this.lblLaptopPrice.innerText = laptop.price;
        this.imgLaptopImg.src = laptop.imgLink;

    }
}

// Banker Joe
function Banker(name) {
    this.name = name;
    this.balance = 0;
    this.loanValue = 0;
    this.workBalance = 0;
    this.hasLoan = false;
    this.buyLaptop = false;
}

//Events for banking
function BankHandler(banker, app) {

    this.init = function () {
        app.lblWorkBalance.innerText = banker.workBalance;
        app.lblBalance.innerText = banker.balance;
        app.lblBankerName.innerText = banker.name;
    }
// When press work, adds 100 to balance
    this.work = function () {
        banker.workBalance += 100;
        app.lblWorkBalance.innerText = banker.workBalance;

    }

//Function that makes the payments for loan
    this.bank = function () {
        if (banker.workBalance > 0) {

            if (banker.hasLoan) {
                //if loan = true, then pay automatically 10% from work to loan, if loan =0 then pay nothing to loan
                const interestRate = banker.workBalance * 0.1;
                banker.balance += (banker.workBalance - interestRate);

                if (interestRate >= banker.loanValue) {
                    let remaining = interestRate - banker.loanValue;
                    banker.loanValue == 0;
                    banker.hasLoan = false;
                    banker.balance += remaining;

                    this.manipulateLoanElements("hidden");

                } else
                    banker.loanValue -= interestRate;

                app.lblLoan.innerText = banker.loanValue;

            } else
                banker.balance += banker.workBalance;

            banker.workBalance = 0;
            app.lblWorkBalance.innerText = banker.workBalance;
            app.lblBalance.innerText = banker.balance;

        } else {
            window.alert("You don't have money to transfer")
        }
    }

// functiuon for bying laptop and checking if you have enough nmoney
    this.buy = function () {
        const laptopPrice = parseInt(app.lblLaptopPrice.innerText)
        if (banker.balance >= laptopPrice) {
            banker.balance -= laptopPrice;
            app.lblBalance.innerText = banker.balance;
            window.alert("You just bougth a laptop")
        } else {
            window.alert("You don't have enough money to buy")

        }
    }

// function for getting the loan, and checking if theres allready a loan
    this.getLoan = function () {
        if (!banker.loanValue) {
            if (banker.balance >= 0) {

                const propmtValue = window.prompt("Enter loan value:", 0)
                if (!isNaN(propmtValue)) {

                    banker.loanValue = parseInt(propmtValue);
                    if (banker.loanValue > 0) {
                        if (banker.loanValue <= (banker.balance * 2)) {
                            banker.balance += banker.loanValue;
                            app.lblLoan.innerText = banker.loanValue;
                            banker.hasLoan = true;
                            this.manipulateLoanElements("visible");

                        } else
                            window.alert("Your loan cannot exceed: " + banker.balance * 2)
                    }
                } else
                    window.alert("Please make sure your request contains only numbers")

            }

            app.lblBalance.innerText = banker.balance;
        } else
            window.alert("Only one loan per laptop")
    }

    // Pay the loan back function
    this.repay = function () {

        if (banker.workBalance > 0) {

            if (banker.loanValue > banker.workBalance) {
                banker.loanValue -= banker.workBalance;
                banker.workBalance = 0;
            } else {
                banker.workBalance -= banker.loanValue;
                banker.loanValue = 0;
                banker.hasLoan = false;
                this.manipulateLoanElements('hidden');
            }

            app.lblLoan.innerText = banker.loanValue;
            app.lblWorkBalance.innerText = banker.workBalance;

        } else
            window.alert("Your gotta work first to pay")
    }
    this.manipulateLoanElements = function (visibilityValue) {
        app.loanElementsDiv.style.visibility = visibilityValue;
        app.payBtnDiv.style.visibility = visibilityValue;
    }
}

const laptopArray = [...MOCK_LAPTOPS]; // to copy values

const app = new App(laptopArray);
app.init();

const banker = new Banker('Joe Banker');

const bankhandler = new BankHandler(banker, app);
bankhandler.init();

app.elLaptops.addEventListener("change", app.renderLaptopSpec.bind(app));

app.getLoanBtn.addEventListener('click', bankhandler.getLoan.bind(bankhandler));

app.workBtn.addEventListener('click', bankhandler.work.bind(bankhandler));

app.bankBtn.addEventListener('click', bankhandler.bank.bind(bankhandler));

app.buyBtn.addEventListener('click', bankhandler.buy.bind(bankhandler));

app.repayLoanbtn.addEventListener('click', bankhandler.repay.bind(bankhandler));





