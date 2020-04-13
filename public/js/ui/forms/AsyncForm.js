/**
 * Класс AsyncForm управляет всеми формами
 * приложения, которые не должны быть отправлены с
 * перезагрузкой страницы. Вместо этого данные
 * с таких форм собираются и передаются в метод onSubmit
 * для последующей обработки
 * */
class AsyncForm {
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
     * Необходимо запретить отправку формы. В момент отправки
     * вызывает метод submit()
     * */
    registerEvents() {
        this.element.addEventListener('submit', (event) => {
            event.preventDefault();
            this.submit(event);
        });
    }

    /**
     * Преобразует данные формы в объект вида
     * {
     *  'название поля формы 1': 'значение поля формы 1',
     *  'название поля формы 2': 'значение поля формы 2'
     * }
     * */
    getData() {
        let inputs = this.element.querySelectorAll('input, select');
        let formData = {};
        for (let i = 0; i < inputs.length; i++) {
            formData[inputs[i].name] = inputs[i].value;
        }

        return formData;
    }

    onSubmit(options) {
    }

    /**
     * Вызывает метод onSubmit и передаёт туда
     * данные, полученные из метода getData()
     * */
    submit() {
        let formData = this.getData();

        formData.method = this.element.method;
        formData.url = this.element.url;

        this.onSubmit(formData);
    }
}
