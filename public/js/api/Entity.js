/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * Имеет свойство HOST, равно 'https://bhj-diplom.letsdocode.ru'.
 * */
class Entity {
    /**
     * Запрашивает с сервера список данных.
     * Это могут быть счета или доходы/расходы
     * (в зависимости от того, что наследуется от Entity)
     * */
    static list(data, callback = f => f) {
        return createRequest({method: 'GET', url: this.HOST + this.URL, callback: callback, data: data});
    }

    /**
     * Создаёт счёт или доход/расход с помощью запроса
     * на сервер. (в зависимости от того,
     * что наследуется от Entity)
     * */
    static create(data, callback = f => f) {
        data._method = 'PUT';
        return createRequest({
            method: 'POST',
            url: this.HOST + this.URL,
            callback: callback,
            data: this.makeFormData(data)
        });
    }

    /**
     * Получает информацию о счёте или доходе/расходе
     * (в зависимости от того, что наследуется от Entity)
     * */
    static get(id = '', data, callback = f => f) {
        data.id = id;
        return createRequest({method: 'GET', url: this.HOST + this.URL, callback: callback, data: data});

    }

    /**
     * Удаляет информацию о счёте или доходе/расходе
     * (в зависимости от того, что наследуется от Entity)
     * */
    static remove(id = '', data, callback = f => f) {
        data._method = 'DELETE';
        data.id = id;
        return createRequest({
            method: 'POST',
            url: this.HOST + this.URL,
            callback: callback,
            data: this.makeFormData(data)
        });
    }

    static makeFormData(data) {
        let formData = new FormData();
        for (let key in data) {
            formData.append(key, data[key]);
        }
        ;
        return formData;
    }
}

Entity.HOST = 'http://localhost:8000';
Entity.URL = '';