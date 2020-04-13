/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */
class AccountsWidget {
    /**
     * Устанавливает текущий элемент в свойство element
     * Регистрирует обработчики событий с помощью
     * AccountsWidget.registerEvents()
     * Вызывает AccountsWidget.update() для получения
     * списка счетов и последующего отображения
     * Если переданный элемент не существует,
     * необходимо выкинуть ошибку.
     * */
    constructor(element) {
        if (!element) {
            throw new DOMException('Пустой элемент');
        }
        this.element = element;
        this.update();
        this.registerEvents();
        this.itemEvent = new Event('itemEvent');
    }


    /**
     * При нажатии на .create-account открывает окно
     * #modal-new-account для создания нового счёта
     * При нажатии на один из существующих счетов
     * (которые отображены в боковой колонке),
     * вызывает AccountsWidget.onSelectAccount()
     * */
    registerEvents() {
        let createAccountButton = this.element.querySelector('.create-account');
        createAccountButton.addEventListener('click', function () {
            App.getModal('createAccount').open();
        })

        this.element.addEventListener('itemEvent', (event) => {
            let lastLiLink = event.target.lastElementChild.firstElementChild;
            lastLiLink.addEventListener('click', () => {
                this.onSelectAccount(lastLiLink.parentNode);
            })
        })
    }

    /**
     * Метод доступен только авторизованным пользователям
     * (User.current()).
     * Если пользователь авторизован, необходимо
     * получить список счетов через Account.list(). При
     * успешном ответе необходимо очистить список ранее
     * отображённых счетов через AccountsWidget.clear().
     * Отображает список полученных счетов с помощью
     * метода renderItem()
     * */
    update() {
        if (User.current()) {
            Account.list(User.current(), (error, response) => {
                if (error === null && response.success && response.data) {
                    this.clear();
                    for (let i = 0; i < response.data.length; i++) {
                        this.renderItem(response.data[i]);
                    }
                }
            });
        }
    }

    getAccounts() {
        return this.element.querySelectorAll('.account');
    }

    /**
     * Очищает список ранее отображённых счетов.
     * Для этого необходимо удалять все элементы .account
     * в боковой колонке
     * */
    clear() {
        let scoresList = this.getAccounts();
        for (let i = 0; i < scoresList.length; i++) {
            scoresList[i].remove();
        }
    }

    /**
     * Срабатывает в момент выбора счёта
     * Устанавливает текущему выбранному элементу счёта
     * класс .active. Удаляет ранее выбранному элементу
     * счёта класс .active.
     * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
     * */
    onSelectAccount(element) {
        if (!element.classList.contains('active')) {
            let account = Array.from(this.getAccounts()).find((elem) => elem.classList.contains('active'));

            if (account) {
                account.classList.remove('active');
            }

            element.classList.add('active');
        }

        App.showPage('transactions', {account_id: element.dataset.id});
    }

    /**
     * Возвращает HTML-код счёта для последующего
     * отображения в боковой колонке.
     * item - объект с данными о счёте
     * */
    getAccountHTML(item) {
        return `<li class="account" data-id="${item.id}">
                    <a href="#">
                        <span>${item.name}</span> /
                        <span>${item.sum} ₽</span>
                    </a>
                </li>`
    }

    /**
     * Получает массив с информацией о счетах.
     * Отображает полученный с помощью метода
     * AccountsWidget.getAccountHTML HTML-код элемента
     * и добавляет его внутрь элемента виджета
     * */
    renderItem(item) {
        this.element.insertAdjacentHTML('beforeend', this.getAccountHTML(item));
        this.element.dispatchEvent(this.itemEvent);
    }
}
