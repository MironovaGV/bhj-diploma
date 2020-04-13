/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * Наследуется от AsyncForm
 * */
class CreateTransactionForm extends AsyncForm {
    /**
     * Вызывает родительский конструктор и
     * метод renderAccountsList
     * */
    constructor(element) {
        super(element);
        this.renderAccountsList();
    }

    /**
     * Получает список счетов с помощью Account.list
     * Обновляет в форме всплывающего окна выпадающий список
     * */
    renderAccountsList() {
        Account.list(User.current(), (error, response) => {
            if (error === null && response.data) {
                this.clear();
                for (let i = 0; i < response.data.length; i++) {
                    this.renderOption(response.data[i]);
                }
            }
        });
    }

    clear() {
        let options = this.element.querySelectorAll('option')
        for (let i = 0; i < options.length; i++) {
            options[i].remove();
        }
    }

    getOptionHtml(item) {
        return `<option value="${item.id}">${item.name}</option>`;
    }

    renderOption(item) {
        this.element.querySelector('.accounts-select')
            .insertAdjacentHTML('beforeend', this.getOptionHtml(item));
    }

    /**
     * Создаёт новую транзакцию (доход или расход)
     * с помощью Transaction.create. По успешному результату
     * вызывает App.update(), сбрасывает форму и закрывает окно,
     * в котором находится форма
     * */
    onSubmit(options) {
        options.user_id = User.current().id;

        Transaction.create(options, (error, response) => {
            if (error === null && response.success) {
                let modalName;
                if (this.element.id === 'new-expense-form') {
                    modalName = 'newExpense';
                }
                if (this.element.id === 'new-income-form') {
                    modalName = 'newIncome';
                }

                App.getModal(modalName).close();
                this.element.reset();
                App.update();
            }
        });
    }
}
