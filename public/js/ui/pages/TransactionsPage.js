/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
    /**
     * Если переданный элемент не существует,
     * необходимо выкинуть ошибку.
     * Сохраняет переданный элемент и регистрирует события
     * через registerEvents()
     * */
    constructor(element) {
        if (!element) {
            throw new DOMException('Пустой элемент');
        }
        this.element = element;
        this.registerEvents();
    }

    /**
     * Вызывает метод render для отрисовки страницы
     * */
    update() {
        if (this.lastOptions) {
            this.render(this.lastOptions);
        } else {
            this.render();
        }
    }

    /**
     * Отслеживает нажатие на кнопку удаления транзакции
     * и удаления самого счёта. Внутри обработчика пользуйтесь
     * методами TransactionsPage.removeTransaction и
     * TransactionsPage.removeAccount соответственно
     * */
    registerEvents() {
        let removeButton = this.element.querySelector('.remove-account');
        removeButton.addEventListener('click', () => this.removeAccount());

        this.element.addEventListener('click', (event) => {
            let deleteButton = event.target.closest('.transaction__remove');
            if (deleteButton != null) {
                this.removeTransaction(deleteButton.dataset.id);
            }
        });
    }

    /**
     * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
     * Если пользователь согласен удалить счёт, вызовите
     * Account.remove, а также TransactionsPage.clear с
     * пустыми данными для того, чтобы очистить страницу.
     * По успешному удалению необходимо вызвать метод App.update()
     * для обновления приложения
     * */
    removeAccount() {
        if (this.lastOptions) {
            let isDelete = confirm(`Вы действительно хотите удалить счёт?`);
            if (isDelete) {
                Account.remove(this.lastOptions.account_id, this.lastOptions, (error, response) => {
                    if (error === null && response.success) {
                        this.clear();
                        App.update();
                    }
                });
            }
        }
    }

    /**
     * Удаляет транзакцию (доход или расход). Требует
     * подтверждеия действия (с помощью confirm()).
     * По удалению транзакции вызовите метод App.update()
     * */
    removeTransaction(id) {
        let isDelete = confirm('Вы действительно хотите удалить эту транзакцию?');
        if (isDelete) {
            Transaction.remove(id, {account_id: id}, (error, response) => {
                if (error === null && response.success) {
                    App.update();
                }
            })
        }
    }

    /**
     * С помощью Account.get() получает название счёта и отображает
     * его через TransactionsPage.renderTitle.
     * Получает список Transaction.list и полученные данные передаёт
     * в TransactionsPage.renderTransactions()
     * */
    render(options) {
        if (options) {
            this.lastOptions = options;
            Account.get(User.current().id, options, (error, response) => {
                if (error === null && response.data) {
                    let currentAccount = response.data.filter((account) => account.id === options.account_id).shift();

                    this.renderTitle(currentAccount.name);
                }
            })
            Transaction.list(options, (error, response) => {
                if (error === null && response.data) {
                    this.renderTransactions(response.data);
                }
            })
        }
    }

    /**
     * Очищает страницу. Вызывает
     * TransactionsPage.renderTransactions() с пустым массивом.
     * Устанавливает заголовок: «Название счёта»
     * */
    clear() {
        this.renderTransactions([]);
        this.element.querySelector('span.content-title').innerText = 'Название счёта';
        delete this.lastOptions;
    }

    /**
     * Устанавливает заголовок в элемент .content-title
     * */
    renderTitle(name) {
        this.element.querySelector('span.content-title').innerText = name;
    }

    /**
     * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
     * в формат «10 марта 2019 г. в 03:20»
     * */
    formatDate(date) {
        let dateObj = new Date(date);
        return dateObj.toLocaleDateString('ru', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Формирует HTML-код транзакции (дохода или расхода).
     * item - объект с информацией о транзакции
     * */
    getTransactionHTML(item) {
        return `<div class="transaction transaction_${item.type.toLowerCase()} row">
            <div class="col-md-7 transaction__details">
              <div class="transaction__icon">
                  <span class="fa fa-money fa-2x transaction_${item.type.toLowerCase()}"></span>
              </div>
              <div class="transaction__info">
                  <h4 class="transaction__title">${item.name}</h4>
                  <div class="transaction__date">${this.formatDate(item.created_at)}</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="transaction__summ">
                  ${item.sum} <span class="currency">₽</span>
              </div>
            </div>
            <div class="col-md-2 transaction__controls">
                <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                    <i class="fa fa-trash"></i>  
                </button>
            </div>
        </div>`
    }

    /**
     * Отрисовывает список транзакций на странице
     * используя getTransactionHTML
     * */
    renderTransactions(data) {
        if (data) {
            let transactions = '';
            for (let i = 0; i < data.length; i++) {
                transactions += this.getTransactionHTML(data[i]);
            }

            this.element.querySelector('.content').innerHTML = transactions;
        }
    }
}
