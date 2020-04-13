/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
    /**
     * Запускает initAuthLinks и initToggleButton
     * */
    static init() {
        this.initAuthLinks();
        this.initToggleButton();
    }

    /**
     * Отвечает за скрытие/показа боковой колонки:
     * переключает два класса для body: sidebar-open и sidebar-collapse
     * при нажатии на кнопку .sidebar-toggle
     * */
    static initToggleButton() {
        let sideBarButton = document.getElementsByClassName('sidebar-toggle')[0];
        let parentButton = document.querySelector('body');

        sideBarButton.onclick = function () {

            parentButton.classList.toggle('sidebar-open');
            parentButton.classList.toggle('sidebar-collapse');
        }
    }

    /**
     * При нажатии на кнопку входа, показывает окно входа
     * (через найденное в App.getModal)
     * При нажатии на кнопку регастрации показывает окно регистрации
     * При нажатии на кнопку выхода вызывает User.logout и по успешному
     * выходу устанавливает App.setState( 'init' )
     * */
    static initAuthLinks() {
        let menuList = document.querySelector('ul.sidebar-menu').querySelectorAll('li.menu-item');

        for (let i = 0; i < menuList.length; i++) {
            menuList[i].firstElementChild.onclick = function () {

                if (menuList[i].classList.contains('menu-item_logout')) {
                    User.logout(User.current(), function (error, response) {
                        if (error === null && response.success) {
                            App.setState('init');
                        }
                    });
                } else {
                    let type;

                    if (menuList[i].classList.contains('menu-item_register')) {
                        type = 'register';
                    }
                    if (menuList[i].classList.contains('menu-item_login')) {
                        type = 'login';
                    }

                    App.getModal(type).open();
                }
            }
        }
    }

}
