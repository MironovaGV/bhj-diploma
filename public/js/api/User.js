/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство HOST, равно значению Entity.HOST.
 * Имеет свойство URL, равное '/user'.
 * */
class User {
    /**
     * Устанавливает текущего пользователя в
     * локальном хранилище.
     * */
    static setCurrent(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    /**
     * Удаляет информацию об авторизованном
     * пользователе из локального хранилища.
     * */
    static unsetCurrent() {
        localStorage.removeItem('user');
    }

    /**
     * Возвращает текущего авторизованного пользователя
     * из локального хранилища
     * */
    static current() {
        if (localStorage.length > 0 && localStorage.user) {
            return JSON.parse(localStorage.user);
        }
    }

    /**
     * Получает информацию о текущем
     * авторизованном пользователе.
     * */
    static fetch(data, callback = f => f) {
        createRequest({
            method: 'GET', url: this.HOST + this.URL + '/current', callback: function (error, response) {
                if (response && response.user) {
                    User.setCurrent(response.user);
                } else {
                    User.unsetCurrent();
                }
                callback(error, response);

            }, data: data
        });
    }

    /**
     * Производит попытку авторизации.
     * После успешной авторизации необходимо
     * сохранить пользователя через метод
     * User.setCurrent.
     * */
    static login(data, callback = f => f) {
        createRequest({
            method: 'POST', url: this.HOST + this.URL + '/login', callback: function (error, response) {
                if (response && response.user) {
                    User.setCurrent(response.user);
                }
                callback(error, response);

            }, data: Entity.makeFormData(data)
        });


    }

    /**
     * Производит попытку регистрации пользователя.
     * После успешной авторизации необходимо
     * сохранить пользователя через метод
     * User.setCurrent.
     * */
    static register(data, callback = f => f) {
        let xhr = createRequest({
            method: 'POST', url: this.HOST + this.URL + '/register', callback: function (error, response) {
                if (response && response.user) {
                    User.setCurrent(response.user);
                }
                callback(error, response);

            }, data: Entity.makeFormData(data)
        });

    }

    /**
     * Производит выход из приложения. После успешного
     * выхода необходимо вызвать метод User.unsetCurrent
     * */
    static logout(data, callback = f => f) {
        createRequest({
            method: 'POST', url: this.HOST + this.URL + '/logout', callback: function (error, response) {
                if (response) {
                    User.unsetCurrent();
                }
                callback(error, response);

            }, data: Entity.makeFormData(data)
        });

    }
}

User.URL = '/user';
User.HOST = 'http://localhost:8000';