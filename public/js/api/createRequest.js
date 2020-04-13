/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest;

    try {
        if (options.method === 'GET') {
            let params = new URLSearchParams(options.data);
            options.url += `?${params.toString()}`;
        }
        xhr.open(options.method, options.url);

        xhr.responseType = 'json';
        xhr.withCredentials = true;
        xhr.send(options.data);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                if (xhr.response && xhr.response.success) {
                    options.callback(null, xhr.response);
                } else {
                    options.callback(xhr.response.error, xhr.response);
                }
            }
        };

        return xhr;
    } catch (e) {

        options.callback(e);
    }
};
